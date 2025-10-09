import { CaretDownOutlined, SearchOutlined } from '@ant-design/icons'
import type { Category } from '@utility/renderCategories'
import renderCategories from '@utility/renderCategories'
import { Dropdown, Empty, Select, Spin } from 'antd'
import Input from 'antd/es/input/Input'
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
  const [value, setValue] = useState<string>(defaultValue ?? '')
  const [isOpenSelect, setIsOpenSelect] = useState<boolean>(false)
  const [isOpenDropdown, setIsOpenDropdown] = useState<boolean>(false)
  const handleSelect = (
    level: number,
    currentPath: string[],
    currentCat: Category[],
    categoryId?: number,
  ) => {
    onSelect?.(level, currentPath, currentCat, categoryId)
    setValue(currentPath.join(' > '))
    setIsOpenSelect(false)
    setTimeout(() => {
      setIsOpenDropdown(false)
    })
  }

  return (
    <Dropdown
      trigger={['click']}
      placement="bottomRight"
      open={isOpenDropdown}
      disabled={disabled}
      onOpenChange={(visible) => {
        setTimeout(() => {
          setIsOpenDropdown(visible)
        })
      }}
      popupRender={() => (
        <div className={styles.popupRenderContainer}>
          <Select
            open={isOpenSelect}
            popupMatchSelectWidth
            labelInValue
            showSearch
            allowClear
            filterOption={false}
            onOpenChange={(visible) => setIsOpenSelect(visible)}
            onSearch={debounceFetcher}
            options={options}
            style={{ width: '100%' }}
            onChange={setSearchText}
            placeholder="検索..."
            suffixIcon={<SearchOutlined />}
            notFoundContent={isLoading ? <Spin size="small" /> : <Empty />}
            loading={isLoading}
            popupRender={() => {
              if (isLoading) return <Spin size="small" />

              if (!options?.length) return <Empty />

              return (
                <div className="my-2 max-h-[300px] overflow-y-auto px-2">
                  {renderCategories(
                    categories?.data || [],
                    1,
                    [],
                    [],
                    handleSelect,
                  )}
                </div>
              )
            }}
            onFocus={setAllowFetchData}
          />
        </div>
      )}
    >
      {valueOnly ? (
        value
      ) : (
        <Input
          hidden={hidden}
          value={value}
          placeholder={placeholder}
          readOnly
          suffix={
            <CaretDownOutlined
              style={{
                color: '#00000040',
                fontSize: '12px',
              }}
            />
          }
        />
      )}
    </Dropdown>
  )
}

export default memo(ProductCategoryDropdown)
