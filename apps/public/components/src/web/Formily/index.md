---
group:
  title: 重型组件
---

# formily1.0

### 核心 Schema 协议

主要用于描述数据结构

```json 结构
{
  "type": "object",
  "properties": {
    "key": {
      "type": "string"
    },
    "key1": {
      "type": "object",
      "properties": {
        "key2": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "key3": {
                "type": "string"
              }
            }
          }
        }
      }
    }
  }
}
```

### json Schema 使用方式

```tsx
import { SchemaForm, SchemaMarkupField as Field, FormButtonGroup, Submit, Reset } from '@apps/formily'

import { Input } from 'antd'

export default () => {
  return (
    <SchemaForm
      components={{ Input }}
      schema={{
        type: 'object',
        properties: {
          name: {
            type: 'string',
            title: 'Name',
            'x-component': 'Input',
          },
        },
      }}
      onSubmit={(values) => {
        console.log(values)
      }}
    >
      <Field type="string" name="name" title="Name" x-component="Input" />
      <FormButtonGroup>
        <Submit>查询</Submit>
        <Reset>重置</Reset>
      </FormButtonGroup>
    </SchemaForm>
  )
}
```

### JSX Schema 使用方式

```tsx
import { SchemaForm, SchemaMarkupField as Field, FormButtonGroup, Submit, Reset } from '@apps/formily'

import { Input } from 'antd'

export default () => {
  return (
    <SchemaForm
      components={{ Input }}
      onSubmit={(values) => {
        console.log(values)
      }}
    >
      <Field type="string" name="name" title="Name" x-component="Input" />
      <FormButtonGroup>
        <Submit>查询</Submit>
        <Reset>重置</Reset>
      </FormButtonGroup>
    </SchemaForm>
  )
}
```

### Form Schema expressionScope 表达式

Formily 针对 Form Schema 支持了表达式的能力，可以帮助我们在 JSON 字符串中注入一些逻辑能力

```tsx
import { SchemaForm, SchemaMarkupField as Field, FormButtonGroup, Submit, Reset } from '@apps/formily'

import { Input } from 'antd'

export default () => {
  return (
    <SchemaForm
      components={{ Input }}
      schema={{
        type: 'object',
        properties: {
          name: {
            type: 'string',
            title: '{{customTitle}}',
            description: '{{customDescription}}',
            'x-component': 'Input',
            'x-component-props': {
              placeholder: '{{customPlaceholder}}',
            },
          },
        },
      }}
      onSubmit={(values) => {
        console.log(values)
      }}
      // 表达式
      expressionScope={{
        customTitle: 'this is custom title',
        customDescription: 'this is custom description',
        customPlaceholder: 'this is custom placeholder',
      }}
    >
      <Field type="string" name="name" title="Name" x-component="Input" />
      <FormButtonGroup>
        <Submit>查询</Submit>
        <Reset>重置</Reset>
      </FormButtonGroup>
    </SchemaForm>
  )
}
```

### actions 调用 Form 内部 API

1. 先通过 createFormActions/createAsyncFormActions 创建 actions 实例
2. 将 actions 传递给 SchemaForm 或者 Form 组件 这样就能真正调用 FormAPI 了

```tsx
import { useEffect } from 'react'
import {
  SchemaForm,
  SchemaMarkupField as Field,
  FormButtonGroup,
  Submit,
  Reset,
  createFormActions,
} from '@apps/formily'

import { Input } from 'antd'

const actions = createFormActions()
export default () => {
  useEffect(() => {
    actions.setFieldState('name', (state) => {
      state.value = '我是通过Form Api 设置的'
    })
  }, [])
  return (
    <SchemaForm
      components={{ Input }}
      actions={actions}
      schema={{
        type: 'object',
        properties: {
          name: {
            type: 'string',
            title: 'Name',
            'x-component': 'Input',
          },
        },
      }}
      onSubmit={(values) => {
        console.log(values)
      }}
    >
      <Field type="string" name="name" title="Name" x-component="Input" />
      <FormButtonGroup>
        <Submit>查询</Submit>
        <Reset>重置</Reset>
      </FormButtonGroup>
    </SchemaForm>
  )
}
```

### effects 生命周期

可以做一些表单联动操作，显示隐藏，修改表单值 更多属性查看 FieldState 属性

