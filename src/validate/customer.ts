/* eslint-disable */
import { createSchemaFieldRule } from 'antd-zod'
import { error } from 'console'
import { z } from 'zod'

const zDeliveryAddressRule = (t: any) =>
  z.object({
    id: z.optional(z.int()),
    delivery_address_name: z.optional(
      z
        .string({
          error: t('validation.customer.delivery_address_name.string'),
        })
        .max(50, {
          error: t('validation.customer.delivery_address_name.max', {
            max: 50,
          }),
        }),
    ),
    address: z.optional(
      z.string({ error: t('validation.customer.address.string') }).max(255, {
        error: t('validation.customer.address.max', { max: 255 }),
      }),
    ),
    contact_person_name: z.optional(
      z
        .string({ error: t('validation.customer.contact_person_name.string') })
        .max(50, {
          error: t('validation.customer.contact_person_name.max', { max: 50 }),
        }),
    ),
    phone: z.optional(
      z
        .string({ error: t('validation.customer.phone.string') })
        .max(20, { error: t('validation.customer.phone.max', { max: 20 }) })
        .regex(/^\d{3,11}$/, {
          error: t('validation.customer.phone.regex'),
        }),
    ),
    mail: z.optional(
      z
        .string({ error: t('validation.customer.mail.email') })
        .email({ error: t('validation.customer.mail.email') })
        .max(100, { error: t('validation.customer.mail.max', { max: 100 }) }),
    ),
  })

const zCompanyResearchInformationRule = (t: any) =>
  z.object({
    id: z.optional(z.union([z.int(), z.null()])),
    material_name: z.optional(
      z
        .string({ error: t('validation.customer.material_name.string') })
        .max(50, {
          error: t('validation.customer.material_name.max', { max: 50 }),
        }),
    ),
    judgement: z.optional(
      z.enum(['A', 'B', 'C', 'D', 'E', 'O', 'T', 'X', '未定'], {
        error: t('validation.customer.judgement.in'),
      }),
    ),
    files: z.optional(
      z.array(
        z.object({
          name: z
            .string({ error: t('validation.customer.file_name.string') })
            .max(255, {
              error: t('validation.customer.file_name.max', { max: 255 }),
            }),
          url: z
            .string({ error: t('validation.customer.file_url.string') })
            .url({ error: t('validation.customer.file_url.url') })
            .max(1024, {
              error: t('validation.customer.file_url.max', { max: 1024 }),
            }),
        }),
      ),
    ),
  })

