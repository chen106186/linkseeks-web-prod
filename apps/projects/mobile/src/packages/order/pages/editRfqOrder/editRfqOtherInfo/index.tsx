import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useEffect } from 'react'
import { Input, View } from '@apps/mobile-ui'
import { setNavigationBarTitle } from '@apps/mobile-services/utils/taro'
import { useIntl } from '@linkseeks/i18n'
import useEditRfqOtherInfo from '../services/hooks/useEditRfqOtherInfo'
import styles from './index.module.scss'
import { usePageInit } from '@/hooks/usePageInit'
const EditRfqOtherInfo = () => {
  const intl = useIntl()
  const { query, handleSubmit, handleInput } = useEditRfqOtherInfo()
  usePageInit()
  useEffect(() => {
    // setNavigationBarTitle({
    //   title: intl.formatMessage({ id: 'order.tianxieqitatiaojian', defaultMessage: '填写其他条件' }),
    // })
  }, [])
  return (
    <View className={styles['EditRfqOtherInfo']}>
      <View className={styles['EditRfqOtherInfo-container']}>
        <View className={styles['EditRfqOtherInfo-container-item']}>
          <View className={styles['field-item-label']}>
            {intl.formatMessage({
              id: 'order.baojiayaoqiu',
              defaultMessage: '报价要求',
            })}
          </View>
          <Input
            placeholder={intl.formatMessage({
              id: 'order.qingshurubaojiayaoqiu',
              defaultMessage: '请输入报价要求',
            })}
            value={query?.offer}
            onChange={(e) => handleInput(e, 'offer')}
            maxlength={60}
          />
        </View>
        <View className={styles['EditRfqOtherInfo-container-item']}>
          <View className={styles['field-item-label']}>
            {intl.formatMessage({
              id: 'order.fukuanfangshi',
              defaultMessage: '付款方式',
            })}
          </View>
          <Input
            placeholder={intl.formatMessage({
              id: 'order.qingshurufukuanfangshi',
              defaultMessage: '请输入付款方式',
            })}
            value={query?.paymentType}
            onChange={(e) => handleInput(e, 'paymentType')}
          />
        </View>
        <View className={styles['EditRfqOtherInfo-container-item']}>
          <View className={styles['field-item-label']}>
            {intl.formatMessage({
              id: 'order.shuifeiyaoqiu',
              defaultMessage: '税费要求',
            })}
          </View>
          <Input
            placeholder={intl.formatMessage({
              id: 'order.qingshurushuifeiyaoqiu',
              defaultMessage: '请输入税费要求',
            })}
            value={query?.taxes}
            onChange={(e) => handleInput(e, 'taxes')}
          />
        </View>
        <View className={styles['EditRfqOtherInfo-container-item']}>
          <View className={styles['field-item-label']}>
            {intl.formatMessage({
              id: 'order.wuliuyaoqiu',
              defaultMessage: '物流要求',
            })}
          </View>
          <Input
            placeholder={intl.formatMessage({
              id: 'order.qingshuruwuliuyaoqiu',
              defaultMessage: '请输入物流要求',
            })}
            value={query?.logistics}
            onChange={(e) => handleInput(e, 'logistics')}
          />
        </View>
        <View className={styles['EditRfqOtherInfo-container-item']}>
          <View className={styles['field-item-label']}>
            {intl.formatMessage({
              id: 'order.baozhuangyaoqiu',
              defaultMessage: '包装要求',
            })}
          </View>
          <Input
            placeholder={intl.formatMessage({
              id: 'order.qingshurubaozhuangyaoqiu',
              defaultMessage: '请输入包装要求',
            })}
            value={query?.packRequire}
            onChange={(e) => handleInput(e, 'packRequire')}
          />
        </View>
      </View>
      <View className={styles['EditRfqOtherInfo-submit']}>
        <View className={styles['EditRfqOtherInfo-submit-btn']} onClick={handleSubmit}>
          {intl.formatMessage({
            id: 'order.tijiao',
            defaultMessage: '提交',
          })}
        </View>
      </View>
    </View>
  )
}
export default GlobalWrapper(EditRfqOtherInfo)
