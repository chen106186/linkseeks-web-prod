import { CategoryType } from '@apps/design-core'

export const reactContainers: CategoryType = {
  Customer: {
    components: {
      MallLayout: null,
      Header: {
        props: [
          {
            style: {},
          },
        ],
      },
      Navigation: {
        props: [
          {
            style: {},
          },
        ],
      },
    },
  },
  FloorLine: {
    components: {
      FloorLine: {
        props: [
          {
            style: {
              height: 100,
            },
          },
        ],
      },
      'FloorLine.Brand': {
        props: [
          {
            style: {
              height: 100,
            },
          },
        ],
      },
      'FloorLine.Goods': null,
      'FloorLine.Shops': null,
      'FloorLine.Category': null,
      'FloorLine.FloorHeader': null,
      'FloorLine.Banner': null,
      'FloorLine.Vertical': null,
      'FloorLine.Horizontal': null,
    },
  },
  ShopFloorLine: {
    components: {
      ShopFloorLine: {
        props: [
          {
            style: {
              height: 100,
            },
          },
        ],
      },
      'ShopFloorLine.Category': null,
      'ShopFloorLine.Goods': null,
    },
  },
  ShowCase: {
    components: {
      ShowCase: {
        props: [
          {
            style: {
              height: 100,
            },
          },
        ],
      },
      'ShowCase.Brand': {
        props: [
          {
            style: {
              height: 100,
            },
          },
        ],
      },
      'ShowCase.Goods': {
        props: [
          {
            style: {
              height: 100,
            },
          },
        ],
      },
      'ShowCase.Shop': {
        props: [
          {
            style: {
              height: 100,
            },
          },
        ],
      },
    },
  },
}

export const reactNonContainers: CategoryType = {
  Customer: {
    components: {
      TopBar: null,
      MainNav: null,
      Advert: null,
      QuickNav: null,
      FindMore: null,
      Information: null,
      Footer: null,
    },
  },
}
