/**
 * @Description 导入会员弹窗
 */
import React, { useEffect, useMemo, useState } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Modal, Spin, Radio, RadioChangeEvent } from 'antd'
import { getMemberCustomerAbilitySubExcelRole } from '@apps/apis'
import themeConfig from '@apps/config/lingxi.theme.config'
import styles from './index.less'

export type AddressValueType = {
  /**
   * 角色Id
   */
  roleId: number
  /**
   * 角色Id
   */
  roleName: string
}

interface MemberRolesModalProps {
  /**
   * 是否可见
   */
  visible: boolean
  /**
   * 关闭触发函数
   */
  onClose: () => void
  /**
   * 点击确认触发事件
   */
  onConfirm: (roleId: number) => void
}

const MemberRolesModal: React.FC<MemberRolesModalProps> = (props) => {
  const { visible, onClose, onConfirm } = props

  const [list, setList] = useState<AddressValueType[]>([])
  const [listLoading, setListLoading] = useState(false)
  const [internalValue, setInternalValue] = useState<number>(0)

  const intl = useIntl()

  const fetchRolesList = () => {
    setListLoading(true)
    getMemberCustomerAbilitySubExcelRole()
      .then((res) => {
        if (res.code === 1000) {
          setList(res.data)
        }
      })
      .finally(() => {
        setListLoading(false)
      })
  }

  useEffect(() => {
    if (visible) {
      fetchRolesList()
    }
  }, [visible])

  const handleClose = () => {
    onClose?.()
  }

  const handleSelectItem = (id: number) => {
    setInternalValue(id)
  }

  const handleRadioChange = (e: RadioChangeEvent) => {
    setInternalValue(e.target.value)
  }

  const handleRadioClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation()
  }

  const handleConfirm = () => {
    onConfirm?.(internalValue)
  }

  const options = useMemo(() => {
    return list.map((item) => ({
      value: item.roleId,
      label: item.roleName,
    }))
  }, [list])

  return (
    <Modal
      title={intl.formatMessage({
        id: 'customerAbility.memberImport.components.MemberRolesModal.title',
        defaultMessage: '选择导入角色',
      })}
      cancelText={intl.formatMessage({ id: 'common.button.cancel', defaultMessage: '取消' })}
      okText={intl.formatMessage({
        id: 'customerAbility.memberImport.components.MemberRolesModal.next.step',
        defaultMessage: '下一步',
      })}
      visible={visible}
      onCancel={handleClose}
      onOk={handleConfirm}
      width={400}
      bodyStyle={{
        padding: themeConfig['@padding-xs'],
      }}
      maskClosable={false}
      okButtonProps={{
        disabled: !internalValue,
      }}
    >
      <Spin spinning={listLoading}>
        <Radio.Group value={internalValue} className={styles['customerAbility-roles']}>
          {options.map((item) => (
            <div
              key={item.value}
              className={styles['customerAbility-roles-item']}
              onClick={() => handleSelectItem(item.value)}
            >
              <div className={styles['customerAbility-roles-item-left']}>
                <Radio value={item.value} onClick={handleRadioClick} onChange={handleRadioChange}>
                  {item.label}
                </Radio>
              </div>
            </div>
          ))}
        </Radio.Group>
      </Spin>
    </Modal>
  )
}

export default MemberRolesModal
