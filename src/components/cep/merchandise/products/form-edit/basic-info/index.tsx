import { CaretDownOutlined, EditFilled } from '@ant-design/icons'
import CoreInput from '@components/common/core-input'
import ProductCategoryDropdown from '@components/common/product-category-dropdown'
import { useTranslate } from '@refinedev/core'
import boldText from '@utility/bold-text'
import { Button, Col, Form, Modal, Row, Select, Spin, Typography } from 'antd'
import { Empty, type FormInstance } from 'antd/lib'
import { type MutableRefObject, useMemo } from 'react'

import { CategoryModal } from '../modal/code-issue'
import { ProductCategoryModal } from '../modal/product-category'
import type { ProductFormType } from '../use-product-form'
import { useBasicInfoController } from './controller'

interface BasicInfoProps {
  form: FormInstance<ProductFormType>
  addRef: MutableRefObject<
    ((defaultValue?: object, insertIndex?: number) => void) | undefined
  >
}

const BasicInfo: React.FC<BasicInfoProps> = (props) => {
  const { form, addRef } = props
  const t = useTranslate()
  const [
    {
      isAppend,
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
      setIsAppend,
    },
  ] = useBasicInfoController(form, addRef)

  const { show, close, open } = modalFormProps
  const {
    show: onOpenCategoryModal,
    close: onCloseCategoryModal,
    open: isOpenCategoryModal,
  } = modalFormCategory

  const allowShowForm = useMemo(() => {
    return isAppend
  }, [isAppend])

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
                message: t('validation.required'),
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
                message: t('validation.required'),
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
                message: t('validation.required'),
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
                message: t('validation.required'),
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
                message: t('validation.required'),
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
                message: t('validation.required'),
              },
            ]}
            style={{
              width: '100%',
            }}
          />
        </Col>
        <Col>
          <div className="mt-1 ml-10">
            {isAppend ? (
              <EditFilled
                onClick={() => {
                  setIsAppend(false)
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
        width={'70vw'}
      >
        <CategoryModal modalProps={modalFormProps} />
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
