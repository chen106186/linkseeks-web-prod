import React, { useState, useRef, forwardRef, useImperativeHandle, memo } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import FormProgress, { HandleType, listFieldsConfigItemType } from '@/components/FormProgress'
import { Button, Form, FormInstance } from 'antd'
import { SaveOutlined } from '@ant-design/icons'
import usePrompt from '@/hooks/usePrompt'
import { PAGE_TYPE } from '@/constants'
import { FieldData } from 'rc-field-form/lib/interface'
import { AuthButton } from '@apps/components'
import { ColProps } from 'antd/es/grid/col'
import { useIntl } from '@linkseeks/i18n'

type PropsType = {
  pageType: 'add' | 'edit' | 'view' // 页面类型
  btnCode?: string // 提交按钮权限标识
  title?: string | React.ReactNode // 页面标题
  form: FormInstance<any> // form 对象
  formLayout?: { colon?: boolean; labelAlign?: 'left' | 'right'; labelCol?: ColProps; wrapperCol?: ColProps } // form基础布局配置
  onSubmit?: (setLoading: Function, handleLeave: Function) => void // 提交
  onValuesChange?: (changedValues: any, values: any) => void // 监听 form 值变化
  onFieldsChange?: (changedFields: FieldData[], allFields: FieldData[]) => void // 监听 form 字段变化
  tabLink?: Array<{ label: string; key: string }> // tab 配置
  children?: React.ReactNode // 内容
  extra?: React.ReactNode // 右侧拓展部分（一般用于自定义按钮内容）
  onBack?: () => void // 左侧返回按钮回调
  customStyle?: React.CSSProperties // 自定义样式
  progressIgnoreConfig?: Array<{ key?: string; value?: any; ignoreKey: string }> // 完整度计算 - 需要忽略的字段（key 和 value 是 忽略 ignoreKey 的前置条件）
  progressListFieldsConfig?: listFieldsConfigItemType[] // 完整度计算 - 列表字段内部需要计算的字段配置
  isAutoSetChildrenIdAndTitle?: boolean
  childrenTitleKey?: string
}

export const layout: any = {
  colon: false,
  labelCol: { style: { width: '144px' } },
  // wrapperCol: { span: 18 },
  labelAlign: 'left',
}

const ContentLayout = (props: PropsType, ref) => {
  const intl = useIntl()
  const {
    tabLink = [],
    title,
    pageType,
    form,
    formLayout = layout,
    onSubmit,
    children,
    onValuesChange,
    onFieldsChange,
    btnCode,
    progressIgnoreConfig,
    progressListFieldsConfig,
    isAutoSetChildrenIdAndTitle = true,
    childrenTitleKey = 'title',
    ...rest
  } = props
  const { handleLeave } = usePrompt()
  const [loading, setLoading] = useState<boolean>(false)

  const progressRef = useRef<HandleType>()

  let tabIndex = -1

  const handleSubmit = () => {
    onSubmit?.(setLoading, handleLeave)
  }

  useImperativeHandle(ref, () => ({
    // 通过 ref 设置信息完整度
    setProgress() {
      progressRef?.current?.render(form)
    },
  }))

  return (
    <>
      <PageHeaderWrapper
        title={
          <FormProgress
            title={title}
            ref={progressRef}
            disabled={pageType === PAGE_TYPE.VIEW}
            ignoreConfig={progressIgnoreConfig}
            listFieldConfig={progressListFieldsConfig}
          />
        }
        isAnchor
        items={tabLink}
        extra={
          pageType !== PAGE_TYPE.VIEW && (
            // <AuthButton type="custom" code={btnCode}>
            <Button icon={<SaveOutlined />} type="primary" onClick={handleSubmit} loading={loading}>
              {intl.formatMessage({ id: 'common.button.save', defaultMessage: '保存' })}
            </Button>
            // </AuthButton>
          )
        }
        {...rest}
      >
        <Form
          form={form}
          {...formLayout}
          onValuesChange={(changedValues: any, values: any) => {
            if (pageType !== PAGE_TYPE.VIEW) {
              handleLeave()
            }
            onValuesChange?.(changedValues, values)
          }}
          onFieldsChange={(changedFields: FieldData[], allFields: FieldData[]) => {
            progressRef?.current?.render(form)
            onFieldsChange?.(changedFields, allFields)
          }}
        >
          {children &&
            React.Children.map(children, (child: any, index: number) => {
              if (child) {
                tabIndex++
                return React.cloneElement(child, {
                  id: tabLink[tabIndex]?.key,
                  [childrenTitleKey]: tabLink[tabIndex]?.name,
                })
              }
              return false
            })}
        </Form>
      </PageHeaderWrapper>
    </>
  )
}
export default memo(forwardRef(ContentLayout))
