import GlobalWrapper from '@/components/GlobalWrapper'
import React from 'react'
import { Input, Text, Icons, View, Image, Upload, Button } from '@apps/mobile-ui'
import { getOssUrlPath } from '@apps/constants'
import { Picker } from '@tarojs/components'
import { getCurrentInstance, pxTransform } from '@apps/mobile-services/utils/taro'
import { dateFormat } from '@/utils/date'
import { useIntl } from '@linkseeks/i18n'
import { useSafeArea } from '@apps/mobile-services'
import { themeLayout } from '@/constants/theme'
import useEditRfqOrder from './services/hooks/useEditRfqOrder'
import List from './components/List'
import OtherList from './components/OtherList'
import styles from './index.module.scss'
import DatePicker from '@/components/DatePicker'
const EditRfqOrder = () => {
  const {
    params: { id },
  }: any = getCurrentInstance()?.router
  const intl = useIntl()
  const { safeBottomHeight } = useSafeArea()
  const {
    data,
    query,
    fileList,
    submitLoading,
    headTagList,
    products,
    setQuery,
    fnGetNextYear,
    fnGetTomorrow,
    removeFile,
    uploadFile,
    handleJumpEditProduct,
    handleSelectDatePicker,
    handleSubmit,
    totalCount,
    handleJumpOtherConditions,
    handleAddress,
  } = useEditRfqOrder(id)
  const dataSource: any = {
    basicInfo: [
      {
        label: intl.formatMessage({
          id: 'order.jibenxinxi',
          defaultMessage: '基本信息',
        }),
        isTitle: true,
      },
      {
        label: intl.formatMessage({
          id: 'order.beixunjiahuiyuan',
          defaultMessage: '被询价会员',
        }),
        extra: data.memberName || '',
      },
      {
        label: intl.formatMessage({
          id: 'order.xunjiazhaiyao',
          defaultMessage: '询价摘要',
        }),
        viewStyle: true,
        extra: (
          <Input
            placeholder={intl.formatMessage({
              id: 'order.qingshuruxunjiazhaiyao',
              defaultMessage: '请输入询价摘要',
            })}
            maxlength={60}
            onChange={(e) => {
              const parmas = {
                ...query,
              }
              parmas.details = e
              setQuery(parmas)
            }}
            value={query.details}
          />
        ),
      },
    ],
    conditions: [
      {
        label: intl.formatMessage({
          id: 'order.tianxiejiaoyitiaojian',
          defaultMessage: '填写交易条件',
        }),
        isTitle: true,
      },
      {
        label: intl.formatMessage({
          id: 'order.jiaofushijian',
          defaultMessage: '交付时间',
        }),
        extra: (
          <DatePicker
            mode="day"
            value={query.deliveryTime}
            // start={dateFormat(fnGetTomorrow(), "YYYY-MM-DD")}
            // end={dateFormat(fnGetNextYear(), "YYYY-MM-DD")}
            onChange={(value) => handleSelectDatePicker(value, 'deliveryTime')}
          >
            <View className={styles['time']}>
              {query.deliveryTime || (
                <Text>
                  {intl.formatMessage({
                    id: 'order.qingxuanze',
                    defaultMessage: '请选择',
                  })}
                </Text>
              )}
              <Icons name="ChevronRight" size={12} />
            </View>
          </DatePicker>
        ),
      },
      {
        label: intl.formatMessage({
          id: 'order.jiaofudizhi',
          defaultMessage: '交付地址',
        }),
        extra: (
          // style={style.textStyle} onPress={() => handleAddress()}
          // style={style.selStyle}
          <Text onClick={() => handleAddress()}>
            {query.fullAddress ? (
              query.fullAddress
            ) : (
              <Text>
                {intl.formatMessage({
                  id: 'order.qingxuanze',
                  defaultMessage: '请选择',
                })}
              </Text>
            )}
            {/* iconStyle={style.textStyle} */}
            <Icons name="ChevronRight" size={12} />
          </Text>
        ),
      },
      {
        label: intl.formatMessage({
          id: 'order.baojiajiezhishijian',
          defaultMessage: '报价截止时间',
        }),
        extra: (
          <DatePicker
            mode="day"
            value={query.quotationAsTime}
            // start={dateFormat(fnGetTomorrow(), "YYYY-MM-DD")}
            // end={dateFormat(fnGetNextYear(), "YYYY-MM-DD")}
            onChange={(value) => handleSelectDatePicker(value, 'quotationAsTime')}
          >
            <View className={styles['time']}>
              {query.quotationAsTime || (
                <Text>
                  {intl.formatMessage({
                    id: 'order.qingxuanze',
                    defaultMessage: '请选择',
                  })}
                </Text>
              )}
              <Icons name="ChevronRight" size={12} />
            </View>
          </DatePicker>
        ),
      },
    ],
    otherConditions: [
      {
        label: intl.formatMessage({
          id: 'order.qitatiaojianxuantian',
          defaultMessage: '其他条件(选填)',
        }),
        isTitle: true,
        extra: (
          <Text onClick={handleJumpOtherConditions}>
            <Text>
              {totalCount() === 0
                ? intl.formatMessage({
                    id: 'order.dianjitianxie',
                    defaultMessage: '点击填写',
                  })
                : `${intl.formatMessage({
                    id: 'order.yitian',
                    defaultMessage: '已填',
                  })}${totalCount()}${intl.formatMessage({
                    id: 'order.xiang',
                    defaultMessage: '项',
                  })}`}
            </Text>
          </Text>
        ),
      },
    ],
  }
  return (
    <View className={styles['EditRfqOrder-container']}>
      {!id && (
        <View className={styles['EditRfqOrder-container-advert']}>
          <View className={styles['EditRfqOrder-container-advert-Head']}>
            <View className={styles['EditRfqOrder-container-advert-Head-title']}>
              {intl.formatMessage({
                id: 'order.quanwangxinxizhu',
                defaultMessage: '全网信息 | 助你高效采购',
              })}
            </View>
          </View>
          <View className={styles['EditRfqOrder-container-advert-headTagList']}>
            {headTagList &&
              headTagList.map((item: any, index: number) => (
                <View key={index} className={styles['EditRfqOrder-container-advert-headTagList-item']}>
                  <Image src={item.url} />
                  <View className={styles['advert-tofo-text']}>{item.name}</View>
                </View>
              ))}
          </View>
        </View>
      )}
      <View className={styles['EditRfqOrder-container-main']}>
        <View className={styles['EditRfqOrder-container-main-box']}>
          <List dataSource={dataSource.basicInfo} />
        </View>
        <View className={styles['EditRfqOrder-container-main-box']}>
          <OtherList
            title={intl.formatMessage({
              id: 'order.xunjiashangpin',
              defaultMessage: '询价商品',
            })}
            dataSource={products}
            type="ALL"
            extra={
              <View className={styles['textStyle']} onClick={handleJumpEditProduct}>
                <Text className={styles['selStyle']}>
                  {intl.formatMessage({
                    id: 'order.yixuanze',
                    defaultMessage: '已选择',
                  })}
                  {products.length}
                  {intl.formatMessage({
                    id: 'order.jianshangpin',
                    defaultMessage: '件商品',
                  })}
                </Text>
                <Icons name="ChevronRight" size={16} />
              </View>
            }
          />
        </View>
        <View className={styles['EditRfqOrder-container-main-box']}>
          <List dataSource={dataSource.conditions} />
        </View>
        <View className={styles['EditRfqOrder-container-main-box']}>
          <List dataSource={dataSource.otherConditions} />
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
            <Upload actions={(e) => uploadFile(e)} pickerMax={1}>
              <View className={styles['UploadList']}>
                {fileList.length < 4 && (
                  <View className={styles['UploadList-card']}>
                    <Image src={getOssUrlPath(`/Images/127912Icon%D0%A1olor%402x.png`)} />
                  </View>
                )}
              </View>
            </Upload>
            {fileList.map((item: any, index: number) => (
              <View className={styles['UploadList-item']} key={index}>
                <Image src={item.url} />
                <Image
                  className={styles['remove']}
                  onClick={() => removeFile(index)}
                  src={getOssUrlPath(`/Images/minus-circle-fill%402x.png`)}
                  mode="center"
                />
              </View>
            ))}
          </View>
        </View>
      </View>
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
