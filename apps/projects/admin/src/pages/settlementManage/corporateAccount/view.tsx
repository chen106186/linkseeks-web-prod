import React, { useState, useEffect } from 'react'
import styles from './index.less'
import { FormOutlined } from '@ant-design/icons'
import { Button, Input, Space, Popconfirm } from 'antd'
import bank from '@/assets/bank.png'
import bank_account from '@/assets/bank_account.png'
import company from '@/assets/company.png'
import { usePrompt } from '@linkseeks/router-core'
import {
  getSettlementPlatformConfigGetPlatformAccountConfig,
  postSettlementPlatformConfigUpdatePlatformAccountConfigDetail,
} from '@apps/apis'

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

const ItemRender: React.FC<Config> = (props) => {
  const { isEdit, name, canEdit, value, image, changeEdit, pattern, message } = props
  const [validError, setValidError] = useState(false)
  // const [inputValue, setInputValue] = useState(value);
  const handleClick = (_name: string) => {
    changeEdit(_name, { isEdit: true }, 'change')
  }
  // 内容修改
  const handleChange = (_value: string, _name: string) => {
    if (!pattern.test(_value)) {
      setValidError(true)
    } else {
      setValidError(false)
    }
    changeEdit(_name, { value: _value }, 'change')
  }
  // 取消按钮
  const handleCancel = (_name: string) => {
    setValidError(false)
    changeEdit(_name, { isEdit: false }, 'cancel')
  }
  // 确定提交
  const handleConfirm = (_name: string) => {
    if (validError) {
      return
    }
    changeEdit(_name, { isEdit: false }, 'confirm')
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
                  确定
                </Button>
                <Popconfirm title="确定取消吗？" onConfirm={() => handleCancel(name)}>
                  <Button>取消</Button>
                </Popconfirm>
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
  const [, setData] = useState<any>({})
  const [unsaved, setUnsaved] = useState<boolean>(false)
  usePrompt({ when: unsaved, message: '信息还未保存，确定离开吗？' })

  const changeEdit = (name: string, res: any, type: string) => {
    const temp = [...configs]
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
      setUnsaved(false)
      postSettlementPlatformConfigUpdatePlatformAccountConfigDetail({
        itemValue: target.value,
        itemType: PARAM_TO_TYPE[target.dataIndex],
      }).then((data) => {
        if (data.code == 1000) {
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
    async function fetchData() {
      const { data } = await getSettlementPlatformConfigGetPlatformAccountConfig()
      setData(data)
      setConfigs([
        {
          name: '账号名称',
          pattern: /.+/,
          message: '请填写账号名称',
          dataIndex: 'name',
          image: company,
          value: (data && data.name) || '',
          cacheValue: (data && data.name) || '',
          isEdit: false,
          canEdit: true,
        },
        {
          name: '银行账号',
          dataIndex: 'bankAccount',
          image: bank_account,
          value: (data && data.bankAccount) || '',
          cacheValue: (data && data.bankAccount) || '',
          isEdit: false,
          canEdit: true,
          pattern: /^[0-9]{8,20}$/,
          message: '请输入正确的银行账号',
        },
        {
          name: '开户行',
          dataIndex: 'bankDeposit',
          image: bank,
          value: (data && data.bankDeposit) || '',
          cacheValue: (data && data.bankDeposit) || '',
          isEdit: false,
          canEdit: true,
          pattern: /^[\u4e00-\u9fa5]{0,50}|[0-9a-zA-Z]{0,100}$/,
          message: '最多50个汉字',
        },
      ])
    }
    fetchData()
  }, [])

  return (
    <div>
      {configs.map((item: Config) => {
        return <ItemRender key={item.name} {...item} changeEdit={changeEdit} />
      })}
    </div>
  )
}

export default CorporateAccount
