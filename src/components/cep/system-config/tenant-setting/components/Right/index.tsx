/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import UploadSetting from '@components/cep/system-config/tenant-setting/components/upload'
import { useTranslate } from '@refinedev/core'
import { ParameterResourceEnum } from '@sdk/hey-api'
import { useUserStore } from '@stores/useUserStore'
import { Checkbox, Col, Form, Radio, Typography } from 'antd'
import Image from 'next/image'

const { Text } = Typography
const { Group } = Radio

function Right() {
  const t = useTranslate()
  const form = Form.useFormInstance()
  const parameterSettings = useUserStore((state) => state.parameterSettings)

  const hasApproveRoutePermission =
    parameterSettings?.get?.(ParameterResourceEnum.APPROVE_ROUTES) ?? false

  const watchCompanyLogoImage = Form.useWatch('company_logo_image', form)
  const watchCompanySealImage = Form.useWatch('company_seal_image', form)

  const watchAddress = Form.useWatch('address', form)
  const watchPhone = Form.useWatch('phone_number', form)
  const watchCompanyName = Form.useWatch('company_name', form)

  return (
    <Col xs={24} xl={12}>
      <div className="rounded-lg border border-[#D0D0D0]">
        <div className="flex h-[120px] border-b-[1px] border-solid border-[#D0D0D0]">
          <div className="min-w-[160px] content-center border-r-[1px] border-solid border-[#D0D0D0] pr-10 pl-4 text-left">
            <Text strong>{t('tenant_settings.companyLogo.label')}</Text>
          </div>
          <div className="flex flex-1 content-center items-center">
            <div className="flex w-3/4 content-center items-center px-4">
              <Form.Item name={'company_logo_image_name'} hidden />
              <Form.Item
                name="company_logo_image"
                style={{
                  margin: 0,
                }}
                className="ant-form-item-hidden-margin"
              >
                <UploadSetting
                  name={'company_logo_image'}
                  fileListProp={null}
                  initialUrl={form.getFieldValue('company_logo_image')}
                  aspect={16 / 9}
                />
              </Form.Item>
            </div>

            <div className="flex flex-1 items-center justify-center">
              <Form.Item
                valuePropName="checked"
                name={'is_display_company_logo_image'}
              >
                <Checkbox>{t('tenant_settings.hide')}</Checkbox>
              </Form.Item>
            </div>
          </div>
        </div>

        <div className="flex h-[120px] border-b-[1px] border-solid border-[#D0D0D0]">
          <div className="min-w-[160px] content-center border-r-[1px] border-solid border-[#D0D0D0] pr-10 pl-4 text-left">
            <Text strong>{t('tenant_settings.companySeal.label')}</Text>
          </div>
          <div className="flex flex-1 content-center items-center">
            <div className="flex w-3/4 content-center items-center px-4">
              <Form.Item name={'company_seal_image_name'} hidden />
              <Form.Item
                name="company_seal_image"
                style={{
                  margin: 0,
                }}
                className="ant-form-item-hidden-margin"
              >
                <UploadSetting
                  name={'company_seal_image'}
                  fileListProp={null}
                  initialUrl={form.getFieldValue('company_seal_image')}
                />
              </Form.Item>
            </div>
            <div className="flex flex-1 items-center justify-center">
              <Form.Item
                valuePropName="checked"
                name={'is_display_company_seal_image'}
              >
                <Checkbox>{t('tenant_settings.hide')}</Checkbox>
              </Form.Item>
            </div>
          </div>
        </div>

        <div className="flex min-h-[250px] border-b-[1px] border-solid border-[#D0D0D0]">
          <div className="min-w-[160px] content-center border-r-[1px] border-solid border-[#D0D0D0] pr-10 pl-4 text-left">
            <Text strong>{t('tenant_settings.preview.title')}</Text>
          </div>
          <div className="flex-1 content-center px-4">
            <Form.Item
              name="preview_image"
              style={{
                marginBottom: 0,
              }}
            >
              <div className="relative my-4 min-h-[200px] rounded-lg border border-solid border-[#ccc] p-4">
                {watchCompanyLogoImage && (
                  <div className="mb-4 ml-[60%]">
                    <div className="relative h-[80px] w-[142px]">
                      <Image
                        src={
                          watchCompanyLogoImage instanceof File
                            ? URL.createObjectURL(watchCompanyLogoImage)
                            : watchCompanyLogoImage
                        }
                        alt="company logo preview"
                        fill
                        unoptimized
                        style={{
                          borderRadius: 8,
                          objectFit: 'contain',
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="relative flex items-start justify-between">
                  <div className="ml-[60%] flex flex-1 flex-col space-y-1">
                    {watchCompanyName && (
                      <Text strong className="text-base">
                        {watchCompanyName}
                      </Text>
                    )}
                    {watchAddress && (
                      <Text className="text-sm">{watchAddress}</Text>
                    )}
                    {watchPhone && (
                      <Text className="text-sm">{watchPhone}</Text>
                    )}
                  </div>

                  {watchCompanySealImage && (
                    <div className="relative ml-4 h-[80px] w-[80px] flex-shrink-0">
                      <Image
                        src={
                          watchCompanySealImage instanceof File
                            ? URL.createObjectURL(watchCompanySealImage)
                            : watchCompanySealImage
                        }
                        alt="company seal preview"
                        fill
                        unoptimized
                        style={{
                          borderRadius: 8,
                          objectFit: 'contain',
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </Form.Item>
          </div>
        </div>

        <div className="flex h-[80px] border-solid border-[#D0D0D0]">
          <div className="min-w-[160px] content-center border-r-[1px] border-solid border-[#D0D0D0] pl-4 text-left">
            <Text strong>{t('tenant_settings.digitalStamp.label')}</Text>
          </div>
          <div className="flex flex-1 content-center items-center">
            <div className="solid content-center px-4">
              <Form.Item
                name="is_display_manager_seal"
                style={{
                  margin: 0,
                }}
              >
                <Group
                  defaultValue={true}
                  options={[
                    {
                      value: true,
                      label: t('tenant_settings.digitalStamp.withStamp'),
                      disabled: !hasApproveRoutePermission,
                    },
                    {
                      value: false,
                      label: t('tenant_settings.digitalStamp.withoutStamp'),
                    },
                  ]}
                />
              </Form.Item>
            </div>
          </div>
        </div>

        {/* <div className="flex h-[80px] border-b-[1px] border-solid border-[#D0D0D0]">
          <div className="min-w-[160px] content-center border-r-[1px] border-solid border-[#D0D0D0] pr-10 pl-4 text-left">
            <Text strong>{t('tenant_settings.taxRounding.label')}</Text>
          </div>
          <div className="flex-1 content-center px-4">
            <Form.Item
              name="tax_rounding_method"
              style={{
                marginBottom: 0,
              }}
            >
              <Select
                style={{ width: '50%' }}
                options={[
                  {
                    value: 'round_down',
                    label: t('tenant_settings.taxRounding.options.roundDown'),
                  },
                  {
                    value: 'round_up',
                    label: t('tenant_settings.taxRounding.options.roundUp'),
                  },
                  {
                    value: 'round_nearest',
                    label: t('tenant_settings.taxRounding.options.round'),
                  },
                ]}
              />
            </Form.Item>
          </div>
        </div>

        <div className="flex h-[80px]">
          <div className="min-w-[160px] content-center border-r-[1px] border-solid border-[#D0D0D0] pr-10 pl-4 text-left">
            <Text strong>{t('tenant_settings.priceRounding.label')}</Text>
          </div>
          <div className="flex-1 content-center px-4">
            <Form.Item
              name="sale_price_rounding_method"
              style={{
                marginBottom: 0,
              }}
            >
              <Select
                style={{ width: '50%' }}
                options={[
                  {
                    value: 'round_down',
                    label: t('tenant_settings.priceRounding.options.roundDown'),
                  },
                  {
                    value: 'round_up',
                    label: t('tenant_settings.priceRounding.options.roundUp'),
                  },
                  {
                    value: 'round_nearest',
                    label: t('tenant_settings.priceRounding.options.round'),
                  },
                ]}
              />
            </Form.Item>
          </div>
        </div> */}
      </div>
    </Col>
  )
}

export default Right
