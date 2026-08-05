import { createFormActions, FormPath } from '@apps/formily'

export const useLinkageUtils = () => {
  const { setFieldState } = createFormActions()
  const linkage = (key, defaultValue?) => (path, value?) =>
    setFieldState(path, (state) => {
      const componentProps = state.props['x-component-props'] || {}
      // 对象浅合并
      if (key === 'props.x-component-props') {
        value = Object.assign({}, componentProps, value)
      }
      FormPath.setIn(state, key, value !== undefined ? value : defaultValue)
    })
  return {
    hide: linkage('visible', false),
    show: linkage('visible', true),
    visible: linkage('visible'),
    enum: linkage('props.enum', []),
    loading: linkage('loading', true),
    loaded: linkage('loading', false),
    value: linkage('value'),
    componentProps: linkage('props.x-component-props', {}),
    display: linkage('display', true),
  }
}
