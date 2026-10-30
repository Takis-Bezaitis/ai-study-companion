
import { createHmac, timingSafeEqual } from 'node:crypto';

const SPAWN_HMAC_SECRET = process.env.GAME_SPAWN_HMAC_SECRET;

if (!SPAWN_HMAC_SECRET) {
  throw new Error('GAME_SPAWN_HMAC_SECRET is not configured.');
}

export function createSpawnSignature(
  sessionId: string,
  spawnId: string,
  gameItemId: string,
  isCorrect: boolean,
): string {
  return createHmac('sha256', SPAWN_HMAC_SECRET!)
    .update(`${sessionId}:${spawnId}:${gameItemId}:${isCorrect}`)
    .digest('hex');
}

export function verifySpawnSignature(
  signature: string,
  sessionId: string,
  spawnId: string,
  gameItemId: string,
  isCorrect: boolean,
): boolean {
  const expectedSignature = createSpawnSignature(
    sessionId,
    spawnId,
    gameItemId,
    isCorrect,
  );

  const receivedBuffer = Buffer.from(signature, 'hex');
  const expectedBuffer = Buffer.from(expectedSignature, 'hex');

  if (
    receivedBuffer.length !== expectedBuffer.length ||
    receivedBuffer.toString('hex') !== signature.toLowerCase()
  ) {
    return false;
  }

  return timingSafeEqual(receivedBuffer, expectedBuffer);
}
