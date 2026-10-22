import { describe, it, expect, vi, afterEach } from 'vitest';

describe('config/auth.ts', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('deve usar JWT_SECRET do process.env quando definido', async () => {
    vi.stubEnv('JWT_SECRET', 'my_custom_secret');

    const { JWT_SECRET } = await import('./auth');

    expect(JWT_SECRET).toBe('my_custom_secret');
  });

  it('deve usar chave padrão quando JWT_SECRET não estiver no env', async () => {
    vi.stubEnv('JWT_SECRET', '');

    const { JWT_SECRET } = await import('./auth');

    expect(JWT_SECRET).toBe('chave_secreta_padrao');
  });
});
