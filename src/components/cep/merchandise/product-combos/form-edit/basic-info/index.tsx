import { CaretDownOutlined } from '@ant-design/icons'
import { CodeIssueSettingEdit } from '@app/(auth)/(layout-breadcrumb)/(system-config)/code-issue-settings/edit/modal'
import {
  ProductResourceEnum,
  ProductResourceLabel,
} from '@components/cep/merchandise/products/enum'
import { ProductUnitModal } from '@components/cep/merchandise/products/form-edit/modal/product-unit'
import CoreInput from '@components/common/core-input'
import ProductCategoryEditDropdown from '@components/common/product-category-edit-dropdown'
import UploadImage from '@components/common/upload-image/upload-image'
import { useTranslate } from '@refinedev/core'
import boldText from '@utility/bold-text'
import {
  Button,
  Col,
  Form,
  InputNumber,
  Modal,
  Radio,
  Row,
  Select,
  Spin,
  Typography,
} from 'antd'
import { Empty, type FormInstance } from 'antd/lib'
import type { MutableRefObject } from 'react'
import { useEffect, useRef } from 'react'

import { ProductCategoryModal } from '../modal/product-category'
import type { ProductComboFormType } from '../use-product-combo-form'
import { useBasicInfoController } from './controller'

interface BasicInfoProps {
  form: FormInstance<ProductComboFormType>
  setIsInitializingCode: (value: boolean) => void
  isEdit?: boolean
  isResourceChangedByUserRef: MutableRefObject<boolean>
}

