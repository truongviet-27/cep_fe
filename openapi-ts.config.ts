import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  input:
    // 'https://k8nw75hfk8.execute-api.ap-northeast-1.amazonaws.com/docs/api-docs.json',
    'http://localhost:8002/docs/api-docs.json',
  output: {
    format: `prettier`,
    lint: `eslint`,
    path: `./src/sdk/hey-api`,
  },
  plugins: [
    `@hey-api/client-next`,
    `zod`,
    {
      enums: `javascript`,
      name: `@hey-api/typescript`,
    },
    {
      name: `@hey-api/sdk`,
      validator: {
        request: 'zod',
      },
    },
    {
      name: '@hey-api/client-axios',
      runtimeConfigPath: './src/lib/hey-api.ts',
    },
  ],
})
