import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  input: 'api-docs/swagger.json',
  output: {
    format: `prettier`,
    lint: `eslint`,
    path: `./src/sdk/hey-api`,
  },
  plugins: [
    `@hey-api/client-next`,
    `@tanstack/react-query`,
    `zod`,
    {
      enums: `javascript`,
      name: `@hey-api/typescript`,
    },
    {
      name: `@hey-api/sdk`,
      validator: {
        request: true,
        response: false,
      },
    },
    {
      name: '@hey-api/client-axios',
      runtimeConfigPath: './src/lib/hey-api.ts',
    },
  ],
})
