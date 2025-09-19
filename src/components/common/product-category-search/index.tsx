import { CaretDownOutlined, SearchOutlined } from '@ant-design/icons'
import { WHITE } from '@utility/color'
import type { Category } from '@utility/renderCategories'
import renderCategories from '@utility/renderCategories'
import { AutoComplete, Dropdown } from 'antd'

import CoreInput from '../core-input'
import { useProductCategorySearchController } from './controller'

interface Props {
  isView?: boolean
  name?: string
  required?: boolean
  layout?: 'horizontal' | 'vertical'
  label?: string
  placeholder?: string
  onSelect?: (
    level: number,
    currentPath: string[],
    currentCat: Category[],
    categoryId?: number,
  ) => void
}

const ProductCategorySearch: React.FC<Props> = (props) => {
  const {
    isView,
    name,
    required,
    layout = 'horizontal',
    label,
    placeholder,
    onSelect,
  } = props
  const [{ categories }, { setSearchText }] =
    useProductCategorySearchController()

  return (
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
          <AutoComplete
            options={categories?.data.map((item) => ({
              value: item.name,
              label: item.name,
            }))}
            style={{ width: '100%' }}
            onChange={setSearchText}
            placeholder="検索..."
            suffixIcon={<SearchOutlined />}
            popupRender={() => {
              return (
                <div className="my-2 max-h-[300px] overflow-y-auto px-2">
                  {renderCategories(
                    categories?.data || [],
                    1,
                    [],
                    [],
                    onSelect,
                  )}
                </div>
              )
            }}
          />
        </div>
      )}
    >
      <CoreInput
        name={name}
        readOnly={true}
        placeholder={placeholder}
        isView={isView}
        icon={
          <CaretDownOutlined
            style={{
              color: '#00000040',
              fontSize: '12px',
            }}
          />
        }
        layout={layout}
        required={required}
        label={label}
      />
    </Dropdown>
  )
}

export default ProductCategorySearch
