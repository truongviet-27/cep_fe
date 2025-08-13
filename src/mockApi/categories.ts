import type { ITree } from '@interfaces/tree'

const seed: ITree[] = [
  {
    id: 'all_items',
    name: 'すべての商品',
    code: 'all_items',
    isPublic: true,
    open: true,
    children: [],
  },
  {
    id: 'ct5',
    name: 'Category-2-1-1',
    code: 'ct5',
    isPublic: true,
    open: true,
    children: [
      { id: 'ct5-1', name: 'Category-2-1-1-1', code: 'ct5-1', isPublic: true },
      { id: 'ct5-2', name: 'Category-2-1-1-2', code: 'ct5-2', isPublic: true },
    ],
  },
  {
    id: 'ct2',
    name: 'Category-1-1',
    code: 'ct2',
    isPublic: true,
    open: true,
    children: [
      { id: 'ct2-1', name: 'Category-1-1-1', code: 'ct2-1', isPublic: true },
      { id: 'ct2-2', name: 'Category-1-1-2', code: 'ct2-2', isPublic: true },
    ],
  },
  {
    id: 'ct3',
    name: 'Category-1-2',
    code: 'ct3',
    isPublic: true,
    children: [],
  },
  { id: 'new', name: 'New Category', isPublic: true },
]

export async function fetchCategories(): Promise<ITree[]> {
  await new Promise((r) => setTimeout(r, 150))
  return JSON.parse(JSON.stringify(seed))
}
