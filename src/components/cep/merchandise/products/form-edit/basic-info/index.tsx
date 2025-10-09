import { CaretDownOutlined, EditFilled } from '@ant-design/icons'
import { CodeIssueSettingEdit } from '@app/(auth)/(layout-breadcrumb)/(system-config)/code-issue-settings/edit/modal'
import CoreInput from '@components/common/core-input'
import ProductCategoryDropdown from '@components/common/product-category-dropdown'
import type { GetListResponse } from '@refinedev/core'
import { useTranslate } from '@refinedev/core'
import type { Rank } from '@sdk/hey-api'
import boldText from '@utility/bold-text'
import { Button, Col, Form, Modal, Row, Select, Spin, Typography } from 'antd'
import { Empty, type FormInstance } from 'antd/lib'
import { type MutableRefObject } from 'react'

import { ProductCategoryModal } from '../modal/product-category'
import type { ProductFormType } from '../use-product-form'
import { useBasicInfoController } from './controller'

interface BasicInfoProps {
  form: FormInstance<ProductFormType>
  addRef: MutableRefObject<
    ((defaultValue?: object, insertIndex?: number) => void) | undefined
  >
  isAllowedSaveButton: boolean

  ranks?: GetListResponse<Rank>
  setIsAllowedSaveButton: (value: boolean) => void
}

