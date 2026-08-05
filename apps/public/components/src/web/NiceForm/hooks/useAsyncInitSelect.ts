import { onFormInit, action } from '@apps/form'
/**
 * 异步获取数据源
 * @param pattern string | Array
 * @param service feat
 */
export const useAsyncInitSelect = (pattern: string[], service: () => Promise<any>) => {
  onFormInit((form) => {
    service().then(
      action?.bound!((data) => {
        pattern.forEach((v) => {
          form.setFieldState(v, (field) => {
            field.dataSource = data[v]
          })
        })
      }),
    )
  })
}
