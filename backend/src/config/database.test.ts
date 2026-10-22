import { describe, it, expect, vi, afterEach } from 'vitest';

describe('config/database.ts', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('deve usar SQLite em memória quando NODE_ENV for test', async () => {
    vi.stubEnv('NODE_ENV', 'test');

    const { sequelize } = await import('./database');

    // No ambiente de teste, a instância deve usar SQLite em memória
    expect(sequelize.getDialect()).toBe('sqlite');
    await sequelize.close();
  });

  it('deve usar Postgres quando NODE_ENV não for test', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    vi.stubEnv('DB_NAME', 'test_db');
    vi.stubEnv('DB_USER', 'test_user');
    vi.stubEnv('DB_PASSWORD', 'test_pass');
    vi.stubEnv('DB_HOST', 'localhost');
    vi.stubEnv('DB_PORT', '5432');
    vi.stubEnv('DB_SSL', 'false');

    const { sequelize } = await import('./database');

    expect(sequelize.getDialect()).toBe('postgres');
    await sequelize.close();
  });

  it('deve usar SSL quando DB_SSL for true', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('DB_NAME', 'prod_db');
    vi.stubEnv('DB_USER', 'prod_user');
    vi.stubEnv('DB_PASSWORD', 'prod_pass');
    vi.stubEnv('DB_HOST', 'db.example.com');
    vi.stubEnv('DB_PORT', '5432');
    vi.stubEnv('DB_SSL', 'true');

    const { sequelize } = await import('./database');

    expect(sequelize.getDialect()).toBe('postgres');
    expect(sequelize.config.dialectOptions).toHaveProperty('ssl');
    expect(sequelize.config.dialectOptions.ssl).toEqual({
      require: true,
      rejectUnauthorized: false,
    });
    await sequelize.close();
  });

  it('deve usar valores padrão quando variáveis não forem definidas', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('DB_NAME', '');
    vi.stubEnv('DB_USER', '');
    vi.stubEnv('DB_PASSWORD', '');
    vi.stubEnv('DB_HOST', '');
    vi.stubEnv('DB_PORT', '');

    const { sequelize } = await import('./database');

    // Os valores padrão são: 'fatec_db', 'postgres', 'postgres', 'localhost', 5432
    expect(sequelize.config.database).toBe('fatec_db');
    expect(sequelize.config.username).toBe('postgres');
    expect(sequelize.config.password).toBe('postgres');
    expect(sequelize.config.host).toBe('localhost');
    expect(sequelize.config.port).toBe(5432);
    await sequelize.close();
  });
});
