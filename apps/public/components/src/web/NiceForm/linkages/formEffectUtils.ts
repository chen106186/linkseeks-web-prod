/**
 * @ Author: Liangzhu
 * @ Create Time: 2023-06-09 10:11:49
 * @ Modified by: Your name
 * @ Modified time: 2023-06-09 15:30:35
 * @ Description: 修改Field的属性
 * @ Example: linkage.dataSource(field, value)
 * @ Example: linkage.loading(field)
 * @ Example: linkage.loaded(field)
 */

import { FormPath, Field } from '@apps/form'

/**
 * @description 用于修改Field的属性
 * @returns hide 隐藏
 * @returns show 显示，
 * @returns visible 设置显示隐藏，
 * @returns enum 设置下拉数据源，
 * @returns dataSource 设置下拉数据源，
 * @returns loading 设置加载状态，
 * @returns loaded 设置加载状态，
 * @returns value 设置值，
 * @returns componentProps 设置组件属性，
 * @returns display 设置显示隐藏，
 */
export const useLinkageUtils = () => {
  const linkage = (key: string, defaultValue?: any) => (path: Field, value?: any) => {
    // 对象浅合并
    if (key === 'props.x-component-props') {
      value = Object.assign({}, path.props || {}, value)
    }
    return FormPath.setIn(path, key, value ? value : defaultValue)
  }
  return {
    hide: linkage('visible', false),
    show: linkage('visible', true),
    visible: linkage('visible'),
    enum: linkage('dataSource', []),
    dataSource: linkage('dataSource', []),
    loading: linkage('loading', true),
    loaded: linkage('loading', false),
    value: linkage('value'),
    componentProps: linkage('props.x-component-props', {}),
    display: linkage('display', 'visible'),
  }
}
