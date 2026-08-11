import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useEffect, useState } from 'react'
import { View, Image, Text, Icons  } from '@apps/mobile-ui'
import { Picker } from '@tarojs/components'
import { getCurrentInstance, setNavigationBarTitle } from '@apps/mobile-services/utils/taro'
import Router from '@/utils/router'
import { useIntl } from '@linkseeks/i18n'
import { postPayMobileAssetAccountGetAccountTradeRecord } from '@apps/apis'
import { getOssUrlPath } from '@apps/constants'
import styles from './index.module.scss'
import DatePicker from '@/components/DatePicker'
import { pxTransform } from '@apps/mobile-services/utils/taro'
const paymentIcon = 'https://obs-wnwl.obs.cn-east-3.myhuaweicloud.com/mini-program/img-add/payment.png'
const extractIcon = 'https://obs-wnwl.obs.cn-east-3.myhuaweicloud.com/mini-program/img-add/extract.png'
const rebateIcon = 'https://obs-wnwl.obs.cn-east-3.myhuaweicloud.com/mini-program/img-add/rebate.png'

const TradingRecord = () => {
  const { acccountId, index }: any = getCurrentInstance()?.router?.params
  const [dataSource, setdataSource] = useState<any>([])
  const intl = useIntl()
  const title = [
    intl.formatMessage({
      id: 'pay.jiaoyijilu',
      defaultMessage: '交易记录',
    }),
    // intl.formatMessage({
    //   id: 'pay.chongzhijilu',
    //   defaultMessage: '充值记录',
    // }),
    intl.formatMessage({
      id: 'pay.tixianjilu',
      defaultMessage: '提现记录',
    }),
  ]
  const STATUS_MAP: any = {
    1: {
      title: intl.formatMessage({
        id: 'pay.shenqingtixian',
        defaultMessage: '申请提现',
      }),
      type: 'warning',
    },
    2: {
      title: intl.formatMessage({
        id: 'pay.shenhetongguo',
        defaultMessage: '审核通过',
      }),
      type: 'success',
    },
    3: {
      title: intl.formatMessage({
        id: 'pay.shenhebutongguo',
        defaultMessage: '审核不通过',
      }),
      type: 'default',
    },
    4: {
      title: intl.formatMessage({
        id: 'pay.tixianchenggong',
        defaultMessage: '提现成功',
      }),
      type: 'success',
    },
    5: {
      title: intl.formatMessage({
        id: 'pay.tixianshibai',
        defaultMessage: '提现失败',
      }),
      type: 'danger',
    },
    6: {
      title: intl.formatMessage({
        id: 'pay.zhifuzhong',
        defaultMessage: '支付中',
      }),
      type: 'processing',
    },
    7: {
      title: intl.formatMessage({
        id: 'pay.zhifushibai',
        defaultMessage: '支付失败',
      }),
      type: 'danger',
    },
    8: {
      title: intl.formatMessage({
        id: 'pay.querendaozhang',
        defaultMessage: '确认到账',
      }),
      type: 'success',
    },
    9: {
      title: intl.formatMessage({
        id: 'pay.zhifuchenggong',
        defaultMessage: '支付成功',
      }),
      type: 'success',
    },
  }
  const OPERATION_MAP = {
    1: {
      title: intl.formatMessage({
        id: 'pay.zhanghuchongzhi',
        defaultMessage: '账户充值',
      }),
      operator: '+',
      url: getOssUrlPath('/Images/Recharge.png'),
      color: '#C45124',
    },
    2: {
      title: intl.formatMessage({
        id: 'pay.zhanghutixian',
        defaultMessage: '账户提现',
      }),
      operator: '-',
      // url: getOssUrlPath('/Images/pay%402x.png'),
			url: extractIcon,
      color: '#B97828',
    },
    3: {
      title: intl.formatMessage({
        id: 'pay.dingdanzhifu',
        defaultMessage: '订单支付',
      }),
      operator: '-',
      // url: getOssUrlPath('/Images/orderIcon.png'),
			url: paymentIcon,
      color: '#C45124',
    },
    4: {
      title: intl.formatMessage({
        id: 'pay.dingdantuikuan',
        defaultMessage: '订单退款',
      }),
      operator: '+',
      url: getOssUrlPath('/Images/pay%402x.png'),
      color: '#A83F1B',
    },
    5: {
      title: intl.formatMessage({
        id: 'pay.dingdanfanli',
        defaultMessage: '订单返利',
      }),
      operator: '+',
      // url: getOssUrlPath('/Images/Rebate.png'),
			url: rebateIcon,
      color: '#C45124',
    },
		6: {
			title: intl.formatMessage({
				id: 'pay.fenxiaodingdanfanli',
				defaultMessage: '分销订单返利',
			}),
			operator: '+',
			url: rebateIcon,
			color: '#C45124',
		},
		7: {
			title: intl.formatMessage({
				id: 'pay.tuangoudingdanfanli',
				defaultMessage: '团购订单返利',
			}),
			operator: '+',
			url: rebateIcon,
			color: '#C45124',
		},
  }
  const [date, setDate] = useState<any>('')
  // 选中值
  const getzf = (num) => {
    if (parseInt(num) < 10) {
      num = '0' + num
    }
    return num
  }
  /* 时间搓转为时间格式 */
  const Datetimestamp = (timestamp: number, format: number) => {
    /* format 当前年 推进 1  */
    const now = new Date(timestamp)
    const year = format === 1 ? now.getFullYear() - 1 : now.getFullYear()
    const month = now.getMonth() + 1
    const date = now.getDate()
    const hour = now.getHours()
    const minute = now.getMinutes()
    const second = now.getSeconds()
    // return `${year}-${getzf(month)}-${getzf(date)} ${getzf(hour)}:${getzf(minute)}:${getzf(second)}`
		return `${getzf(month)}-${getzf(date)} ${getzf(hour)}:${getzf(minute)}`
  }
  /* 处理月份 */
  // const getmonth = (timestamp: number) => {
  //   const now = new Date(timestamp)
  //   const year = now.getFullYear()
  //   const month = now.getMonth() + 1
  //   return `${year}${intl.formatMessage({
  //     id: 'pay.nian',
  //     defaultMessage: '年',
  //   })}${month}${intl.formatMessage({
  //     id: 'pay.yue',
  //     defaultMessage: '月',
  //   })}`
  // }
	const getmonth = (timestamp: number) => {
		const now = new Date(timestamp)
		// const year = now.getFullYear()
		const month = now.getMonth() + 1
		return `${month}${intl.formatMessage({
			id: 'pay.yue',
			defaultMessage: '月',
		})}`
	}
  const getTradingRecord = async (startTime: number, endTime: number) => {
    const param = {
      startTime,
      endTime,
      memberAssetAccountId: acccountId,
			// operationList: index == 0 ? [1, 2, 3, 4, 5, 6, 7] : index == 1 ? [1] : [2],
			// 隐藏充值按钮、充值记录
			operationList: index == 0 ? [1, 2, 3, 4, 5, 6, 7] : [2],
      pageSize: 100,
      current: 1,
    }
    const res = await postPayMobileAssetAccountGetAccountTradeRecord(param)
    if (res.code === 1000) {
      const array: string | any[] = []
      res.data.data.forEach((item: any) => {
        const time = getmonth(item.tradeTime)
        // console.log(time, 'time')
        const last = array[array.length - 1]
        if (!last || last.name !== time) {
          const key = {
            name: time,
            list: [item],
          }
          array.push(key)
          return
        }
        if (last.name === time) {
          last.list.push(item)
        }
      })
      console.log(array, 'array')
      setdataSource(array)
    }
  }
  const handleSelectDatePicker = (value: string) => {
    setDate(value)
    const date = new Date()
    const Month = date.getMonth()
    const day = date.getDate()
    let startTime: any = Number(value) - 1
    startTime = `${startTime}/${Month + 1}/${day} 23:59`
    let endTime = `${value}/${Month + 1}/${day} 23:59`
    const STime = new Date(startTime).getTime()
    const eTime = new Date(endTime).getTime()
    console.log(startTime, endTime)
    setdataSource([])
    getTradingRecord(STime, eTime)
  }
  useEffect(() => {
    const date = new Date()
    const years: any = date.getFullYear()
    const Month = date.getMonth()
    const day = date.getDate()
    const startTimes = `${years - 1}/${Month + 1}/${day} 23:59`
    const endTimes = `${years}/${Month + 1}/${day} 23:59`
    const STime = new Date(startTimes).getTime()
    const eTime = new Date(endTimes).getTime()
    console.log(STime, eTime, endTimes, startTimes)
    getTradingRecord(STime, eTime)
    setNavigationBarTitle({
      title: title[index],
    })
  }, [])
  const jumpDetail = (items: any) => {
    Router.navigateTo('basicSetting/tradingDetail', {
      tradeCode: items.tradeCode,
      tradeTime: items.tradeTime,
      tradeMoney: items.tradeMoney,
      remark: items.remark,
      operation: items.operation,
      status: items.status,
      index,
    })
  }
  return (
    <View className={styles['TradingRecord']}>
      <DatePicker mode="year" value={date} onChange={handleSelectDatePicker}>
        <View className={styles['time']}>
					<Text style={{marginRight: pxTransform(4)}}>
            {date ||
              intl.formatMessage({
                id: 'pay.quanbu',
                defaultMessage: '全部',
              })}
						{date && (
							<Text style={{marginLeft: pxTransform(2)}}>{intl.formatMessage({ id: 'pay.nian', defaultMessage: '年'})}</Text>
						)}
					</Text>
					<Icons name="ArrowDownFill" size={12}/>
          {/*<Image src={getOssUrlPath(`/Images/%26%23127912%20Icon%20%D0%A1olor%402x.png`)} />*/}
        </View>
      </DatePicker>
      <View className={styles['TradingRecordList']}>
        {dataSource.length !== 0 ? (
          dataSource.map((item: any, i: number) => (
            <View className={styles['TradingRecordList-item']} key={i}>
              <View className={styles['TradingRecordList-item-mm']}>{item.name}</View>
              {item.list.map((items: any, j: number) => (
                <View className={styles['TradingRecordList-item-list']} key={j} onClick={() => jumpDetail(items)}>
                  <View className={styles['TradingRecordList-item-list-left']}>
                    <Image src={OPERATION_MAP[items.operation].url} />
                    <View>
                      <View className={styles['lalel']}>{OPERATION_MAP[items.operation].title}</View>
                      <View className={styles['times']}>{Datetimestamp(items.tradeTime, 2)}</View>
                    </View>
                  </View>
                  <View className={styles['TradingRecordList-item-list-rghit']}>
                    <View className={styles['move']}>{`${OPERATION_MAP[items.operation].operator}${
                      items.tradeMoney
                    }`}</View>
                    <View
                      className={styles['status']}
                      style={{
                        color: `${OPERATION_MAP[items.operation].color}`,
                      }}
                    >
                      {STATUS_MAP[items.status].title}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ))
        ) : (
          <View className={styles['nodata']}>
            <Image className={styles['fileListLogo']} src={getOssUrlPath(`/Images/null.png`)} mode="aspectFill" />
            <View>
              {intl.formatMessage({
                id: 'pay.zanwushuju',
                defaultMessage: '暂无数据',
              })}
            </View>
          </View>
        )}
      </View>
    </View>
  )
}
export default GlobalWrapper(TradingRecord)
