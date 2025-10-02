/* eslint-disable */
import { createSchemaFieldRule } from 'antd-zod'
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
        .regex(/^(?:0|\+84)(3|5|7|8|9)\d{8}$/, {
          error: t('validation.customer.phone.regex'),
        }),
    ),
    mail: z.optional(
      z
        .string()
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
          .string({ error: t('validation.customer.customer_code.string') })
          .max(50, {
            error: t('validation.customer.customer_code.max', { max: 50 }),
          })
          .regex(/^[A-Z0-9-]+$/, {
            error: t('validation.rank.code.regex'),
          }),
      ),
      name: z.optional(
        z
          .string({ error: t('validation.customer.name.string') })
          .max(255, { error: t('validation.customer.name.max', { max: 255 }) }),
      ),
      customer_name_by_kana: z.optional(
        z
          .string({
            error: t('validation.customer.customer_name_by_kana.string'),
          })
          .max(255, {
            error: t('validation.customer.customer_name_by_kana.max', {
              max: 255,
            }),
          })
          .regex(/^[ァ-ンヴ・ー]+$/, {
            error: t('validation.customer.customer_name_by_kana.regex'),
          })
          .or(z.literal('')),
      ),
      customer_type: z.optional(
        z.enum(['individual', 'company'], {
          error: t('validation.customer.customer_type.in'),
        }),
      ),
      company_type: z.optional(
        z
          .string({ error: t('validation.customer.company_type.string') })
          .max(50, {
            error: t('validation.customer.company_type.max', { max: 50 }),
          }),
      ),
      company_name_display_format: z.optional(
        z.enum(['before', 'after'], {
          error: t('validation.customer.company_name_display_format.in'),
        }),
      ),
      corporate_number: z.optional(
        z
          .string({ error: t('validation.customer.corporate_number.string') })
          .max(50, {
            error: t('validation.customer.corporate_number.max', { max: 50 }),
          }),
      ),
      price_rank_id: z.optional(
        z.int({ error: t('validation.customer.price_rank_id.integer') }),
      ),

      country: z.optional(
        z.string({ error: t('validation.customer.country.string') }).max(50, {
          error: t('validation.customer.country.max', { max: 50 }),
        }),
      ),
      post_code: z
        .string({ error: t('validation.required') })
        .max(10, {
          error: t('validation.customer.post_code.max', { max: 10 }),
        })
        .min(1, { error: t('validation.required') }),
      address: z.optional(
        z
          .string({ error: t('validation.required') })
          .max(255, {
            error: t('validation.customer.address.max', { max: 255 }),
          })
          .min(1, { error: t('validation.required') }),
      ),
      building: z.optional(
        z
          .string({ error: t('validation.customer.building.string') })
          .max(255, {
            error: t('validation.customer.building.max', { max: 255 }),
          })
          .nullable(),
      ),

      phone: z.optional(
        z
          .string({ error: t('validation.customer.phone.string') })
          .max(20, { error: t('validation.customer.phone.max', { max: 20 }) })
          .regex(/^(?:0|\+84)(3|5|7|8|9)\d{8}$/, {
            error: t('validation.customer.phone.regex'),
          }),
      ),
      fax: z.optional(
        z
          .string({ error: t('validation.customer.fax.string') })
          .max(20, { error: t('validation.customer.fax.max', { max: 20 }) })
          .or(z.literal(''))
          .nullable(),
      ),
      mail: z.optional(
        z
          .string({ error: t('validation.required') })
          .email({ error: t('validation.customer.mail.email') })
          .max(255, { error: t('validation.customer.mail.max', { max: 255 }) }),
      ),

      listing_classification: z.optional(
        z
          .enum(['未上場', 'プライム', 'スタンダード', 'グロース'], {
            error: t('validation.customer.listing_classification.in'),
          })
          .nullable(),
      ),
      industry: z.optional(
        z.string({ error: t('validation.customer.industry.string') }).max(255, {
          error: t('validation.customer.industry.max', { max: 255 }),
        }),
      ),
      date_of_establishment: z.any().optional(),

      department_in_charge: z
        .string({
          error: t('validation.customer.department_in_charge.string'),
        })
        .max(100, {
          error: t('validation.customer.department_in_charge.max', {
            max: 100,
          }),
        }),
      person_in_charge_name: z.optional(
        z
          .string({
            error: t('validation.customer.person_in_charge_name.string'),
          })
          .max(50, {
            error: t('validation.customer.person_in_charge_name.max', {
              max: 50,
            }),
          }),
      ),
      person_in_charge_department: z.optional(
        z
          .string({
            error: t('validation.customer.person_in_charge_department.string'),
          })
          .max(100, {
            error: t('validation.customer.person_in_charge_department.max', {
              max: 100,
            }),
          })
          .min(1, { error: t('validation.required') }),
      ),
      person_in_charge_mail: z.optional(
        z
          .string(t('validation.customer.person_in_charge_mail.email'))
          .email({
            error: t('validation.customer.person_in_charge_mail.email'),
          })
          .max(100, {
            error: t('validation.customer.person_in_charge_mail.max', {
              max: 100,
            }),
          })
          .min(1, { error: t('validation.required') }),
      ),
      person_in_charge_phone: z.optional(
        z
          .string({
            error: t('validation.customer.person_in_charge_phone.string'),
          })
          .max(20, {
            error: t('validation.customer.person_in_charge_phone.max', {
              max: 20,
            }),
          })
          .regex(/^(?:0|\+84)(3|5|7|8|9)\d{8}$/, {
            error: t('validation.customer.person_in_charge_phone.regex'),
          })
          .or(z.literal(''))
          .nullable(),
      ),
      company_research_information: z.optional(
        z.array(zCompanyResearchInformationRule(t)),
      ),
      delivery_addresses: z.optional(z.array(zDeliveryAddressRule(t))),
    }),
  )
}
