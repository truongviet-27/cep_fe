export type Category = {
  id: number
  order: number
  parent_id: number | null
  level: number
  name: string
  closed: boolean
  children: Category[]
}

const renderCategories = (
  categories: Category[],
  level = 1,
  parents: string[] = [],
  parentsCat: Category[] = [],
  handleChooseCategory?: (
    level: number,
    currentPath: string[],
    currentCat: Category[],
  ) => void,
) => {
  return (
    <>
      {categories.map((cat) => {
        const hasChildren = cat.children && cat.children.length > 0
        const currentPath = [...parents, cat.name]
        const currentCat = [...parentsCat, cat]

        return (
          <div
            key={cat.id}
            style={{
              padding: '4px 8px',
              paddingLeft: `${level * 8}px`,
              cursor: 'pointer',
              width: '100%',
            }}
            onClick={(e) => {
              e.stopPropagation()
              if (handleChooseCategory) {
                handleChooseCategory(level, currentPath, currentCat)
              }
            }}
          >
            {cat.name}
            {hasChildren &&
              renderCategories(
                cat.children,
                level + 1,
                currentPath,
                currentCat,
                handleChooseCategory,
              )}
          </div>
        )
      })}
    </>
  )
}

export default renderCategories
