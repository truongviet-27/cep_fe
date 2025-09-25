/* eslint-disable */
import { createSchemaFieldRule } from 'antd-zod'
import { z } from 'zod'

export const validateRankRule = (t: any) => {
  return createSchemaFieldRule(
    z.object({
      id: z.optional(z.int()),
      code: z.optional(
        z
          .string()
          .max(20, { error: t('validation.rank.code.max', { max: 20 }) })
          .regex(/^[A-Za-z0-9]+$/, {
            error: t('validation.rank.code.regex'),
          }),
      ),
      name: z.optional(
        z
          .string()
          .max(50, { error: t('validation.rank.name.max', { max: 50 }) }),
      ),
      rate: z.optional(
        z
          .int({ error: t('validation.rank.rate.type') })
          .gte(0, { error: t('validation.rank.rate.min', { min: 0 }) }),
      ),
      note: z.optional(
        z.union([
          z.string().max(255, {
            error: t('validation.rank.note.max', { max: 255 }),
          }),
          z.null(),
        ]),
      ),
      created_at: z.optional(z.iso.datetime()),
      updated_at: z.optional(z.iso.datetime()),
    }),
  )
}
