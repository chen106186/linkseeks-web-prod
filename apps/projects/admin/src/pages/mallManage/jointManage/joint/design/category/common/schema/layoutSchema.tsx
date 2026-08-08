import { ComponentSchemaType, PROPS_SETTING_TYPES, PROPS_TYPES } from '@apps/design-core'

const HeaderNav: { [key: string]: ComponentSchemaType } = {
  HeaderNav: {
    propsConfig: {
      children: {
        label: '内容',
        type: PROPS_TYPES.string,
      },
    },
  },
  'HeaderNav.ActionItem': {
    propsConfig: {
      children: {
        label: '内容',
        type: PROPS_TYPES.string,
      },
    },
  },
}

const CustomizeTabs: { [key: string]: ComponentSchemaType } = {
  CustomizeTabs: {
    propsConfig: {
      children: {
        label: '内容',
        type: PROPS_TYPES.string,
      },
    },
  },
  'CustomizeTabs.TabItem': {
    propsConfig: {
      children: {
        label: '内容',
        type: PROPS_TYPES.string,
      },
    },
  },
}

const SecondaryNavigation: { [key: string]: ComponentSchemaType } = {
  SecondaryNavigation: {
    propsConfig: {
      children: {
        label: '内容',
        type: PROPS_TYPES.string,
      },
    },
  },
  'SecondaryNavigation.Item': {
    propsConfig: {
      children: {
        label: '内容',
        type: PROPS_TYPES.string,
      },
    },
  },
}

const CustomizeCard: ComponentSchemaType = {
  propsConfig: {
    children: {
      label: '内容',
      type: PROPS_TYPES.string,
    },
  },
}

const Container: ComponentSchemaType = {
  propsConfig: {
    children: {
      label: '内容',
      type: PROPS_TYPES.string,
    },
  },
}

const SimpleCommodity: { [key: string]: ComponentSchemaType } = {
  SimpleCommodityList: {
    propsConfig: {
      children: {
        label: '内容',
        type: PROPS_TYPES.string,
      },
    },
  },
  'SimpleCommodityList.Item': {
    propsConfig: {
      children: {
        label: '内容',
        type: PROPS_TYPES.string,
      },
    },
  },
}

const CategoryList: { [key: string]: ComponentSchemaType } = {
  CategoryList: {
    propsConfig: {
      children: {
        label: '内容',
        type: PROPS_TYPES.string,
      },
    },
  },
  'CategoryList.Item': {
    propsConfig: {
      children: {
        label: '内容',
        type: PROPS_TYPES.string,
      },
    },
  },
}

const Product: ComponentSchemaType = {
  propsConfig: {
    children: {
      label: '内容',
      type: PROPS_TYPES.string,
    },
  },
}

const ProductContainer: ComponentSchemaType = {
  propsConfig: {},
}

export default {
  ...HeaderNav,
  ...SecondaryNavigation,
  ...SimpleCommodity,
  ...CustomizeTabs,
  CustomizeCard,
  Container,
  ...CategoryList,
  Product,
  ProductContainer,
}
