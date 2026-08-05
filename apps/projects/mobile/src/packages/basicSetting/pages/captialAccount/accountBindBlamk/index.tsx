import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useState, useEffect } from 'react'
import { View, Text, Button, Toast, Input } from '@apps/mobile-ui'
import { useRouter, setNavigationBarTitle, pxTransform } from '@apps/mobile-services/utils/taro'
import useStores from '@/store/useStores'
import FullScreenLoading from '@/components/Loading/fullscreenLoading'
import Router from '@/utils/router'
import MellowCard from '@/components/MellowCard'
import { useIntl } from '@linkseeks/i18n'
import Cell from '@/components/Cell'
import { postSettlementMobileCorporateAccountUpdate } from '@apps/apis'
import styles from './index.module.scss'
import { usePageInit } from '@/hooks/usePageInit'
interface BlankProps {
  /** 修改的id */
  _id?: number
  /** 银行账户 */
  _name?: string
  /** 银行账号 */
  _bankAccount?: string
  /** 开户银行 */
  _bankDeposit?: string
}
const AccountBindBlamk: React.FC<{}> = () => {
  const params = useRouter()?.params
  const { _id, _name, _bankAccount, _bankDeposit }: BlankProps = params
  const intl = useIntl()
  const {
    userStore: { userInfo },
  } = useStores()
  usePageInit()
  useEffect(() => {
    // setNavigationBarTitle({ title: intl.formatMessage({ id: 'pay.bangdingyinhangka', defaultMessage: '绑定银行卡' }) })
  }, [])
  /** 绑定银行卡信息 */
  const [id, setId] = useState<number>()
  const [name, setName] = useState<string>(userInfo!.name)
  const [bankAccount, setBankAccount] = useState<string>('')
  const [bankDeposit, setBankDeposit] = useState<string>('')
  const [disabled, setDisabled] = useState<boolean>(true)
  const handleGetBlankInfo = (value, key: string) => {
    switch (key) {
      case 'name':
        setName(value)
        break
      case 'bankAccount':
        setBankAccount(value)
        break
      case 'bankDeposit':
        setBankDeposit(value)
        break
      default:
        break
    }
  }
  useEffect(() => {
    if (name && bankAccount && bankDeposit) {
      setDisabled(false)
    } else {
      setDisabled(true)
    }
  }, [name, bankAccount, bankDeposit])
  useEffect(() => {
    if (_id && _name && _bankAccount && _bankDeposit) {
      setId(_id)
      setName(decodeURI(_name!))
      setBankAccount(_bankAccount!)
      setBankDeposit(decodeURI(_bankDeposit!))
    }
  }, [_id, _name, _bankAccount, _bankDeposit])
  const handleSubmit = () => {
    const param: any = {
      name,
      bankAccount,
      bankDeposit,
    }
    _id && (param.id = _id)
    FullScreenLoading.show()
    postSettlementMobileCorporateAccountUpdate(param).then((res) => {
      if (res.code !== 1000) {
        Toast.show({
          title: intl.formatMessage({
            id: `${res.code}`,
            defaultMessage: res.message,
          }),
          icon: 'none',
        })
        FullScreenLoading.hide()
        return
      }
      FullScreenLoading.hide()
      Router.navigateBack()
    })
  }
  return (
    <View className={styles['bindBlankPage']}>
      <FullScreenLoading />
      <View className={styles['bindBlankPage-blankWrapper']}>
        <MellowCard
          bodyStyle={{
            padding: pxTransform(0),
          }}
        >
          <Cell>
            <Cell.Item
              title={intl.formatMessage({
                id: 'pay.yinhangzhanghu',
                defaultMessage: '银行账户',
              })}
              value={
                <Input
                  placeholder={intl.formatMessage({
                    id: 'pay.qingshuruyinhangzhanghu',
                    defaultMessage: '请输入银行账户',
                  })}
                  value={name}
                  placeholderClass={styles['bindBlankPage-placeholderClass']}
                  border={false}
                  onChange={(e) => handleGetBlankInfo(e, 'name')}
                />
              }
            />
            <Cell.Item
              title={intl.formatMessage({
                id: 'pay.yinhangzhanghao',
                defaultMessage: '银行账号',
              })}
              value={
                <Input
                  placeholder={intl.formatMessage({
                    id: 'pay.qingshuruyinhangzhanghao',
                    defaultMessage: '请输入银行账号',
                  })}
                  value={bankAccount}
                  placeholderClass={styles['bindBlankPage-placeholderClass']}
                  type="number"
                  border={false}
                  onChange={(e) => handleGetBlankInfo(e, 'bankAccount')}
                />
              }
            />
            <Cell.Item
              title={intl.formatMessage({
                id: 'pay.kaihuyinhang',
                defaultMessage: '开户银行',
              })}
              value={
                <Input
                  placeholderClass={styles['bindBlankPage-placeholderClass']}
                  placeholder={intl.formatMessage({
                    id: 'pay.qingshurukaihuhang',
                    defaultMessage: '请输入开户行',
                  })}
                  value={bankDeposit}
                  border={false}
                  onChange={(e) => handleGetBlankInfo(e, 'bankDeposit')}
                  maxlength={50}
                />
              }
            />
          </Cell>
        </MellowCard>
      </View>
      <View className={styles['bindBlankPage-action']}>
        <Button type="primary" disabled={disabled} onClick={handleSubmit}>
          <Text
            style={{
              color: 'white',
              width: '100%',
              textAlign: 'center',
            }}
          >
            {intl.formatMessage({
              id: 'pay.queding',
              defaultMessage: '确定',
            })}
          </Text>
        </Button>
      </View>
    </View>
  )
}
export default GlobalWrapper(AccountBindBlamk)
