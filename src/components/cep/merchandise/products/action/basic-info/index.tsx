import {
  CaretDownOutlined,
  EditFilled,
  SearchOutlined,
} from '@ant-design/icons'
import CoreInput from '@components/organism/CoreInput'
import { useTranslate } from '@refinedev/core'
import { WHITE } from '@utility/color'
import renderCategories from '@utility/renderCategories'
import {
  AutoComplete,
  Button,
  Col,
  Dropdown,
  Form,
  Modal,
  Row,
  Select,
  Spin,
  Typography,
} from 'antd'
import { Empty, type FormInstance } from 'antd/lib'
import { type MutableRefObject, useMemo } from 'react'

import { CategoryModal } from '../modal/code-issue'
import { ProductCategoryModal } from '../modal/product-category'
import type { ProductFormType } from '../use-product-detail'
import { useBasicInfoController } from './controller'

interface BasicInfoProps {
  isView: boolean
  form: FormInstance<ProductFormType>
  addRef: MutableRefObject<
    ((defaultValue?: object, insertIndex?: number) => void) | undefined
  >
}

const BasicInfo: React.FC<BasicInfoProps> = (props) => {
  const { isView, form, addRef } = props
  const t = useTranslate()
  const [
    {
      isAppend,
      loadingPd,
      modalFormProps,
      modalFormCategory,
      codeIssueSetting,
      dataProductCategories,
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
    return isView || isAppend
  }, [isView, isAppend])

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
                message: 'This field is required',
              },
            ]}
          />
        </Col>
        {!isView && (
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
                >
                  自動採番
                </Button>

                <Button
                  color="primary"
                  variant="link"
                  size="small"
                  onClick={() => {
                    show(codeIssueSetting?.data.id)
                  }}
                >
                  コード採番設定はこちら
                </Button>
              </div>
            </div>
          </Col>
        )}
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
                message: 'This field is required',
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
          <Dropdown
            trigger={['click']}
            placement="bottomRight"
            popupRender={() => (
              <div
                style={{
                  width: '80%',
                  height: '100%',
                  padding: 10,
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  background: WHITE,
                }}
              >
                <Form.Item name={'name_lk'}>
                  <AutoComplete
                    options={dataProductCategories?.data.map((item) => ({
                      value: item.name,
                      label: item.name,
                    }))}
                    placeholder="検索..."
                    suffixIcon={<SearchOutlined />}
                    popupRender={() => {
                      return (
                        <div className="my-2 max-h-[300px] overflow-y-auto px-2">
                          {renderCategories(
                            dataProductCategories?.data || [],
                            1,
                            [],
                            [],
                            handleChooseCategory,
                          )}
                        </div>
                      )
                    }}
                  />
                </Form.Item>
              </div>
            )}
          >
            <CoreInput
              name={'category'}
              readOnly={true}
              placeholder="選択してください"
              isView={allowShowForm}
              layout="horizontal"
              icon={
                <CaretDownOutlined
                  style={{
                    color: '#00000040',
                    fontSize: '12px',
                  }}
                />
              }
              required
              label={t('products.fields.category')}
              rules={[
                {
                  required: true,
                  message: 'This field is required',
                },
              ]}
            />
          </Dropdown>
        </Col>
        {!isView && (
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
              新規登録
            </Button>
          </Col>
        )}
      </Row>
      <Row className="mb-4">
        <Col xs={24} sm={22} md={20} lg={16} xl={12} xxl={10}>
          <CoreInput name="unit" hidden />
          <Form.Item
            name="unit_id"
            label={
              <span className="text-left font-bold">
                {t('products.fields.unit')}
              </span>
            }
            colon={false}
            required={true}
            rules={[
              {
                required: true,
                message: 'This field is required',
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
                placeholder="選択してください"
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
                message: 'This field is required',
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
                message: 'This field is required',
              },
            ]}
            style={{
              width: '100%',
            }}
          />
        </Col>
        {!isView && (
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
        )}
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
        title={t('商品カテゴリ編集')}
        footer={null}
      >
        <ProductCategoryModal modalProps={modalFormCategory} />
      </Modal>
    </div>
  )
}

export default BasicInfo
