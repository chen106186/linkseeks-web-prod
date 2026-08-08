import GlobalWrapper from '@/components/GlobalWrapper'
import React from 'react'
import { Input, Text, View, Image, Upload, Button, Toast, Picker, Icons } from '@apps/mobile-ui'
import { ScrollView } from '@tarojs/components'
import { pxTransform, setClipboardData } from '@apps/mobile-services/utils/taro'
import { useIntl } from '@linkseeks/i18n'
import useSafeArea from '@/hooks/useSafeArea'
import { themeLayout } from '@/constants/theme'
import plusIcon from '@/assets/plus-icon.png'
import minusIcon from '@/assets/minus-icon.png'
import MellowCard from '@/components/MellowCard'
import Cell from '@/components/Cell'
import cx from 'classnames'
import { useMobileIntl } from '@apps/locales'
import useAskPurchase from '../../hooks'
import List from '../../components/List'
import OtherList from '../../components/OtherList'
import styles from './index.module.scss'
import { getIcon } from '../detail/components/Enclosure'
const EditRfqOrder = () => {
  const intl = useIntl()
  const { safeBottomHeight } = useSafeArea()
  const translate = useMobileIntl()
  const {
    purchaseDetail,
    query,
    products,
    fileList,
    submitLoading,
    currencyList,
    setQuery,
    removeFile,
    uploadFile,
    handleSubmit,
    handleProductsChange,
  } = useAskPurchase()
  const dataSource: any = {
    basicInfo: [
      {
        label: translate('mobile.resource.askPurchase.baojiadanxinxi'),
        isTitle: true,
      },
      {
        label: translate('mobile.resource.askPurchase.baojiadanzhaiyao'),
        viewStyle: true,
        extra: (
          <Input
            placeholder={translate('mobile.common.dianjitianxie')}
            maxlength={60}
            onChange={(e) => {
              const parmas = {
                ...query,
              }
              parmas.name = e
              setQuery(parmas)
            }}
            value={query.name}
          />
        ),
      },
      {
        label: translate('mobile.resource.askPurchase.lianxirenxingming'),
        viewStyle: true,
        extra: (
          <Input
            placeholder={translate('mobile.common.dianjitianxie')}
            maxlength={60}
            onChange={(e) => {
              const parmas = {
                ...query,
              }
              parmas.contactName = e
              setQuery(parmas)
            }}
            value={query.contactName}
          />
        ),
      },
      {
        label: translate('mobile.resource.askPurchase.lianxirendianhua'),
        viewStyle: true,
        extra: (
          <Input
            placeholder={translate('mobile.common.dianjitianxie')}
            maxlength={11}
            type="phone"
            onChange={(e) => {
              const parmas = {
                ...query,
              }
              parmas.contactCountryCode = '+86'
              parmas.contactMobile = e
              setQuery(parmas)
            }}
            value={query.contactMobile}
          />
        ),
      },
      {
        label: translate('mobile.resource.askPurchase.bizhong'),
        viewStyle: true,
        extra: (
          <Picker
            mode="selector"
            rangeKey="label"
            range={currencyList}
            onChange={(e) => {
              const selectItem = currencyList[Number(e.detail.value)]
              if (selectItem) {
                const parmas = {
                  ...query,
                }
                parmas.currencyId = selectItem.value
                parmas.currencyName = selectItem.label
                setQuery(parmas)
              }
            }}
          >
            <View className={cx(styles['time'], !query.currencyName && styles.placeholderColor)}>
              {query.currencyName || <Text>{translate('mobile.common.qingxuanze')}</Text>}
              <Icons name="ChevronRight" size={12} />
            </View>
          </Picker>
        ),
      },
    ],
    conditions: [
      {
        label: translate('mobile.resource.askPurchase.qitashuoming'),
        isTitle: true,
      },
      {
        label: translate('mobile.resource.askPurchase.jiaofushuoming'),
        viewStyle: true,
        extra: (
          <Input
            maxlength={100}
            placeholder={translate('mobile.common.dianjitianxie')}
            onChange={(e) => {
              const parmas = {
                ...query,
              }
              parmas.deliverRemark = e
              setQuery(parmas)
            }}
            value={query.deliverRemark}
          />
        ),
      },
      {
        label: translate('mobile.resource.askPurchase.fukuanshuoming'),
        viewStyle: true,
        extra: (
          <Input
            maxlength={100}
            placeholder={translate('mobile.common.dianjitianxie')}
            onChange={(e) => {
              const parmas = {
                ...query,
              }
              parmas.paymentRemark = e
              setQuery(parmas)
            }}
            value={query.paymentRemark}
          />
        ),
      },
      {
        label: translate('mobile.resource.askPurchase.shuifeishuoming'),
        viewStyle: true,
        extra: (
          <Input
            maxlength={100}
            placeholder={translate('mobile.common.dianjitianxie')}
            onChange={(e) => {
              const parmas = {
                ...query,
              }
              parmas.taxesRemark = e
              setQuery(parmas)
            }}
            value={query.taxesRemark}
          />
        ),
      },
      {
        label: translate('mobile.resource.askPurchase.wuliushuoming'),
        viewStyle: true,
        extra: (
          <Input
            maxlength={100}
            placeholder={translate('mobile.common.dianjitianxie')}
            onChange={(e) => {
              const parmas = {
                ...query,
              }
              parmas.logisticsRemark = e
              setQuery(parmas)
            }}
            value={query.logisticsRemark}
          />
        ),
      },
      {
        label: translate('mobile.resource.askPurchase.baozhuangshuoming'),
        viewStyle: true,
        extra: (
          <Input
            maxlength={100}
            placeholder={translate('mobile.common.dianjitianxie')}
            onChange={(e) => {
              const parmas = {
                ...query,
              }
              parmas.packageRemark = e
              setQuery(parmas)
            }}
            value={query.packageRemark}
          />
        ),
      },
      {
        label: translate('mobile.resource.askPurchase.qitashuoming'),
        viewStyle: true,
        extra: (
          <Input
            maxlength={100}
            placeholder={translate('mobile.common.dianjitianxie')}
            onChange={(e) => {
              const parmas = {
                ...query,
              }
              parmas.otherRemark = e
              setQuery(parmas)
            }}
            value={query.otherRemark}
          />
        ),
      },
    ],
  }
  const clipboard = (dataText: any) => {
    setClipboardData({
      data: dataText,
      success: () => {
        Toast.show({
          title: intl.formatMessage({
            id: 'inquiry.fuzhichenggong',
            defaultMessage: '内容复制成功',
          }),
          icon: 'none',
        })
      },
    })
  }
  return (
    <View className={styles['EditRfqOrder-container']}>
      <ScrollView scrollY showScrollbar={false} className={styles['EditRfqOrder-container-main']}>
        <View className={styles['inquiryDetailContainer-productInfo']}>
          <View className={styles['inquiryDetailContainer-productInfoTitle']}>
            <View className={styles['inquiryDetailContainer-docLine']} />
            <Text className={styles['inquiryDetailContainer-productName']}>{purchaseDetail?.name}</Text>
          </View>
          <View className={styles['inquiryDetailContainer-productInfoNo']}>
            <Text className={styles['inquiryDetailContainer-productNo']}>{purchaseDetail?.askPurchaseNo}</Text>
            <View>
              <Text
                onClick={() => clipboard(purchaseDetail?.askPurchaseNo)}
                className={styles['inquiryDetailContainer-textCopyStyle']}
              >
                {intl.formatMessage({
                  id: 'inquiry.fuzhi',
                  defaultMessage: '复制',
                })}
              </Text>
            </View>
          </View>
        </View>
        <MellowCard
          title={intl.formatMessage({
            id: 'inquiry.jibenxinxi',
            defaultMessage: '基本信息',
          })}
          className={styles['inquiryDetailContainer-customStyle']}
          bodyStyle={{
            padding: 0,
          }}
        >
          <Cell>
            <Cell.Item title={translate('mobile.resource.askPurchase.danhao')} value={purchaseDetail?.askPurchaseNo} />
            <Cell.Item
              title={intl.formatMessage({
                id: 'inquiry.xuqiuzhaiyao',
                defaultMessage: '需求摘要',
              })}
              value={purchaseDetail?.name}
            />
            <Cell.Item title={translate('mobile.resource.askPurchase.danjushijian')} value={purchaseDetail?.billTime} />
          </Cell>
        </MellowCard>
        <View className={styles['EditRfqOrder-container-main-box']}>
          <List dataSource={dataSource.basicInfo} />
        </View>
        <View className={styles['EditRfqOrder-container-main-box']}>
          <OtherList dataSource={products} onChange={handleProductsChange} />
        </View>
        <View className={styles['EditRfqOrder-container-main-box']}>
          <List dataSource={dataSource.conditions} />
        </View>
        <View className={styles['EditRfqOrder-container-main-box']}>
          <View className={styles['tabItem']}>
            <Text className={styles['title']}>
              {intl.formatMessage({
                id: 'order.fujianxuantian',
                defaultMessage: '附件(选填)',
              })}
            </Text>
          </View>
          <View className={styles['Upload']}>
            {fileList.map((item: any, index: number) => (
              <View className={styles['UploadList-item']} key={index}>
                <Image src={getIcon(item.url)} />
                <Image className={styles['remove']} onClick={() => removeFile(index)} src={minusIcon} mode="center" />
              </View>
            ))}
            <Upload chooseFile actions={(e) => uploadFile(e)} pickerMax={1}>
              <View className={styles['UploadList']}>
                {fileList.length < 4 && (
                  <View className={styles['UploadList-card']}>
                    <Image src={plusIcon} />
                  </View>
                )}
              </View>
            </Upload>
          </View>
        </View>
      </ScrollView>
      <View
        className={styles['EditRfqOrder-container-actions']}
        style={{
          paddingBottom: safeBottomHeight ? `${safeBottomHeight}PX` : pxTransform(themeLayout['padding-xs']),
        }}
      >
        <Button type="primary" onClick={handleSubmit} loading={submitLoading}>
          {intl.formatMessage({
            id: 'order.tijiao',
            defaultMessage: '提交',
          })}
        </Button>
      </View>
    </View>
  )
}
export default GlobalWrapper(EditRfqOrder)
