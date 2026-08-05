import React, { useMemo } from 'react'
import { Tag, Button, Space, Dropdown, Modal } from '@linkseeks/ui'
import { ImageBox, AuthButton } from '@apps/components'
import { ArrowDownFillIcon, PaletteIcon } from '@linkseeks/icons'
import { Link } from '@linkseeks/router-core'
import { history } from '@linkseeks/router-manager'
import defaultLogo from '@/assets/imgs/default_logo.jpg'
import { MenuProps } from 'antd/lib/menu'
import { customAuthUrl } from '@apps/domains'
import { useIntl } from '@linkseeks/i18n'
import { StoreItemType } from '../../types'
import styles from './index.less'
import { SHOP_STATUS_TYPE } from '../../constants'
import { renderShopAreas } from '../../utils'
import useStore from '../../hooks/useStore'

interface StoreItemProps {
  itemInfo: StoreItemType
  onShowPrint: () => void
  /** 更新列表数据 */
  onRefresh: () => void
}

const StoreItem: React.FC<StoreItemProps> = (props) => {
  const { itemInfo, onRefresh, onShowPrint } = props
  const { changeStoreState } = useStore({ refreshFn: onRefresh })
  const intl = useIntl()

  const handleCloseShop = () => {
    if (itemInfo?.status === 1) {
      Modal.confirm({
        title: intl.formatMessage({
          id: 'store.deactivate.tip',
          defaultMessage: '关闭店铺后该商城将不允许再被访问！',
        }),
        onOk: () => {
          changeStoreState(itemInfo.id, 0)
        },
      })
    } else {
      changeStoreState(itemInfo.id, 1)
    }
  }

  const items: MenuProps['items'] = useMemo(() => {
    const actioinsMap = {
      shopInfo: true,
      setPrint: true,
      edit: customAuthUrl('edit'),
      open: itemInfo?.status !== 1 && customAuthUrl('open'),
      close: itemInfo?.status === 1 && customAuthUrl('close'),
    }
    const actionsKeys = Object.keys(actioinsMap).filter((key) => actioinsMap[key])

    const actioinsButtons = [
      {
        key: 'shopInfo',
        label: (
          <AuthButton type="detail">
            <Link to={`/shopAbility/shopManage/detail?id=${itemInfo?.id}`}>
              {intl.formatMessage({
                id: 'store.info',
                defaultMessage: '店铺信息',
              })}
            </Link>
          </AuthButton>
        ),
      },
      {
        key: 'setPrint',
        label: <div onClick={onShowPrint}>配置打印机</div>,
      },
      {
        key: 'edit',
        label: (
          <AuthButton type="edit">
            <Link to={`/shopAbility/shopManage/edit?id=${itemInfo?.id}`}>
              {intl.formatMessage({
                id: 'common.button.edit',
                defaultMessage: '编辑',
              })}
            </Link>
          </AuthButton>
        ),
      },
      {
        key: 'open',
        label: (
          <div onClick={handleCloseShop}>
            {intl.formatMessage({ id: 'store.button.enabled', defaultMessage: '启用店铺' })}
          </div>
        ),
      },
      {
        key: 'close',
        label: (
          <div onClick={handleCloseShop}>
            {intl.formatMessage({ id: 'store.button.deactivate', defaultMessage: '关闭店铺' })}
          </div>
        ),
      },
    ]
    return actioinsButtons.filter((item) => actionsKeys.includes(item.key))
  }, [itemInfo])

  return (
    <div className={styles['shop-item']}>
      <div className={styles['shop-item-body']}>
        <ImageBox resizeMode="cover" width={88} height={88} round={8} src={itemInfo?.logo || defaultLogo} />
        <div className={styles['shop-item-main']}>
          <div className={styles['shop-item-line']}>
            <div className={styles['shop-item-name']}>{itemInfo?.name}</div>
          </div>
          <div className={styles['shop-item-line']}>
            <Tag
              color={SHOP_STATUS_TYPE[itemInfo?.status]?.background}
              style={{
                color: SHOP_STATUS_TYPE[itemInfo?.status]?.color,
              }}
            >
              {SHOP_STATUS_TYPE[itemInfo?.status]?.name}
            </Tag>
          </div>
          <div className={styles['shop-item-line']}>
            <label>
              {intl.formatMessage({ id: 'shop.form.label.memberShopAreas', defaultMessage: '业务所在地' })}：
            </label>
            <span>{renderShopAreas(itemInfo?.areaList)}</span>
          </div>
        </div>
        <div className={styles['shop-item-actions']}>
          <Space>
            <AuthButton type="custom" code="adorn">
              <Button
                onClick={() => history.push(`/shopAbility/shopManage/adorn?id=${itemInfo.id}`)}
                icon={<PaletteIcon />}
                type="primary"
              >
                {intl.formatMessage({ id: 'common.button.design', defaultMessage: '装修' })}
              </Button>
            </AuthButton>
            <Dropdown menu={{ items }} placement="bottomRight">
              <div className={styles['shop-item-actions-dropdown-btn']}>
                <span>{intl.formatMessage({ id: 'common.text.more', defaultMessage: '更多' })}</span>
                <ArrowDownFillIcon size={16} />
              </div>
            </Dropdown>
          </Space>
        </div>
      </div>
    </div>
  )
}

export default StoreItem
