import { Button, Drawer, Form, Input, Modal, Select } from '@linkseeks/ui'
import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { ArrayFormTable, LanguageArrayFormTable } from '@apps/components'
import { useRequest, useRequestApi, useToggle } from '@linkseeks/hooks'
import useFormUnSaved from '../useFormUnSaved'
import {
  getMemberRegisterConfigGetConfigFieldTypeList,
  getMemberRegisterConfigGetConfigTagList,
  getMemberRegisterConfigGetConfigCheckRuleList,
  postMemberRegisterConfigAdd,
  postMemberRegisterConfigUpdate,
} from '@apps/apis'
import useFieldType from '../services/useFieldType'
import { Validator } from '@apps/validator'

const validate = new Validator()
let editKey: any = ''
const ControlRegisterDrawer = forwardRef<any, any>((props, ref) => {
  const { title, isList = false, tableRef, parentForm } = props
  const [form] = Form.useForm()
  const childRef = useRef<any>({})
  const [visible, toggle] = useToggle(false)
  const [appStatus, setAppStatus] = useState<'add' | 'edit' | 'preview'>('add')
  const [unsaved, setUnsaved, onFormChange] = useFormUnSaved()
  const fieldTypeMaps = useFieldType(form)
  const { data: fieldTypeList, loading: fieldTypeLoading } = useRequestApi(
    getMemberRegisterConfigGetConfigFieldTypeList,
    { cacheKey: 'fieldTypeList', staleTime: -1 },
  )
  const { data: fieldTagList, loading: fieldTagLoading } = useRequestApi(getMemberRegisterConfigGetConfigTagList, {
    cacheKey: 'fieldTagList',
    staleTime: -1,
  })
  const { data: fieldRuleList, loading: fieldRuleLoading } = useRequestApi(
    getMemberRegisterConfigGetConfigCheckRuleList,
    { cacheKey: 'fieldRuleList', staleTime: -1 },
  )

  const { run: runAdd, loading: addSubmitLoading } = useRequestApi(postMemberRegisterConfigAdd, {
    manual: true,
    onSuccess(data, params) {
      if (data.code === 1000) {
        toggle()
        tableRef.current.reload()
      }
    },
  })
  const { run: runUpdate, loading: updateSubmitLoading } = useRequestApi(postMemberRegisterConfigUpdate, {
    manual: true,
    onSuccess(data, params) {
      if (data.code === 1000) {
        toggle()
        tableRef.current.reload()
      }
    },
  })

  useImperativeHandle(ref, () => {
    return {
      toggle(record: any) {
        if (record) {
          if (record.ruleEnum === 0) {
            // 后端会返回字段标签不存在时为0，但是列表项要过滤掉这个，不然会显示一个0在下拉框
            record.ruleEnum = ''
          }

          if (record.tagEnum === 0) {
            record.tagEnum = ''
          }
          form.setFieldsValue(record)
        }
        toggle()
      },
      setAppStatus,
      form,
    }
  })
  const titleRender = useMemo(() => {
    if (title) {
      return title
    }
    const titleMaps = {
      add: '新增',
      edit: '编辑',
      preview: '查看',
    }
    return (
      <span style={{ color: '#172B4D', fontSize: 16, fontWeight: 'bold' }}>
        {`${titleMaps[appStatus]}会员注册资料`}
      </span>
    )
  }, [appStatus, title])

  // 是否显示字段长度
  const showFieldLength = useMemo(() => {
    return (
      fieldTypeMaps.isfileType || fieldTypeMaps.isTextType || fieldTypeMaps.isNumberType || fieldTypeMaps.isAddressType
    )
  }, [fieldTypeMaps])

  const handleSubmit = async () => {
    const value = await form.validateFields()
    if (isList) {
      // 列表形态点击确定，无需调接口，应当将数据返回给上一级
      const target = parentForm.getFieldValue('configs') || []
      if (editKey !== '') {
        const results = [...target]
        Object.assign(results[editKey], value)
        parentForm.setFieldValue('configs', results)
      } else {
        // 新增
        parentForm.setFieldValue('configs', [...target, value])
      }
      toggle()
    } else {
      // 提交选项
      appStatus === 'add' ? runAdd(value) : runUpdate(value)
    }
  }
  const renderFooter = () => {
    return (
      <div style={{ textAlign: 'right' }}>
        <Button
          onClick={() => {
            if (unsaved) {
              Modal.confirm({
                content: '您还有未保存的内容，是否确定要取消？',
                onOk() {
                  setUnsaved(false)
                  toggle(false)
                },
              })
            } else {
              toggle(false)
            }
          }}
          style={{ marginRight: 16 }}
        >
          取消
        </Button>
        {appStatus !== 'preview' && (
          <Button onClick={handleSubmit} type="primary" loading={addSubmitLoading || updateSubmitLoading}>
            确定
          </Button>
        )}
      </div>
    )
  }

  const handleEditConfig = (record, index) => {
    // 只有一级才有该操作
    editKey = index
    const configValue = form.getFieldValue('configs')
    childRef.current.toggle(configValue[index])
  }

  const handleAddConfig = () => {
    editKey = ''
    childRef.current.form.resetFields()
    childRef.current.toggle()
  }
  return (
    <Drawer
      width={800}
      title={titleRender}
      open={visible}
      onClose={toggle}
      getContainer={() => document.querySelector('main.ant-layout-content') as HTMLElement}
      destroyOnClose
      footer={renderFooter()}
    >
      <Form
        disabled={appStatus === 'preview'}
        form={form}
        labelAlign="left"
        labelCol={{ span: 4 }}
        onChange={onFormChange}
      >
        <Form.Item name="id" hidden />
        <Form.Item name="listField" hidden />
        <Form.Item
          label="字段编码"
          name="fieldName"
          rules={[
            { max: 26, message: '最长26个字符' },
            { required: true, message: '请输入字段编码' },
          ]}
        >
          <Input disabled={appStatus === 'edit' || appStatus === 'preview'} />
        </Form.Item>
        <Form.Item
          label="字段名称"
          name="fieldLocalName"
          required
          rules={[validate.validateLanguageRequired({ length: 100, required: true })]}
        >
          <LanguageArrayFormTable maxLength={100} />
        </Form.Item>
        <Form.Item label="字段类型" name="fieldType" rules={[{ required: true, message: '请选择' }]}>
          <Select
            loading={fieldTypeLoading}
            disabled={appStatus === 'edit' || appStatus === 'preview'}
            options={fieldTypeList
              ?.filter((v) => !(v.configEnumMessage === 'list' && isList))
              ?.map((v) => ({
                label: v.configEnumName,
                value: v.configEnumMessage,
              }))}
          />
        </Form.Item>
        {showFieldLength && (
          <Form.Item
            label={fieldTypeMaps.isfileType ? '大小限制' : '字段长度'}
            name="fieldLength"
            rules={[{ required: true, message: `请输入${fieldTypeMaps.isfileType ? '大小限制' : '字段长度'}` }]}
          >
            <Input suffix={fieldTypeMaps.isfileType ? 'MB' : false} />
          </Form.Item>
        )}

        <Form.Item label="是否允许为空" name="fieldEmpty" rules={[{ required: true, message: '请选择' }]}>
          <Select
            options={[
              { label: '是', value: 1 },
              { label: '否', value: 0 },
            ]}
          />
        </Form.Item>
        <Form.Item
          label="分组名称"
          name="fieldGroupName"
          required
          rules={[validate.validateLanguageRequired({ length: 100, required: true })]}
        >
          <LanguageArrayFormTable maxLength={100} />
        </Form.Item>
        <Form.Item
          label="排序"
          name="fieldOrder"
          required
          rules={[validate.validateRequired({ message: '请选择' }), validate.validateNumber({ min: 1, max: 100 })]}
        >
          <Input />
        </Form.Item>
        <Form.Item hidden={isList} label="字段标签" name="tagEnum">
          <Select
            loading={fieldTagLoading}
            options={fieldTagList?.map((v) => ({
              label: v.configEnumName,
              value: v.configEnum,
            }))}
            allowClear
          />
        </Form.Item>
        <Form.Item label="帮助信息" name="fieldRemark" rules={[validate.validateLanguageRequired({ length: 200 })]}>
          <LanguageArrayFormTable maxLength={200} />
        </Form.Item>
        <Form.Item hidden={isList} label="规则类型" name="ruleEnum">
          <Select
            loading={fieldRuleLoading}
            options={fieldRuleList?.map((v) => ({
              label: v.configEnumName,
              value: v.configEnum,
            }))}
            allowClear
          />
        </Form.Item>
        <Form.Item label="变更需审核" name="validate">
          <Select
            options={[
              { label: '是', value: 1 },
              { label: '否', value: 0 },
            ]}
            allowClear
          />
        </Form.Item>
        <Form.Item hidden={isList} label="是否搜索项" name="allowSelect">
          <Select
            options={[
              { label: '是', value: 1 },
              { label: '否', value: 0 },
            ]}
          />
        </Form.Item>
        <Form.Item
          hidden={!fieldTypeMaps.isCheckType && !fieldTypeMaps.isRadioType && !fieldTypeMaps.isSelectType}
          label="字段值类型"
          name={'fieldEnum'}
          rules={[validate.validateLanguageRequired({ length: 100 })]}
        >
          <LanguageArrayFormTable maxLength={100} type="multiple" showControl targetKey="items" />
        </Form.Item>
        {fieldTypeMaps.isListType && (
          <Form.Item label="列表" name={'configs'}>
            <LanguageArrayFormTable
              type="multiple"
              showControl
              targetKey="fieldLocalName"
              onAdd={handleAddConfig}
              onEdit={handleEditConfig}
            />
          </Form.Item>
        )}
      </Form>
      {fieldTypeMaps.isListType && <ControlRegisterDrawer title="字段设置" ref={childRef} parentForm={form} isList />}
    </Drawer>
  )
})

export default ControlRegisterDrawer