const BasicInfo: React.FC<BasicInfoProps> = (props) => {
  const { form, setIsInitializingCode, isEdit, isResourceChangedByUserRef } =
    props
  const t = useTranslate()

  const resourceWatch = Form.useWatch('resource', form)
  const prevResourceRef = useRef<string>(
    resourceWatch ?? ProductResourceEnum.MERCHANDISE,
  )
  const userResourceInteracted = useRef(false)
  useEffect(() => {
    if (!userResourceInteracted.current) {
      prevResourceRef.current = resourceWatch ?? ProductResourceEnum.MERCHANDISE
    }
  }, [resourceWatch])
  const [
    {
      loadingPd,
      modalFormProps,
      modalFormCategory,
      codeIssueSetting,
      productUnitOptions,
      isFetchingProductUnits,
      modalFormProductUnit,
      orderNumberProductUnits,
    },
    {
      handleAutoNumber,
      handleChooseCategory,
      handleSearchProductUnit,
      // handleAppendPackaging,
    },
  ] = useBasicInfoController(form, setIsInitializingCode)

  const { show, close, open } = modalFormProps
  const {
    show: onOpenCategoryModal,
    close: onCloseCategoryModal,
    open: isOpenCategoryModal,
  } = modalFormCategory
  const {
    show: onOpenProductUnitModal,
    close: onCloseProductUnitModal,
    open: isOpenProductUnitModal,
  } = modalFormProductUnit

  return (
    <div className="grid grid-cols-5 px-2">
      <div className="col-span-4">
        <Row className="my-4">
          <Col xs={24} sm={22} md={20} lg={16} xl={12} xxl={10}>
            <CoreInput
              name="code"
              label={t('product_combos.fields.assortmentCode')}
              required={true}
              layout="horizontal"
              rules={[
                {
                  required: true,
                  message: 'セットコードは必須です。',
                },
                {
                  max: 20,
                  message: 'セットコードは20文字以内で入力してください',
                },
                {
                  pattern: /^[A-Za-z0-9-_]+$/,
                  message:
                    'セットコードにはA〜Z, a〜zの英字, 0〜9の数字, ハイフン(-), およびアンダーバー(_)のみ使用できます。',
                },
              ]}
            />
          </Col>
          <Col xs={24} lg={8}>
            <div className="mt-1 flex">
              <Typography>（A-Z, a-z, 0-9, -, _）</Typography>
              <div className="flex flex-col items-center">
                <Button
                  color="primary"
                  variant="outlined"
                  size="small"
                  onClick={handleAutoNumber}
                  loading={loadingPd}
                  disabled={
                    codeIssueSetting?.data?.issue_method !== 'automatic'
                  }
                >
                  {t('product_combos.buttons.autoNumbering')}
                </Button>

                <Button
                  color="primary"
                  variant="link"
                  size="small"
                  onClick={() => {
                    show(codeIssueSetting?.data.id)
                  }}
                >
                  {t('product_combos.codeNumberingSettings')}
                </Button>
              </div>
            </div>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col xs={24} sm={22} md={20} lg={16} xl={12} xxl={10}>
            <CoreInput
              name="name"
              label={t('product_combos.fields.assortmentName')}
              required={true}
              layout="horizontal"
              rules={[
                {
                  required: true,
                  message: 'セット名は必須です。',
                },
                {
                  max: 100,
                  message: 'セット名は100文字以内で入力してください',
                },
              ]}
            />
          </Col>
        </Row>
        <Row className="mb-4">
          <Col xs={24} sm={22} md={20} lg={16} xl={12} xxl={10}>
            <Form.Item
              name="resource"
              label={boldText('セット区分')}
              colon={false}
              required={true}
              rules={[
                {
                  required: true,
                  message: 'セット区分は必須です。',
                },
              ]}
              initialValue={ProductResourceEnum.MERCHANDISE}
            >
              <Radio.Group
                disabled={isEdit}
                options={[
                  {
                    label:
                      ProductResourceLabel[ProductResourceEnum.MERCHANDISE],
                    value: ProductResourceEnum.MERCHANDISE,
                  },
                  {
                    label: ProductResourceLabel[ProductResourceEnum.SERVICE],
                    value: ProductResourceEnum.SERVICE,
                  },
                ]}
                onChange={(e) => {
                  userResourceInteracted.current = true
                  const newValue = e.target.value
                  const prevValue = prevResourceRef.current

                  if (newValue === prevValue) {
                    return
                  }

                  const products = form.getFieldValue('products') || []
                  const hasSelected = products.some((p: never) => p && p.id)
                  if (hasSelected) {
                    form.setFieldValue('resource', prevValue)
                    Modal.confirm({
                      icon: null,
                      centered: true,
                      closable: true,
                      maskClosable: false,
                      content:
                        'セット区分を変更すると、登録済みの商品がクリアされます。よろしいでしょうか?',
                      okText: '変更する',
                      cancelText: 'キャンセル',
                      onOk() {
                        prevResourceRef.current = newValue
                        isResourceChangedByUserRef.current = true
                        form.setFieldValue('resource', newValue)
                      },
                    })
                  } else {
                    prevResourceRef.current = newValue
                    isResourceChangedByUserRef.current = true
                  }
                }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col xs={24} sm={22} md={20} lg={16} xl={12} xxl={10}>
            <CoreInput
              name="short_name"
              label={
                <span className="font-bold">
                  {t('product_combos.fields.assortmentNameAbbr')}
                </span>
              }
              layout="horizontal"
              rules={[
                {
                  max: 50,
                  message: '略称は50文字以内で入力してください',
                },
              ]}
            />
          </Col>
        </Row>
        <Row className="mb-4">
          <Col xs={24} sm={22} md={20} lg={16} xl={12} xxl={10}>
            <CoreInput
              name="barcode"
              label={
                <span className="font-bold">
                  {t('product_combos.fields.barcode')}
                </span>
              }
              layout="horizontal"
              rules={[
                {
                  pattern: /^[0-9]*$/,
                  message: t('validation.barcode.number_only'),
                },
              ]}
            />
          </Col>
        </Row>
        <Row className="mb-4">
          <Col xs={24} sm={22} md={20} lg={16} xl={12} xxl={10}>
            <Form.Item
              name="category"
              label={boldText(t('product_combos.fields.category'))}
              colon={false}
            >
              <ProductCategoryEditDropdown
                defaultValue={form.getFieldValue('category')}
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
              {t('product_combos.newRegistration')}
            </Button>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col xs={24} sm={22} md={20} lg={16} xl={12} xxl={10}>
            <CoreInput name="unit" hidden />
            <Form.Item
              name="unit_id"
              label={boldText(t('product_combos.fields.unit'))}
              colon={false}
              required={true}
              rules={[
                {
                  required: true,
                  message: '単位は必須です。',
                },
              ]}
            >
              <Select
                showSearch
                onSearch={handleSearchProductUnit}
                filterOption={false}
                notFoundContent={
                  isFetchingProductUnits ? <Spin size="small" /> : <Empty />
                }
                placeholder={t('product_combos.pleaseSelect')}
                options={isFetchingProductUnits ? [] : productUnitOptions}
                suffixIcon={<CaretDownOutlined />}
                onSelect={(_, option) => {
                  form.setFieldValue('unit', option.label)
                }}
              />
            </Form.Item>
          </Col>
          <Col>
            <Button
              color="primary"
              variant="outlined"
              size="small"
              onClick={() => onOpenProductUnitModal()}
              style={{
                margin: '4px 0 0 40px',
              }}
            >
              {t('products.newRegistration')}
            </Button>
          </Col>
        </Row>
        <Row className="mb-4 flex">
          <Col xs={24} sm={22} md={20} lg={16} xl={12} xxl={10}>
            <Form.Item
              label={boldText(t('products.fields.taxRate'))}
              required={true}
              name="tax_rate"
              rules={[
                {
                  required: true,
                  message: '消費税率は必須です。',
                },
              ]}
              initialValue={10}
            >
              <Select
                style={{ width: '80px' }}
                options={[
                  { label: '10%', value: 10 },
                  { label: '8%', value: 8 },
                  { label: '0%', value: 0 },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col xs={24} sm={22} md={20} lg={16} xl={12} xxl={10}>
            <CoreInput
              name="cost_price"
              label={t('product_combos.fields.costPrice')}
              layout="horizontal"
              type="number"
              rules={[
                {
                  validator: (_, value) => {
                    if (value === undefined || value === null) {
                      return Promise.resolve()
                    }

                    if (value < 0) {
                      return Promise.reject(
                        '原価は0以上の数字で入力してください',
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
            <Form.Item
              className="!w-full"
              name="selling_price"
              label={boldText(t('product_combos.fields.sellingPrice'))}
              colon={false}
              required={true}
              layout="horizontal"
              rules={[
                {
                  required: true,
                  message: '販売単価は必須です。',
                },
                {
                  validator: (_, value) => {
                    if (value === undefined || value === null) {
                      return Promise.resolve()
                    }

                    if (value < 0) {
                      return Promise.reject(
                        '原価は0以上の数字で入力してください',
                      )
                    }

                    if (value < form.getFieldValue('cost_price')) {
                      return Promise.reject(
                        '販売単価は原価以上で入力してください',
                      )
                    }

                    if (!Number.isInteger(value)) {
                      return Promise.reject('整数で入力してください')
                    }

                    return Promise.resolve()
                  },
                },
              ]}
            >
              <InputNumber controls={false} min={0} className="!w-full" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col xs={24} sm={22} md={20} lg={16} xl={12} xxl={10}>
            <CoreInput
              name="note"
              label={t('product_combos.fields.remarks')}
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
          <CodeIssueSettingEdit modalProps={modalFormProps} type="products" />
        </Modal>
        <Modal
          open={isOpenCategoryModal}
          onCancel={onCloseCategoryModal}
          cancelButtonProps={{ style: { display: 'none' } }}
          okButtonProps={{ style: { display: 'none' } }}
          width={'25vw'}
          title={t('product_combos.productCategoryEdit')}
          footer={null}
        >
          <ProductCategoryModal modalProps={modalFormCategory} />
        </Modal>
        <Modal
          open={isOpenProductUnitModal}
          onCancel={onCloseProductUnitModal}
          cancelButtonProps={{ style: { display: 'none' } }}
          okButtonProps={{ style: { display: 'none' } }}
          width={'25vw'}
          title={t('product_combos.newRegistration')}
          footer={null}
        >
          <ProductUnitModal
            modalProps={modalFormProductUnit}
            order={orderNumberProductUnits}
          />
        </Modal>
      </div>
      <div className="col-span-1">
        <Row>
          <Form.Item name={'image_name'} hidden />
          <Form.Item name={'image_file_key'} hidden />
          <Form.Item name="image">
            <UploadImage
              name="image"
              initialUrl={form.getFieldValue('image_file_url') as string}
            />
          </Form.Item>
        </Row>
      </div>
    </div>
  )
}

export default BasicInfo
