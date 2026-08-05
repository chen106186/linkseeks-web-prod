import React, { useState, useEffect } from 'react'
import { View, Text, Icons, Image } from '@apps/mobile-ui'
import Router from '@/utils/router'
import { useIntl } from '@linkseeks/i18n'
import { pxTransform, preload, showLoading, hideLoading } from '@apps/mobile-services/utils/taro'
import { getPayAllInPayGetMemberInfo, postPayAllInPaySignContract, postPayAllInPaySignContractQuery } from '@apps/apis'
import styles from './index.module.scss'

const AccountInfo = () => {
  const intl = useIntl()
  const [MemberInfo, setMemberInfo] = useState<any>({
    Cell1: [],
    Cell2: [],
    Cell3: [],
  })
  const [Data, setData] = useState<any>({})
  // const navigation = useNavigation();
  const Like = (phone: string) => {
    console.log(phone, 'phone')
    if (phone) {
      preload('params', {
        onConfirm: onConfirm,
        phone,
        type: 'phone',
        bankNo: '',
      })
      Router.navigateTo('basicSetting/unbound')
    } else {
      preload('params', {
        onConfirm: onConfirm,
      })
      Router.navigateTo('basicSetting/bindphone')
    }
  }
  const getAuthMemberInfo = async () => {
    // getPayAllInPayGetAuthMemberInfo
    showLoading({
      title: '加载中',
    })
    const res: any = await getPayAllInPayGetMemberInfo()
    console.log(JSON.stringify(res.data), 'res')
    let positive: any = {}
    let otherve: any = {}
    let License: any = {}
    res.data?.picUrl &&
      res.data.picUrl.forEach((element: any) => {
        console.log(element, 'element')
        if (element.picType === 1) {
          License = element
        }
        if (element.picType === 9) {
          positive = element
        }
        if (element.picType === 8) {
          otherve = element
        }
      })
    console.log(License, 'positive')
    if (res.code === 1000) {
      setData(res.data)
      if (res.data.allInMemberType === 3) {
        const data = {
          Cell1: [
            {
              name: intl.formatMessage({ id: 'pay.xingming', defaultMessage: '姓名' }),
              value: res.data.name,
            },
            {
              name: intl.formatMessage({ id: 'pay.zhengjianleixing', defaultMessage: '证件类型' }),
              value: intl.formatMessage({ id: 'pay.shenfenzheng', defaultMessage: '身份证' }),
            },
            {
              name: intl.formatMessage({ id: 'pay.zhengjianhao', defaultMessage: '证件号' }),
              value: res.data.identityCardNo,
            },
            {
              name: intl.formatMessage({ id: 'pay.shoujihao', defaultMessage: '手机号' }),
              value: (
                <View onClick={() => Like(res.data.phone)}>
                  <View
                    style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', fontSize: pxTransform(14) }}
                  >
                    <Text className={styles.size}>{res.data.phone ? res.data.phone : '未绑定'}</Text>
                    <Icons name="ChevronRight" size={14} />
                  </View>
                </View>
              ),
            },
          ],
          Cell2: [
            {
              name: intl.formatMessage({ id: 'pay.yinhangzhanghao', defaultMessage: '银行账号' }),
              value: res.data.bankNo,
            },
          ],
          Cell3: [
            {
              name: intl.formatMessage({ id: 'pay.dianzixieyiqianyue', defaultMessage: '电子协议签约' }),
              value: res.data.contractNo,
            },
          ],
        }
        setMemberInfo(data)
      } else {
        const data = {
          Cell1: [
            {
              name: intl.formatMessage({ id: 'pay.qiyemingcheng', defaultMessage: '企业名称' }),
              value: res.data.name,
            },
            {
              name: intl.formatMessage({ id: 'pay.tongyishehuixinyongdaima', defaultMessage: '统一社会信用代码' }),
              value: res.data.uniCredit,
            },
            {
              name: intl.formatMessage({ id: 'pay.qiyeduigongzhanghu', defaultMessage: '企业对公账户' }),
              value: res.data.accountNo,
            },
            {
              name: intl.formatMessage({ id: 'pay.kaihuyinhangmingcheng', defaultMessage: '开户银行名称' }),
              value: res.data.bankName,
            },
            {
              name: intl.formatMessage({ id: 'pay.zhihangkahao', defaultMessage: '支行卡号' }),
              value: res.data.bankNo,
            },
          ],
          Cell2: [
            {
              name: intl.formatMessage({ id: 'pay.farenxingming', defaultMessage: '法人姓名' }),
              value: res.data.name,
            },
            {
              name: intl.formatMessage({ id: 'pay.farenshoujihao', defaultMessage: '法人手机号' }),

              value: (
                <View onClick={() => Like(res.data.phone)}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text className={styles.size}>
                      {res.data.phone
                        ? res.data.phone
                        : intl.formatMessage({ id: 'pay.weibangding', defaultMessage: '未绑定' })}
                    </Text>
                    <Icons name="ChevronRight" size={14} />
                  </View>
                </View>
              ),
            },
            {
              name: intl.formatMessage({ id: 'pay.zhengjianleixing', defaultMessage: '证件类型' }),
              value: intl.formatMessage({ id: 'pay.shenfenzheng', defaultMessage: '身份证' }),
            },
            {
              name: intl.formatMessage({ id: 'pay.farenshenfenzheng', defaultMessage: '法人身份证' }),
              value: res.data.identityCardNo,
            },
            {
              name: intl.formatMessage({ id: 'pay.farenshenfenzhengzhengmian', defaultMessage: '法人身份证正面' }),

              value: <Image src={positive.picture} className={styles.Img} mode="aspectFill" />,
            },
            {
              name: intl.formatMessage({ id: 'pay.farenshenfenzhengfanmian', defaultMessage: '法人身份证反面' }),

              value: <Image src={otherve.picture} className={styles.Img} mode="aspectFill" />,
            },
          ],
          Cell3: [
            {
              name: intl.formatMessage({ id: 'pay.yingyezhizhao', defaultMessage: '营业执照' }),
              value: <Image src={License.picture} className={styles.Img} mode="aspectFill" />,
            },
          ],
        }
        setMemberInfo(data)
        hideLoading()
      }
    }
    hideLoading()
  }
  useEffect(() => {
    getAuthMemberInfo()
  }, [])

  const onConfirm = () => {
    getAuthMemberInfo()
  }
  const onBindbankCard = (value: string) => {
    if (Data.allInMemberType) {
      if (value) {
        preload('params', {
          onConfirm: onConfirm,
          phone: '',
          type: 'bankCard',
          bankNo: value,
        })
        // 取消绑定
        Router.navigateTo('basicSetting/unbound')
      } else {
        preload('params', {
          onConfirm: onConfirm,
          name: Data.name,
          identityCardType: 1,
          identityCardNo: Data.identityCardNo,
          phone: Data.phone,
        })
        Router.navigateTo('basicSetting/bindbankCard')
      }
    }
  }
  // 点击签约
  const onContract = async (key: string) => {
    if (!key) {
      const res = await postPayAllInPaySignContract({ jumpPageType: 1 })
      preload('params', {
        onConfirm: onConfirm,
        url: res.data,
      })
      Router.navigateTo('basicSetting/webInfo')
    } else {
      const res = await postPayAllInPaySignContractQuery({ jumpPageType: 1 })
      preload('params', {
        onConfirm: onConfirm,
        url: res.data,
      })
      Router.navigateTo('basicSetting/webInfo')
    }
  }
  return (
    <View className={styles.page}>
      <View>
        <View className={styles.Warp}>
          {MemberInfo.Cell1.map((item: any, index: number) => (
            <View className={styles.WarpItem} key={`Cell1-${index}`}>
              <View>{item.name}</View>
              <View style={{ flexDirection: 'row', alignItems: 'center', display: 'flex' }}>{item.value}</View>
            </View>
          ))}
        </View>
        <View className={styles.Warp}>
          {MemberInfo.Cell2.map((item: any, index: number) => (
            <View key={`Cell2-${index}`} className={styles.WarpItem} onClick={() => onBindbankCard(item.value)}>
              <View>{item.name}</View>
              <View style={{ flexDirection: 'row', alignItems: 'center', display: 'flex' }}>
                {item.value ? item.value : '未绑定'}
              </View>
            </View>
          ))}
        </View>
        <View className={styles.Warp}>
          {MemberInfo.Cell3.map((item: any, index: number) =>
            item.name === '电子协议签约' ? (
              <View key={`Cell3-${index}`} className={styles.WarpItem} onClick={() => onContract(item.value)}>
                <View>{item.name}</View>
                <View style={{ flexDirection: 'row', display: 'flex', alignItems: 'center' }}>
                  {item.value}
                  <Icons name="ChevronRight" size={14} />
                </View>
              </View>
            ) : (
              <View className={styles.WarpItem} key={`Cell3-${index}`}>
                <View>{item.name}</View>
                <View style={{ flexDirection: 'row', alignItems: 'center', display: 'flex' }}>{item.value}</View>
              </View>
            ),
          )}
        </View>
      </View>
    </View>
  )
}
export default AccountInfo
