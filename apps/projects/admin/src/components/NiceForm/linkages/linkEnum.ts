import { useValueLinkageEffect, FormPath, FormEffectHooks } from '@apps/formily'

/**
 * 联动逻辑, 主要用于处理省市区等联动, 必须手动设置 originData
 * @param childKey 子集菜单key
 * @param [transformFn] 用于是否转化label和value的字段,可不传
 * @author xjm
 * @example `
  <NiceForm
    onSubmit={values => console.log(values)}
    actions = {actions}
    effects={($, {setFieldState}) => {
      onFormMount$().subscribe(() => {
        mockData().then((data:any) => {
          setFieldState('a', state => {
            state.originData = data
            state.props.enum = data.map(v => ({
              label: v.name,
              value: v.id
            }))
          })
        })
      })

      useLinkEnumEffect(data => data.map(v => ({
        label: v.name,
        value: v.id
      })), 'children')
    }}
    schema={{
      type: 'object',
      properties: {
        a: {
          type: 'string',
          enum: [],
          "x-linkages": [
            {
              type: 'value:linkage',
              condition: "{{!!$value}}",
              origin: 'a',
              target: 'b',
            }
          ]
        },
        b: {
          type: 'string',
          enum: [],
          "x-linkages": [
            {
              type: 'value:linkage',
              condition: "{{!!$value}}",
              origin: 'b',
              target: 'c'
            }
          ]
        },
        c: {
          type: 'string',
          enum: []
        }
      }
    }}
    />
 *
 * `
 */
export const useLinkEnumEffect = (childKey, transformFn?) => {
  const { onFieldValueChange$ } = FormEffectHooks
  useValueLinkageEffect({
    type: 'value:linkage',
    resolve: ({ origin, target }, { setFieldState, getFieldState }) => {
      getFieldState(origin, (state) => {
        console.log('origin', origin, 'state', state)
        const { originData = [] } = state
        setFieldState(target, (targetState) => {
          if (state.value === undefined) {
          } else {
            if (originData.length > 0) {
              const result = originData.find((v) => v.id === state.value)[childKey] || []
              if (state.modified) {
                targetState.value = undefined
              }
              targetState.originData = result
              targetState.props.enum = transformFn ? transformFn(result) : result
            }
          }
        })
      })
    },
    reject: ({ target }, { setFieldState, getFieldState }) => {
      setFieldState(target, (targetState) => {
        targetState.value = undefined
        targetState.props.enum = []
      })
    },
  })
}
