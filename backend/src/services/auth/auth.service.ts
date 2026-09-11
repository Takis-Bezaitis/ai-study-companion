import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';

import type { JwtPayload, SignOptions } from 'jsonwebtoken';

import { env } from '../../config/env.js';
import prisma from '../../lib/prismaClient.js';
import { AppError } from '../../utils/AppError.js';

import type {
  LoginInput,
  RegisterInput,
} from '../../validations/auth.validation.js';

const JWT_ISSUER = 'ai-study-companion';
const JWT_AUDIENCE = 'ai-study-companion-users';

const ACCESS_TOKEN_EXPIRES_IN =
  env.JWT_ACCESS_EXPIRES_IN as SignOptions['expiresIn'];

const REFRESH_TOKEN_EXPIRES_IN =
  env.JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn'];

const BCRYPT_ROUNDS = 12;

function hashToken(token: string) {
  return crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
}

function generateAccessToken(userId: string) {
  return jwt.sign(
    {},
    env.JWT_ACCESS_SECRET,
    {
      subject: userId,
      expiresIn: ACCESS_TOKEN_EXPIRES_IN!,
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    },
  );
}

function generateRefreshToken(userId: string) {
  return jwt.sign(
    {},
    env.JWT_REFRESH_SECRET,
    {
      subject: userId,
      expiresIn: REFRESH_TOKEN_EXPIRES_IN!,
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    },
  );
}

export async function registerUser(input: RegisterInput) {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
  });

  if (existingUser) {
    throw new AppError('Email already in use', 409);
  }

  const passwordHash = await bcrypt.hash(
    input.password,
    BCRYPT_ROUNDS,
  );

  try {
    const user = await prisma.user.create({
      data: {
        email: input.email,
        passwordHash,
        name: input.name ?? null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    return user;
  } catch (error) {
    // Handles race condition on unique email.
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 'P2002'
    ) {
      throw new AppError('Email already in use', 409);
    }

    throw error;
  }
}

export async function loginUser(input: LoginInput) {
  const user = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
  });

  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  const passwordMatches = await bcrypt.compare(
    input.password,
    user.passwordHash,
  );

  if (!passwordMatches) {
    throw new AppError('Invalid credentials', 401);
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  const refreshTokenHash = hashToken(refreshToken);

  const decodedRefreshToken = jwt.decode(refreshToken) as jwt.JwtPayload;

  if (typeof decodedRefreshToken.exp !== 'number') {
    throw new AppError('Invalid refresh token', 500);
  }

  const expiresAt = new Date(decodedRefreshToken.exp * 1000);
  
  await prisma.refreshSession.create({
    data: {
      userId: user.id,
      tokenHash: refreshTokenHash,
      expiresAt,
    },
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    accessToken,
    refreshToken,
  };
}


export async function refreshAccessToken(
  refreshToken: string,
) {
  let decoded: JwtPayload;

  try {
    decoded = jwt.verify(
      refreshToken,
      env.JWT_REFRESH_SECRET,
      {
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
      },
    ) as JwtPayload;
  } catch {
    throw new AppError(
      'Invalid or expired refresh token',
      401,
    );
  }

  if (typeof decoded.sub !== 'string') {
    throw new AppError('Invalid refresh token', 401);
  }

  const tokenHash = hashToken(refreshToken);

  const session = await prisma.refreshSession.findUnique({
    where: {
      tokenHash,
    },
  });

  if (!session) {
    throw new AppError('Invalid refresh session', 401);
  }

  if (session.revokedAt) {
    throw new AppError('Refresh token has been revoked', 401);
  }

  if (session.expiresAt <= new Date()) {
    throw new AppError('Refresh token has expired', 401);
  }

  if (session.userId !== decoded.sub) {
    throw new AppError('Invalid refresh session', 401);
  }

  const newAccessToken = generateAccessToken(
    session.userId,
  );

  const newRefreshToken = generateRefreshToken(
    session.userId,
  );

  const newRefreshTokenHash =
    hashToken(newRefreshToken);

  const decodedNewRefreshToken =
    jwt.decode(newRefreshToken) as JwtPayload;

  if (typeof decodedNewRefreshToken.exp !== 'number') {
    throw new AppError('Invalid refresh token', 500);
  }

  const newExpiresAt = new Date(
    decodedNewRefreshToken.exp * 1000,
  );

  await prisma.$transaction([
    prisma.refreshSession.update({
      where: {
        id: session.id,
      },
      data: {
        revokedAt: new Date(),
      },
    }),

    prisma.refreshSession.create({
      data: {
        userId: session.userId,
        tokenHash: newRefreshTokenHash,
        expiresAt: newExpiresAt,
      },
    }),
  ]);

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
}


export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
}

export async function logoutUser(refreshToken: string) {
  const tokenHash = hashToken(refreshToken);

  await prisma.refreshSession.updateMany({
    where: {
      tokenHash,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });
}