import * as LxUI from '@apps/design-ui'
import type { ConfigType } from '@apps/design-react'
import schema from './schema'
import HTML from './html'
import CustomLayouts from '../../components/Layouts'
import webScheam from './webSchema'
/** web 组件 */
import WebLayout from '../../components/WebDesignPanel/components/WebLayout'

/** 组件注册 */
const originalComponents = { ...LxUI, ...CustomLayouts, WebLayout }
/** 组件schema 注册, 所有组件在 components/Layouts 下 */
const componentSchemasMap = { ...schema, ...HTML, ...webScheam }

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