```tsx
import { SchemaForm, SchemaMarkupField as Field, FormButtonGroup, Submit, Reset, FormEffectHooks } from '@apps/formily'

import { Input } from 'antd'
const { onFormInit$ } = FormEffectHooks

export default () => {
  return (
    <SchemaForm
      components={{ Input }}
      schema={{
        type: 'object',
        properties: {
          name: {
            type: 'string',
            title: 'name',
            'x-component': 'Input',
          },
          gender: {
            type: 'string',
            title: 'gender',
            'x-component': 'Input',
          },
        },
      }}
      effects={($, { setFieldState }) => {
        // 使用hook 方式
        onFormInit$().subscribe(() => {
          // 设置name 属性
          setFieldState('name', (state) => {
            state.value = '我是通过onFormInit 设置的值'
          })
        })
        // 监听 name onChange 时间
        $('onFieldValueChange', 'name').subscribe((fieldState) => {
          setFieldState('gender', (state) => {
            state.value = '我是gender，通过onFieldValueChange 设置了name 的值：' + fieldState.value
          })
        })
      }}
      onSubmit={(values) => {
        console.log(values)
      }}
    >
      <Field type="string" name="name" title="Name" x-component="Input" />
      <FormButtonGroup>
        <Submit>查询</Submit>
        <Reset>重置</Reset>
      </FormButtonGroup>
    </SchemaForm>
  )
}
```

### Schema