const BasicInfo: React.FC<BasicInfoProps> = (props) => {
  const { form, addRef, isAllowedSaveButton, ranks, setIsAllowedSaveButton } =
    props
  const t = useTranslate()
  const [
    {
      loadingPd,
      modalFormProps,
      modalFormCategory,
      codeIssueSetting,
      productUnitOptions,
      isFetchingProductUnits,
    },
    {
      handleAutoNumber,
      handleChooseCategory,
      handleSearchProductUnit,
      handleAppendPackaging,
    },
  ] = useBasicInfoController(form, addRef, setIsAllowedSaveButton, ranks)

  const { show, close, open } = modalFormProps
  const {
    show: onOpenCategoryModal,
    close: onCloseCategoryModal,
    open: isOpenCategoryModal,
  } = modalFormCategory

  const allowShowForm = isAllowedSaveButton

  return (
    <div className="px-2">
      <Row className="my-4">
        <Col xs={24} sm={22} md={20} lg={16} xl={12} xxl={10}>
          <CoreInput
            name="code"
            isView={allowShowForm}
            label={t('products.fields.productCode')}
            required={true}
            layout="horizontal"
            rules={[
              {
                required: true,
                message: '「商品コードは必須です。」',
              },
              {
                max: 20,
                message: '「商品コードは20文字以内で入力してください」',
              },
              {
                pattern: /^[A-Z0-9-]+$/,
                message:
                  '商品コードには A〜Z の英字、1〜9 の数字、およびハイフン（-）のみ使用できます',
              },
            ]}
          />
        </Col>
        <Col xs={24} lg={8}>
          <div className="mt-1 flex">
            <Typography>（A-Z, 0-9, -）</Typography>
            <div className="flex flex-col items-center">
              <Button
                color="primary"
                variant="outlined"
                size="small"
                onClick={handleAutoNumber}
                loading={loadingPd}
                disabled={codeIssueSetting?.data?.issue_method !== 'automatic'}
              >
                {t('products.buttons.autoNumbering')}
              </Button>

              <Button
                color="primary"
                variant="link"
                size="small"
                onClick={() => {
                  show(codeIssueSetting?.data.id)
                }}
              >
                {t('products.codeNumberingSettings')}
              </Button>
            </div>
          </div>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col xs={24} sm={22} md={20} lg={16} xl={12} xxl={10}>
          <CoreInput
            name="name"
            isView={allowShowForm}
            label={t('products.fields.productName')}
            required={true}
            layout="horizontal"
            rules={[
              {
                required: true,
                message: '「商品名は必須です。」',
              },
              {
                max: 100,
                message: '「商品名は100文字以内で入力してください」',
              },
            ]}
          />
        </Col>
      </Row>
      <Row className="mb-4">
        <Col xs={24} sm={22} md={20} lg={16} xl={12} xxl={10}>
          <CoreInput
            name="short_name"
            isView={allowShowForm}
            label={
              <span className="font-bold">
                {t('products.fields.productNameAbbr')}
              </span>
            }
            layout="horizontal"
            rules={[
              {
                max: 50,
                message: '「略称は50文字以内で入力してください」',
              },
            ]}
          />
        </Col>
      </Row>
      <Row className="mb-4">
        <Col xs={24} sm={22} md={20} lg={16} xl={12} xxl={10}>
          <CoreInput
            name="barcode"
            isView={allowShowForm}
            label={
              <span className="font-bold">{t('products.fields.barcode')}</span>
            }
            layout="horizontal"
          />
        </Col>
      </Row>
      <Row className="mb-4">
        <Col xs={24} sm={22} md={20} lg={16} xl={12} xxl={10}>
          <Form.Item
            name="category"
            label={boldText(t('products.fields.category'))}
            colon={false}
            required={true}
            rules={[
              {
                required: true,
                message: '「カテゴリは必須です。」',
              },
            ]}
          >
            <ProductCategoryDropdown
              defaultValue={form.getFieldValue('category')}
              valueOnly={allowShowForm}
              placeholder="選択してください"
              onSelect={handleChooseCategory}
            />
          </Form.Item>
        </Col>

        <Col>
          <Button
            color="primary"
            variant="outlined"
            size="small"
            onClick={() => onOpenCategoryModal()}
            style={{
              margin: '4px 0 0 40px',
            }}
          >
            {t('products.newRegistration')}
          </Button>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col xs={24} sm={22} md={20} lg={16} xl={12} xxl={10}>
          <CoreInput name="unit" hidden />
          <Form.Item
            name="unit_id"
            label={boldText(t('products.fields.unit'))}
            colon={false}
            required={true}
            rules={[
              {
                required: true,
                message: '「単位は必須です。」',
              },
            ]}
          >
            {!allowShowForm ? (
              <Select
                showSearch
                onSearch={handleSearchProductUnit}
                filterOption={false}
                notFoundContent={
                  isFetchingProductUnits ? <Spin size="small" /> : <Empty />
                }
                placeholder={t('products.pleaseSelect')}
                options={isFetchingProductUnits ? [] : productUnitOptions}
                suffixIcon={<CaretDownOutlined />}
                onSelect={(_, option) => {
                  form.setFieldValue('unit', option.label)
                }}
              />
            ) : (
              form.getFieldValue('unit')
            )}
          </Form.Item>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col xs={24} sm={22} md={20} lg={16} xl={12} xxl={10}>
          <CoreInput
            name="cost_price"
            isView={allowShowForm}
            label={t('products.fields.costPrice')}
            required={true}
            layout="horizontal"
            type="number"
            rules={[
              {
                required: true,
                message: '「原価は必須です。」',
              },
              {
                validator: (_, value) => {
                  if (value === undefined || value === null) {
                    return Promise.resolve()
                  }

                  if (value < 0) {
                    return Promise.reject(
                      '「原価は0以上の数字で入力してください」',
                    )
                  }

                  return Promise.resolve()
                },
              },
            ]}
            style={{
              width: '100%',
              padding: 0,
            }}
          />
        </Col>
      </Row>
      <Row className="mb-4">
        <Col xs={24} sm={22} md={20} lg={16} xl={12} xxl={10}>
          <CoreInput
            name="selling_price"
            isView={allowShowForm}
            label={t('products.fields.sellingPrice')}
            required={true}
            layout="horizontal"
            type="number"
            rules={[
              {
                required: true,
                message: '「販売単価は必須です。」',
              },
              {
                validator: (_, value) => {
                  if (value === undefined || value === null) {
                    return Promise.resolve()
                  }

                  console.log(value, typeof value)

                  if (value < 0) {
                    return Promise.reject(
                      '「原価は0以上の数字で入力してください」',
                    )
                  }

                  if (value < form.getFieldValue('cost_price')) {
                    return Promise.reject(
                      '「販売単価は原価以上で入力してください」',
                    )
                  }

                  if (!Number.isInteger(value)) {
                    return Promise.reject('「整数で入力してください」')
                  }

                  return Promise.resolve()
                },
              },
            ]}
            style={{
              width: '100%',
            }}
          />
        </Col>
        <Col>
          <div className="mt-1 ml-10">
            {isAllowedSaveButton ? (
              <EditFilled
                onClick={() => {
                  setIsAllowedSaveButton(false)
                }}
              />
            ) : (
              <Button
                size="small"
                color="blue"
                variant="outlined"
                onClick={handleAppendPackaging}
              >
                {t('更新')}
              </Button>
            )}
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs={24} sm={22} md={20} lg={16} xl={12} xxl={10}>
          <CoreInput
            name="note"
            isView={allowShowForm}
            label={t('products.fields.remarks')}
            layout="horizontal"
          />
        </Col>
      </Row>
      <CoreInput name="category_id" hidden />
      <Modal
        open={open}
        onCancel={close}
        cancelButtonProps={{ style: { display: 'none' } }}
        okButtonProps={{ style: { display: 'none' } }}
        width="650px"
      >
        <CodeIssueSettingEdit modalProps={modalFormProps} />
      </Modal>
      <Modal
        open={isOpenCategoryModal}
        onCancel={onCloseCategoryModal}
        cancelButtonProps={{ style: { display: 'none' } }}
        okButtonProps={{ style: { display: 'none' } }}
        width={'25vw'}
        title={t('products.productCategoryEdit')}
        footer={null}
      >
        <ProductCategoryModal modalProps={modalFormCategory} />
      </Modal>
    </div>
  )
}

export default BasicInfo
