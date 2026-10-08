import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
    exclude: ['node_modules', 'dist'],
    coverage: {
      // Define o provedor nativo V8
      provider: 'v8',

      // Define onde os relatórios HTML e LCOV serão salvos
      reportsDirectory: 'coverage',

      // Padrões de arquivos incluídos na análise de cobertura
      include: ['src/**/*.ts'],

      // Arquivos e pastas que devem ser desconsiderados
      exclude: [
        'src/**/*.test.ts', 
        'src/**/*.spec.ts',
        'src/migrations/**',
        'src/types/**',
        'src/server.ts',
      ],

      // Definição de limites mínimos obrigatórios (Quality Gate Local)
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },

    },
  },
});
