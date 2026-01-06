/* eslint-disable */
import { createSchemaFieldRule } from 'antd-zod'
import { z } from 'zod'

export const validateCodeIssueSettingsRule = (t: any) => {
  return createSchemaFieldRule(
    z.object({
      issue_method: z.optional(
        z.enum(['automatic', 'manual'], {
          error: t('validation.code_issue_settings.issue_method.in'),
        }),
      ),
      prefix: z.string().superRefine((val, ctx) => {
        const trimmedVal = val.replace(/\s/g, '')

        if (trimmedVal.length < 1) {
          ctx.addIssue({
            code: z.ZodIssueCode.too_small,
            origin: 'string',
            minimum: 1,
            type: 'string',
            inclusive: true,
            message: t('validation.code_issue_settings.prefix.required'),
          })
          return
        }

        if (trimmedVal.length > 2) {
          ctx.addIssue({
            code: z.ZodIssueCode.too_big,
            origin: 'string',
            maximum: 2,
            type: 'string',
            inclusive: true,
            message: t('validation.code_issue_settings.prefix.max', { max: 2 }),
          })
          return
        }

        if (!/^[A-Z ]+$/.test(val)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            validation: 'regex',
            message: t('validation.code_issue_settings.prefix.numeric'),
          })
          return
        }
      }),

      hash_dash: z.optional(
        z.boolean({
          error: t('validation.code_issue_settings.hash_dash.boolean'),
        }),
      ),

      segment: z.optional(
        z.enum(
          [
            'none',
            'year',
            'year_range',
            'year_month',
            'year_month_range',
            'year_month_day',
            'year_month_day_range',
          ],
          { error: t('validation.code_issue_settings.segment.in') },
        ),
      ),

      serial_length: z.optional(
        z
          .number({
            error: t('validation.code_issue_settings.serial_length.number'),
          })
          .min(1, {
            error: t('validation.code_issue_settings.serial_length.min', {
              min: 1,
            }),
          })
          .max(10, {
            error: t('validation.code_issue_settings.serial_length.max', {
              max: 10,
            }),
          }),
      ),
    }),
  )
}
