import React, { useEffect, useState } from 'react'
import cx from 'classnames'
import { useIntl } from '@linkseeks/i18n'
import { View, Text, Input, Icons, Toast, ScrollView, Checkbox, TextArea } from '@apps/mobile-ui'
import Popup from '@/components/Popup'
import { showLoading, hideLoading, pxTransform } from '@apps/mobile-services/utils/taro'
import { postOrderMobileBuyerCancel } from '@apps/apis'
import styles from './index.module.scss'
import { IS_WEB } from '@/constants'
import { requestSubscribeMessage } from '@tarojs/taro'

interface Props {
  onHandleClose?: () => void
  onConfirm?: () => void
  cancelOrderVisible: boolean
  orderItem?: any
}
const CancelOrder = (props: Props) => {
  const { cancelOrderVisible, onHandleClose, onConfirm, orderItem } = props
  const [current, setCurrent] = useState(0)
  const [display, setDisplay] = useState(false)
  const [submit, setSubmit] = useState(false)
  const [Value, setValue] = useState('')
  const intl = useIntl()
  /** 关闭取消订单 */
  const handleClose = () => {
    onHandleClose && onHandleClose()
    setDisplay(false)
  }
  const dataSource = [
    {
      id: 1,
      title: intl.formatMessage({ id: 'order.jiageyoudiangui', defaultMessage: '价格有点贵' }),
    },
    {
      id: 2,
      title: intl.formatMessage({ id: 'order.guigexinghaoshuliang', defaultMessage: '规格/型号/数量拍错' }),
    },
    {
      id: 3,
      title: intl.formatMessage({ id: 'order.shouhuodizhipaicuo', defaultMessage: '收货地址拍错' }),
    },
    {
      id: 4,
      title: intl.formatMessage({ id: 'order.xuancuozhifufangshi', defaultMessage: '选错支付方式' }),
    },
    {
      id: 5,
      title: intl.formatMessage({ id: 'order.fapiaoxinxiyouwu', defaultMessage: '发票信息有误' }),
    },
    {
      id: 6,
      title: intl.formatMessage({ id: 'order.qitawangzhanjiagegengdi', defaultMessage: '其他网站价格更低' }),
    },
    {
      id: 7,
      title: intl.formatMessage({ id: 'order.yunfeitaigao', defaultMessage: '运费太高' }),
    },
    {
      id: 8,
      title: intl.formatMessage({ id: 'order.buxiangmaile', defaultMessage: '不想买了' }),
    },
  ]
  /* 点击选中 */
  const fnChangeSelect = (value: number) => {
    setCurrent(value)
  }
  /* 显示其他原因理由 */
  const ondisplay = () => {
    setDisplay(!display)
  }
  const Scroll = () => (
    <ScrollView
      style={{
        height: pxTransform(462),
      }}
    >
      {dataSource.map((item: any, index: number) => (
        <View className={styles['Cell']} key={index}>
          <Text className={styles['CellText']}>{item.title}</Text>
          <Checkbox
            checked={index === current}
            onChange={() => {
              fnChangeSelect(index)
            }}
          />
        </View>
      ))}
      <View className={styles['Cell']} onClick={() => ondisplay()}>
        <Text className={styles['CellText']}>
          {intl.formatMessage({ id: 'order.qitayuanyin', defaultMessage: '其他原因' })}
        </Text>
				<Icons name="ChevronRight" size={18} color="#C0C4CC" customStyle={{ marginRight: pxTransform(-4) }} />
			</View>
    </ScrollView>
  )
  const setVal = (val: any) => {
    setValue(val)
  }
  const message = () => (
    <View
      style={{
				width: '100%',
				height: pxTransform(462),
				margin: '0 ' + pxTransform(12),
				padding: pxTransform(12),
				borderRadius: pxTransform(12),
      }}
    >
      <TextArea
        placeholder={intl.formatMessage({ id: 'order.dianjishuruqitayuanyin', defaultMessage: '点击输入其他原因' })}
        maxLength={60}
				height={pxTransform(290)}
        value={Value}
        className={cx(styles['input'], styles['warpflex'])}
				customStyle={{
					background: '#FAFBFC',
					borderRadius: pxTransform(16),
				}}
        onChange={setVal}
      />
    </View>
  )
  /* 确认 */
  const Confirm = async () => {
    if (!submit) {
      setSubmit(true)
      if (!IS_WEB) {
        // 小程序授权订阅消息-订单取消通知
        await requestSubscribeMessage({
          tmplIds: ['-vy3EQL530YEpr1Pzau4Yu99iqrr4t7_lxqAHf91KAk'],
          entityIds: [],
        }).catch(() => {})
      }
      showLoading({
        title: intl.formatMessage({ id: 'order.jiazaizhong', defaultMessage: '加载中' }),
      })
      const data = {
        orderId: orderItem.orderId,
        reason: Value || dataSource[current].title,
      }
      postOrderMobileBuyerCancel(data).then((res: any) => {
        if (res.code === 1000) {
          onConfirm && onConfirm()
          onHandleClose && onHandleClose()
          Toast.show({ title: intl.formatMessage({ id: `${res.code}`, defaultMessage: res.message }) })
          setDisplay(false)
          setSubmit(false)
          hideLoading()
        } else {
          hideLoading()
          setSubmit(false)
          Toast.show({ title: intl.formatMessage({ id: `${res.code}`, defaultMessage: res.message }) })
        }
      })
    }
  }
  return (
    <Popup visible={cancelOrderVisible} onClose={handleClose}>
      <View className={styles['Props-box']}>
        <Text className={styles['title']}>
          {intl.formatMessage({ id: 'order.quxiaodingdan', defaultMessage: '取消订单' })}
        </Text>
        {display ? message() : Scroll()}
        <View className={styles['Props-foot']}>
          <Text className={styles['cancel']} onClick={handleClose}>
            {intl.formatMessage({ id: 'order.wozaixiangxiang', defaultMessage: '我再想想' })}
          </Text>
          <Text className={styles['confirm']} onClick={Confirm}>
            {intl.formatMessage({ id: 'order.quedingquxiao', defaultMessage: '确定取消' })}
          </Text>
        </View>
      </View>
    </Popup>
  )
}
export default CancelOrder