export const validateCustomerRule = (t: any) => {
  return createSchemaFieldRule(
    z.object({
      customer_code: z.optional(
        z
          .string({ error: t('validation.customer.customer_code.required') })
          .superRefine((val, ctx) => {
            if (val.length < 1) {
              ctx.addIssue({
                code: z.ZodIssueCode.too_small,
                origin: 'string',
                minimum: 1,
                type: 'string',
                inclusive: true,
                message: t('validation.customer.customer_code.required'),
              })
              return
            }
            if (val.length > 50) {
              ctx.addIssue({
                code: z.ZodIssueCode.too_big,
                origin: 'string',
                maximum: 50,
                type: 'string',
                inclusive: true,
                message: t('validation.customer.customer_code.max', {
                  max: 50,
                }),
              })
              return
            }
            if (!/^[A-Z0-9-]+$/.test(val)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                validation: 'regex',
                message: t('validation.rank.code.regex'),
              })
              return
            }
          }),
      ),
      name: z.optional(
        z
          .string({ error: t('validation.customer.name.required') })
          .superRefine((val, ctx) => {
            if (val.length < 1) {
              ctx.addIssue({
                code: z.ZodIssueCode.too_small,
                origin: 'string',
                minimum: 1,
                type: 'string',
                inclusive: true,
                message: t('validation.customer.name.required'),
              })
              return
            }
            if (val.length > 255) {
              ctx.addIssue({
                code: z.ZodIssueCode.too_big,
                origin: 'string',
                maximum: 255,
                type: 'string',
                inclusive: true,
                message: t('validation.customer.name.max', { max: 255 }),
              })
              return
            }
          }),
      ),
      customer_name_by_kana: z.optional(
        z
          .string({
            error: t('validation.customer.customer_name_by_kana.required'),
          })
          .nullable()
          .or(z.literal(''))
          .superRefine((val, ctx) => {
            if (val === null || val === '') return

            if (val.length > 255) {
              ctx.addIssue({
                code: z.ZodIssueCode.too_big,
                origin: 'string',
                maximum: 255,
                type: 'string',
                inclusive: true,
                message: t('validation.customer.customer_name_by_kana.max', {
                  max: 255,
                }),
              })
              return
            }
            if (!/^[ァ-ンヴ・ー]+$/.test(val)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                validation: 'regex',
                message: t('validation.customer.customer_name_by_kana.regex'),
              })
              return
            }
          }),
      ),
      customer_type: z.optional(
        z.enum(['individual', 'company'], {
          error: t('validation.customer.customer_type.in'),
        }),
      ),
      company_type: z.optional(
        z
          .string({ error: t('validation.customer.company_type.required') })
          .superRefine((val, ctx) => {
            if (val.length > 50) {
              ctx.addIssue({
                code: z.ZodIssueCode.too_big,
                origin: 'string',
                maximum: 50,
                type: 'string',
                inclusive: true,
                message: t('validation.customer.company_type.max', { max: 50 }),
              })
              return
            }
          })
          .nullable(),
      ),
      company_name_display_format: z
        .optional(
          z.enum(['before', 'after'], {
            error: t('validation.customer.company_name_display_format.in'),
          }),
        )
        .nullable(),
      corporate_number: z.optional(
        z
          .string({ error: t('validation.customer.corporate_number.required') })
          .superRefine((val, ctx) => {
            if (val.length > 50) {
              ctx.addIssue({
                code: z.ZodIssueCode.too_big,
                origin: 'string',
                maximum: 50,
                type: 'string',
                inclusive: true,
                message: t('validation.customer.corporate_number.max', {
                  max: 50,
                }),
              })
              return
            }
          })
          .nullable(),
      ),
      price_rank_id: z
        .int({
          error: t('validation.customer.price_rank_id.required'),
        })
        .min(1, { error: t('validation.customer.price_rank_id.required') }),
      country: z.optional(
        z
          .string({ error: t('validation.customer.country.required') })
          .nullable()
          .or(z.literal(''))
          .superRefine((val, ctx) => {
            if (val === null || val === '') return

            if (val.length > 50) {
              ctx.addIssue({
                code: z.ZodIssueCode.too_big,
                origin: 'string',
                maximum: 50,
                type: 'string',
                inclusive: true,
                message: t('validation.customer.country.max', { max: 50 }),
              })
              return
            }
          }),
      ),
      post_code: z
        .string({ error: t('validation.customer.post_code.required') })
        .superRefine((val, ctx) => {
          if (val.length < 1) {
            ctx.addIssue({
              code: z.ZodIssueCode.too_small,
              origin: 'string',
              minimum: 1,
              type: 'string',
              inclusive: true,
              message: t('validation.customer.post_code.required'),
            })
            return
          }
          if (val.length > 10) {
            ctx.addIssue({
              code: z.ZodIssueCode.too_big,
              origin: 'string',
              maximum: 10,
              type: 'string',
              inclusive: true,
              message: t('validation.customer.post_code.max', { max: 10 }),
            })
            return
          }
          if (!/^[0-9]+$/.test(val)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              validation: 'regex',
              message: t('validation.customer.post_code.numeric_only'),
            })
            return
          }
        }),
      address: z.optional(
        z
          .string({ error: t('validation.customer.address.required') })
          .superRefine((val, ctx) => {
            if (val.length < 1) {
              ctx.addIssue({
                code: z.ZodIssueCode.too_small,
                origin: 'string',
                minimum: 1,
                type: 'string',
                inclusive: true,
                message: t('validation.required'),
              })
              return
            }
            if (val.length > 255) {
              ctx.addIssue({
                code: z.ZodIssueCode.too_big,
                origin: 'string',
                maximum: 255,
                type: 'string',
                inclusive: true,
                message: t('validation.customer.address.max', { max: 255 }),
              })
              return
            }
          }),
      ),
      building: z.optional(
        z
          .string({ error: t('validation.customer.building.required') })
          .max(255, {
            error: t('validation.customer.building.max', { max: 255 }),
          })
          .nullable(),
      ),

      phone: z.optional(
        z
          .string({ error: t('validation.customer.phone.required') })
          .superRefine((val, ctx) => {
            if (val.length < 1) {
              ctx.addIssue({
                code: z.ZodIssueCode.too_small,
                origin: 'string',
                minimum: 1,
                type: 'string',
                inclusive: true,
                message: t('validation.customer.phone.required'),
              })
              return
            }
            if (val.length > 20) {
              ctx.addIssue({
                code: z.ZodIssueCode.too_big,
                origin: 'string',
                maximum: 20,
                type: 'string',
                inclusive: true,
                message: t('validation.customer.phone.max', { max: 20 }),
              })
              return
            }
            if (!/^\d+$/.test(val)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: t('validation.customer.phone.regex'),
              })
              return
            }
          }),
      ),
      fax: z.optional(
        z
          .string({ error: t('validation.customer.fax.required') })
          .nullable()
          .or(z.literal(''))
          .superRefine((val, ctx) => {
            if (val === null || val === '') return
            if (val.length > 20) {
              ctx.addIssue({
                code: z.ZodIssueCode.too_big,
                origin: 'string',
                maximum: 20,
                type: 'string',
                inclusive: true,
                message: t('validation.customer.fax.max', { max: 20 }),
              })
              return
            }
          }),
      ),
      mail: z.optional(
        z
          .string({ error: t('validation.customer.mail.required') })
          .superRefine((val, ctx) => {
            if (val.length < 1) {
              ctx.addIssue({
                code: z.ZodIssueCode.too_small,
                origin: 'string',
                minimum: 1,
                type: 'string',
                inclusive: true,
                message: t('validation.customer.mail.required'),
              })
              return
            }
            if (val.length > 255) {
              ctx.addIssue({
                code: z.ZodIssueCode.too_big,
                origin: 'string',
                maximum: 255,
                type: 'string',
                inclusive: true,
                message: t('validation.customer.mail.max', { max: 255 }),
              })
              return
            }
            if (!z.string().email().safeParse(val).success) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                validation: 'email',
                message: t('validation.customer.mail.email'),
              })
              return
            }
          }),
      ),

      listing_classification: z.optional(
        z
          .enum(['未上場', 'プライム', 'スタンダード', 'グロース'], {
            error: t('validation.customer.listing_classification.in'),
          })
          .nullable(),
      ),
      industry: z
        .optional(
          z
            .string({ error: t('validation.customer.industry.required') })
            .superRefine((val, ctx) => {
              if (val.length > 255) {
                ctx.addIssue({
                  code: z.ZodIssueCode.too_big,
                  origin: 'string',
                  maximum: 255,
                  type: 'string',
                  inclusive: true,
                  message: t('validation.customer.industry.max', { max: 255 }),
                })
                return
              }
            }),
        )
        .nullable(),
      date_of_establishment: z.any().optional(),

      department_in_charge_id: z
        .int({
          error: t('validation.customer.department_in_charge.required'),
        })
        .min(1, {
          error: t('validation.customer.department_in_charge.required'),
        }),
      person_in_charge_name: z.optional(
        z
          .string({
            error: t('validation.customer.person_in_charge_name.required'),
          })
          .superRefine((val, ctx) => {
            if (val.length < 1) {
              ctx.addIssue({
                code: z.ZodIssueCode.too_small,
                origin: 'string',
                minimum: 1,
                type: 'string',
                inclusive: true,
                message: t(
                  'validation.customer.person_in_charge_name.required',
                ),
              })
              return
            }
            if (val.length > 50) {
              ctx.addIssue({
                code: z.ZodIssueCode.too_big,
                origin: 'string',
                maximum: 50,
                type: 'string',
                inclusive: true,
                message: t('validation.customer.person_in_charge_name.max', {
                  max: 50,
                }),
              })
              return
            }
          }),
      ),
      person_in_charge_department: z.optional(
        z
          .string({
            error: t(
              'validation.customer.person_in_charge_department.required',
            ),
          })
          .superRefine((val, ctx) => {
            if (val.length < 1) {
              ctx.addIssue({
                code: z.ZodIssueCode.too_small,
                origin: 'string',
                minimum: 1,
                type: 'string',
                inclusive: true,
                message: t('validation.required'),
              })
              return
            }
            if (val.length > 100) {
              ctx.addIssue({
                code: z.ZodIssueCode.too_big,
                origin: 'string',
                maximum: 100,
                type: 'string',
                inclusive: true,
                message: t(
                  'validation.customer.person_in_charge_department.max',
                  {
                    max: 100,
                  },
                ),
              })
              return
            }
          }),
      ),
      person_in_charge_mail: z.optional(
        z
          .string(t('validation.customer.person_in_charge_mail.required'))
          .superRefine((val, ctx) => {
            if (val.length < 1) {
              ctx.addIssue({
                code: z.ZodIssueCode.too_small,
                origin: 'string',
                minimum: 1,
                type: 'string',
                inclusive: true,
                message: t('validation.required'),
              })
              return
            }
            if (val.length > 100) {
              ctx.addIssue({
                code: z.ZodIssueCode.too_big,
                origin: 'string',
                maximum: 100,
                type: 'string',
                inclusive: true,
                message: t('validation.customer.person_in_charge_mail.max', {
                  max: 100,
                }),
              })
              return
            }
            if (!z.string().email().safeParse(val).success) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                validation: 'email',
                message: t('validation.customer.person_in_charge_mail.email'),
              })
              return
            }
          }),
      ),
      person_in_charge_phone: z.optional(
        z
          .string({
            error: t('validation.customer.person_in_charge_phone.required'),
          })
          .nullable()
          .or(z.literal(''))
          .superRefine((val, ctx) => {
            if (val === null || val === '') return

            if (val.length > 20) {
              ctx.addIssue({
                code: z.ZodIssueCode.too_big,
                origin: 'string',
                maximum: 20,
                type: 'string',
                inclusive: true,
                message: t('validation.customer.person_in_charge_phone.max', {
                  max: 20,
                }),
              })
              return
            }
            if (!/^\d{3,11}$/.test(val)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                validation: 'regex',
                message: t('validation.customer.person_in_charge_phone.regex'),
              })
              return
            }
          }),
      ),
      company_research_information: z.optional(
        z.array(zCompanyResearchInformationRule(t)),
      ),
      delivery_addresses: z.optional(z.array(zDeliveryAddressRule(t))),
    }),
  )
}
