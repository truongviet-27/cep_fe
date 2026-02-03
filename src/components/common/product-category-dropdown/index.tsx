import { SearchOutlined } from '@ant-design/icons'
import type { Category } from '@utility/renderCategories'
import renderCategories from '@utility/renderCategories'
import { Empty, Select, Spin } from 'antd'
import { memo, useState } from 'react'

import { useController } from './controller'
import styles from './index.module.css'

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

const ProductCategoryDropdown: React.FC<Props> = (props) => {
  const { placeholder, hidden, valueOnly, defaultValue, disabled, onSelect } =
    props
  const [
    { options, debounceFetcher, isLoading, categories },
    { setSearchText, setAllowFetchData },
  ] = useController()

  const [value, setValue] = useState<string | undefined>(defaultValue)
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const handleSelect = (
    level: number,
    currentPath: string[],
    currentCat: Category[],
    categoryId?: number,
  ) => {
    const fullPath = currentPath.join(' > ')
    onSelect?.(level, currentPath, currentCat, categoryId)
    setValue(fullPath)
    setIsOpen(false) // Đóng menu sau khi chọn xong
  }

  if (hidden) return null
  if (valueOnly) return <>{value}</>

  return (
    <Select
      className={styles.widthFull} // Đảm bảo width: 100%
      open={isOpen}
      onDropdownVisibleChange={setIsOpen}
      value={value}
      placeholder={placeholder || 'カテゴリーを選択'}
      disabled={disabled}
      showSearch
      allowClear
      onClear={() => {
        setValue(undefined)
        onSelect?.(0, [], [], undefined)
      }}
      filterOption={false}
      onSearch={(val) => {
        setSearchText?.(val)
        debounceFetcher?.(val)
      }}
      onFocus={setAllowFetchData}
      suffixIcon={<SearchOutlined />}
      dropdownRender={() => (
        <div style={{ padding: '8px' }}>
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <Spin size="small" />
            </div>
          ) : categories?.data?.length || options?.length ? (
            <div className="max-h-[300px] overflow-y-auto">
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

export default memo(ProductCategoryDropdown)
