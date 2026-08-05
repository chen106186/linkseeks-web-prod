import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useEffect, useState } from 'react'
import { setNavigationBarTitle, showToast, hideLoading } from '@apps/mobile-services/utils/taro'
import Router from '@/utils/router'
import { useIntl } from '@linkseeks/i18n'
import { View, Text, Input, Form, Toast } from '@apps/mobile-ui'
import AgreementLayout from '@/components/Agreement'
import { postPayAllInPayBindCompanyAccount, getPayAllInPayGetMemberInfo } from '@apps/apis'
import Layout from '../../components/Layout'
import styles from './index.module.scss'
import { usePageInit } from '@/hooks/usePageInit'
import { useMobileIntl } from '@apps/locales'
const EnterBindbankCard = () => {
  const intl = useIntl()
  const translate = useMobileIntl()
  const [formItems, setFormItems] = useState<any>({
    accountNo: '',
    bankName: '',
    branchName: '',
    bankNo: '',
  })
  const [agre, setagre] = useState<boolean>(true)
  usePageInit()
  useEffect(() => {
    async function GetMemberInfo() {
      const { code, data } = await getPayAllInPayGetMemberInfo()
      if (code === 1000) {
        const from = {
          accountNo: data.accountNo,
          bankName: data.bankName,
          branchName: data.branchName,
          bankNo: data.bankNo,
        }
        setFormItems({
          ...from,
        })
      }
    }
    // setNavigationBarTitle({ title: intl.formatMessage({id: 'pay.qiyehuiyuanrenzheng', defaultMessage: '企业会员认证'}) })
    GetMemberInfo()
  }, [])
  // 提交
  const Submit = async () => {
    if (!agre) {
      showToast({
        title: translate('mobile.resource.user.qingyueduxieyi'),
        icon: 'none',
      })
      return
    }
    const res: any = await postPayAllInPayBindCompanyAccount(formItems)
    if (res.code === 1000) {
      let arrUrl: any = [
        'basicSetting/entErpriseAuth',
        'basicSetting/ImageAcquisition',
        'basicSetting/enterpBindphone',
        'basicSetting/enterBindbankCard',
      ]
      const resj: any = await getPayAllInPayGetMemberInfo()
      if (resj.code === 1000) {
        // Router.navigateTo(arrUrl[resj.data.step]);
        Router.reLaunch('extra/mine', {
          hasTab: 'true',
        })
        hideLoading()
      } else {
        hideLoading()
      }
      // navigation.navigate('AccountInfo')
    } else {
      Toast.show({
        title: intl.formatMessage({
          id: `${res.code}`,
          defaultMessage: res.message,
        }),
      })
    }
  }
  // 给input赋值
  const changeInputValue = (key: string, val: any) => {
    setFormItems({
      ...formItems,
      [key]: val,
    })
  }
  return (
    <View className={styles.page}>
      <Layout steps={3}>
        <View className={styles.warp}>
          <View className={styles.warpItem}>
            <View className={styles.WarpTitle}>
              <Text className={styles.WarptitleText}>
                {intl.formatMessage({
                  id: 'pay.bangdingyinhangzhanghu',
                  defaultMessage: '绑定银行账户',
                })}
              </Text>
            </View>
            <View className={styles.FormTitem}>
              <View className={styles.lalbel}>
                {intl.formatMessage({
                  id: 'pay.qiyeduigongzhanghu',
                  defaultMessage: '企业对公账户',
                })}
              </View>
              <Input
                placeholder={intl.formatMessage({
                  id: 'pay.qingshuruqiyeduigongzhang',
                  defaultMessage: '请输入企业对公账户',
                })}
                className={styles.input}
                placeholderClass={styles.placeholder}
                value={formItems.accountNo}
                onChange={(e) => changeInputValue('accountNo', e)}
              />
            </View>
            <View className={styles.FormTitem}>
              <View className={styles.lalbel}>
                {intl.formatMessage({
                  id: 'pay.kaihuyinhangmingcheng',
                  defaultMessage: '开户银行名称',
                })}
              </View>
              <Input
                placeholder={intl.formatMessage({
                  id: 'pay.qingshurukaihuyinhangming',
                  defaultMessage: '请输入开户银行名称',
                })}
                className={styles.input}
                value={formItems.bankName}
                onChange={(e) => changeInputValue('bankName', e)}
                placeholderClass={styles.placeholder}
              />
            </View>
            <View className={styles.FormTitem}>
              <View className={styles.lalbel}>
                {intl.formatMessage({
                  id: 'pay.kaihuhangzhihangmingcheng',
                  defaultMessage: '开户行支行名称',
                })}
              </View>
              <Input
                placeholder={intl.formatMessage({
                  id: 'pay.qingshurukaihuhangzhihang',
                  defaultMessage: '请输入开户行支行名称',
                })}
                className={styles.input}
                value={formItems.branchName}
                onChange={(e) => changeInputValue('branchName', e)}
                placeholderClass={styles.placeholder}
              />
            </View>
            <View className={styles.FormTitem}>
              <View className={styles.lalbel}>
                {intl.formatMessage({
                  id: 'pay.zhifuhanghao',
                  defaultMessage: '支付行号',
                })}
              </View>
              <Input
                placeholder={intl.formatMessage({
                  id: 'pay.qingshuruzhifuhanghao',
                  defaultMessage: '请输入支付行号',
                })}
                className={styles.input}
                value={formItems.bankNo}
                onChange={(e) => changeInputValue('bankNo', e)}
                placeholderClass={styles.placeholder}
              />
            </View>
          </View>
          <AgreementLayout click={(e) => setagre(e)} consentText="阅读并同意" />
        </View>

        <View className={styles.btn} onClick={Submit}>
          <View className={styles.btnText}>
            {intl.formatMessage({
              id: 'pay.tijiao',
              defaultMessage: '提交',
            })}
          </View>
        </View>
      </Layout>
    </View>
  )
}
export default GlobalWrapper(EnterBindbankCard)
