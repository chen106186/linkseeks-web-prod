import React, { useMemo } from 'react'
import { Tag, Button, Space, Dropdown, Modal } from '@linkseeks/ui'
import { ArrowDownFillIcon, PaletteIcon } from '@linkseeks/icons'
import { WEB } from '@apps/constants'
import { ENVIRONMENT_TYPE, PROPERTY_TYPE } from '@/constants/environment'
import { MenuProps } from 'antd/lib/menu'
import { useIntl } from '@linkseeks/i18n'
import { getMallLink } from '@apps/utils'
import { StoreShopItemType } from '../../types'
import useStore from '../../hooks/useStore'
import styles from './index.less'
import { AuthButton } from '@apps/components'
import { useWebIntl } from '@apps/locales'
import { history } from '@linkseeks/router-manager'
interface StoreShopItemProps {
  itemInfo: StoreShopItemType
  storeId: string
}

const StoreShopItem: React.FC<StoreShopItemProps> = (props) => {
  const { itemInfo, storeId } = props
  const { createShopAdorn } = useStore()
  const intl = useIntl()

  const translate = useWebIntl()
  const handleJumpStore = () => {
    if (itemInfo?.environment === WEB) {
      const storeLink = `${getMallLink(itemInfo?.url)}/shop/${storeId}`
      window.open(storeLink)
    }
  }

  const items: MenuProps['items'] = useMemo(() => {
    return [
      {
        key: 'shopInfo',
        disabled: !Boolean(itemInfo?.storeAdornId),
        label: (
          <div
            onClick={() => {
              if (itemInfo?.storeAdornId) {
                handleJumpAdorn(itemInfo?.storeAdornId, true)
              }
            }}
          >
            {intl.formatMessage({ id: 'common.button.preview', defaultMessage: '预览' })}
          </div>
        ),
      },
      {
        key: 'edit',
        disabled: itemInfo?.environment !== WEB,
        label: (
          <div onClick={handleJumpStore}>
            {intl.formatMessage({ id: 'store.button.access', defaultMessage: '访问店铺' })}
          </div>
        ),
      },
    ]
  }, [itemInfo])

  const handleJumpAdorn = (storeAdornId: number, preview = false) => {
    if (!storeAdornId) return
    if (itemInfo?.environment === WEB) {
      history.jump(
        `/shopAbility/shopManage/adorn/design${preview ? '' : '/edit'}?adornId=${storeAdornId}&environment=${
          itemInfo?.environment
        }&shopId=${itemInfo?.id}&storeId=${storeId}`,
      )
    } else {
      history.jump(
        `/shopAbility/shopManage/adorn/design/mobile${preview ? '' : '/edit'}?adornId=${storeAdornId}&environment=${
          itemInfo?.environment
        }&shopId=${itemInfo?.id}&storeId=${storeId}`,
      )
    }
  }

  const handleAdorn = async () => {
    if (itemInfo?.storeAdornId) {
      handleJumpAdorn(itemInfo?.storeAdornId)
    } else {
      const storeAdornId = await createShopAdorn(itemInfo?.id, Number(storeId))
      if (storeAdornId) {
        handleJumpAdorn(storeAdornId)
      }
    }
  }

  return (
    <div className={styles['mall-item']}>
      <div className={styles['mall-item-main']}>
        <div className={styles['mall-item-info']}>
          <div className={styles['mall-item-info-title']}>
            {intl.formatMessage({ id: 'store.text.inmall', defaultMessage: '店铺所在商城' })}
          </div>
          <div className={styles['mall-item-info-name']}>{itemInfo?.name}</div>
          <div className={styles['mall-item-info-line']}>
            <Tag className={styles['mall-item-info-tag']} color="#F5F6F7">
              {PROPERTY_TYPE[itemInfo?.property]}
            </Tag>
            <Tag
              className={styles['mall-item-info-tag']}
              color={ENVIRONMENT_TYPE[itemInfo?.environment].background}
              style={{
                color: ENVIRONMENT_TYPE[itemInfo?.environment].color,
              }}
            >
              {ENVIRONMENT_TYPE[itemInfo?.environment].name}
            </Tag>
          </div>
        </div>
      </div>
      <div className={styles['mall-item-actions']}>
        <Space>
          <AuthButton type="custom" code="design/edit">
            <Button onClick={handleAdorn} icon={<PaletteIcon />} type="secondary">
              {intl.formatMessage({ id: 'common.button.design', defaultMessage: '装修' })}
            </Button>
          </AuthButton>
          <Dropdown menu={{ items }} placement="bottomRight">
            <div className={styles['mall-item-actions-dropdown-btn']}>
              <span>{intl.formatMessage({ id: 'common.text.more', defaultMessage: '更多' })}</span>
              <ArrowDownFillIcon size={16} />
            </div>
          </Dropdown>
        </Space>
      </div>
    </div>
  )
}

export default StoreShopItem
