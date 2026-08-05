import { createFormActions, FormEffectHooks, FormPath } from '@apps/formily'
import { useLinkageUtils } from '@/utils/formEffectUtils'
const { onFormMount$ } = FormEffectHooks

/**
 * @description 处理异步请求的下拉选择
 * @param name 待处理的表单路径
 * @param service 触发的异步函数， 需返回一个{label: any, value: any}形式的数组
 */
export const useAsyncSelect = async (name, service: () => Promise<any[]>, format?: [string, string]) => {
  return new Promise((resolve, reject) => {
    const { dispatch, setFieldState } = createFormActions()

    const linkage = useLinkageUtils()
    onFormMount$().subscribe(() => {
      setFieldState(name, (state) => {
        FormPath.setIn(state, 'props.x-props.hasFeedback', true)
      })
      linkage.loading(name)
      service()
        .then((res) => {
          let enums = []
          if (format) {
            const [labelString, valueString] = format
            enums = res.map((v) => ({
              ...v,
              label: v[labelString],
              value: v[valueString],
            }))
          } else {
            enums = res
          }
          setFieldState(name, (state) => {
            state.originAsyncData = res
          })
          linkage.loaded(name)

          linkage.enum(name, enums)
          //请求结束可以dispatch一个自定义事件收尾，方便后续针对该事件做联动
          dispatch('requestAsyncSelect', {
            name,
            payload: res,
          })
          resolve(res)
        })
        .catch(() => {
          linkage.loaded(name)
          linkage.enum(name, [])
          reject([])
        })
    })
  })
}
