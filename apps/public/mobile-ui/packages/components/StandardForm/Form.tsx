import React, { useMemo, useRef } from 'react'
import { View } from '@apps/mobile-ui'
import FieldContext from './FieldContext'
import { FormInstance, useForm } from './FormStore'
import type { Store, Callbacks, ValidateRule } from './typings'

type BaseFormProps = Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'>
// TODO v1 children为函数的情况
// type RenderFn = (values: Store) => JSX.Element | React.ReactNode;

export interface FormProps<Values = any> extends BaseFormProps {
  form?: FormInstance
  initialValues?: Store
  children?: React.ReactNode
  onFinish?: Callbacks<Values>['onFinish']
  onValuesChange?: Callbacks<Values>['onValuesChange']
  rules?: Record<string, ValidateRule>
}

const Form: React.ForwardRefRenderFunction<FormInstance, FormProps> = (
  { form, initialValues, children, onValuesChange, onFinish, onReset, rules, style },
  ref,
) => {
  // TODO 未处理children为function的情况
  // const [, forceUpdate] = useState(null);
  const [formInstance] = useForm(form)

  React.useImperativeHandle(ref, () => formInstance)

  const { setCallbacks, setInitialValues, setRules } = formInstance.getInternalHooks()

  setCallbacks({
    onValuesChange,
    onFinish: (values: Store) => {
      if (onFinish) {
        onFinish(values)
      }
    },
  })

  const mountRef = useRef(false)
  setInitialValues(initialValues, !mountRef.current)
  setRules(rules)
  if (!mountRef.current) {
    mountRef.current = true
  }
  const fieldContextValue = useMemo(
    () => ({
      ...formInstance,
      rules,
    }),
    [formInstance, rules],
  )

  const wrapperNode = <FieldContext.Provider value={fieldContextValue}>{children}</FieldContext.Provider>

  return (
    <View className="form" style={style}>
      {wrapperNode}
    </View>
  )
}

export default Form
