import React from 'react'
import { Modal, Form, FormInstance, Input, Switch } from '@linkseeks/ui'
import { UploadImage } from '@apps/components'
import { useIntl } from '@linkseeks/i18n'
import { MallFormType, MallItemType } from '../../types'

interface MallModalProps {
  saveLoading: boolean
  form: FormInstance<any>
  visible: boolean
  mallInfo: MallItemType
  mro?: boolean
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
  onOk: (values: MallFormType) => void
}

const MallModal: React.FC<MallModalProps> = (props) => {
  const { saveLoading, form, mallInfo, visible, mro = false, onOk, setVisible } = props
  const intl = useIntl()

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  }

  const handleOk = () => {
    form.validateFields().then((values) => {
      onOk(values)
    })
  }

  return (
    <Modal
      title={intl.formatMessage({
        id: 'mall.eidt.modal.title',
        defaultMessage: '编辑商城信息',
      })}
      centered
      onCancel={() => setVisible(false)}
      open={visible}
      onOk={handleOk}
      confirmLoading={saveLoading}
      destroyOnClose
    >
      <Form form={form} labelAlign="left" initialValues={mallInfo} {...layout}>
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="logoUrl" hidden>
          <Input />
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({ id: 'mall.eidt.modal.logo', defaultMessage: '商城LOGO' })}
          dependencies={['logoUrl']}
          shouldUpdate
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'own_configure.form.logoUrl.required',
                defaultMessage: '请上传商城LOGO',
              }),
            },
          ]}
        >
          {({ getFieldValue }) => (
            <UploadImage
              imgUrl={getFieldValue('logoUrl')}
              size="200x200"
              fileMaxSize={200}
              onChange={(url) => {
                console.log(url, 'url')
                form.setFieldValue('logoUrl', url)
              }}
            />
          )}
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({ id: 'own_configure.form.mallname', defaultMessage: '商城名称' })}
          name="name"
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'own_configure.form.name.required', defaultMessage: '请输入商城名称' }),
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({ id: 'own_configure.form.describe', defaultMessage: '商城描述' })}
          name="describe"
        >
          <Input />
        </Form.Item>
        {mro && mallInfo?.environment === 1 && (
          <Form.Item
            label={intl.formatMessage({ id: 'mall.eidt.modal.mro', defaultMessage: 'MRO 模式' })}
            name="isOpenMro"
          >
            <Switch defaultChecked={mallInfo.isOpenMro} />
          </Form.Item>
        )}
      </Form>
    </Modal>
  )
}

export default MallModal
