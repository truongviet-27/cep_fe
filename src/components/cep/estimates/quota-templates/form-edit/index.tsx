import { RightOutlined } from '@ant-design/icons'
import PageContainer from '@components/common/page-container'
import ShowMoreInfo from '@components/common/show-more-info'
import { useGo, useTranslate } from '@refinedev/core'
import { QuotaCategoryEnum } from '@sdk/hey-api'
import boldText from '@utility/bold-text'
import { PRIMARY } from '@utility/color'
import {
  Alert,
  Breadcrumb,
  Button,
  Divider,
  Flex,
  Form,
  Space,
  Spin,
} from 'antd'
import Link from 'next/link'
import { type FC, useCallback, useEffect, useRef, useState } from 'react'

import type {
  TemplatePriceChange,
  TemplatePriceChangeParent,
} from '../utils/price-changes'
import {
  computeTemplatePriceChanges,
  removeTemplatePriceChange,
} from '../utils/price-changes'
import BasicInfo from './basic-info'
import { useController } from './controller'
import DetailInfo from './detail-info'
import NoteForm from './note'
import OptionalInfo from './optional-info'
import TagForm from './tag'

const QuoteTemplateFormEditContainer: FC = () => {
  const t = useTranslate()
  const go = useGo()

  const isCategoryChangedByUserRef = useRef(false)
  const [confirmedCategory, setConfirmedCategory] = useState<QuotaCategoryEnum>(
    QuotaCategoryEnum.MERCHANDISE,
  )

  const {
    isUpdateMode,
    isLoading,
    methods,
    handleSaveDraft,
    handleApplyDraft,
    isPendingDraft,
    isSavingDraft,
    isApplyingDraft,
    isDraftAppliedOnce,
    isRedirectingAfterDraftSave,
    dataQuotaTemplateDraft,
    isFetchingQuotaTemplateDraft,
  } = useController()

  const { form, query } = methods

  const [priceChanges, setPriceChanges] = useState<TemplatePriceChange[]>([])
  const [isPriceAlertVisible, setIsPriceAlertVisible] = useState(false)
  const priceCheckDoneRef = useRef(false)

  useEffect(() => {
    if (priceCheckDoneRef.current) return
    const detail = query?.data?.data as
      | { main_product?: unknown[]; optional_product?: unknown[] }
      | undefined
    if (!detail) return
    priceCheckDoneRef.current = true
    const changes = computeTemplatePriceChanges(
      detail.main_product,
      detail.optional_product,
    )
    setPriceChanges(changes)
    setIsPriceAlertVisible(changes.length > 0)
  }, [query?.data?.data])

  const handleReflectPrices = useCallback(() => {
    priceChanges.forEach((change) => {
      const list: Array<{ product_id?: number | null }> =
        form.getFieldValue(change.parent) ?? []
      const index = list.findIndex(
        (item) => item?.product_id === change.productId,
      )
      if (index !== -1) {
        form.setFieldValue(
          [change.parent, index, 'selling_price'],
          change.newPrice,
        )
      }
    })
    setIsPriceAlertVisible(false)
    setPriceChanges([])
  }, [priceChanges, form])

  const handleDismissPriceAlert = useCallback(() => {
    setIsPriceAlertVisible(false)
  }, [])

  const handleProductChanged = useCallback(
    (parent: TemplatePriceChangeParent, oldProductId: number | null) => {
      setPriceChanges((prev) =>
        removeTemplatePriceChange(prev, parent, oldProductId),
      )
    },
    [],
  )

  return (
    <PageContainer
      breadcrumbs={
        <Breadcrumb
          items={[
            {
              title: (
                <Link href="/quota-templates">
                  {boldText(t('quota_templates.breadcrumb.parent'))}
                </Link>
              ),
            },
            {
              title: boldText(
                isUpdateMode
                  ? t('quota_templates.form.titleUpdate')
                  : t('quota_templates.form.titleRegister'),
                PRIMARY,
              ),
            },
          ]}
          separator={<RightOutlined />}
        />
      }
      title={
        isUpdateMode
          ? t('quota_templates.form.titleUpdate')
          : t('quota_templates.form.titleRegister')
      }
    >
      {isPriceAlertVisible && (
        <Alert
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
          message="商品の売単価が変更されました。"
          action={
            <Space>
              <Button size="small" type="primary" onClick={handleReflectPrices}>
                反映する
              </Button>
              <Button size="small" onClick={handleDismissPriceAlert}>
                反映しない
              </Button>
            </Space>
          }
        />
      )}
      <Spin spinning={isLoading}>
        <Form
          {...methods.formProps}
          labelCol={{ xs: 24, sm: 8, md: 8, xl: 6, xxl: 5 }}
          labelAlign="left"
          autoComplete="off"
          name="basic"
          layout="horizontal"
          scrollToFirstError={{
            behavior: 'smooth',
            block: 'center',
          }}
        >
          <BasicInfo isCategoryChangedByUserRef={isCategoryChangedByUserRef} />
          <DetailInfo
            isCategoryChangedByUserRef={isCategoryChangedByUserRef}
            confirmedCategory={confirmedCategory}
            onCategoryConfirmed={setConfirmedCategory}
            priceChanges={priceChanges}
            onProductChanged={handleProductChanged}
          />
          <OptionalInfo
            confirmedCategory={confirmedCategory}
            priceChanges={priceChanges}
            onProductChanged={handleProductChanged}
          />
          <NoteForm />
          <TagForm />
          <Divider />
          {isUpdateMode && (
            <ShowMoreInfo
              descriptions={[
                {
                  title: t('approve_routes.show.creator'),
                  value: '---',
                },
                {
                  title: t('approve_routes.show.updater'),
                  value: '---',
                },
              ]}
            />
          )}

          <Flex
            justify="space-between"
            style={{
              marginTop: 40,
            }}
          >
            <Space>
              <> </>
            </Space>
            <Space className="items-end">
              <Button
                type="default"
                onClick={() => {
                  go({
                    to: '/quota-templates',
                  })
                }}
                autoInsertSpace={false}
              >
                {t('buttons.back')}
              </Button>
              {!isUpdateMode &&
                dataQuotaTemplateDraft?.data &&
                Array.isArray(dataQuotaTemplateDraft.data) &&
                dataQuotaTemplateDraft.data.length > 0 && (
                  <Button
                    color="primary"
                    variant="outlined"
                    onClick={handleApplyDraft}
                    disabled={
                      isFetchingQuotaTemplateDraft ||
                      isSavingDraft ||
                      isApplyingDraft ||
                      isDraftAppliedOnce ||
                      isRedirectingAfterDraftSave
                    }
                    loading={isApplyingDraft && !isDraftAppliedOnce}
                  >
                    {t('buttons.apply_draft')}
                  </Button>
                )}
              {!isUpdateMode && (
                <Button
                  type="primary"
                  onClick={handleSaveDraft}
                  loading={isPendingDraft || isSavingDraft}
                  disabled={
                    isSavingDraft ||
                    isApplyingDraft ||
                    isRedirectingAfterDraftSave
                  }
                  autoInsertSpace={false}
                >
                  {t('buttons.draft')}
                </Button>
              )}
              <Button
                {...methods.saveButtonProps}
                type="primary"
                autoInsertSpace={false}
              >
                {isUpdateMode ? t('buttons.save') : t('buttons.create')}
              </Button>
            </Space>
          </Flex>
        </Form>
      </Spin>
    </PageContainer>
  )
}

export default QuoteTemplateFormEditContainer
