import React from 'react'
import { Text, View, Image } from '@apps/mobile-ui'
import useCustomerService from '@/hooks/useCustomerService'
import Router from '@/utils/router'
import { useIntl } from '@linkseeks/i18n'
import styles from './index.module.scss'
import CustomerServiceList from '../../../../../../components/CustomerServiceList'
import { useToggle } from '@linkseeks/hooks'
import useStores from '@/store/useStores'
import { observer } from 'mobx-react-lite'
import GlobalWrapper from '@/components/GlobalWrapper'
import { useMobileIntl } from '@apps/locales'
import { getOssUrlPath } from '@apps/constants'
import { THEME_COLORS } from '@/constants/theme'

const evaluate = getOssUrlPath('/Images/evaluate.svg')
const collection = getOssUrlPath('/Images/collection.svg')
const address = getOssUrlPath('/Images/address.svg')
const invoice = getOssUrlPath('/Images/invoice.svg')
const service = getOssUrlPath('/Images/service.svg')
const security = getOssUrlPath('/Images/security.svg')
const problem = getOssUrlPath('/Images/problem.svg')
const oftenBuy = getOssUrlPath('/Images/oftenBuy.svg')

const MyMessage: React.FC<{}> = () => {
  const { routerToCustomerService } = useCustomerService()
  const [serviceVisible, toggleServiceVisible] = useToggle()
  const intl = useIntl()
  const {
    userStore: { userInfo },
  } = useStores()
  const translate = useMobileIntl()

  const data = [
    {
      title: intl.formatMessage({ id: 'mine.wodepingjia', defaultMessage: '我的评价' }),
      url: 'extra/evaluatingManage',
      icon: evaluate,
    },
    {
      title: intl.formatMessage({ id: 'mine.wodeshoucang', defaultMessage: '我的收藏' }),
      url: 'members/collection',
      icon: collection,
    },
    {
      title: intl.formatMessage({ id: 'mine.shouhuodizhi', defaultMessage: '收货地址' }),
      url: 'basicSetting/addressList',
      icon: address,
    },
    {
      title: intl.formatMessage({ id: 'mine.fapiaotaitou', defaultMessage: '发票抬头' }),
      url: 'basicSetting/invoiceList',
      icon: invoice,
    },
    {
      title: intl.formatMessage({ id: 'mine.changgouqingdan', defaultMessage: '常购清单' }),
      url: 'order/oftenBuy',
      icon: oftenBuy,
    },
    {
      title: intl.formatMessage({ id: 'mine.zhanghaoanquan', defaultMessage: '账号安全' }),
      url: 'basicSetting/accountSafe',
      icon: security,
    },
    {
      title: intl.formatMessage({ id: 'mine.changjianwenti', defaultMessage: '常见问题' }),
      url: 'basicSetting/HelpCenter',
      icon: problem,
    },
    {
      title: translate('mobile.common.pingtaikefu'),
      url: 'customerService',
      icon: service,
    },
  ]

  const goJump = (url: any) => {
    if (url) {
      if (url === 'customerService') {
        // 平台客服跳转
        toggleServiceVisible()
        return
      } else {
        Router.navigateTo(url)
      }
    }
  }

  return (
    <View className={styles['userItem-card']}>
      <View className={styles['userItem-card-header']}>
        <Text className={styles['userItem-card-title']}>
          {intl.formatMessage({ id: 'mine.changyonggongju', defaultMessage: '常用工具' })}
        </Text>
      </View>
      <View className={styles['userItem-card-content']}>
        {data.map((item) => {
          const xmlSvg = item.icon.replace(/#C0C4CC/g, THEME_COLORS.primary)
          return (
            <View className={styles['userItem-card-item']} key={item.title} onClick={() => goJump(item.url)}>
              <Image src={xmlSvg} className={styles['userItem-card-svg']} />
              <Text className={styles['userItem-card-text']}>{item.title}</Text>
            </View>
          )
        })}
      </View>
      <CustomerServiceList
        visible={serviceVisible}
        onClose={toggleServiceVisible}
        memberId={userInfo?.memberId}
        isAdmin
      />
    </View>
  )
}
export default GlobalWrapper(observer(MyMessage))
