import React, { useEffect, useState, useMemo } from 'react'
import { getCurrentInstance } from '@apps/mobile-services/utils/taro'
import { View, ScrollView, Text, Icons, Toast } from '@apps/mobile-ui'
import Router from '@/utils/router'
import cx from 'classnames'
import { useSafeArea } from '@apps/mobile-services'
import {
  getSettlementMobileBusinessApplyAmountApplyAmountRowList,
  getSettlementMobileBusinessApplyAmountDetail,
  postSettlementMobileBusinessApplyAmountApplyAmountExamine1,
  postSettlementMobileBusinessApplyAmountApplyAmountExamine2,
  postSettlementMobileBusinessApplyAmountApplyAmountExamine3,
  postSettlementMobileBusinessApplyAmountSubmitApplyAmount,
} from '@apps/apis'
import styles from './index.module.scss'
import Loading from '@/components/Loading'
import NavBar from '@/components/NavBar'
import VerifyPopup from '@/components/VerifyPopup'
import FullScreenLoading from '@/components/Loading/fullscreenLoading'
import Popup from '@/components/Popup'

const RequisitionDetail: React.FC = () => {
  const params = getCurrentInstance().preloadData as any
  const { applyAmountId, applyNo, refresh, type } = params
  const { safeBottomHeight } = useSafeArea()
  const [dataSoucre, setDataSoucre] = useState<any>({})
  const [dataSoucreList, setDataSoucreList] = useState<any>([])
  const [moreList, setMoreList] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(false)
  const [showMore, setShowMore] = useState<boolean>(false)
  const [current, setCurrent] = useState<number>(1)
  const [title, setTitle] = useState('')
  const [auditLayout, setAuditLayout] = useState<boolean>(false)
  const [agree, setAgree] = useState<boolean>()

  const [hxVisible, setHxVisible] = useState<boolean>(false)
  const [writeOffRecords, setWriteOffRecords] = useState<any[]>([])

  /* 头部标题 */
  const scrollView = (evt) => {
    const contentOffsetY: number = evt.detail.scrollTop
    if (Math.round(contentOffsetY) >= 45) {
      setTitle(dataSoucre?.statusName)
    } else {
      setTitle('')
    }
  }
  const getAmountRowList = (num?: number) => {
    const _current = num || 1
    const params = { applyAmountId, applyNo, pageSize: 10, current: _current }
    getSettlementMobileBusinessApplyAmountApplyAmountRowList(params as any)
      .then((res) => {
        if (res.code !== 1000) {
          Toast.show({ title: res.message, icon: 'none' })
          return
        }
        setCurrent(_current)
        const list = dataSoucreList.concat(res.data?.data)
        if (list.length >= res.data.totalCount) {
          setMoreList(false)
        }
        setDataSoucreList([...list])
      })
      .finally(() => setLoading(false))
  }
  const getMoreAmountRow = () => {
    if (!(moreList && showMore)) {
      return
    }
    setLoading(true)
    getAmountRowList(current + 1)
  }
  useEffect(() => {
    getSettlementMobileBusinessApplyAmountDetail({ applyAmountId, applyNo } as any).then((res) => {
      if (res.code !== 1000) {
        Toast.show({ title: res.message, icon: 'none' })
        return
      }
      setDataSoucre(res.data)
    })
    getAmountRowList()
  }, [])

  const subArr = [12, 14, 16, 18]
  const _submitBtnText = useMemo(() => {
    switch (dataSoucre?.status) {
      case 12:
        return '提交审核'
      // case 14: return '审核请款单一级';
      // case 16: return '审核请款单二级';
      // case 18: return '确认请款单';
      default:
        return '审核通过'
    }
  }, [dataSoucre])

  const handleAuditLayout = (flag?: boolean) => {
    if (dataSoucre?.status === 12) {
      const _fn = postSettlementMobileBusinessApplyAmountSubmitApplyAmount
      _fn({ id: dataSoucre?.id }).then((res) => {
        if (res.code === 1000) {
          Router.navigateBack({
            success: () => {
              refresh()
            },
          })
        }
      })
    } else {
      setAuditLayout(true)
      setAgree(!flag)
    }
  }

  const writeOffView = (hxList: any[]) => {
    if (hxList?.length) {
      setHxVisible(true)
      setWriteOffRecords([...hxList])
    } else {
      Toast.show({ title: '无核销记录', icon: 'none' })
    }
  }

  // 基本信息
  const [cards, setCards] = useState([
    {
      title: '基本信息',
      showMore: true,
      key: 0,
      children: [
        {
          title: '请款单号',
          key: 'applyNo',
        },
        {
          title: '请款类型',
          key: 'applyTypeName',
        },
        {
          title: '请款单摘要',
          key: 'applyAbstract',
        },
        {
          title: '收款方',
          key: 'payee',
        },
        {
          title: '账号名称',
          key: 'accountName',
        },
        {
          title: '银行账号',
          key: 'bankAccount',
        },
        {
          title: '开户行',
          key: 'bankDeposit',
        },
        {
          title: '请款金额',
          key: 'applyAmount',
          render: (text) => (text || text === 0 ? `¥ ${text.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')}` : ''),
        },
        {
          title: '核销金额',
          key: 'writeOffAmount',
          render: (text) => (text || text === 0 ? `¥ ${text.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')}` : ''),
        },
        {
          title: '预计付款日',
          key: 'expectPayTime',
          render: (text) => text?.split(' ')[0],
        },
        {
          title: '结算方式',
          key: 'payWayName',
        },
        {
          title: '结算日期',
          key: 'settlementTime',
          render: (text) => text?.split(' ')[0],
        },
        {
          title: '支付方式',
          key: 'moneyPayWayName',
        },
        {
          title: '请款备注',
          key: 'remark',
        },
        {
          title: '对账单号',
          key: 'reconciliationNo',
        },
        {
          title: '发票号码',
          key: 'invoiceMessages',
          render: (item) => {
            return (
              <View>
                {item?.numbers?.map((val) => {
                  return (
                    <View>
                      <Text>{`${val.invoiceNumber} ${val.invoiceDate?.split(' ')[0] || ''} ${
                        val.invoiceMoney ? '￥' + val.invoiceMoney : ''
                      }`}</Text>
                    </View>
                  )
                })}
              </View>
            )
          },
        },
        {
          title: '单据时间',
          key: 'createTime',
        },
      ],
    },
    {
      title: '请款明细',
      showMore: true,
      key: 1,
      children: [
        {
          title: '单据号',
          key: 'billNo',
        },
        {
          title: '单据类型',
          key: 'billTypeName',
        },
        {
          title: '单据状态',
          key: 'billStatus',
        },
        {
          title: '单据时间',
          key: 'billTime',
        },
        {
          title: '单据金额',
          key: 'billAmount',
          render: (text) => (text || text === 0 ? `¥ ${text.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')}` : ''),
        },
        {
          title: '含税/税率',
          key: 'hasTax',
          render: (text, record?) => {
            return `${text ? '是' : '否'}/${record.taxRate || '0'}%`
          },
        },
        {
          title: '已付款',
          key: 'paid',
          render: (text) => (text || text === 0 ? `¥ ${text.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')}` : ''),
        },
        {
          title: '已请款待付款',
          key: 'appliedUnpaid',
          render: (text) => (text || text === 0 ? `¥ ${text.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')}` : ''),
        },
        {
          title: '对账金额',
          key: 'reconciliationAmount',
          render: (text) => (text || text === 0 ? `¥ ${text.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')}` : ''),
        },
        {
          title: '请款金额',
          key: 'applyPayment',
          render: (text) => (text || text === 0 ? `¥ ${text.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')}` : ''),
        },
        {
          title: '核销金额',
          key: 'writeOffAmount',
          render: (text) => (text || text === 0 ? `¥ ${text.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')}` : ''),
        },
        {
          title: '可核销金额',
          key: 'canWriteOffAmount',
          render: (text) => (text || text === 0 ? `¥ ${text.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')}` : ''),
        },
      ],
    },
  ])
  const hxCards = [
    {
      title: '请款单号',
      key: 'applyNo',
    },
    {
      title: '请款类型',
      key: 'applyTypeName',
    },
    {
      title: '单据号',
      key: 'applyRowBillNo',
    },
    {
      title: '单据摘要',
      key: 'applyRowBillAbstract',
    },
    {
      title: '单据时间',
      key: 'applyBillDate',
    },
    {
      title: '单据状态',
      key: 'applyStatusName',
    },
    {
      title: '含税',
      key: 'applyRowBillHasTax',
      render: (text) => (text ? '是' : '否'),
    },
    {
      title: '税率',
      key: 'applyRowBillTaxRate',
      render: (text) => `${text || '0'}%`,
    },
    {
      title: '请款金额',
      key: 'applyRowPayment',
      render: (text) => (text || text === 0 ? `¥ ${text.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')}` : ''),
    },
    {
      title: '核销金额',
      key: 'writeOffAmount',
      render: (text) => (text || text === 0 ? `¥ ${text.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')}` : ''),
    },
    {
      title: '可核销金额',
      key: 'canWriteAmount',
      render: (text) => (text || text === 0 ? `¥ ${text.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')}` : ''),
    },
  ]
  const handleOpen = (key) => {
    let _cards = cards
    _cards[key]['showMore'] = !_cards[key]?.['showMore']
    setCards([..._cards])
  }

  const _func = useMemo(() => {
    switch (dataSoucre.status) {
      case 14:
        return postSettlementMobileBusinessApplyAmountApplyAmountExamine1
      case 16:
        return postSettlementMobileBusinessApplyAmountApplyAmountExamine2
      case 18:
        return postSettlementMobileBusinessApplyAmountApplyAmountExamine3
      default:
        return postSettlementMobileBusinessApplyAmountApplyAmountExamine1
    }
  }, [dataSoucre])

  /** 审核提交 */
  const handleSubmit = (values) => {
    const param: any = {
      id: dataSoucre?.id,
      auditOpinion: values.reason,
      state: values.agree,
    }
    FullScreenLoading.show()
    _func(param).then((res) => {
      if (res.code !== 1000) {
        FullScreenLoading.hide()
        Toast.show({ title: res.message, icon: 'none' })
        return
      }
      Router.navigateBack({
        delta: 1,
        success: () => {
          refresh()
        },
      })
      FullScreenLoading.hide()
    })
  }
  return (
    <View className={styles['container']} style={safeBottomHeight ? { paddingBottom: `${safeBottomHeight}PX` } : {}}>
      <NavBar title={title} backIconColor="white" titleColor="white" customStyle="background: #00A98F" />
      <View className={cx(styles['scrollView-outer'], styles['paddingBottomHide'])}>
        <ScrollView
          onScroll={scrollView}
          className={styles['scrollView']}
          onEndReached={() => {
            getMoreAmountRow()
          }}
          listFooterComponent={<Loading loading={loading} noMore={!moreList} />}
        >
          <View className={styles['scrollView-box']}>
            <View className={styles['scrollView-box-status']}>
              <View className={styles['scrollView-box-status-line']}>
                <Text className={styles['scrollView-box-status-line-text']}>{dataSoucre?.statusName}</Text>
                {dataSoucre?.statusName && <Icons name="ChevronRight" size={14} color="#FFFFFF" />}
              </View>
            </View>
            {/* 内容 */}
            <View className={styles['scrollView-box-content']}>
              <View className={styles['productInfo']}>
                <View className={styles['productInfoTitle']}>
                  <View className={styles['docLine']} />
                  <Text className={styles['productName']}>{dataSoucre?.applyAbstract}</Text>
                </View>
                <View className={styles['productInfoNo']}>
                  <Text className={styles['productNo']}>请款单号：{dataSoucre?.applyNo}</Text>
                </View>
              </View>
              {/* 基本信息 */}
              {cards.map((items) => {
                return (
                  <View className={styles['materialItem']} key={items.key}>
                    <View className={styles['materialItem-tips']}>
                      <Text className={styles['materialItem-tips-text']}>{items.title}</Text>
                      <View
                        className={styles['materialItem-tips-operation']}
                        onClick={() => {
                          handleOpen(items.key)
                        }}
                      >
                        <Text className={styles['materialItem-tips-operation-text']}>
                          {items?.showMore ? '收起' : '展开'}
                        </Text>
                        <Icons name={items?.showMore ? 'ChevronUp' : 'ChevronDown'} size={14} color="#91959B" />
                      </View>
                    </View>
                    {items?.showMore && (
                      <View className={styles['materialItem-box']}>
                        {items.key === 0 &&
                          items.children?.map((item) => {
                            return (
                              <View className={styles['materialItem-box-row']} key={item.key}>
                                <View className={styles['materialItem-box-row-label']}>
                                  <Text>{item.title}</Text>
                                </View>
                                <View className={styles['materialItem-box-row-text']}>
                                  {item.render ? item.render(dataSoucre[item?.key]) : dataSoucre[item?.key]}
                                </View>
                              </View>
                            )
                          })}
                        {items.key === 1 &&
                          dataSoucreList?.map((val, i) => {
                            if (i < 2 || showMore) {
                              return (
                                <View key={val.id}>
                                  <View
                                    className={cx(styles['materialItem-tips-text'], styles['materialItem-tips-text1'])}
                                    style={i === 0 ? { border: 'unset' } : ''}
                                  >
                                    <Text>{val.billAbstract}</Text>
                                  </View>
                                  {items.children?.map((item) => {
                                    return (
                                      <View className={styles['materialItem-box-row']} key={item.key}>
                                        <View className={styles['materialItem-box-row-label']}>
                                          <Text>{item.title}</Text>
                                        </View>
                                        <View className={styles['materialItem-box-row-text']}>
                                          {item.render ? item.render(val[item?.key], val) : val[item?.key]}
                                        </View>
                                      </View>
                                    )
                                  })}
                                  <View className={styles['materialItem-box-row']}>
                                    <View className={styles['materialItem-box-row-label']}></View>
                                    <View
                                      className={styles['materialItem-box-row-text']}
                                      onClick={() => writeOffView(val?.writeOffRecords)}
                                    >
                                      <Text className={styles['materialItem-tips-operation-text']}>查看核销明细</Text>
                                      <Icons name="ChevronRight" size={14} color="#91959B" />
                                    </View>
                                  </View>
                                </View>
                              )
                            }
                          })}
                        {items.key === 1 && dataSoucreList.length > 2 && (
                          <View className={styles['materialItem-tips-btn']} onClick={() => setShowMore(!showMore)}>
                            <Text>{showMore ? '收起' : '展开更多'}</Text>
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                )
              })}
            </View>
          </View>
        </ScrollView>
        {!!type && subArr.includes(dataSoucre.status) && (
          <View className={styles['scrollView-outer-fixButton']}>
            <View className={styles['scrollView-outer-fixButton-btnBox']}>
              {dataSoucre.status !== 12 && (
                <View
                  className={cx(
                    styles['scrollView-outer-fixButton-btnBox-btn'],
                    styles['scrollView-outer-fixButton-btnBox-btn__cancel'],
                  )}
                  onClick={() => {
                    handleAuditLayout(true)
                  }}
                >
                  <Text
                    className={cx(
                      styles['scrollView-outer-fixButton-btnBox-btn-text'],
                      styles['scrollView-outer-fixButton-btnBox-btn__cancel-text'],
                    )}
                  >
                    审核不通过
                  </Text>
                </View>
              )}
              <View
                className={styles['scrollView-outer-fixButton-btnBox-btn']}
                onClick={() => {
                  handleAuditLayout()
                }}
              >
                <Text className={styles['scrollView-outer-fixButton-btnBox-btn-text']}>{_submitBtnText}</Text>
              </View>
            </View>
          </View>
        )}
      </View>
      <FullScreenLoading />
      <VerifyPopup
        visible={auditLayout}
        agree={!!agree}
        onClose={() => setAuditLayout(false)}
        onConfirm={handleSubmit}
      />
      <Popup
        visible={hxVisible}
        onClose={() => setHxVisible(false)}
        title={'核销明细'}
        customTitleStyle={{
          borderBottom: 'none',
        }}
      >
        <View className={styles['materialItem']} style={{ margin: 8, marginBottom: 'unset', paddingBottom: 12 }}>
          {writeOffRecords?.map((val, i) => {
            return (
              <View key={val.id}>
                <View
                  className={cx(styles['materialItem-tips-text'], styles['materialItem-tips-text1'])}
                  style={i === 0 ? { border: 'unset' } : ''}
                >
                  <Text>{val.applyAbstract}</Text>
                </View>
                {hxCards?.map((item) => {
                  return (
                    <View className={styles['materialItem-box-row']} key={item.key}>
                      <View className={styles['materialItem-box-row-label']}>
                        <Text>{item.title}</Text>
                      </View>
                      <View className={styles['materialItem-box-row-text']}>
                        {item.render ? item.render(val[item?.key]) : val[item?.key]}
                      </View>
                    </View>
                  )
                })}
              </View>
            )
          })}
        </View>
      </Popup>
    </View>
  )
}
export default RequisitionDetail
