import { ComponentSchemaType, PROPS_TYPES } from '@apps/design-core'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()

const a: ComponentSchemaType = {
  propsConfig: {
    target: {
      label: `${intl.formatMessage({ id: 'activePage.whereToOpenBook' })}`,
      type: PROPS_TYPES.enum,
      enumData: ['_blank', '_father', '_self', '_top', 'framename'],
    },
    href: {
      label: `${intl.formatMessage({ id: 'activityPage.linkToUrl' })}`,
      type: PROPS_TYPES.string,
    },
    className: {
      label: `${intl.formatMessage({ id: 'activePage.className' })}`,
      type: PROPS_TYPES.string,
    },
    onClick: {
      label: `${intl.formatMessage({ id: 'activePage.clickEvent' })}`,
      type: PROPS_TYPES.function,
      placeholder: '()=>{}',
    },
    children: {
      label: `${intl.formatMessage({ id: 'activePage.textValue' })}`,
      type: PROPS_TYPES.string,
    },
  },
}

const div: ComponentSchemaType = {
  propsConfig: {
    children: {
      label: `${intl.formatMessage({ id: 'activePage.textValue' })}`,
      type: PROPS_TYPES.string,
    },
  },
}

const img: ComponentSchemaType = {
  propsConfig: {
    alt: {
      label: `${intl.formatMessage({ id: 'activePage.imgToText' })}`,
      type: PROPS_TYPES.string,
    },
    src: {
      label: `${intl.formatMessage({ id: 'activePage.uploadImg' })}`,
      type: PROPS_TYPES.string,
    },
    height: {
      label: `${intl.formatMessage({ id: 'activePage.imgHeight' })}`,
      type: PROPS_TYPES.string,
    },
    width: {
      label: `${intl.formatMessage({ id: 'activePage.imgWidth' })}`,
      type: PROPS_TYPES.string,
    },
  },
}

const span: ComponentSchemaType = {
  propsConfig: {
    children: {
      label: `${intl.formatMessage({ id: 'activePage.textValue' })}`,
      type: PROPS_TYPES.string,
    },
  },
}

export default {
  div,
  span,
  img,
  a,
}
