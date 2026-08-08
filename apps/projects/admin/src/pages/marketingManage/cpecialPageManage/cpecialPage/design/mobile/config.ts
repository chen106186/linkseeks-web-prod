import { PageConfigType } from '@apps/design-react'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()

export const layoutConfig: PageConfigType = {
  '0': {
    componentName: 'LocaleProvide',
    props: {
      style: {
        width: '100%',
        minHeight: '100vh',
        background: '#F7F8FA',
        overflowX: 'hidden',
        paddingBottom: '50px',
      },
    },
    childNodes: ['1'],
  },
  '1': {
    title: '状态栏',
    canDelete: false,
    canHide: true,
    componentName: 'StatusBar',
    canEdit: false,
    props: {},
  },
}
