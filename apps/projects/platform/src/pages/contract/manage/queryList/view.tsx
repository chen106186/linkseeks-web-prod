import React, { useRef, useState } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import { Card, Modal, Form, DatePicker, Button, Input, message } from 'antd'
import statuStyle from '../../common/colorTag'
import type { ColumnType } from 'antd/lib/table/interface'
import StandardTable from '@/components/StandardTable'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { QueryListSchema } from '../schema'
import StatusTag from '@/components/StatusTag'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import Submit from '@/components/NiceForm/components/Submit'
import DateRangePickerUnix from '@/components/NiceForm/components/DateRangePickerUnix'
import { PlayCircleOutlined, PoweroffOutlined } from '@ant-design/icons'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import moment from 'moment'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import { getContractManagePageList, getContractManageStatusList, postContractManageInvalid } from '@apps/apis'
import { AuthButton } from '@apps/components'
import { customAuthUrl as AuthUrl } from '@apps/domains'
const intl = getIntl()

const QueryList = () => {
  const ref = useRef<any>({})
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const [form] = Form.useForm()
  const [id, setId] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false)
  // const [selectRow, setSelectRow] = useState<any[]>([]) // 模态框选择的行数据
  const getdate = (time) => {
    return new Date(Date.parse(time.replace(/-/g, '/'))).getTime() / 1000
  }

  const like = (record) => {
    history.push(`/contract/manage/queryList/edit?contractId=${record.id}&oldContractId=1`)
  }

  const invalid = (idx) => {
    setId(idx)
    setIsModalVisible(!isModalVisible)
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
            url={`/contract/manage/queryList/detail?contractId=${record.id}`}
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
          <p>
            <PlayCircleOutlined /> &nbsp;{text}
          </p>
          <p>
            <PoweroffOutlined /> &nbsp;{record.endTime}
          </p>
        </div>
      ),
    },
    {
      title: intl.formatMessage({ id: 'contract.hetongyifang' }),
      dataIndex: 'partyBName',
      align: 'left',
    },
    {
      title: intl.formatMessage({ id: 'contract.hetongzongjine' }),
      dataIndex: 'totalAmount',
      align: 'left',
      sorter: {
        compare: (a, b) => a.totalAmount - b.totalAmount,
        multiple: 1,
      },
      render: (text) => text,
      // <div>
      //   <p>{intl.formatMessage({ id: 'common.money' })}
      //   {text}</p>
      // </div>
    },
    {
      title: intl.formatMessage({ id: 'contract.duiyingdanjuxunyuanlei' }),
      dataIndex: 'sourceNo',
      align: 'left',
      render: (text, record) => {
        let url = ''
        if (record.sourceId) {
          switch (record.sourceType) {
            case 1: {
              if (record.turn && record.sourceId) {
                url = `/procurementAbility/confirmOffer/offerInquire/preview?id=${record.sourceId}&turn=${record.turn}`
              }
              break
            }
            case 2: {
              url = `/procurementAbility/callForBids/callForBidsSearch/detail?id=${record.sourceId}`
              break
            }
            case 3: {
              url = `/procurementAbility/purchaseBid/search/detail?id=${record.sourceId}&number=${record.sourceNo}`
              break
            }
          }
        }
        return (
          <div>
            {text && record.sourceId && (
              <EyeAuthButton type={record.sourceId ? 'link' : 'button'} url={url}>
                {text}
              </EyeAuthButton>
            )}
            <p>{record.sourceTypeName}</p>
          </div>
        )
      },
    },
    {
      title: intl.formatMessage({ id: 'contract.waibuzhuangtai' }),
      dataIndex: 'outerStatus',
      align: 'left',
      render: (text, record) => {
        return <StatusTag type="warning" title={record.outerStatusName} />
      },
    },
    {
      title: intl.formatMessage({ id: 'contract.neibuzhuangtai' }),
      dataIndex: 'innerStatus',
      align: 'left',
      render: (text, record) => {
        return (
          <div>
            <span style={statuStyle.point}> </span>
            <span>{record.innerStatusName}</span>
          </div>
        )
      },
    },
    {
      title: intl.formatMessage({ id: 'contract.caozuo' }),
      dataIndex: 'state',
      align: 'left',
      render: (text, record) => {
        console.log(record.outerStatus)
        return (
          <div>
            {record.outerStatus != 7 && record.outerStatus != 9 && record.outerStatus != 8 && (
              <AuthButton type="custom" code="cancel">
                <span
                  style={{ color: '#00A98F', marginRight: 20, cursor: 'pointer' }}
                  onClick={() => invalid(record.id)}
                >
                  {intl.formatMessage({ id: 'contract.zuofei' })}
                </span>
              </AuthButton>
            )}
            {!record.subContractId && record.outerStatus == 6 && (
              <AuthButton type="custom" code="edit">
                <span style={{ color: '#00A98F', marginRight: 20, cursor: 'pointer' }} onClick={() => like(record)}>
                  {intl.formatMessage({ id: 'contract.hetongbiangeng' })}
                </span>
              </AuthButton>
            )}
          </div>
        )
      },
    },
  ]
  const rowSelection: any = {
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKey: any) => {
      setSelectedRowKeys(selectedRowKey)
      // setSelectRow(selectedRows)
    },
  }

  // 列表数据
  const fetchData = (params?: any) => {
    params.startTime = params.startTime ? moment(Number(params.startTime)).format('YYYY-MM-DD') : ''
    params.endTime = params.endTime ? moment(Number(params.endTime)).format('YYYY-MM-DD') : ''
    return new Promise((resolve, reject) => {
      getContractManagePageList({
        ...params,
        innerStatus: params.innerStatus || 0,
        outerStatus: params.outerStatus || 0,
      })
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
  const today = moment() // 当天日期

  const handleCancel = () => {
    setIsModalVisible(!isModalVisible)
  }
  const onFinish = (values: any) => {
    values.invalidTime = moment().format('YYYY-MM-DD')
    values.contractId = id
    const msg = message.loading({
      content: intl.formatMessage({ id: 'contract.zhengzaicaozuo' }),
      duration: 0,
    })

    postContractManageInvalid(values)
      .then((res) => {
        console.log(res)
        if (res.code === 1000) {
          ref.current.reloadCurrent()
          setIsModalVisible(!isModalVisible)
        }
      })
      .finally(() => {
        msg()
      })
      .catch(() => {
        // reject();
      })
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }
  const fetchOptions = (service, Status) => {
    console.log(service, 'service', Status)
    return async function () {
      const res = await service()
      if (res.code === 1000) {
        if (Status == 'outerStatus') {
          return res.data.outerList.map((item) => {
            return { label: item.message, value: item.code }
          })
        } else {
          return res.data.innerList.map((item) => {
            return { label: item.message, value: item.code }
          })
        }
      }
      return []
    }
  }
  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          tableProps={{
            rowKey: 'id',
          }}
          columns={columns}
          rowSelection={rowSelection}
          currentRef={ref}
          fetchTableData={(params: any) => fetchData(params)}
          formilyProps={{
            ctx: {
              inline: false,
              schema: QueryListSchema,
              effects: ($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'contractNo', FORM_FILTER_PATH)
                useAsyncSelect('outerStatus', fetchOptions(getContractManageStatusList, 'outerStatus'))
                useAsyncSelect('innerStatus', fetchOptions(getContractManageStatusList, 'innerStatus'))
              },
              components: {
                DateRangePickerUnix,
                Submit,
              },
            },
          }}
        />
      </Card>
      <Modal
        title={intl.formatMessage({ id: 'contract.zuofeiyuanyin' })}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          name="basic"
          form={form}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            name="invalidTime"
            label={intl.formatMessage({ id: 'contract.zuofeiriqi' })}
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: 'contract.qingxuanzezuofeiriqi' }),
              },
            ]}
            initialValue={moment(today)}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            name="invalidReason"
            label={intl.formatMessage({ id: 'contract.zuofeiyuanyin' })}
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: 'contract.qingshuruzuofeiyuanyin' }),
              },
            ]}
          >
            <Input.TextArea
              placeholder={intl.formatMessage({ id: 'contract.qingshuruzuofeiyuanyin' })}
              maxLength={50}
            />
          </Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleCancel} style={{ marginRight: 10 }}>
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

export default QueryList
