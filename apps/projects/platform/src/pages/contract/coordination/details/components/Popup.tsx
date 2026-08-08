/* 查看付款明细弹出  */
import React, { useRef, useState } from 'react'
import { Button, Drawer, Space, Typography } from 'antd'

import { IAntdSchemaFormProps } from '@apps/formily'
import StandardTable from '@/components/StandardTable'
import style from '../index.less'
import { ColumnType } from 'antd/lib/table/interface'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import moment from 'moment'
import { getContractExecuteExecuteInfoPayDetailInfoPagePayDetail } from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'
import {
  getSettlementBusinessApplyAmountApplyAmountRowList,
  getSettlementBusinessApplyAmountDetailApplyAmount,
} from '@apps/apis'

const intl = getIntl()
export interface Iprops extends IAntdSchemaFormProps {
  popupshow: any
  basicData?: any
  setDrawerModal: Function
  applyId: any
  applyNo: string
}
const { Text } = Typography
const PopupDrawer: React.FC<Iprops> = ({ popupshow, basicData, setDrawerModal, applyId, applyNo }) => {
  console.log(basicData, applyId)
  const ref = useRef<any>({})
  const [payAmount, setpayAmount] = useState(0) //付款金额
  const [orderAmount, setorderAmount] = useState(0) // 订单金额
  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'contract.danjuhaozhaiyao' }),
      dataIndex: 'billNo',
      align: 'left',
      render: (text: any, record: any) => {
        return (
          <div>
            <EyeAuthButton
              url={
                record.billType === 1
                  ? `/orderAbility/saleOrder/orderList/detail?id=${record.billId}`
                  : `/afterAbility/returnManage/returnQuery/detail?id=${record.billId}`
              }
            >
              {text}
            </EyeAuthButton>
            {/* <p>{record.}</p> */}
          </div>
        )
      },
    },
    {
      title: intl.formatMessage({ id: 'contract.danjuleixing' }),
      dataIndex: 'billTypeName',
      align: 'left',
    },
    {
      title: intl.formatMessage({ id: 'contract.danjushijian' }),
      dataIndex: 'billTime',
      align: 'left',
    },
    {
      title: intl.formatMessage({ id: 'contract.danjuzhuangtai' }),
      dataIndex: 'billStatus',
      align: 'left',
    },
    {
      dataIndex: 'billRowAmount',
      title: (
        <Space direction="vertical">
          <Text>{intl.formatMessage({ id: 'contract.danjujine' })}</Text>
          {/* <Text>{intl.formatMessage({ id: 'contract.heji' })}: {intl.formatMessage({ id: 'common.money' })}{orderAmount}</Text> */}
        </Space>
      ),
    },
    {
      title: intl.formatMessage({ id: 'contract.hanshuishuil' }),
      dataIndex: 'hasTaxName',
      align: 'left',
    },
    {
      dataIndex: 'applyPayment',
      align: 'left',
      title: (
        <Space direction="vertical">
          <Text>{intl.formatMessage({ id: 'contract.fukuanjine' })}</Text>
          {/* <Text>{intl.formatMessage({ id: 'contract.heji' })}: {intl.formatMessage({ id: 'common.money' })}{payAmount}</Text> */}
        </Space>
      ),
    },
  ]

  // 模拟请求
  const fetchData = (params?: any) => {
    return new Promise((resolve, reject) => {
      // /settle/accounts/business/apply/amount/detail/apply/amount
      // getContractExecuteExecuteInfoPayDetailInfoPagePayDetail
      // /api/settle/accounts/business/apply/amount/apply/amount/row/list
      getSettlementBusinessApplyAmountApplyAmountRowList({
        applyAmountId: applyId,
        applyNo,
        ...params,
      })
        .then((res) => {
          if (res.code === 1000) {
            resolve(res.data)
            let payAmount = 0,
              orderAmount = 0
            res.data.data.map((item: any) => {
              payAmount += item.billRowAmount
              orderAmount += item.applyPayment
            })
            console.log(payAmount, orderAmount)
            setpayAmount(payAmount)
            setorderAmount(orderAmount)
          }
        })
        .catch((err) => {
          resolve([])
        })
    })
  }

  return (
    <Drawer
      visible={popupshow}
      onClose={() => setDrawerModal()}
      title={intl.formatMessage({ id: 'contract.hetongfukuanxiangqing' })}
      width={900}
      footer={
        <div
          style={{
            textAlign: 'right',
          }}
        >
          <Button onClick={() => setDrawerModal()} style={{ marginRight: 8 }}>
            {intl.formatMessage({ id: 'contract.quxiao' })}
          </Button>
          <Button type="primary" onClick={() => setDrawerModal()}>
            {intl.formatMessage({ id: 'contract.queding' })}
          </Button>
        </div>
      }
      destroyOnClose
    >
      <div className={style.PopupTitle}>{intl.formatMessage({ id: 'contract.jibenxinxi' })}</div>
      <div className={style.menu}>
        <div className={style.memuItem}>
          <div className={style.menuCard}>
            <div className={style.menulabel}>{intl.formatMessage({ id: 'contract.shoukuanzhanghu' })}：</div>
            <div className={style.card}>{basicData.accountName}</div>
          </div>
          <div className={style.menuCard}>
            <div className={style.menulabel}>{intl.formatMessage({ id: 'contract.yinhangzhanghao' })}：</div>
            <div className={style.card}>{basicData.bankAccount}</div>
          </div>
          <div className={style.menuCard}>
            <div className={style.menulabel}>{intl.formatMessage({ id: 'contract.kaihuhang' })}：</div>
            <div className={style.card}>{basicData.bankDeposit}</div>
          </div>

          <div className={style.menuCard}>
            <div className={style.menulabel}>{intl.formatMessage({ id: 'contract.fukuanjieduan' })}：</div>
            <div className={style.card}>{basicData.payStage}</div>
          </div>
        </div>
        <div className={style.memuItem}>
          <div className={style.menuCard}>
            <div className={style.menulabel}>{intl.formatMessage({ id: 'contract.fukuanjine' })}：</div>
            <div className={style.card}>
              {intl.formatMessage({ id: 'common.money' })} {basicData.applyAmount}
            </div>
          </div>
          <div className={style.menuCard}>
            <div className={style.menulabel}>{intl.formatMessage({ id: 'contract.fukuanshijian' })}：</div>
            <div className={style.card}>{moment(basicData.payTime).format('YYYY-MM-DD')}</div>
          </div>

          <div className={style.menuCard}>
            <div className={style.menulabel}>{intl.formatMessage({ id: 'contract.fukuanfangshi' })}：</div>
            {/* {basicData.payParam} */}
            <div className={style.card}>
              {basicData.payWay == 1
                ? intl.formatMessage({ id: 'contract.zhangqi' })
                : basicData.payWay == 2
                ? intl.formatMessage({ id: 'contract.yuejie' })
                : intl.formatMessage({ id: 'contract.xianjie' })}{' '}
            </div>
          </div>
        </div>
        <div className={style.memuItem}>
          <div className={style.menuCard}>
            <div className={style.menulabel}>{intl.formatMessage({ id: 'contract.zhifufangshi' })}：</div>
            <div className={style.card}>{intl.formatMessage({ id: 'contract.xianxiazhifufangshixian' })}</div>
          </div>
          <div className={style.menuCard}>
            <div className={style.menulabel}>{intl.formatMessage({ id: 'contract.fapiaobianhaokaipiaori' })}:</div>
            {basicData.invoiceProveVOList.map((item: any) => {
              return (
                <div className={style.card}>
                  {item.number} + '-'+{item.invoiceDate}
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <div className={style.PopupTitle}>{intl.formatMessage({ id: 'contract.fukuanmingxi' })}</div>
      <StandardTable
        rowKey="id"
        style={{
          width: '100%',
        }}
        pagination={false}
        columns={columns}
        ref={ref}
        fetchTableData={(params: any) => fetchData(params)}
      />
    </Drawer>
  )
}
PopupDrawer.defaultProps = {
  popupshow: false,
  basicData: {
    invoiceProveVOList: [],
  },
  applyId: '',
}

export default PopupDrawer
