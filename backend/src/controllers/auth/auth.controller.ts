import type { Request, Response, CookieOptions } from 'express';

import {
  loginSchema,
  registerSchema,
} from '../../validations/auth.validation.js';

import {
  getMe,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from '../../services/auth/auth.service.js';

import { env } from '../../config/env.js';
import type { AuthRequest } from '../../types/custom.js';


const refreshCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite:
    env.NODE_ENV === 'production' ? 'none' : 'lax',
  path: '/',
};

export async function register(
  req: Request,
  res: Response,
) {
  const input = registerSchema.parse(req.body);

  const user = await registerUser(input);

  return res.status(201).json({
    data: user,
  });
}

export async function login(
  req: Request,
  res: Response,
) {
  const input = loginSchema.parse(req.body);

  const result = await loginUser(input);

  res.cookie(
    'refreshToken',
    result.refreshToken,
    {
      ...refreshCookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  );

  return res.status(200).json({
    data: {
      user: result.user,
      accessToken: result.accessToken,
    },
  });
}


export async function refresh(
  req: Request,
  res: Response,
) {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      error: 'Refresh token required',
    });
  }

  const result = await refreshAccessToken(
    refreshToken,
  );

  res.cookie(
    'refreshToken',
    result.refreshToken,
    {
      ...refreshCookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  );

  return res.status(200).json({
    data: {
      accessToken: result.accessToken,
    },
  });
}


export async function me(
  req: AuthRequest,
  res: Response,
) {
  if (!req.user) {
    return res.status(401).json({
      error: 'Not authenticated',
    });
  }

  const user = await getMe(req.user.id);

  return res.status(200).json({
    data: user,
  });
}


export async function logout(
  req: Request,
  res: Response,
) {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    await logoutUser(refreshToken);
  }

  res.clearCookie(
    'refreshToken',
    refreshCookieOptions,
  );

  return res.status(204).send();
}