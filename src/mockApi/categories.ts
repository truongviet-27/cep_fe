import type { ITree } from '@interfaces/tree'

const seed: ITree[] = [
  { id: 'all_items', name: 'すべての商品', public: true },
  {
    id: 'ct5',
    name: 'Category-2-1-1',
    public: true,
    children: [
      { id: 'ct5-1', name: 'Category-2-1-1-1', public: true },
      { id: 'ct5-2', name: 'Category-2-1-1-2', public: true },
    ],
  },
  {
    id: 'ct2',
    name: 'Category-1-1',
    public: true,
    children: [
      {
        id: 'ct2-1',
        name: 'Category-1-1-1',
        public: true,
        children: [
          { id: 'ct2-1-1', name: 'Category-1-1-1-1', public: true },
          { id: 'ct2-1-2', name: 'Category-1-1-1-2', public: true },
        ],
      },
      { id: 'ct2-2', name: 'Category-1-1-2', public: true },
    ],
  },
  {
    id: 'ct3',
    name: 'Category-1-2',
    public: true,
    children: [{ id: 'ct3-1', name: 'Category-1-2-1', public: true }],
  },
]

export async function fetchCategories(): Promise<ITree[]> {
  await new Promise((r) => setTimeout(r, 150))
  return JSON.parse(JSON.stringify(seed))
}
