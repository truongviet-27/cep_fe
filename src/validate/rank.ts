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
          .or(z.literal(''))
          .superRefine((val, ctx) => {
            if (val.trim().length === 0) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: t('validation.rank.code.required'),
              })
              return z.NEVER
            }
            if (val.length > 20) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: t('validation.rank.code.max', { max: 20 }),
              })
              return z.NEVER
            }
            if (!/^[A-Z0-9-]+$/.test(val)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: t('validation.rank.code.regex'),
              })
              return z.NEVER
            }
          }),
      ),
      name: z.optional(
        z
          .string()
          .or(z.literal(''))
          .superRefine((val, ctx) => {
            if (val.trim().length === 0) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: t('validation.rank.name.required'),
              })
              return z.NEVER
            }
            if (val.length > 50) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: t('validation.rank.name.max', { max: 50 }),
              })
              return z.NEVER
            }
          }),
      ),
      rate: z.any().superRefine((val, ctx) => {
        if (val === undefined || val === null || val === '') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('validation.rank.rate.required'),
          })
          return z.NEVER
        }
        const num = Number(val)
        if (isNaN(num)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('validation.rank.rate.type'),
          })
          return z.NEVER
        }
      }),
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
