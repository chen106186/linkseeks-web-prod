import React, { useRef, useState } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import { Card, Modal, Form, Radio, message, Input, Button } from 'antd'
import statuStyle from '../../common/colorTag'
import { ColumnType } from 'antd/lib/table/interface'
import StandardTable from '@/components/StandardTable'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { Schema } from '../schema'
import SearchSelect from '@/components/NiceForm/components/SearchSelect'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import Submit from '@/components/NiceForm/components/Submit'
import DateRangePickerUnix from '@/components/NiceForm/components/DateRangePickerUnix'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import moment from 'moment'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { getContractCoordinationPageToBeSign, postContractCoordinationSubmitExamine } from '@apps/apis'
import { AuthButton } from '@apps/components'
import { customAuthUrl as AuthUrl } from '@apps/domains'

const { TextArea } = Input

const intl = getIntl()

const Sign = () => {
  const ref = useRef<any>({})
  const [form] = Form.useForm()
  const [isPass, setIsAllMember] = useState()
  const [Visible, setIsModalVisible] = useState<boolean>(false)
  const [id, setid] = useState('')
  const getdate = (time) => {
    return new Date(Date.parse(time.replace(/-/g, '/'))).getTime() / 1000
  }
  //表头
  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'contract.hetongbianhaozhaiyao' }),
      dataIndex: 'contractNo',
      align: 'left',
      render: (text, record) => (
        <DetailAuthButton>
          <EyeAuthButton
            type={AuthUrl('detail') ? 'link' : 'button'}
            url={`/contract/coordination/sign/detail?contractId=${record.id}`}
          >
            {text}
          </EyeAuthButton>
          <p>{record.contractAbstract}</p>
        </DetailAuthButton>
      ),
    },
    {
      title: intl.formatMessage({ id: 'contract.hetongshengxiaoshixiaoshi' }),
      dataIndex: 'startTime',
      align: 'left',
      sorter: {
        compare: (a, b) => getdate(a.startTime) - getdate(b.startTime),
        multiple: 1,
      },
      render: (text, record) => (
        <div>
          <p>{text}</p>
          <p>{record.endTime}</p>
        </div>
      ),
    },
    {
      title: intl.formatMessage({ id: 'contract.hetongjiafang' }),
      dataIndex: 'partyAName',
      align: 'left',
    },
    {
      title: intl.formatMessage({ id: 'contract.hetongzongjine' }),
      dataIndex: 'totalAmount',
      align: 'left',
    },
    {
      title: intl.formatMessage({ id: 'contract.duiyingdanjuxunyuanlei' }),
      dataIndex: 'sourceNo',
      align: 'left',
      render: (text, record) => (
        <DetailAuthButton>
          {text && record.sourceId && (
            <EyeAuthButton
              type={record.sourceType == 1 ? (record.sourceId ? 'link' : 'button') : 'link'}
              url={
                record.sourceType == 1
                  ? `/procurementAbility/offter/offter/preview?id=${record.sourceId}&number${record.sourceNo}`
                  : `/procurementAbility/callForBids/callForBidsSearch/detail?id=${record.sourceId}`
              }
            >
              {text}
            </EyeAuthButton>
          )}
          <p>{record.sourceTypeName}</p>
        </DetailAuthButton>
      ),
    },
    {
      title: intl.formatMessage({ id: 'contract.waibuzhuangtai' }),
      dataIndex: 'outerStatusName',
      align: 'left',
      render: (text) => {
        return <span style={statuStyle.success}>{text}</span>
      },
    },
    {
      title: intl.formatMessage({ id: 'contract.neibuzhuangtai' }),
      dataIndex: 'innerStatusName',
      align: 'left',
      render: (text) => {
        return (
          <div>
            <span style={statuStyle.point}> </span>
            <span>{text}</span>
          </div>
        )
      },
    },
    {
      title: intl.formatMessage({ id: 'contract.caozuo' }),
      dataIndex: 'innerStatusName',
      align: 'left',
      render: (text, record) => {
        return (
          <AuthButton type="custom" code="submit">
            <div>
              <span
                style={{ color: '#00A98F', cursor: 'pointer' }}
                onClick={() =>
                  history.push(`/contract/coordination/sign/submit?contractId=${record.id}&type=sign&status=submit`)
                }
              >
                {intl.formatMessage({ id: 'contract.qiandinghetong' })}
              </span>
            </div>
          </AuthButton>
        )
      },
    },
  ]
  const fetchOptions = (service) => {
    return async function () {
      const res = await service()
      if (res.code === 1000) {
        return res.data.map((item) => {
          return { label: item.name, value: item.status }
        })
      }
      return []
    }
  }
  // 列表数据
  const fetchData = (params?: any) => {
    console.log(params) //可以直接打印参数
    params.startTime = params.startTime ? moment(Number(params.startTime)).format('YYYY-MM-DD') : ''
    params.endTime = params.endTime ? moment(Number(params.endTime)).format('YYYY-MM-DD') : ''
    return new Promise((resolve, reject) => {
      getContractCoordinationPageToBeSign({
        ...params,
      })
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
  const handleIsAllMemberChange = (v: any) => {
    setIsAllMember(v.target.value)
  }
  /* 提交表单 */
  const submitExamine = (id) => {
    setid(id)
    setIsModalVisible(!Visible)
  }
  const onFinish = (values: any) => {
    values.contractId = id
    const msg = message.loading({
      content: intl.formatMessage({ id: 'contract.zhengzaicaozuo' }),
      duration: 0,
    })
    console.log('Success:', values)
    postContractCoordinationSubmitExamine(values)
      .then((res) => {
        console.log(res)
        if (res.code === 1000) {
          ref.current.reloadCurrent()
          setIsModalVisible(!Visible)
        }
      })
      .finally(() => {
        msg()
      })
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }
  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          tableProps={{
            rowKey: 'id',
          }}
          columns={columns}
          currentRef={ref}
          fetchTableData={(params: any) => fetchData(params)}
          formilyProps={{
            ctx: {
              inline: false,
              schema: Schema,
              effects: ($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'contractNo', FORM_FILTER_PATH)
              },
              components: {
                DateRangePickerUnix,
                Submit,
                SearchSelect,
              },
            },
          }}
        />
      </Card>
      <Modal
        footer={null}
        title={intl.formatMessage({ id: 'contract.tijiaoshenhe' })}
        visible={Visible}
        onOk={() => setIsModalVisible(!Visible)}
        onCancel={() => setIsModalVisible(!Visible)}
      >
        <Form
          name="basic"
          form={form}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            name="isPass"
            label=""
            rules={[{ required: true, message: intl.formatMessage({ id: 'contract.qingxuanzezuofeiriqi' }) }]}
            initialValue={isPass}
          >
            <Radio.Group onChange={handleIsAllMemberChange}>
              <Radio value={1}>{intl.formatMessage({ id: 'contract.tongguo' })}</Radio>
              <Radio value={0}>{intl.formatMessage({ id: 'contract.butongguo' })}</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label={
              isPass
                ? intl.formatMessage({ id: 'contract.shenhetongguoyuanyin' })
                : intl.formatMessage({ id: 'contract.shenhebutongguoyuanyin' })
            }
            rules={[{ required: true, message: intl.formatMessage({ id: 'contract.qingxuanzezuofeiriqi' }) }]}
          ></Form.Item>
          <Form.Item
            label=""
            name="opinion"
            rules={[{ required: true, message: intl.formatMessage({ id: 'contract.shenhetongguoyijian' }) }]}
          >
            <TextArea placeholder={intl.formatMessage({ id: 'contract.zaicishurunideyuanyin' })} maxLength={120} />
          </Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={() => setIsModalVisible(!Visible)} style={{ marginRight: 10 }}>
              {intl.formatMessage({ id: 'contract.quxiao' })}
            </Button>
            <Button type="primary" htmlType="submit">
              {intl.formatMessage({ id: 'contract.baocun' })}
            </Button>
          </div>
        </Form>
      </Modal>
    </PageHeaderWrapper>
  )
}

export default Sign
