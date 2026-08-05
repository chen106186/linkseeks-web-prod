import React from 'react'
import { Button, Tag, Space } from '@linkseeks/ui'
import { SHOP_TYPE_ENUM, WEB } from '@apps/constants'
import { ShareIcon, EditIcon, PaletteIcon } from '@linkseeks/icons'
import { getMallLink } from '@apps/utils'
import { ENVIRONMENT_TYPE } from '@apps/constants'
import PortalModal from '../PortalModal'
import { PortalItemType } from '../../types'
import { DOOR_ICONS } from '../../constants'
import useEditProtal from '../../hooks/useEditPortal'
import styles from './index.less'
import { AuthButton } from '@apps/components'
import { history } from '@linkseeks/router-manager'
interface ProtalItemProps {
  mallInfo: PortalItemType
  /** 更新列表数据 */
  onRefresh: () => void
}

const ProtalItem: React.FC<ProtalItemProps> = (props) => {
  const { mallInfo, onRefresh } = props
  const { saveLoading, editVisible, editForm, setEditVisible, editMallInfo, createShopAdorn } = useEditProtal({
    refreshFn: onRefresh,
  })

  /** 访问门户链接 */
  const handleJumpDoor = () => {
    if (mallInfo.environment === WEB) {
      const doorLink = getMallLink(mallInfo?.url)
      if (doorLink) {
        window.open(doorLink)
      }
    }
  }

  const handleJumpAdorn = (adornId: number, preview = false) => {
    history.jump(
      `/mallManage/portal/design${preview ? '' : '/edit'}?id=${adornId}&environment=${mallInfo?.environment}&shopId=${
        mallInfo?.id
      }`,
    )
  }

  const handleAdorn = async () => {
    if (mallInfo?.adornId) {
      handleJumpAdorn(mallInfo?.adornId)
    } else {
      const adornId = await createShopAdorn(mallInfo?.id)
      if (adornId) {
        handleJumpAdorn(adornId)
      }
    }
  }

  return (
    <div className={styles['door-item']}>
      <div className={styles['door-item-body']}>
        <img className={styles['door-item-icon']} src={DOOR_ICONS[mallInfo.type]} />
        <div className={styles['door-item-name']}>{mallInfo.name}</div>
        {mallInfo.type !== SHOP_TYPE_ENUM.MAIN_PORTAL && (
          <Tag
            className={styles['door-item-tag']}
            color={ENVIRONMENT_TYPE[mallInfo?.environment]?.background}
            style={{
              color: ENVIRONMENT_TYPE[mallInfo?.environment]?.color,
            }}
          >
            {ENVIRONMENT_TYPE[mallInfo?.environment]?.name}
          </Tag>
        )}
        <div className={styles['door-item-actions']}>
          <Space>
            {mallInfo.type === SHOP_TYPE_ENUM.MAIN_PORTAL && (
              <AuthButton type="custom" code="design/edit">
                <Button type="primary" onClick={handleAdorn} icon={<PaletteIcon />}>
                  装修
                </Button>
              </AuthButton>
            )}
            <Button
              onClick={() => setEditVisible(true)}
              className={styles['door-item-actions-btn']}
              icon={<EditIcon />}
            >
              编辑
            </Button>
            <Button
              disabled={mallInfo?.environment !== WEB}
              onClick={() => handleJumpDoor()}
              className={styles['door-item-actions-btn']}
              icon={<ShareIcon />}
            >
              访问
            </Button>
          </Space>
        </div>
      </div>
      <PortalModal
        saveLoading={saveLoading}
        form={editForm}
        visible={editVisible}
        mallInfo={mallInfo}
        setVisible={setEditVisible}
        onOk={editMallInfo}
      />
    </div>
  )
}

export default ProtalItem
