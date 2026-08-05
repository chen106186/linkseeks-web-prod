import * as LxUI from '@apps/design-ui'
import { ConfigType } from '@apps/design-react'
import MallLayout from './LingXiUI/MallLayout'
import * as HTML from './HTML'
import schema from './layoutSchema'
import CustomLayouts from '../../components'

// import CustomLayouts from '../../components/Layouts';
// import MobileQuickNav from '@/pages/pageCustomized/configs/componentConfigs/LingXiUI/MobileQuickNav';

const componentSchemasMap = { MallLayout, ...schema, ...HTML }
const originalComponents = { ...LxUI, ...CustomLayouts }

// /**
//  * 容器组件分类
//  */
// export const CONTAINER_CATEGORY = { ...reactContainers, ...htmlContainers };
// /**
//  * 非容器组件分类
//  * @type {{Input, InputNumber, Slider, Checkbox, Rate, Radio, Icon, Typography}}
//  */
// export const NON_CONTAINER_CATEGORY = { ...reactNonContainers, ...htmlNonContainers };

/**
 * 设计面板iframe 模板，如果集成到项目中，需要将拖拽组件所依赖的样式在模板中设置，
 * 否则设计面板渲染的页面将是无样式的效果
 */
const config: ConfigType = {
  componentsMap: originalComponents,
  componentSchemasMap: componentSchemasMap as any,
}

export default config
