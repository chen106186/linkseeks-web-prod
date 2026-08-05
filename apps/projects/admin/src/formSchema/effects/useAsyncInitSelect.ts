import { createFormActions, FormEffectHooks, FormPath } from '@apps/formily'
import { useLinkageUtils } from '@/utils/formEffectUtils'
const { onFormInit$ } = FormEffectHooks

/**
 * @description 处理异步请求的下拉选择
 * @param name 待处理的表单路径
 * @param service 触发的异步函数， 需返回一个{label: any, value: any}形式的数组
 */
export const useAsyncInitSelect = (name: string[], service: () => Promise<any>) => {
  const { dispatch, setFieldState } = createFormActions()
  const linkage = useLinkageUtils()

  onFormInit$().subscribe(() => {
    const nameStr: string = name.toString()
    const formPath: string = `*(${nameStr})`

    setFieldState(formPath, (state) => {
      FormPath.setIn(state, 'props.x-props.hasFeedback', true)
    })

    linkage.loading(formPath)

    service()
      .then((res) => {
        name.forEach((v) => {
          linkage.enum(v, res[v] || [])
        })
        // 请求结束可以dispatch一个自定义事件收尾，方便后续针对该事件做联动
        dispatch?.('requestAsyncSelect', {
          name,
          payload: res,
        })
      })
      .finally(() => {
        linkage.loaded(formPath)
      })
  })
}
