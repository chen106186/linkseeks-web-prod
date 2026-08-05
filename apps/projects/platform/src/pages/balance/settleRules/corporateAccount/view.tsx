import React, { useState, useEffect } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { PageHeaderWrapper } from '@apps/components'
import styles from './index.less'
import { FormOutlined } from '@ant-design/icons'
import { Button, Input, Space } from 'antd'
import bank from '@/assets/imgs/bank.png'
import bank_account from '@/assets/imgs/bank_account.png'
import company from '@/assets/imgs/company.png'
import { authService } from '@apps/services'
import { usePrompt } from '@linkseeks/router-core'
import { useWebIntl } from '@apps/locales'
import { getSettlementCorporateAccountGetDetail, postSettlementCorporateAccountUpdateDetail } from '@apps/apis'

interface Config {
  name: string
  image: any
  value: string
  isEdit: boolean
  canEdit: boolean
  cacheValue: string
  changeEdit?: any
  pattern?: any
  message?: string
  dataIndex: string
}

interface AccountDetal {
  id: number
  name: string
  bankAccount: string
  bankDeposit: string
  memberId: number
}

const ItemRender: React.FC<Config> = (props) => {
  const { isEdit, name, canEdit, value, image, changeEdit, pattern, message } = props
  const [validError, setValidError] = useState(false)
  const intl = useIntl()
  // const [inputValue, setInputValue] = useState(value);
  const handleClick = (name: string) => {
    changeEdit(name, { isEdit: true }, 'change')
  }
  // 内容修改
  const handleChange = (value: string, name: string) => {
    if (pattern && !pattern.test(value)) {
      setValidError(true)
    } else {
      setValidError(false)
    }
    changeEdit(name, { value: value }, 'change')
  }
  // 取消按钮
  const handleCancel = (name: string) => {
    setValidError(false)
    changeEdit(name, { isEdit: false }, 'cancel')
  }
  // 确定提交
  const handleConfirm = (name: string) => {
    if (validError) {
      return
    }
    changeEdit(name, { isEdit: false }, 'confirm')
  }

  return (
    <div className={styles.container}>
      <div className={styles.item}>
        <div className={styles.image}>
          <img src={image} className={styles.img} />
        </div>
        <div className={styles.itemName}>{name}</div>
        <div className={styles.itemValue}>
          {isEdit ? (
            <Input value={value} style={{ width: '300px' }} onChange={(e) => handleChange(e.target.value, name)} />
          ) : (
            value
          )}
        </div>
        {canEdit ? (
          !isEdit ? (
            <div className={styles.edit} style={{ width: '300px' }} onClick={() => handleClick(name)}>
              <FormOutlined />
            </div>
          ) : (
            <div>
              <Space>
                <Button type="primary" onClick={() => handleConfirm(name)}>
                  {intl.formatMessage({ id: 'balance.settleRules.corporateAccount.itemRender.button.1' })}
                </Button>
                <Button onClick={() => handleCancel(name)}>
                  {intl.formatMessage({ id: 'balance.settleRules.corporateAccount.itemRender.button.2' })}
                </Button>
              </Space>
            </div>
          )
        ) : null}
      </div>
      <div className={styles.error}>{validError ? message : ''}</div>
    </div>
  )
}

const PARAM_TO_TYPE = {
  name: 1,
  bankAccount: 2,
  bankDeposit: 3,
}

const CorporateAccount = () => {
  const [configs, setConfigs] = useState<Config[]>([])
  const [unsaved, setUnsaved] = useState<boolean>(false)
  const intl = useIntl()
  const translate = useWebIntl()

  usePrompt({
    when: unsaved,
    message: intl.formatMessage({
      id: 'common.tip.save.confirm',
      defaultMessage: '您还有未保存的内容，是否确定要离开？',
    }),
  })
  // const [datas, setDatas] = useState<AccountDetal>(null);
  const changeEdit = (name: string, res: any, type: string) => {
    let temp = [...configs]
    const index = temp.findIndex((row) => row.name === name)
    const target = temp[index]
    if (type == 'change') {
      setUnsaved(true)
      temp[index] = {
        ...target,
        ...res,
      }
      setConfigs(temp)
    } else if (type == 'cancel') {
      setUnsaved(false)
      temp[index] = {
        ...target,
        ...res,
        value: type == 'cancel' ? target.cacheValue : target.value,
      }
      setConfigs(temp)
    } else if (type == 'confirm') {
      postSettlementCorporateAccountUpdateDetail({
        itemValue: target.value,
        itemType: PARAM_TO_TYPE[target.dataIndex],
      }).then((data) => {
        if (data.code == 1000) {
          setUnsaved(false)
          // setDatas(postData);
          temp[index] = {
            ...target,
            ...res,
            cacheValue: type == 'confirm' ? target.value : target.cacheValue,
          }
          setConfigs(temp)
        }
      })
    }
  }

  useEffect(() => {
    const { memberId, memberRoleId } = authService.getAuth() || {}
    // 进行基础赋值， fetchData
    ///settle/accounts/corporate/account/getDetail
    async function fetchData() {
      const { data } = await getSettlementCorporateAccountGetDetail()
      // setDatas(data);
      setConfigs([
        {
          name: intl.formatMessage({ id: 'balance.settleRules.corporateAccount.itemRender.setConfigs.name' }),
          dataIndex: 'name',
          image: company,
          value: data && data.name,
          cacheValue: data && data.name,
          isEdit: false,
          pattern: /^.{0,20}$/,
          canEdit: true,
          message: translate('web.resource.systemManage.zhanghaomingchengchangdubuchaoguoershi'),
        },
        {
          name: intl.formatMessage({ id: 'balance.settleRules.corporateAccount.itemRender.setConfigs.bankAccount' }),
          dataIndex: 'bankAccount',
          image: bank_account,
          value: data && data.bankAccount,
          cacheValue: data && data.bankAccount,
          isEdit: false,
          canEdit: true,
          pattern: /^[0-9]{8,20}$/,
          message: intl.formatMessage({
            id: 'balance.settleRules.corporateAccount.itemRender.setConfigs.bankAccount.message',
          }),
        },
        {
          name: intl.formatMessage({ id: 'balance.settleRules.corporateAccount.itemRender.setConfigs.bankDeposit' }),
          dataIndex: 'bankDeposit',
          image: bank,
          value: data && data.bankDeposit,
          cacheValue: data && data.bankDeposit,
          isEdit: false,
          canEdit: true,
          pattern: /^[\u4e00-\u9fa5]{0,50}|[0-9a-zA-Z]{0,100}$/,
          message: intl.formatMessage({
            id: 'balance.settleRules.corporateAccount.itemRender.setConfigs.bankDeposit.message',
          }),
        },
      ])
    }
    fetchData()
  }, [])

  return (
    <PageHeaderWrapper>
      {configs.map((item: Config, key) => {
        return <ItemRender key={item.name} {...item} changeEdit={changeEdit} />
      })}
    </PageHeaderWrapper>
  )
}

export default CorporateAccount
