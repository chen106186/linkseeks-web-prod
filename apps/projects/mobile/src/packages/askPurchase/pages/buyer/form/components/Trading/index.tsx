import React, { Dispatch, Fragment, SetStateAction } from 'react'
import { View, Text, Picker, DateTimePicker, Input, Icons } from '@apps/mobile-ui'
import MellowCard from '@/components/MellowCard'
import Cell from '@/components/Cell'
import cx from 'classnames'
import { dateFmt } from '@/utils/date'
import { GetMemberManageUsersPageResponseDetail } from '@apps/apis'
import styles from '../../index.module.scss'
import { preload } from '@apps/mobile-services/utils/taro'
import Router from '@/utils/router'
import { useMobileIntl } from '@apps/locales'

interface IProps {
  query: Record<string, any>
  userList: GetMemberManageUsersPageResponseDetail[]
  onChange: (key: string, value: string) => void
  setQuery: Dispatch<SetStateAction<Record<string, any>>>
}

const Trading: React.FC<IProps> = (props) => {
  const { query, userList, setQuery, onChange } = props
  const translate = useMobileIntl()

  /**
   * 获取当前时间
   */
  const fnGetCurrentDate = () => {
    const today = new Date()
    const tomorrow = today.getTime() + 24 * 60 * 60 * 1000
    return new Date(tomorrow)
  }

  return (
    <Fragment>
      <MellowCard
        title={translate('mobile.resource.askPurchase.jiaoyitiaojian')}
        style={{
          marginTop: 8,
        }}
        bodyStyle={{
          padding: 0,
        }}
      >
        <Cell>
          <Cell.Item
            title={translate('mobile.resource.askPurchase.jiaofuriqi')}
            value={
              <Picker
                mode="date"
                onChange={(e) => onChange('deliverTime', e.detail.value)}
                value={query.deliverTime}
                start={dateFmt(new Date(), 'YYYY-MM-DD')}
              >
                <View className={cx(styles['time'], !query.deliverTime && styles.placeholderColor)}>
                  {query.deliverTime || <Text>{translate('mobile.common.qingxuanze')}</Text>}
                  <Icons name="ChevronRight" size={12} />
                </View>
              </Picker>
            }
          />
          <Cell.Item
            title={translate('mobile.resource.askPurchase.baojiajiezhiriqi')}
            value={
              <DateTimePicker
                min={fnGetCurrentDate()}
                format="YYYY-MM-DD HH:mm"
                onConfirm={(value) => onChange('quoteEndTime', value as string)}
              >
                <View className={cx(styles['time'], !query.quoteEndTime && styles.placeholderColor)}>
                  {query.quoteEndTime || <Text>{translate('mobile.common.qingxuanze')}</Text>}
                  <Icons name="ChevronRight" size={12} />
                </View>
              </DateTimePicker>
            }
          />
          <Cell.Item
            title={translate('mobile.resource.askPurchase.lianxiren')}
            value={
              <Picker
                mode="selector"
                range={userList}
                rangeKey="name"
                onChange={(e) => {
                  const index = Number(e.detail.value)
                  const userItem = userList[index]
                  if (userItem) {
                    const params = { ...query }
                    params.contactUserId = userItem.userId
                    params.contactName = userItem.name
                    params.contactMobile = userItem.phone
                    setQuery(params)
                  }
                }}
                value={userList.findIndex((item) => item.userId === query.contactUserId)}
              >
                <View className={cx(styles['time'], !query.contactName && styles.placeholderColor)}>
                  {query.contactName || <Text>{translate('mobile.common.qingxuanze')}</Text>}
                  <Icons name="ChevronRight" size={12} />
                </View>
              </Picker>
            }
          />
          <Cell.Item
            title={translate('mobile.resource.askPurchase.lianxirendianhua')}
            customHeadStyle={{
              padding: 0,
            }}
            value={
              <Input
                type="text"
                placeholder={translate('mobile.common.dianjitianxie')}
                className={styles['form-input']}
                placeholderClass={styles['form-input-placeholder']}
                onChange={(val: string) => onChange('contactMobile', val)}
                value={query?.contactMobile}
              />
            }
          />
          <Cell.Item
            title={translate('mobile.resource.askPurchase.jiaofudizhi')}
            value={
              <View
                className={cx(styles['time'], styles.placeholderColor)}
                onClick={(e) => {
                  e.stopPropagation()
                  preload({
                    onSelect: (addressItem) => {
                      console.log(addressItem, 'addressItem')
                      if (addressItem) {
                        const params = { ...query }
                        params.deliverAddressId = addressItem.id
                        params.deliverAddress = addressItem.fullAddress
                        params.deliverAddrProvinceCode = addressItem.provinceCode
                        params.deliverAddrCityCode = addressItem.cityCode
                        params.deliverAddrDistrictCode = addressItem.districtCode
                        setQuery(params)
                      }
                    },
                  })
                  Router.navigateTo('basicSetting/addressList')
                }}
              >
                <View className={cx(styles['time'], !query.deliverAddress && styles.placeholderColor)}>
                  {query.deliverAddress || <Text>{translate('mobile.common.qingxuanze')}</Text>}
                  <Icons name="ChevronRight" size={12} />
                </View>
              </View>
            }
          />
        </Cell>
      </MellowCard>
      <MellowCard
        style={{
          marginTop: 8,
        }}
      >
        <Cell.Item
          title={translate('mobile.resource.askPurchase.baojiayaoqiu')}
          customHeadStyle={{
            padding: 0,
          }}
          value={
            <Input
              type="text"
              maxlength={50}
              placeholder={translate('mobile.resource.askPurchase.countziyinei', { count: 50 })}
              className={styles['form-input']}
              placeholderClass={styles['form-input-placeholder']}
              onChange={(val: string) => onChange('quoteRequire', val)}
              value={query?.quoteRequire}
            />
          }
        />
        <Cell.Item
          title={translate('mobile.resource.askPurchase.shuifeiyaoqiu')}
          customHeadStyle={{
            padding: 0,
          }}
          value={
            <Input
              type="text"
              maxlength={50}
              placeholder={translate('mobile.resource.askPurchase.countziyinei', { count: 50 })}
              className={styles['form-input']}
              placeholderClass={styles['form-input-placeholder']}
              onChange={(val: string) => onChange('taxesRequire', val)}
              value={query?.taxesRequire}
            />
          }
        />
        <Cell.Item
          title={translate('mobile.resource.askPurchase.wuliuyaoqiu')}
          customHeadStyle={{
            padding: 0,
          }}
          value={
            <Input
              type="text"
              maxlength={50}
              placeholder={translate('mobile.resource.askPurchase.countziyinei', { count: 50 })}
              className={styles['form-input']}
              placeholderClass={styles['form-input-placeholder']}
              onChange={(val: string) => onChange('logisticsRequire', val)}
              value={query?.logisticsRequire}
            />
          }
        />
        <Cell.Item
          title={translate('mobile.resource.askPurchase.baozhuangyaoqiu')}
          customHeadStyle={{
            padding: 0,
          }}
          value={
            <Input
              type="text"
              maxlength={50}
              placeholder={translate('mobile.resource.askPurchase.countziyinei', { count: 50 })}
              className={styles['form-input']}
              placeholderClass={styles['form-input-placeholder']}
              onChange={(val: string) => onChange('packageRequire', val)}
              value={query?.packageRequire}
            />
          }
        />
        <Cell.Item
          title="付款方式"
          customHeadStyle={{
            padding: 0,
          }}
          value={
            <Input
              type="text"
              maxlength={50}
              placeholder={translate('mobile.resource.askPurchase.countziyinei', { count: 50 })}
              className={styles['form-input']}
              placeholderClass={styles['form-input-placeholder']}
              onChange={(val: string) => onChange('paymentWay', val)}
              value={query?.paymentWay}
            />
          }
        />
        <Cell.Item
          title={translate('mobile.resource.askPurchase.qitayaoqiu')}
          customHeadStyle={{
            padding: 0,
          }}
          value={
            <Input
              type="text"
              maxlength={50}
              placeholder={translate('mobile.resource.askPurchase.countziyinei', { count: 50 })}
              className={styles['form-input']}
              placeholderClass={styles['form-input-placeholder']}
              onChange={(val: string) => onChange('otherRequire', val)}
              value={query?.otherRequire}
            />
          }
        />
      </MellowCard>
    </Fragment>
  )
}

export default Trading
