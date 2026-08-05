const MAIN_COLOR = '#00A98F'
const SECONDARY_COLOR = '#E4F7EF'
const MAIN_FONT_BOLD_COLOR = '#303133'
const MAIN_FONT_TINY_COLOR = '#909399'

/**
 * 定制antd主题样式
 * https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less
 */
export default {
  'layout-header-background': '#38414A',
  '@secondary-color': SECONDARY_COLOR,
  'primary-color': MAIN_COLOR,

  // 公共padding变量
  '@padding-lg': '24px',
  '@padding-md': '16px',
  '@padding-sm': '12px',
  '@padding-xs': '8px',
  '@padding-xss': '4px',

  // 公共margin变量
  '@margin-lg': '24px',
  '@margin-md': '16px',
  '@margin-sm': '12px',
  '@margin-xs': '8px',
  '@margin-xss': '4px',

  // tabs
  'tabs-card-active-color': MAIN_FONT_BOLD_COLOR,
  'tabs-highlight-color': MAIN_FONT_BOLD_COLOR,
  'tabs-hover-color': MAIN_FONT_BOLD_COLOR,
  'tabs-active-color': MAIN_FONT_BOLD_COLOR,
  'tabs-card-head-background': '#fff',
  // 'link-color': MAIN_COLOR,
  // 'link-hover-color': MAIN_COLOR,
  // 'link-active-color': MAIN_COLOR,

  // Font-size
  '@font-size-base': '12px',
  '@font-size-lg': '14px',
  '@font-size-sm': '12px',

  // Layout
  '@layout-header-height': '48px',
  '@border-radius-base': '4px',
  // '@component-background': '#ffffff',
  '@btn-default-bg': '#f4f6f8',

  // PageHeader
  // '@page-header-padding': '8px 24px',     // 这里替换会出现前边拼接了 '6px 8px 24px'这样，所以直接改成修改样式好了
}
