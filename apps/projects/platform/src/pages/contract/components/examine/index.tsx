import React, { useState } from 'react'
import { Button, Input, Form, Radio, message, Modal, Upload, Row, Col } from 'antd'
const { TextArea } = Input
import type { IAntdSchemaFormProps } from '@apps/formily'
import { UploadOutlined } from '@ant-design/icons'
import {
  // postContractApplyAmountExamineStepOne,
  // postContractApplyAmountExamineStepTwo,
  // postContractApplyAmountSubmitExamine,
  postContractCoordinationExamineStepOne,
  postContractCoordinationExamineStepTwo,
  postContractCoordinationSubmitExamine,
  postContractManageCreateExamineStepOne,
  postContractManageCreateExamineStepTwo,
  postContractManageCreateSubmitExamine,
  postContractManageExamineStepOne,
  postContractManageExamineStepTwo,
  postContractManageSign,
  postContractManageSubmitExamine,
} from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'
import { FILE_PREFIX_ENUM } from '@apps/constants/file'
const intl = getIntl()
export interface Iprops extends IAntdSchemaFormProps {
  /* 显示隐藏 */
  ExamineFlag: boolean
  /* 回调方法 */
  getfetchData: Function
  /* id */
  applyId: string
  /* 请求接口类型 */
  type: string
  /* 同意 */
  agreeText?: string
  /* 不同意 */
  disagree?: string
}
/* 合同审核组建 */
const Examine: React.FC<Iprops> = ({ ExamineFlag, getfetchData, applyId, type, agreeText, disagree }) => {
  const [isPass, setIsAllMember] = useState(1)
  const [setstate] = useState<any>(false)
  const [contractUrl, setcontractUrl] = useState('')
  /* 设置选中值 */
  const handleIsAllMemberChange = (v: any) => {
    setIsAllMember(v.target.value)
  }
  const [form] = Form.useForm()
  /* 提交表单 */
  const onFinish = (values: any) => {
    console.log(type, '是啥')
    let fn
    switch (type) {
      /* 待新增请款单审核接口 */
      case 'submitExamine':
        // fn = postContractApplyAmountSubmitExamine
        values.applyId = applyId
        break
      /* 待新增请款单一级审核接口 */
      case 'PageToBeExamineOne':
        // fn = postContractApplyAmountExamineStepOne
        values.applyId = applyId
        break
      /* 待新增请款单二级审核接口 */
      case 'ToBeExamineTwo':
        // fn = postContractApplyAmountExamineStepTwo
        values.applyId = applyId
        break
      /* 待提交审核合同 */
      case 'ManageSubmitExamine':
        fn = postContractManageSubmitExamine
        values.contractId = applyId
        break
      /* 待提交一级审核合同 */
      case 'ManageExamineStepOne':
        fn = postContractManageExamineStepOne
        values.contractId = applyId
        break
      /* 待提交二级审核合同 */
      case 'PageToBeExamineStepTwo':
        fn = postContractManageExamineStepTwo
        values.contractId = applyId
        break
      /* 合同协同  待提交审核合同  */
      case 'pageToBeSubmitExamine':
        fn = postContractCoordinationSubmitExamine
        values.contractId = applyId
        break
      /* 合同协同  一级待提交审核合同  */
      case 'CoordinationPageToBeExamineOne':
        fn = postContractCoordinationExamineStepOne
        values.contractId = applyId
        break
      /* 合同协同  二级待提交审核合同  */
      case 'CoordinationExamineStepTwo':
        fn = postContractCoordinationExamineStepTwo
        values.contractId = applyId
        break
      /* 合同协同签订-签订合同 */
      case 'Signacontract':
        fn = postContractManageSign
        values.contractUrl = contractUrl
        values.contractId = applyId
        break

      /* 合同管理-待提交审核合同创建 -审核*/
      case 'CreatSubmitExamine':
        fn = postContractManageCreateSubmitExamine
        values.contractId = applyId
        break
      /* 合同协同签订-待审核合同创建(一级) -审核 */
      case 'CreatExamineStepOne':
        fn = postContractManageCreateExamineStepOne
        values.contractId = applyId
        break
      /* 合同协同签订-待审核合同创建(二级) -审核 */
      case 'CreatExamineStepTwo':
        fn = postContractManageCreateExamineStepTwo
        values.contractId = applyId
        break
    }
    // if(!values.contractUrl && type == 'Signacontract' && values?.isPass == 1 ){
    //   message.warning(intl.formatMessage({ id: 'contract.qingxianshangchuanhetong' }));
    //   return
    // }
    const msg = message.loading({
      content: intl.formatMessage({ id: 'contract.zhengzaicaozuo' }),
      duration: 0,
    })

    fn(values)
      .then((res) => {
        if (res.code === 1000) {
          getfetchData({
            ExamineFlag: false,
            code: 1000,
          })
        }
      })
      .finally(() => {
        msg()
      })
      .catch(() => {})
  }
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }
  /* 回调 */
  const fetchData = (val?) => {
    if (val == 'onCancel') {
      getfetchData({
        ExamineFlag: false,
        code: 9999,
      })
    } else {
      console.log('关闭弹窗')
    }
  }

  const fileTypeLimitList = [
    'application/pdf', // pdf
    'application/msword', //doc
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', //docx
    'application/vnd.ms-excel', // xls
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', //xlsx
  ]

  const uploadProps = {
    name: 'file',
    action: '/api/support/file/upload/prefix',
    data: {
      fileType: 1,
      prefix: FILE_PREFIX_ENUM.CONTRACT_SERVICE,
    },
    onChange(info) {
      if (info.file.response) {
        const {
          data: { url },
        } = info.file.response
        if (info.file.status == 'done') {
          setcontractUrl(url)
          message.info(intl.formatMessage({ id: 'contract.shangchuanchenggong' }))
          setstate(true)
        } else if (info.file.status == 'removed') {
          setcontractUrl('')
        }
      }
      if (info.file.status !== 'uploading') {
      }
      if (info.file.status === 'done') {
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} ${intl.formatMessage({ id: 'contract.shangchuanshibai' })}`)
      }
    },
    beforeUpload(file) {
      if (!fileTypeLimitList.includes(file.type)) {
        message.warning(intl.formatMessage({ id: 'contract.fujiandaxiaochaoguo.limit' }))
        return Upload.LIST_IGNORE
      }
      if (file.size / 1024 / 1024 > 20) {
        message.warning(intl.formatMessage({ id: 'contract.fujiandaxiaochaoguo20M' }))
        // return Promise.reject();
        return Upload.LIST_IGNORE
      }
    },
  }
  const uploadNode = () => {
    return (
      <div>
        <p style={{ paddingTop: 10, paddingBottom: 10 }}>
          {intl.formatMessage({ id: 'contract.zhizhihetongyifangyi' })}
        </p>
        <Row style={{ marginBottom: 30 }}>
          <Col span={24}>
            <Upload {...uploadProps} accept=".doc,.docx,.pdf,.xls,.xlsx" maxCount={1}>
              <Button icon={<UploadOutlined />}>{intl.formatMessage({ id: 'contract.shangchuanfujian' })}</Button>
            </Upload>
          </Col>
          <Col style={{ marginTop: 10 }}>
            <text style={{ color: '#999' }}>{intl.formatMessage({ id: 'contract.fujiandaxiaochaoguo.limit' })}</text>
          </Col>
        </Row>
      </div>
    )
  }
  return (
    <div>
      <Modal
        footer={null}
        title={intl.formatMessage({ id: 'contract.tijiaoshenhe' })}
        visible={ExamineFlag}
        onCancel={() => fetchData('onCancel')}
      >
        <Form
          name="basic"
          form={form}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          {type === 'Signacontract' ? uploadNode() : null}
          <Form.Item
            name="isPass"
            label=""
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: 'contract.qingxuanzetongguofangshi' }),
              },
            ]}
            initialValue={isPass}
          >
            <Radio.Group onChange={handleIsAllMemberChange}>
              <Radio value={1}>{agreeText}</Radio>
              <Radio value={0}>{disagree}</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label={
              isPass
                ? intl.formatMessage({ id: 'contract.shenhetongguoyuanyin' })
                : intl.formatMessage({ id: 'contract.shenhebutongguoyuanyin' })
            }
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: 'contract.qingxuanzezuofeiriqi' }),
              },
            ]}
          />
          <Form.Item
            label=""
            name="opinion"
            rules={[
              {
                required: isPass ? false : true,
                message: intl.formatMessage({ id: 'contract.shenhetongguoyijian' }),
              },
            ]}
          >
            <TextArea placeholder={intl.formatMessage({ id: 'contract.zaicishurunideyuanyin' })} maxLength={120} />
          </Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={() => fetchData('onCancel')} style={{ marginRight: 10 }}>
              {intl.formatMessage({ id: 'contract.quxiao' })}
            </Button>
            <Button type="primary" htmlType="submit">
              {intl.formatMessage({ id: 'contract.baocun' })}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  )
}
Examine.defaultProps = {
  agreeText: intl.formatMessage({ id: 'contract.tongguo' }),
  disagree: intl.formatMessage({ id: 'contract.butongguo' }),
}
export default Examine
