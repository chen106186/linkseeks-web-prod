import React, { useRef, useState } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import { Card, Button, Space, message, Popconfirm } from 'antd'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import statuStyle from '../../common/colorTag'
import { ColumnType } from 'antd/lib/table/interface'
import StandardTable from '@/components/StandardTable'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import StatusTag from '@/components/StatusTag'
import { addListSchema } from '../schema'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import Submit from '@/components/NiceForm/components/Submit'
import DateRangePickerUnix from '@/components/NiceForm/components/DateRangePickerUnix'
import { PlusCircleOutlined, PlayCircleOutlined, PoweroffOutlined } from '@ant-design/icons'
import moment from 'moment'
import '../../constants/index.less'
import {
  getContractManageCreatePageToBeAdd,
  getContractManagePageToBeAdd,
  postContractManageCreateSubmit,
  postContractManageDelete,
  postContractManageSubmit,
} from '@apps/apis'
import { AuthButton } from '@apps/components'
import { customAuthUrl as AuthUrl } from '@apps/domains'
const intl = getIntl()

const addList = () => {
  const ref = useRef<any>({})
  const getdate = (time) => {
    return new Date(Date.parse(time.replace(/-/g, '/'))).getTime() / 1000
  }
  //表头
  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<string>>([])
  const [selectRow, setSelectRow] = useState<any[]>([]) // 模态框选择的行数据
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
    },
    {
      title: intl.formatMessage({ id: 'contract.duiyingdanjuxunyuanlei' }),
      dataIndex: 'sourceNo',
      align: 'left',
      render: (text, record) => {
        let url
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
            {url && (
              <AuthButton type="custom" code="inquiry">
                <EyeAuthButton type={url ? 'link' : 'button'} url={url}>
                  {text}
                </EyeAuthButton>
              </AuthButton>
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
        // 内部状态为待提交乙方签订合同，
        // 外部状态为待提交乙方签订合同、
        // 乙方不同意签订合同、
        // 甲方不同意签订合同都可以修改
        //外部待提交状态也要可修改
        return (
          <div>
            {/* 外部和内部都为待提交才可提交 */}
            {(record.innerStatus == '1' || record.innerStatus == '21') && record.outerStatus == '1' && (
              <AuthButton type="custom" code="submit">
                <span
                  style={{ color: '#00A98F', cursor: 'pointer', marginRight: 10 }}
                  onClick={() => submit(record.id)}
                >
                  {intl.formatMessage({ id: 'contract.tijiao' })}
                </span>
              </AuthButton>
            )}
            {(record.innerStatus == '1' ||
              record.outerStatus == '1' ||
              record.outerStatus == '3' ||
              record.outerStatus == '5') && (
              <AuthButton type="custom" code="edit">
                <span style={{ color: '#00A98F', cursor: 'pointer', marginRight: 10 }} onClick={() => edit(record)}>
                  {intl.formatMessage({ id: 'contract.xiugai' })}
                </span>
              </AuthButton>
            )}
            {/* 只有内部状态为待提交乙方签订合同状态且从未提交过的才可以删除，删除前需要提示，确认后才能删除 */}
            {/* 外部和内部都为 待提交 可删除 */}
            {((record.outerStatus == 1 && record.innerStatus == 21) || record.innerStatus == '1') && (
              <AuthButton type="custom" code="del">
                <Popconfirm
                  title={intl.formatMessage({ id: 'contract.quedingyaozhixingzhegecao' })}
                  onConfirm={() => confirmDel(record)}
                  okText={intl.formatMessage({ id: 'contract.shi' })}
                  cancelText={intl.formatMessage({ id: 'contract.fou' })}
                >
                  <Button
                    // style={{ margin: 10 }}
                    type="link"
                  >
                    {intl.formatMessage({ id: 'contract.shanchu' })}
                  </Button>
                </Popconfirm>
              </AuthButton>
            )}
          </div>
        )
      },
    },
  ]
  /**删除 */
  const confirmDel = (recode: any) => {
    postContractManageDelete({ contractId: recode.id })
      .then((res) => {
        if (res.code === 1000) {
          ref.current.reloadCurrent()
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  /* 修改 */
  const edit = (record) => {
    history.push(`/contract/manage/addList/edit?contractId=${record.id}`)
  }
  /* 提交审核 */
  const submit = (id) => {
    const msg = message.loading({
      content: intl.formatMessage({ id: 'contract.zhengzaicaozuo' }),
      duration: 0,
    })

    postContractManageCreateSubmit({ contractId: id })
      .then((res) => {
        if (res.code === 1000) {
          ref.current.reloadCurrent()
        }
      })
      .finally(() => {
        msg()
      })
      .catch((err) => {
        console.log(err)
      })
  }
  // 列表数据
  const fetchData = (params?: any) => {
    console.log(params) //可以直接打印参数
    params.startTime = params.startTime ? moment(Number(params.startTime)).format('YYYY-MM-DD') : ''
    params.endTime = params.endTime ? moment(Number(params.endTime)).format('YYYY-MM-DD') : ''
    return new Promise((resolve, reject) => {
      getContractManageCreatePageToBeAdd({
        ...params,
      }).then((res) => {
        resolve(res.data)
      })
    })
  }
  const rowSelection: any = {
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setSelectedRowKeys(selectedRowKeys)
      setSelectRow(selectedRows)
    },
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
          rowSelection={rowSelection}
          fetchTableData={(params: any) => fetchData(params)}
          formilyLayouts={{
            justify: 'space-between',
          }}
          formilyProps={{
            ctx: {
              inline: false,
              schema: addListSchema,
              effects: ($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'contractNo', FORM_FILTER_PATH)
              },
              components: {
                DateRangePickerUnix,
                Submit,
              },
            },
            layouts: {
              order: 2,
              span: 16,
            },
          }}
          formilyChilds={{
            children: (
              <Space>
                <AuthButton type="add">
                  <Button
                    icon={<PlusCircleOutlined />}
                    type="primary"
                    onClick={() => history.push('/contract/manage/addList/add')}
                  >
                    {intl.formatMessage({ id: 'contract.xinjian' })}
                  </Button>
                </AuthButton>
              </Space>
            ),
            layouts: {
              span: 8,
            },
          }}
        />
      </Card>
    </PageHeaderWrapper>
  )
}
export default addList
