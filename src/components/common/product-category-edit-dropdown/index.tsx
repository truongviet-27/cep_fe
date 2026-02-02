import { SearchOutlined } from '@ant-design/icons'
import type { Category } from '@utility/renderCategories'
import renderCategories from '@utility/renderCategories'
import { Empty, Select, Spin } from 'antd'
import { useTranslations } from 'next-intl'
import { memo, useState } from 'react'

import { useController } from './controller'

interface Props {
  placeholder?: string
  hidden?: boolean
  valueOnly?: boolean
  defaultValue?: string
  disabled?: boolean
  onSelect?: (
    level: number,
    currentPath: string[],
    currentCat: Category[],
    categoryId?: number,
  ) => void
}

const ProductCategoryEditDropdown: React.FC<Props> = (props) => {
  const t = useTranslations()
  const { placeholder, hidden, valueOnly, defaultValue, disabled, onSelect } =
    props
  const [
    { options, debounceFetcher, isLoading, categories },
    { setSearchText, setAllowFetchData },
  ] = useController()

  const initialValue = defaultValue || t('products.fields.default_category')
  const [value, setValue] = useState<string>(initialValue)
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const handleSelect = (
    level: number,
    currentPath: string[],
    currentCat: Category[],
    categoryId?: number,
  ) => {
    onSelect?.(level, currentPath, currentCat, categoryId)
    const displayValue = !categoryId
      ? t('products.fields.default_category')
      : currentPath.join(' > ')
    setValue(displayValue)
    setIsOpen(false)
  }

  if (hidden) return null
  if (valueOnly) return <>{value}</>

  return (
    <Select
      className="w-full"
      open={isOpen}
      onDropdownVisibleChange={setIsOpen}
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      showSearch
      filterOption={false}
      onSearch={(val) => {
        setSearchText?.(val)
        debounceFetcher?.(val)
      }}
      onFocus={setAllowFetchData}
      suffixIcon={<SearchOutlined />}
      dropdownRender={() => (
        <div>
          {isLoading ? (
            <div className="flex justify-center p-4">
              <Spin size="small" />
            </div>
          ) : categories?.data?.length || options?.length ? (
            <div className="my-2 max-h-[300px] overflow-y-auto px-2">
              {renderCategories(
                categories?.data || [],
                1,
                [],
                [],
                handleSelect,
              )}
            </div>
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </div>
      )}
    />
  )
}

export default memo(ProductCategoryEditDropdown)
