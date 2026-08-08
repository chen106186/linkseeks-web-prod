import { formatTimeString } from '@/utils'
import StatusColors from '@/components/StatusColors'
import { EyeAuthButton, AuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import StatusTag from '@/components/StatusTag'
import { useIntl } from '@linkseeks/i18n'
import { useLocation } from '@linkseeks/router-core'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { getPurchaseRequisitionOrderPageSelectOption } from '@/pages/procurementAbility/effect'
import { customAuthUrl as AuthUrl } from '@apps/domains'
import { Button } from 'antd'
import { authService } from '@apps/services'
import { onRemoveMenuData } from '@/utils/auth'
import { postMemberLoginSwitchrole } from '@apps/apis'
import { recentVisitLocalStorage } from '@linkseeks/storage'
import { useWebIntl } from '@apps/locales'
import { history } from '@linkseeks/router-manager'

/** 采购 请购单查询 带内部状态schmea */
export const tableSearchListSchema: any = (align?: String, colStyle?: Object) => {
  const intl = useIntl()

  const data = getPurchaseRequisitionOrderPageSelectOption()
  if (data) {
    return {
      type: 'object',
      properties: {
        mageLayout: {
          type: 'object',
          'x-component': 'mega-layout',
          properties: {
            topLayout: {
              type: 'object',
              'x-component': 'mega-layout',
              'x-component-props': {
                grid: true,
              },
              properties: {
                requisitionNo: {
                  type: 'string',
                  'x-component': 'Search',
                  'x-component-props': {
                    placeholder: intl.formatMessage({
                      id: 'purchaseRequisition.qingshuruqinggouNo',
                      defaultMessage: '请输入请购单号',
                    }),
                    align: 'flex-start',
                  },
                },
              },
            },
            [FORM_FILTER_PATH]: {
              type: 'object',
              'x-component': 'flex-layout',
              'x-component-props': {
                rowStyle: {
                  flexWrap: 'nowrap',
                  justifyContent: 'flex-start',
                },
                colStyle: {
                  marginRight: 20,
                },
              },

              properties: {
                digest: {
                  type: 'string',
                  'x-component-props': {
                    placeholder: intl.formatMessage({
                      id: 'purchaseRequisition.qingshuruqinggouDigest',
                      defaultMessage: '请输入请购单摘要',
                    }),
                  },
                },
                memberName: {
                  type: 'string',
                  'x-component-props': {
                    placeholder: intl.formatMessage({
                      id: 'purchaseRequisition.qingshurugongying',
                      defaultMessage: '请输入供应会员名称',
                    }),
                  },
                },
                department: {
                  type: 'string',
                  'x-component-props': {
                    placeholder: intl.formatMessage({
                      id: 'purchaseRequisition.qingshuruqinggouDepartment',
                      defaultMessage: '请输入请购部门',
                    }),
                  },
                },
                requisitioner: {
                  type: 'string',
                  'x-component-props': {
                    placeholder: '请输入请购人',
                  },
                },
                purpose: {
                  type: 'string',
                  'x-component-props': {
                    placeholder: intl.formatMessage({
                      id: 'purchaseRequisition.qingshuruqinggouUse',
                      defaultMessage: '请输入请购用途',
                    }),
                  },
                },
                innerStatus: {
                  type: 'string',
                  'x-component-props': {
                    placeholder: intl.formatMessage({
                      id: 'purchaseRequisition.qingxuanzeneibu',
                      defaultMessage: '请选择内部状态',
                    }),
                  },
                  enum: data.map((item) => ({
                    label: item['name'],
                    value: item['state'],
                  })),
                },
                '[startDate,endDate]': {
                  type: 'daterange',
                  // "x-component": 'DateRangePickerUnix',
                  'x-component-props': {
                    placeholder: [
                      intl.formatMessage({ id: 'purchaseRequisition.kaishishijian', defaultMessage: '开始时间' }),
                      intl.formatMessage({ id: 'purchaseRequisition.jieshushijian', defaultMessage: '结束时间' }),
                    ],
                  },
                },
                submit: {
                  'x-component': 'Submit',
                  'x-component-props': {
                    children: intl.formatMessage({ id: 'purchaseRequisition.chaxun', defaultMessage: '查询' }),
                  },
                },
              },
            },
          },
        },
      },
    }
  }
}

/** 采购 销售订单转请购单schmea */
export const saleOrderTransformRequisitionSchema: any = (data?: any) => {
  const intl = useIntl()
  return {
    type: 'object',
    properties: {
      mageLayout: {
        type: 'object',
        'x-component': 'mega-layout',
        properties: {
          topLayout: {
            type: 'object',
            'x-component': 'mega-layout',
            'x-component-props': {
              grid: true,
            },
            properties: {
              ctl: {
                type: 'object',
                'x-component': 'controllerBtns',
              },
              orderNo: {
                type: 'string',
                'x-component': 'Search',
                'x-component-props': {
                  placeholder: intl.formatMessage({ id: 'purchaseOrder.qingshurudingdanOrderNo' }),
                },
              },
            },
          },
          [FORM_FILTER_PATH]: {
            type: 'object',
            'x-component': 'flex-layout',
            'x-component-props': {
              colStyle: {
                marginLeft: 20,
              },
            },

            properties: {
              digest: {
                type: 'string',
                'x-component-props': {
                  placeholder: intl.formatMessage({ id: 'purchaseOrder.qingshurudingdanDigest' }),
                },
              },
              buyerMemberName: {
                type: 'string',
                'x-component-props': {
                  placeholder: intl.formatMessage({ id: 'purchaseOrder.qingshurucaigouMemberName' }),
                },
              },
              outerStatus: {
                type: 'string',
                'x-component-props': {
                  placeholder: intl.formatMessage({ id: 'contract.qingxuanzewaibuzhuangtai' }),
                },
                enum: data?.map((item) => ({
                  label: item['text'],
                  value: item['id'],
                })),
              },
              '[startTime,endTime]': {
                type: 'daterange',
                // "x-component": 'DateRangePickerUnix',
                'x-component-props': {
                  placeholder: [
                    intl.formatMessage({ id: 'purchaseRequisition.kaishishijian', defaultMessage: '开始时间' }),
                    intl.formatMessage({ id: 'purchaseRequisition.jieshushijian', defaultMessage: '结束时间' }),
                  ],
                },
              },
              submit: {
                'x-component': 'Submit',
                'x-component-props': {
                  children: intl.formatMessage({ id: 'purchaseRequisition.chaxun', defaultMessage: '查询' }),
                },
              },
            },
          },
        },
      },
    },
  }
}

/** 采购 请购单关联销售订单 schmea */
export const saleOrderTransformRequisitionSchemaEdit: any = (data?: any) => {
  const intl = useIntl()
  return {
    type: 'object',
    properties: {
      mageLayout: {
        type: 'object',
        'x-component': 'mega-layout',
        properties: {
          topLayout: {
            type: 'object',
            'x-component': 'mega-layout',
            'x-component-props': {
              grid: true,
            },
            properties: {
              ctl: {
                type: 'object',
                'x-component': 'controllerBtns',
              },
              orderNo: {
                type: 'string',
                'x-component': 'Search',
                'x-component-props': {
                  placeholder: intl.formatMessage({ id: 'purchaseOrder.qingshurudingdanOrderNo' }),
                },
              },
            },
          },
          [FORM_FILTER_PATH]: {
            type: 'object',
            'x-component': 'flex-layout',
            'x-component-props': {
              colStyle: {
                marginLeft: 20,
              },
            },

            properties: {
              digest: {
                type: 'string',
                'x-component-props': {
                  placeholder: intl.formatMessage({ id: 'purchaseOrder.qingshurudingdanDigest' }),
                },
              },
              skuId: {
                type: 'string',
                'x-component-props': {
                  placeholder: intl.formatMessage({ id: 'purchaseOrder.qingshurushangpinid' }),
                },
              },
              buyerMemberName: {
                type: 'string',
                'x-component-props': {
                  placeholder: intl.formatMessage({ id: 'purchaseOrder.qingshurucaigouMemberName' }),
                },
              },
              outerStatus: {
                type: 'string',
                'x-component-props': {
                  placeholder: intl.formatMessage({ id: 'contract.qingxuanzewaibuzhuangtai' }),
                },
                enum: data?.map((item) => ({
                  label: item['text'],
                  value: item['id'],
                })),
              },
              '[startTime,endTime]': {
                type: 'daterange',
                // "x-component": 'DateRangePickerUnix',
                'x-component-props': {
                  placeholder: [
                    intl.formatMessage({ id: 'purchaseRequisition.kaishishijian', defaultMessage: '开始时间' }),
                    intl.formatMessage({ id: 'purchaseRequisition.jieshushijian', defaultMessage: '结束时间' }),
                  ],
                },
              },
              submit: {
                'x-component': 'Submit',
                'x-component-props': {
                  children: intl.formatMessage({ id: 'purchaseRequisition.chaxun', defaultMessage: '查询' }),
                },
              },
            },
          },
        },
      },
    },
  }
}

/** 采购 请购单查询 无内部状态schmea */
export const tableListSchema: any = (align?: String, colStyle?: Object) => {
  const intl = useIntl()
  return {
    type: 'object',
    properties: {
      mageLayout: {
        type: 'object',
        'x-component': 'mega-layout',
        properties: {
          topLayout: {
            type: 'object',
            'x-component': 'mega-layout',
            'x-component-props': {
              grid: true,
            },
            properties: {
              ctl: {
                type: 'object',
                'x-component': 'Children',
                'x-component-props': {
                  children: '{{controllerBtns}}',
                },
              },
              requisitionNo: {
                type: 'string',
                'x-component': 'Search',
                'x-component-props': {
                  placeholder: intl.formatMessage({
                    id: 'purchaseRequisition.qingshuruqinggouNo',
                    defaultMessage: '请输入请购单号',
                  }),
                },
              },
            },
          },
          [FORM_FILTER_PATH]: {
            type: 'object',
            'x-component': 'flex-layout',
            'x-component-props': {
              rowStyle: {
                flexWrap: 'nowrap',
              },
              colStyle: {
                marginLeft: 20,
              },
            },
            properties: {
              digest: {
                type: 'string',
                'x-component-props': {
                  placeholder: intl.formatMessage({
                    id: 'purchaseRequisition.qingshuruqinggouDigest',
                    defaultMessage: '请输入请购单摘要',
                  }),
                },
              },
              memberName: {
                type: 'string',
                'x-component-props': {
                  placeholder: intl.formatMessage({
                    id: 'purchaseRequisition.qingshurugongying',
                    defaultMessage: '请输入供应会员名称',
                  }),
                },
              },
              department: {
                type: 'string',
                'x-component-props': {
                  placeholder: intl.formatMessage({
                    id: 'purchaseRequisition.qingshuruqinggouDepartment',
                    defaultMessage: '请输入请购部门',
                  }),
                },
              },

              requisitioner: {
                type: 'string',
                'x-component-props': {
                  placeholder: intl.formatMessage({
                    id: 'purchaseRequisition.qingshuruqinggouPenson',
                    defaultMessage: '请输入请购人',
                  }),
                },
              },
              purpose: {
                type: 'string',
                'x-component-props': {
                  placeholder: intl.formatMessage({
                    id: 'purchaseRequisition.qingshuruqinggouUse',
                    defaultMessage: '请输入请购用途',
                  }),
                },
              },
              '[startDate,endDate]': {
                type: 'daterange',
                'x-component-props': {
                  placeholder: [
                    intl.formatMessage({ id: 'purchaseRequisition.kaishishijian', defaultMessage: '开始时间' }),
                    intl.formatMessage({ id: 'purchaseRequisition.jieshushijian', defaultMessage: '结束时间' }),
                  ],
                },
              },
              submit: {
                'x-component': 'Submit',
                'x-mega-props': {
                  span: 1,
                },
                'x-component-props': {
                  children: intl.formatMessage({ id: 'purchaseRequisition.chaxun', defaultMessage: '查询' }),
                },
              },
            },
          },
        },
      },
    },
  }
}

/** 采购 请购单查询 列 */
export const baseOrderListColumns: any = (code: string) => {
  const intl = useIntl()
  const translate = useWebIntl()

  return [
    {
      title: intl.formatMessage({ id: 'purchaseRequisition.qinggoudanhao', defaultMessage: '请购单号' }),
      align: 'left',
      dataIndex: 'requisitionNo',
      key: 'requisitionNo',
      width: 120,
      render: (text, record) => {
        const { pathname } = useLocation()
        return (
          <AuthButton type="custom" code="preview">
            <EyeAuthButton type={AuthUrl(code) ? 'link' : 'button'} url={`${pathname}/preview?id=${record.id}`}>
              {text}
            </EyeAuthButton>
          </AuthButton>
        )
      },
    },
    {
      title: intl.formatMessage({ id: 'purchaseRequisition.qinggoudanzhaiyao', defaultMessage: '请购单摘要' }),
      align: 'left',
      dataIndex: 'digest',
      key: 'digest',
      width: 150,
    },
    {
      title: intl.formatMessage({ id: 'purchaseRequisition.gongyinghuiyuan', defaultMessage: '供应会员' }),
      align: 'left',
      dataIndex: 'vendorMemberName',
      key: 'vendorMemberName',
      width: 160,
    },
    {
      title: intl.formatMessage({ id: 'purchaseRequisition.yujiaoriqi', defaultMessage: '预交日期' }),
      align: 'left',
      dataIndex: 'advanceDeliveryDate',
      key: 'advanceDeliveryDate',
      width: 104,
      render: (text) => formatTimeString(text, 'YYYY-MM-DD'),
    },
    {
      title: intl.formatMessage({ id: 'purchaseRequisition.qinggoubumen', defaultMessage: '请购部门' }),
      align: 'left',
      dataIndex: 'department',
      key: 'department',
      width: 88,
    },
    {
      title: translate('web.resource.order.qinggouren'),
      align: 'left',
      dataIndex: 'requisitioner',
      key: 'requisitioner',
      width: 88,
    },
    {
      title: intl.formatMessage({ id: 'purchaseRequisition.qinggouyongtu', defaultMessage: '请购用途' }),
      align: 'left',
      dataIndex: 'purpose',
      key: 'purpose',
      width: 152,
    },
    {
      title: intl.formatMessage({ id: 'purchaseRequisition.qinggoushuliang', defaultMessage: '请购数量' }),
      align: 'left',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
    },
    {
      title: intl.formatMessage({ id: 'purchaseRequisition.yizhuandingdanshu', defaultMessage: '已转订单数量' }),
      align: 'left',
      dataIndex: 'transferQuantity',
      key: 'transferQuantity',
      width: 120,
    },
    {
      title: intl.formatMessage({ id: 'purchaseRequisition.danjushijian', defaultMessage: '单据时间' }),
      align: 'left',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 150,
    },
    {
      title: intl.formatMessage({ id: 'purchaseRequisition.neibuzhuangtai', defaultMessage: '内部状态' }),
      align: 'left',
      dataIndex: 'innerStatus',
      key: 'innerStatus',
      width: 128,
      render: (text, record) => (
        <StatusColors status={text} type="saleInside" mode="Badge" text={record['innerStatusName']} />
      ),
    },
  ]
}

export const saleOrderTransformRequisitionStatus = {
  1: 'primary', //待提交
  2: 'primary', //待确认
  3: 'danger', //不接受订单
  4: 'primary', //待确认电子合同
  5: 'danger', //不同意签订电子合同
  6: 'warning', //待支付
  7: 'primary', //待确认支付结果
  8: 'danger', //确认未到账
  9: 'default', //待新增销售发货单
  10: 'primary', //待新增物流单
  11: 'primary', //待确认发货
  12: 'primary', //待新增采购入库单
  13: 'primary', //待确认收货
  14: 'primary', //待确认回单
  15: 'primary', //待归档
  16: 'primary', //待新增采购收货单
  100: 'success', //已完成
  101: 'danger', //已取消
  102: 'danger', //已中止
}

/** 销售订单转请购单 */
export const saleOrderTransformRequisitionColumns: any = (code: string) => {
  const intl = useIntl()

  const handleJump = (record) => {
    if (!AuthUrl(code)) return
    // 切换角色 b2b供应商
    const userInfo: any = authService.getAuth() || {}
    const roles = userInfo.roles.filter((_item) => _item.memberRoleId === 9)
    postMemberLoginSwitchrole(
      {
        memberRoleId: roles[0].memberRoleId,
      },
      { ctlType: 'none' },
    ).then((res: any) => {
      if (res.code == 1000) {
        authService.setAuth(res.data)
        recentVisitLocalStorage.removeItem()
        // 清空路由缓存
        onRemoveMenuData()
        const result = '/procurementAbility/purchaseRequisition/saleOrderTransformRequisition'
        sessionStorage.setItem('backUrl', JSON.stringify(result))
        setTimeout(() => {
          history.redirect(
            `/orderAbility/saleOrder/orderList/detail?backRole=${userInfo.memberRoleId}&id=${record.orderId}`,
          )
        }, 800)
      }
    })
  }

  return [
    {
      title: intl.formatMessage({ id: 'purchaseOrder.dingdanhao' }),
      align: 'center',
      dataIndex: 'orderNo',
      key: 'orderNo',
      width: 112,
      render: (text, record) => {
        return (
          // <EyeAuthButton type={AuthUrl(code) ? 'link' : 'button'} url={`/orderAbility/saleOrder/orderList/detail?id=${record.orderId}`}>
          //   {text}
          // </EyeAuthButton>

          <Button type="link" onClick={() => handleJump(record)}>
            {text}
          </Button>
        )
      },
    },
    {
      title: intl.formatMessage({ id: 'purchaseOrder.dingdandingdandigest' }),
      align: 'center',
      dataIndex: 'digest',
      key: 'digest',
      width: 160,
    },
    {
      title: intl.formatMessage({ id: 'purchaseOrder.caigouhuiyuan' }),
      align: 'center',
      dataIndex: 'buyerMemberName',
      key: 'buyerMemberName',
      width: 160,
    },
    {
      title: intl.formatMessage({ id: 'purchaseOrder.xiadanshijian' }),
      align: 'center',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 160,
    },
    {
      title: intl.formatMessage({ id: 'purchaseOrder.productId' }),
      align: 'center',
      dataIndex: 'skuId',
      key: 'skuId',
      width: 80,
    },
    {
      title: intl.formatMessage({ id: 'purchaseOrder.shangpinmingcheng' }),
      align: 'center',
      dataIndex: 'productName',
      key: 'productName',
      width: 192,
    },
    {
      title: intl.formatMessage({ id: 'priceManage.effect.unitPrice' }),
      align: 'center',
      dataIndex: 'price',
      key: 'price',
      width: 112,
      render: (text) => `${intl.formatMessage({ id: 'common.money' })}${text}`,
    },
    {
      title: intl.formatMessage({ id: 'saleOrder.caigoushuliang' }),
      align: 'center',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 112,
    },
    {
      title: intl.formatMessage({ id: 'purchaseOrder.readyAddOrder.productInfoColumns.price' }),
      align: 'center',
      dataIndex: 'amount',
      key: 'amount',
      width: 112,
      render: (text) => `${intl.formatMessage({ id: 'common.money' })}${text}`,
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.externalStatus' }),
      align: 'center',
      dataIndex: 'outerStatusName',
      key: 'outerStatusName',
      width: 160,
      render: (text, record) => (
        <StatusTag title={text} type={saleOrderTransformRequisitionStatus[record.outerStatus] || 'default'} />
      ),
    },
  ]
}
