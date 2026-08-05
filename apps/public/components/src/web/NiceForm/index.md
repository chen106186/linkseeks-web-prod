---
group:
  title: 重型组件
---

# NiceForm

## NiceForm2.0 基于 formily2.x

```tsx
import { useMemo } from 'react'
import { NiceForm } from '@apps/components'
import { createForm, onFormValidateSuccess, onFormSubmitSuccess, Submit } from '@apps/form'

export default () => {
  // 1.0 创建 form
  const form = useMemo(
    () =>
      createForm({
        validateFirst: true,
        effects() {
          // formily 的hook 可以在这使用
          // 表单校验
          onFormValidateSuccess((form) => {
            ref.current.reload(form.values)
          })
          // 表单提交成功 hook
          onFormSubmitSuccess(() => {
            console.log('表单提交成功')
          })
        },
      }),
    [],
  )
  // 2.0 定义Schema
  const normalSchema = {
    type: 'object',
    properties: {
      username: {
        type: 'string',
        title: '用户名',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
      },
      password: {
        type: 'string',
        title: '密码',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Password',
      },
    },
  }
  return (
    <NiceForm form={form} schema={normalSchema}>
      <Submit block size="large">
        登录
      </Submit>
    </NiceForm>
  )
}
```

### API

| 参数       | 说明                                            | 类型        | 是否必填 | 默认值 |
| ---------- | ----------------------------------------------- | ----------- | -------- | ------ | --- |
| form       | createForm 初始化 Form                          | `Form`      | 是       |        |
| schema     | 解析 json-schema 的能力                         | `ISchema`   | 是       |        |
| scope      | 传入到 NiceFrom 在 schema 中使用,如传入一些变量 | 方法        | `any?`   |        |     |
| components | 传入到 NiceFrom 在 schema 中使用的组件          | `ReactNode` |          |        |
| children   | 子元素                                          | `ReactNode` |          |        |

### 内置组件

| 组件名                            | 说明                                                                  |
| --------------------------------- | --------------------------------------------------------------------- |
| FormButtonGroup                   | 表单按钮组布局组件                                                    |
| Reset                             | 重置按钮                                                              |
| Checkbox                          | 复选框                                                                |
| TimePicker                        | 时间选择器                                                            |
| Transfer                          | 穿梭框                                                                |
| Switch                            | 开关组件                                                              |
| ArrayCards                        | 卡片列表，对于每行字段数量较多，联动较多的场景比较适合使用 ArrayCards |
| ArrayTable                        | 自增表格                                                              |
| ArrayItems                        | 自增列表                                                              |
| Input                             | 文本输入框                                                            |
| NumberPicker                      | 数字输入框                                                            |
| Password                          | 密码输入框                                                            |
| Radio                             | 单选框                                                                |
| Upload                            | 上传组件                                                              |
| Select                            | 下拉框组件                                                            |
| SelectTable                       | 表格选择组件                                                          |
| Space                             | Flex 布局组件                                                         |
| TreeSelect                        | 树选择器                                                              |
| FormTab                           | 选项卡表单                                                            |
| FormStep                          | 分步表单组件                                                          |
| FormLayout                        | 区块级布局批量控制组件                                                |
| FormItem                          | FormItem 组件 相比于 Antd 的 FormItem，它支持的功能更多               |
| FormGrid                          | FormGrid 组件                                                         |
| FormDrawer                        | 抽屉表单，主要用在简单的事件打开表单场景                              |
| FormDialog                        | 弹窗表单，主要用在简单的事件打开表单场景                              |
| FormCollapse                      | 折叠面板，通常用在布局空间要求较高的表单场景                          |
| Cascader                          | 联级选择器                                                            |
| Editable                          | 局部编辑器                                                            |
| Button                            | 按钮                                                                  |
| Row                               | 布局                                                                  |
| DatePicker                        | 时间选择器                                                            |
| time: TimePicker                  | 时间选择器                                                            |
| timerange: TimePicker.RangePicker | 时间选择器                                                            |
| transfer: Transfer                | 同上                                                                  |
| boolean: Switch                   | 同上                                                                  |
| array: ArrayCards                 | 同上                                                                  |
| cards: ArrayCards                 | 同上                                                                  |
| table: ArrayTable                 | 同上                                                                  |
| checkbox: Checkbox.Group          | 多选                                                                  |
| date: DatePicker                  | 同上                                                                  |
| daterange: DatePicker.RangePicker | 时间选择器                                                            |
| year: DatePicker.YearPicker       | 年时间选择器                                                          |
| month: DatePicker.MonthPicker     | 月时间选择器                                                          |
| week: DatePicker.WeekPicker       | 周时间选择器                                                          |
| string: Input                     | 同上                                                                  |
| textarea: Input.TextArea          | 同上                                                                  |
| number: NumberPicker              | 同上                                                                  |
| password: Password                | 同上                                                                  |
| radio: Radio.Group                | 同上                                                                  |
| upload: Upload                    | 同上                                                                  |
