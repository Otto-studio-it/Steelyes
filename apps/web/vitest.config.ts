import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: [
      'src/lib/configurator/ar/**/*.test.ts',
      'src/lib/configurator/configuration-summary.test.ts',
      'src/lib/configurator/quote-pdf.test.ts',
      'src/lib/configurator/colour-fit.test.ts',
      'src/lib/configurator/lead-pipeline.test.ts',
      'src/lib/security/**/*.test.ts',
      'src/lib/email/**/*.test.ts',
    ],
    exclude: ['**/node_modules/**', '**/._*'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
