import React, { useCallback, useRef, useState } from 'react'
import { Card, message, Button, Dropdown, Menu } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import StandardTable from '@/components/StandardTable'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link, usePrompt, useQuery, useLocation } from '@linkseeks/router-core'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { useSelfTable } from './model/useSelfTable'
import { tableListSchema } from './schema'
import Submit from '@/components/NiceForm/components/Submit'
import DateRangePickerUnix from '@/components/NiceForm/components/DateRangePickerUnix'
import { useHttpRequest } from '@/hooks/useHttpRequest'
import ModalForm from '@/components/ModalForm'
import { createAsyncFormActions } from '@apps/formily'
import moment from 'moment'
import { dataChangeUnix } from '../addNewBid/constant'
import '../../utils/index.less'
import { CaretDownOutlined } from '@ant-design/icons'
import {
  postPurchaseInviteTenderDiscardInviteTender,
  postPurchaseInviteTenderGetInviteTenderList,
  postPurchaseInviteTenderUpdateOpenTender,
} from '@apps/apis'
const intl = getIntl()
const destroyActions = createAsyncFormActions()
const modifyActions = createAsyncFormActions()

const callForBidsSearch: React.FC<{}> = () => {
  const destoryRef = useRef<any>({})
  const modifyRef = useRef<any>({})
  const { run, loading } = useHttpRequest(postPurchaseInviteTenderDiscardInviteTender)
  const { run: runTime, loading: loadingTime } = useHttpRequest(postPurchaseInviteTenderUpdateOpenTender)

  const [inviteTenderEndTime, setInviteTenderEndTime] = useState<any>(null)
  const [evaluationStartTime, setEvaluationStartTime] = useState<any>(null)

  const { ref, columns } = useSelfTable()

  const tableColumns: any[] = columns.concat([
    {
      title: intl.formatMessage({ id: 'table.purchase.caozuo' }),
      align: 'left',
      dataIndex: 'ctl',
      key: 'ctl',
      render: (text, record) => renderOptionButton(record),
    },
  ])

  const renderOptionButton = (record: any) => {
    const buttonGroup = {
      [`${intl.formatMessage({ id: 'commodity.products.buttonGroup.1' })}`]: true,
      [`${intl.formatMessage({ id: 'table.purchase.xiugaikaibiaoshi' })}`]: record.isOpenTenderTime,
      [`${intl.formatMessage({ id: 'table.purchase.chouquzhuanjia' })}`]: record.isExpert,
      [`${intl.formatMessage({ id: 'common.fiebiao' })}`]: record.isDiscardTender,
    }

    const operationHandler = {
      [`${intl.formatMessage({ id: 'commodity.products.buttonGroup.1' })}`]: () => handleCopy(record.id),
      [`${intl.formatMessage({ id: 'table.purchase.xiugaikaibiaoshi' })}`]: () => handleChangeTime(record),
      [`${intl.formatMessage({ id: 'table.purchase.chouquzhuanjia' })}`]: () => handleWithdraw(record.id),
      [`${intl.formatMessage({ id: 'common.fiebiao' })}`]: () => handleDestory(record.id),
    }

    const keyNames = Object.keys(buttonGroup)

    return (
      <>
        {Object.values(buttonGroup).filter(Boolean).length > 2 ? (
          <>
            <Button type="link" onClick={operationHandler[keyNames[0]]}>
              {keyNames[0]}
            </Button>
            <Dropdown
              overlay={
                <Menu>
                  {keyNames.slice(1, keyNames.length).map((e, i) => (
                    <Menu.Item key={`menuItem${i}`}>
                      <Button type="link" onClick={operationHandler[e]}>
                        {e}
                      </Button>
                    </Menu.Item>
                  ))}
                </Menu>
              }
            >
              <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                {intl.formatMessage({ id: 'table.purchase.gengduo' })} <CaretDownOutlined />
              </a>
            </Dropdown>
          </>
        ) : (
          keyNames.map((e, i) =>
            buttonGroup[e] ? (
              <Button key={`btnItem${i}`} type="link" onClick={operationHandler[e]}>
                {e}
              </Button>
            ) : null,
          )
        )}
      </>
    )
  }

  const fetchTableData = async (params) => {
    let _params = params.inviteTenderInStatusList
      ? { ...params, inviteTenderInStatusList: [params.inviteTenderInStatusList] }
      : { ...params }
    let __params = _params.inviteTenderOutStatusList
      ? { ..._params, inviteTenderOutStatusList: [_params.inviteTenderOutStatusList] }
      : { ..._params }
    const { data } = await postPurchaseInviteTenderGetInviteTenderList(__params, { ctlType: 'none' })
    return data
  }

  const handleWithdraw = (id) => {
    history.push(`/procurementAbility/callForBids/remarkBidCommittee/add?code=${id}`)
  }

  // 复制 id存入本地存储跳转至新增页
  const handleCopy = (id) => {
    // postPurchaseInviteTenderCopyInviteTender({id}).then(res => {
    //   if(res.code === 1000) {
    //     ref.current.reloadCurrent()
    //   }
    // })
    sessionStorage.setItem('currentCopyId', id)
    history.push('/procurementAbility/callForBids/readyAddBid/add')
  }

  // 废标
  const handleDestory = (id) => {
    destoryRef.current.setVisible(true)
    destroyActions.setFieldValue('id', id)
  }

  // 修改开标时间
  const handleChangeTime = (record) => {
    setInviteTenderEndTime(record.inviteTenderEndTime)
    setEvaluationStartTime(record.evaluationStartTime)
    setTimeout(() => {
      modifyActions.setFieldValue('openTenderTime', moment(record.openTenderTime).format('YYYY-MM-DD HH:mm:ss'))
      modifyActions.setFieldValue('id', record.id)
    }, 500)
    modifyRef.current.setVisible(true)
  }

  // 提交废标
  const handleSubmit = useCallback(() => {
    destroyActions.submit().then(async ({ values }: any) => {
      const result = await run(values)
      if (result.code === 1000) {
        destoryRef.current.setVisible(false)
        setTimeout(() => {
          ref.current.reloadCurrent()
        }, 800)
      }
    })
  }, [])

  // 修改开标时间
  const handleModifyOpenTime = () => {
    modifyActions.submit().then(async ({ values }: any) => {
      console.log(values)
      const params = {
        id: values.id,
        openTenderTime: dataChangeUnix(values.openTenderTime),
      }
      if (!(params.openTenderTime >= inviteTenderEndTime && params.openTenderTime < evaluationStartTime)) {
        return message.error(intl.formatMessage({ id: 'table.purchase.xiugaidekaibiao' }))
      }

      const result = await runTime(params)
      if (result.code === 1000) {
        modifyRef.current.setVisible(false)
        setTimeout(() => {
          ref.current.reloadCurrent()
        }, 800)
      }
    })
  }

  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          fetchTableData={(params) => fetchTableData(params)}
          currentRef={ref}
          columns={tableColumns}
          rowKey={'id'}
          formilyLayouts={{
            justify: 'space-between',
          }}
          formilyProps={{
            ctx: {
              inline: false,
              schema: tableListSchema(),
              effects: ($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'inviteTenderCode', FORM_FILTER_PATH)
              },
              components: {
                DateRangePickerUnix,
                Submit,
              },
            },
          }}
        />
      </Card>

      <ModalForm
        modalTitle={intl.formatMessage({ id: 'table.purchase.feibiaoyuanyin' })}
        currentRef={destoryRef}
        confirm={handleSubmit}
        actions={destroyActions}
        schema={{
          type: 'object',
          properties: {
            NO_SUBMIT: {
              type: 'object',
              'x-component': 'mega-layout',
              'x-component-props': {
                labelAlign: 'top',
              },
              properties: {
                // destoryDate: {
                //   type: 'string',
                //   "x-component": 'date',
                //   title: '废标时间',
                //   required: true,
                //   "x-component-props": {
                //     // disabledDate: current => {
                //     //   return current && current < moment().startOf('day')
                //     // },
                //     style: { width: "100%" }
                //   },
                //   default: moment().locale('zh-cn').format('YYYY-MM-DD')
                // },
                id: {
                  type: 'number',
                  title: intl.formatMessage({ id: 'table.purchase.dangqianid' }),
                  visible: false,
                },
                disabledRemark: {
                  type: 'textarea',
                  'x-component-props': {
                    rows: 4,
                    placeholder: intl.formatMessage({ id: 'table.purchase.zaicishuruni100' }),
                  },
                  title: intl.formatMessage({ id: 'table.purchase.feibiaoyuanyin' }),
                  'x-rules': [
                    {
                      required: true,
                      message: intl.formatMessage({ id: 'table.purchase.qingshurufeibiao' }),
                    },
                    {
                      limitByte: true,
                      maxByte: 100,
                    },
                  ],
                },
              },
            },
          },
        }}
        modalProps={{ confirmLoading: loading }}
      />

      <ModalForm
        modalTitle={intl.formatMessage({ id: 'table.purchase.xiugaikaibiaoshi' })}
        currentRef={modifyRef}
        confirm={handleModifyOpenTime}
        actions={modifyActions}
        schema={{
          type: 'object',
          properties: {
            NO_SUBMIT: {
              type: 'object',
              'x-component': 'mega-layout',
              'x-component-props': {
                labelAlign: 'top',
              },
              properties: {
                id: {
                  type: 'number',
                  title: intl.formatMessage({ id: 'table.purchase.dangqianid' }),
                  visible: false,
                },
                openTenderTime: {
                  type: 'string',
                  'x-component': 'date',
                  title: intl.formatMessage({ id: 'table.purchase.kaibiaoshijian' }),
                  required: true,
                  'x-component-props': {
                    disabledDate: (current) => {
                      return current && current < moment().startOf('second')
                    },
                    style: { width: '100%' },
                    showTime: true,
                  },
                },
              },
            },
          },
        }}
        modalProps={{ confirmLoading: loadingTime }}
      />
    </PageHeaderWrapper>
  )
}

export default callForBidsSearch