| **属性名** | **描述** | **类型** |
| --- | --- | --- |
| title | 字段标题 | React.ReactNode |
| name | 字段所属的父节点属性名 | string |
| description | 字段描述 | React.ReactNode |
| default | 字段默认值 | any |
| readOnly | 是否只读与 editable 一致 | boolean |
| type | 字段类型 | 'string' &#124; 'object' &#124; 'array' &#124; 'number' &#124; string |
| enum | 枚举数据 | Array<string &#124; number &#124; { label: React.ReactNode, value: any }> |
| const | 校验字段值是否与 const 的值相等 | any |
| multipleOf | 校验字段值是否可被 multipleOf 的值整除 | number |
| maximum | 校验最大值(大于) | number |
| exclusiveMaximum | 校验最大值（大于等于） | number |
| minimum | 校验最小值(小于) | number |
| exclusiveMinimum | 最小值（小于等于） | number |
| maxLength | 校验最大长度 | number |
| minLength | 校验最小长度 | number |
| pattern | 正则校验规则 | string &#124; RegExp |
| maxItems | 最大条目数 | number |
| minItems | 最小条目数 | number |
| uniqueItems | 是否校验重复 | boolean |
| maxProperties | 最大属性数量 | number |
| minProperties | 最小属性数量 | number |
| required | 必填 | boolean |
| format | 正则规则类型，详细类型可以往后看 | InternalFormats |
| properties | 对象属性 | {[key : string]:Schema} |
| items | 数组描述 | Schema &#124; Schema[] |
| additionalItems | 额外数组元素描述 | Schema |
| patternProperties | 动态匹配对象的某个属性的 Schema | {[key : string]:Schema} |
| additionalProperties | 匹配对象额外属性的 Schema | Schema |
| triggerType | 字段校验时机 | "onChange" &#124; "onBlur" |
| editable | 字段是否可编辑 | boolean |
| visible | 字段是否可见(数据+样式) | boolean |
| display | 字段样式是否可见 | boolean |
| x-props | 字段扩展属性 | { [name: string]: any } |
| x-index | 字段顺序 | number |
| x-rules | 字段校验规则，详细描述可以往后看 | [ValidatePatternRules](https://v1.formilyjs.org/iframe.html?path=/opt/build/repo/docs/zh-cn/schema-develop/form-schema.md#validatepatternrules) |
| x-component | 字段 UI 组件名称，大小写不敏感 | string |
| x-component-props | 字段 UI 组件属性 | {} |
| x-linkages | 字段间联动协议，详细描述可以往后看 | Array<{ target: FormPathPattern, type: string, [key: string]: any }> |
| x-mega-props | 字段布局属性 | { [name: string]: any } |

### SchemaForm

| 参数 | 说明 | 类型 | 是否必填 | 默认值 |
| --- | --- | --- | --- | --- |
| value | 受控值属性 主要用于外部多次渲染同步表单值的场景，但是注意，它不会控制默认值，点击重置按钮的时候值会被置空 | `Object` | 否 |  |
| defaultValue | 同步初始值属性 主要用于简单同步默认值场景，限制性较大，只保证第一次渲染生效，重置不会被置空 | `Object` | 否 |  |
| initialValues | 异步初始值属性 主要用于异步默认值场景，兼容同步默认值，只要在第 N 次渲染，某个字段还没被设置默认值，第 N+1 次渲染，就可以给其设置默认值 | `Object` | 否 |  |
| components | 可以传入任意一个只要满足 value/onChange 属性的组件 | `ReactNode` | 否 |  |
| schema | 可以传入一个 JSON schema | `ISchema` | 否 |  |
| onSubmit | 提交回调函数 | (values)=>{} | 否 |  |
| children | 子元素 | `ReactNode` | 否 |  |
| expressionScope | 表达式的能力，可以帮助我们在 JSON 字符串中注入一些逻辑能力 | `json` | 否 |  |
| actions | 传入 createFormActions/createAsyncFormActions 创建 actions 实例 | `actions` | 否 |  |

### Field

| 参数              | 说明                                               | 类型         | 是否必填 | 默认值 |
| ----------------- | -------------------------------------------------- | ------------ | -------- | ------ |
| type              | 类型                                               | `object`     | 是       |        |
| name              | 名称                                               | (values)=>{} | 否       |        |
| title             | 标题                                               | `ReactNode`  | 否       |        |
| x-component       | 名称要和 SchemaForm 属性传入的 components 名称映射 | `String`     | 是       |        |
| x-component-props | 对组件传入属性 方法                                | `any`        | 是       |        |

### FieldState

| **状态名** | **描述** | **类型** | **默认值** |
| --- | --- | --- | --- |
| displayName | Field 状态标识 | string | "FieldState" |
| dataType | 字段值类型 | "any" &#124; "array" | "any" |
| name | 字段数据路径 | string |  |
| path | 字段节点路径 | string |  |
| initialized | 字段是否已经初始化 | boolean | false |
| pristine | 字段 value 是否等于 initialValue | boolean | false |
| valid | 字段是否合法 | boolean | false |
| invalid | 字段是否非法 | boolean | false |
| touched | 字段是否被 touch | boolean | false |
| visible | 字段是否显示(如果为 false，字段值不会被提交) | boolean | true |
| display | 字段是否 UI 显示(如果为 false，字段值可以被提交) | boolean | true |
| editable | 字段是否可编辑 | boolean | true |
| loading | 字段是否处于加载态 | boolean | false |
| modified | 字段的 value 是否变化 | boolean | false |
| active | 字段是否被激活(onFocus 触发) | boolean | false |
| visited | 字段是否被 visited(onBlur 触发) | boolean | false |
| validating | 字段是否正在校验 | boolean | false |
| values | 字段值集合，value 属性相当于是 values[0]，该集合主要来源于组件的 onChange 事件的回调参数 | any[] | [] |
| errors | 字段错误消息集合 | string[] | [] |
| effectErrors | 人工操作的错误消息集合(在 setFieldState 中设置 errors 会被重定向到设置 effectErrors) | string[] | [] |
| ruleErrors | 校验规则的错误消息集合 | string[] | [] |
| warnings | 字段警告信息集合 | string[] | [] |
| effectWarnings | 人工操作的警告信息集合(在 setFieldState 中设置 warnings 会被重定向到设置 effectWarnings) | string[] | [] |
| ruleWarnings | 校验规则的警告信息集合 | string[] | [] |
| value | 字段值 | any |  |
| initialValue | 字段初始值 | any |  |
| rules | 字段校验规则 | [ValidatePatternRules](https://v1.formilyjs.org/iframe.html?path=/opt/build/repo/docs/zh-cn/schema-develop/form-state.md#validatepatternrules) | [] |
| required | 字段是否必填 | boolean | false |
| mounted | 字段是否已挂载 | boolean | false |
| unmounted | 字段是否已卸载 | boolean | false |
| inputed | 字段是否主动输入过 | true |  |
| props | 字段扩展 UI 属性(如果是 Schema 模式，props 代表每个 SchemaField 属性，如果是 JSX 模式，则代表 FormItem 属性) | {} |  |
| 扩展状态 | 通过 setFieldState 可以直接设置扩展状态 | any |  |

### x-props

| **属性名**                 | **描述**                                                  | **类型**  |
| -------------------------- | --------------------------------------------------------- | --------- |
| x-props.addonAfter         | FormItem 的尾随内容                                       | ReactNode |
| x-props.itemStyle          | FormItem 的 style 属性                                    | Object    |
| x-props.itemClassName      | FormItem 的 className 属性                                | String    |
| x-props.triggerType        | 配置校验触发类型 "onChange" &#124; "onBlur" &#124; "none" | String    |
| 针对组件库的 FormItem 属性 | 比如 labelCol/wrapperCol 等                               |           |

### 生命周期 类型

| **常量名** | **常量值** | **描述** | **Hook** | **返回值** |
| --- | --- | --- | --- | --- |
| ON_FORM_WILL_INIT | "onFormWillInit" | 表单初始化前触发 | onFormWillInit$ | FormState |
| ON_FORM_INIT | "onFormInit" | 表单初始化之后触发 | onFormInit$ | FormState |
| ON_FORM_CHANGE | "onFormChange" | 表单状态变化时触发 | onFormChange$ | FormState |
| ON_FORM_MOUNT | "onFormMount" | 表单组件挂载完毕时触发 | onFormMount$ | FormState |
| ON_FORM_UNMOUNT | "onFormUnmount" | 表单组件卸载时触发 | onFormUnmount$ | FormState |
| ON_FORM_SUBMIT | "onFormSubmit" | 表单提交时触发 | onFormSubmit$ | FormState |
| ON_FORM_RESET | "onFormReset" | 表单重置时触发 | onFormReset$ | FormState |
| ON_FORM_SUBMIT_START | "onFormSubmitStart" | 表单提交开始时触发 | onFormSubmitStart$ | FormState |
| ON_FORM_SUBMIT_END | "onFormSubmitEnd" | 表单提交完成时触发 | onFormSubmitEnd$ | FormState |
| ON_FORM_SUBMIT_VALIDATE_START | "onFormSubmitValidateStart" | 表单提交校验开始时触发 | onFormSubmitValidateStart$ | FormState |
| ON_FORM_SUBMIT_VALIDATE_SUCCESS | "onFormSubmitValidateSuccess" | 表单提交校验成功时触发 | onFormSubmitValidateSuccess$ | FormState |
| ON_FORM_SUBMIT_VALIDATE_FAILED | "onFormSubmitValidateFailed" | 表单提交校验失败时触发 | onFormSubmitValidateFailed$ | FormState |
| ON_FORM_ON_SUBMIT_SUCCESS | "onFormOnSubmitSuccess" | 表单自定义 onSubmit 成功，入参为 onSubmit 返回值 | onFormOnSubmitSuccess$ | any |
| ON_FORM_ON_SUBMIT_FAILED | "onFormOnSubmitFailed" | 表单自定义 onSubmit 失败，入参为 onSubmit 抛出异常 | onFormOnSubmitFailed$ | Error |
| ON_FORM_VALUES_CHANGE | "onFormValuesChange" | 表单值变化时触发 | onFormValuesChange$ | FormState |
| ON_FORM_INITIAL_VALUES_CHANGE | "onFormInitialValuesChange" | 表单初始值变化时触发 | onFormInitialValuesChange$ | FormState |
| ON_FORM_VALIDATE_START | "onFormValidateStart" | 表单校验开始时触发 | onFormValidateStart$ | FormState |
| ON_FORM_VALIDATE_END | "onFormValidateEnd" | 表单校验结束时触发 | onFormValidateEnd$ | FormState |
| ON_FORM_INPUT_CHANGE | "onFormInputChange" | 表单输入事件触发时触发(人为操作，不包含间接联动) | onFormInputChange$ | FormState |
| ON_FORM_GRAPH_CHANGE | "onFormGraphChange" | 表单树结构变化时触发 | onFormGraphChange$ | FormGraph |
| ON_FIELD_WILL_INIT | "onFieldWillInit" | 字段初始化前触发 | onFieldWillInit$ | FieldState |
| ON_FIELD_INIT | "onFieldInit" | 字段初始化时触发 | onFieldInit$ | FieldState |
| ON_FIELD_CHANGE | "onFieldChange" | 字段状态发生变化时触发 | onFieldChange$ | FieldState |
| ON_FIELD_INPUT_CHANGE | "onFieldInputChange" | 字段输入事件触发时触发(人为操作，不包含间接联动) | onFieldInputChange$ | FieldState |
| ON_FIELD_VALUE_CHANGE | "onFieldValueChange" | 字段值变化时触发 | onFieldValueChange$ | FieldState |
| ON_FIELD_INITIAL_VALUE_CHANGE | "onFieldInitialValueChange" | 字段初始值变化时触发 | onFieldInitialValueChange$ | FieldState |
| ON_FIELD_VALIDATE_START | "onFieldValidateStart" | 字段校验开始时触发 | onFieldValidateStart$ | FieldState |
| ON_FIELD_VALIDATE_END | "onFieldValidateEnd" | 字段校验结束时触发 | onFieldValidateEnd$ | FieldState |
| ON_FIELD_MOUNT | "onFieldMount" | 字段挂载时触发 | onFieldMount$ | FieldState |
| ON_FIELD_UNMOUNT | "onFieldUnmount" | 字段卸载时触发 | onFieldUnmount$ | FieldState |
