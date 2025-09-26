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
      prefix: z.optional(
        z
          .string({ error: t('validation.code_issue_settings.prefix.string') })
          .regex(/^\d+$/, {
            error: t('validation.code_issue_settings.prefix.numeric'),
          })
          .max(2, {
            error: t('validation.code_issue_settings.prefix.max', { max: 2 }),
          }),
      ),

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
