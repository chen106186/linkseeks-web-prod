import { createFormActions, FormEffectHooks, createEffectHook } from '@apps/formily'
const { onFormInit$ } = FormEffectHooks
const customEvent$ = createEffectHook('requestAsyncDataSource')

const useAsyncDataSource = (name: string, service: any) => {
  const { dispatch, setFieldState } = createFormActions()
  onFormInit$().subscribe(() => {
    // 这里需要调用一下loading
    service().then((res) => {
      //请求结束可以dispatch一个自定义事件收尾，方便后续针对该事件做联动
      setFieldState(name, (state) => {
        // @ts-ignore
        state.props['x-component-props']['dataSource'] = res
      })

      //@ts-ignore
      dispatch('requestAsyncDataSource', {
        name,
        payload: res,
      })
    })
  })
  customEvent$().subscribe(() => {
    console.log('requestAsyncDataSource')
  })
}

export { useAsyncDataSource }
