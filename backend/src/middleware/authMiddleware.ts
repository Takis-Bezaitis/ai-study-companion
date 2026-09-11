import type { Response, NextFunction } from 'express';
import type { JwtPayload } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';

import { env } from '../config/env.js';
import type { AuthRequest } from '../types/custom.js';
import { AppError } from '../utils/AppError.js';

const JWT_ACCESS_SECRET = process.env['JWT_ACCESS_SECRET'];

if (!JWT_ACCESS_SECRET) {
  throw new Error('Missing JWT_ACCESS_SECRET in environment variables');
}

export function authMiddleware(
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError('Not authenticated', 401);
    }

    const token = authHeader.slice(7);

    if (!token) {
      throw new AppError('Not authenticated', 401);
    }

    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET, {
      issuer: 'ai-study-companion',
      audience: 'ai-study-companion-users',
    }) as JwtPayload;

    if (typeof decoded.sub !== 'string') {
      throw new AppError('Invalid token', 401);
    }

    req.user = {
      id: decoded.sub,
    };

    next();
  } catch {
    throw new AppError('Invalid or expired token', 401);
  }
}