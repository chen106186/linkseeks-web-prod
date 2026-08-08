import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useEffect, useState } from 'react'
import { View, Image } from '@apps/mobile-ui'
import { getOssUrlPath } from '@apps/constants'
import { dateFormat } from '@/utils/date'
import { useIntl } from '@linkseeks/i18n'
import { pxTransform, getCurrentInstance, setNavigationBarTitle } from '@apps/mobile-services/utils/taro'
import styles from './index.module.scss'
import { usePageInit } from '@/hooks/usePageInit'
const paymentIcon = 'https://obs-wnwl.obs.cn-east-3.myhuaweicloud.com/mini-program/img-add/payment.png'
const extractIcon = 'https://obs-wnwl.obs.cn-east-3.myhuaweicloud.com/mini-program/img-add/extract.png'
const rebateIcon = 'https://obs-wnwl.obs.cn-east-3.myhuaweicloud.com/mini-program/img-add/rebate.png'

interface dataProps {
  name: string
  key: string
}
const TradingDetail = () => {
  const intl = useIntl()
  const OPERATION_MAP = {
    1: {
      title: intl.formatMessage({
        id: 'pay.zhanghuchongzhi',
        defaultMessage: '账户充值',
      }),
      operator: '+',
      url: getOssUrlPath('/Images/Recharge.png'),
      color: '#00A98F',
    },
    2: {
      title: intl.formatMessage({
        id: 'pay.zhanghutixian',
        defaultMessage: '账户提现',
      }),
      operator: '-',
      // url: getOssUrlPath('/Images/pay%402x.png'),
			url: extractIcon,
      color: '#EA8000',
    },
    3: {
      title: intl.formatMessage({
        id: 'pay.dingdanzhifu',
        defaultMessage: '订单支付',
      }),
      operator: '-',
      // url: getOssUrlPath('/Images/orderIcon.png'),
			url: paymentIcon,
      color: '#00A98F',
    },
    4: {
      title: intl.formatMessage({
        id: 'pay.dingdantuikuan',
        defaultMessage: '订单退款',
      }),
      operator: '+',
      url: getOssUrlPath('/Images/pay%402x.png'),
      color: '#3877FF',
    },
    5: {
      title: intl.formatMessage({
        id: 'pay.dingdanfanli',
        defaultMessage: '订单返利',
      }),
      operator: '+',
      // url: getOssUrlPath('/Images/Rebate.png'),
			url: rebateIcon,
      color: '#00A98F',
    },
		6: {
			title: intl.formatMessage({
				id: 'pay.fenxiaodingdanfanli',
				defaultMessage: '分销订单返利',
			}),
			operator: '+',
			url: rebateIcon,
			color: '#00A98F',
		},
		7: {
			title: intl.formatMessage({
				id: 'pay.tuangoudingdanfanli',
				defaultMessage: '团购订单返利',
			}),
			operator: '+',
			url: rebateIcon,
			color: '#00A98F',
		},
  }
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
  const [list, setlist] = useState<dataProps[]>([])
  const { operation, remark, index, tradeMoney, status, tradeCode, tradeTime }: any =
    getCurrentInstance()?.router?.params
  usePageInit()
  useEffect(() => {
    // setNavigationBarTitle({ title: intl.formatMessage({id: 'pay.jiaoyimingxi', defaultMessage: '交易明细'}) })
    const data = [
      {
        name: intl.formatMessage({
          id: 'pay.jiaoyiliushuihao',
          defaultMessage: '交易流水号',
        }),
        key: tradeCode,
      },
      {
        name: intl.formatMessage({
          id: 'pay.jiaoyixiangmu',
          defaultMessage: '交易项目',
        }),
        key: OPERATION_MAP[operation].title,
      },
      {
        name: intl.formatMessage({
          id: 'pay.jiaoyijine',
          defaultMessage: '交易金额',
        }),
        key: OPERATION_MAP[operation].operator + Number(tradeMoney).toFixed(2),
      },
      {
        name: intl.formatMessage({
          id: 'pay.jiaoyishijian',
          defaultMessage: '交易时间',
        }),
        key: dateFormat(new Date(Number(tradeTime)), 'YYYY-MM-DD HH:mm:ss'),
      },
      {
        name: intl.formatMessage({
          id: 'pay.zhuangtai',
          defaultMessage: '状态',
        }),
        key: STATUS_MAP[status].title,
      },
      {
        name: intl.formatMessage({
          id: 'pay.beizhu',
          defaultMessage: '备注',
        }),
				key: remark ? decodeURIComponent(remark) : "无",
      },
    ]
    setlist(data)
  }, [])
  return (
    <View className={styles['TradingDetail']}>
      <View className={styles['TradingDetail-head']}>
        <View className={styles['TradingDetail-head-status']}>
          <Image src={OPERATION_MAP[operation].url} />
          <View className={styles['statusName']}>{OPERATION_MAP[operation].title}</View>
        </View>
        <View className={styles['TradingDetail-head-Amount']}>
          {OPERATION_MAP[operation].operator} {Number(tradeMoney).toFixed(2)}
        </View>
        <View
          style={{
            color: `${OPERATION_MAP[operation].color}`,
            fontSize: pxTransform(12),
          }}
        >
          {STATUS_MAP[status].title}
        </View>
      </View>
      <View className={styles['TradingDetail-List']}>
        {list.map((item: dataProps) => (
          <View key={item.name} className={styles['TradingDetail-List-item']}>
						<View className={styles['TradingDetail-List-item-text1']}>{item.name}</View>
						<View className={styles['TradingDetail-List-item-text2']}>{item.key}</View>
          </View>
        ))}
      </View>
    </View>
  )
}
export default GlobalWrapper(TradingDetail)
