import { MenuUtil, RouteItem } from '../src/react/MenuUtil'

const menuModules = {
  '/src/pages/content/category/view.tsx': 'element',
  '/src/pages/home/view.tsx': 'element',
  '/src/pages/content/category/detail.tsx': 'element',
}

const testTreeData = [
  new RouteItem({
    key: '/content',
    url: '/content',
    parentUrl: '',
    children: [
      new RouteItem({
        key: '/content/category',
        url: '/content/category',
        parentUrl: '/content',
        children: [
          new RouteItem({
            key: '/content/category/view',
            url: '/content/category/view',
            element: 'element',
            parentUrl: '/content/category',
          }),
          new RouteItem({
            key: '/content/category/detail',
            url: '/content/category/detail',
            element: 'element',
            parentUrl: '/content/category',
          }),
        ],
      }),
    ],
  }),
  new RouteItem({ key: '/home', url: '/home', parentUrl: '', element: 'element' }),
]
describe('test MenuUtil', () => {
  it('hashMaps and menuData', () => {
    const menuUtil = new MenuUtil(menuModules)

    // console.log(testTreeData)
  })
})
