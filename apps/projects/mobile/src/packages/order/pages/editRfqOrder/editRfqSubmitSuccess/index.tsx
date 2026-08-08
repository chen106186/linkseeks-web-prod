import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useEffect } from 'react'
import { View, Text, Image, Icons } from '@apps/mobile-ui'
import { getOssUrlPath } from '@apps/constants'
import classNames from 'classnames'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { useIntl } from '@linkseeks/i18n'
import Copy from '@/components/Copy'
import Cell from '@/components/Cell'
import MellowCard from '@/components/MellowCard'
import useJmpHome from '@/hooks/useJmpHome'
import useEditRfqSubmitSuccess from '../services/hooks/useEditRfqSubmitSuccess'
import styles from './index.module.scss'
const EditRfqSubmitSuccess = () => {
  const intl = useIntl()
  const { info, condition, other, fileList, previewImageFunc, handleJumpMore, getInquiryInfo } =
    useEditRfqSubmitSuccess()
  const { jmpHome } = useJmpHome()
  const basicInfo = [
    {
      key: 0,
      title: intl.formatMessage({
        id: 'order.xunjiadanhao',
        defaultMessage: '询价单号',
      }),
      value: (
        <>
          <Text className={styles['copy-text']}>{info && info.inquiryListNo ? info.inquiryListNo : ''}</Text>
          <Copy text={info && info.inquiryListNo ? info.inquiryListNo : ''} />
        </>
      ),
    },
    {
      key: 1,
      title: intl.formatMessage({
        id: 'order.gongyingshang',
        defaultMessage: '供应商',
      }),
      value: info && info.memberName ? info.memberName : '',
    },
    {
      key: 2,
      title: intl.formatMessage({
        id: 'order.xuqiuzhaiyao',
        defaultMessage: '需求摘要',
      }),
      value: info && info.details ? info.details : '',
    },
  ]
  useEffect(() => {
    getInquiryInfo()
  }, [])
  return (
    <View className={styles['EditRfqSubmitSuccess']}>
      <View className={styles['advert']}>
        <Icons name="CheckCircle" size={32} color="#fff" />
        <View className={styles['advert-title']}>
          {intl.formatMessage({
            id: 'order.tijiaochenggong',
            defaultMessage: '提交成功',
          })}
        </View>
        <View className={styles['success-desc']}>
          {intl.formatMessage({
            id: 'order.xunjiayitijiaochenggong',
            defaultMessage: '询价已提交成功，请等待询价处理结果',
          })}
        </View>
        <View className={styles['success-actions']}>
          <View className={styles['success-actions-btn']} onClick={handleJumpMore}>
            {intl.formatMessage({
              id: 'order.gengduoxunjia',
              defaultMessage: '更多询价',
            })}
          </View>
          <View
            className={styles['success-actions-btn']}
            onClick={() => {
              jmpHome()
            }}
          >
            {intl.formatMessage({
              id: 'order.fanhuishouye',
              defaultMessage: '返回首页',
            })}
          </View>
        </View>
      </View>
      <View className={styles['EditRfqSubmitSuccess-mian']}>
        <View className={styles['EditRfqSubmitSuccess-mian-item']}>
          <MellowCard
            title={intl.formatMessage({
              id: 'order.jibenxinxi',
              defaultMessage: '基本信息',
            })}
          >
            <Cell>
              {basicInfo.map((item) => (
                <Cell.Item
                  key={item.key}
                  title={item.title}
                  value={item.value}
                  customHeadStyle={{
                    alignItems: 'flex-start',
                  }}
                />
              ))}
            </Cell>
          </MellowCard>
          <MellowCard
            title={intl.formatMessage({
              id: 'order.xunjiashangpin',
              defaultMessage: '询价商品',
            })}
            style={{
              marginTop: pxTransform(12),
            }}
          >
            <View className={styles['product']}>
              {info && info.inquiryListProductRequests
                ? info.inquiryListProductRequests.map((item, index) => (
                    <View
                      key={item.id}
                      className={classNames(
                        styles['product-item'],
                        index !== info.inquiryListProductRequests.length - 1 ? styles['product-item__notLast'] : '',
                      )}
                    >
                      <Text className={styles['product-item-name']}>{item.productName}</Text>
                      <Text className={styles['product-item-quantity']}>x{item.purchaseCount}</Text>
                    </View>
                  ))
                : null}
            </View>
          </MellowCard>
          <MellowCard
            title={intl.formatMessage({
              id: 'order.jiaoyitiaojian',
              defaultMessage: '交易条件',
            })}
            style={{
              marginTop: pxTransform(12),
            }}
            bodyStyle={{
              padding: 0,
            }}
          >
            <Cell>
              {condition.map((item) => (
                <Cell.Item
                  key={item.key}
                  title={item.title}
                  value={item.value}
                  customHeadStyle={{
                    alignItems: 'flex-start',
                  }}
                />
              ))}
            </Cell>
          </MellowCard>
          <MellowCard
            title={intl.formatMessage({
              id: 'order.qitatiaojian',
              defaultMessage: '其他条件',
            })}
            style={{
              marginTop: pxTransform(12),
            }}
            bodyStyle={{
              padding: 0,
            }}
          >
            <Cell>
              {other.map((item) => (
                <Cell.Item
                  key={item.key}
                  title={item.title}
                  value={item.value}
                  customHeadStyle={{
                    alignItems: 'flex-start',
                  }}
                />
              ))}
            </Cell>
          </MellowCard>
          <MellowCard
            title={intl.formatMessage({
              id: 'order.fujian',
              defaultMessage: '附件',
            })}
            style={{
              marginTop: pxTransform(12),
            }}
          >
            {fileList.length ? (
              <View className={styles['fileList']}>
                {fileList.map((item: any) => {
                  return (
                    <Image src={item.uri} mode="aspectFill" key={item.uri} onClick={() => previewImageFunc(item.uri)} />
                  )
                })}
              </View>
            ) : (
              <Image src={getOssUrlPath(`/Images/null.png`)} mode="aspectFill" />
            )}
          </MellowCard>
        </View>
      </View>
    </View>
  )
}
export default GlobalWrapper(EditRfqSubmitSuccess)
