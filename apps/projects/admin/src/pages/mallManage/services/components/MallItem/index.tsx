import React, { useMemo } from 'react'
import { ImageBox, AuthButton } from '@apps/components'
import { Tag, Button, Dropdown, Space, Modal } from '@linkseeks/ui'
import defaultLogo from '@/assets/default_logo.jpg'
import { ArrowDownFillIcon, LayoutIcon } from '@linkseeks/icons'
import { MenuProps } from 'antd/lib/menu'
import { ENVIRONMENT_TYPE } from '@apps/constants'
import { getMallLink } from '@apps/utils'
import { customAuthUrl } from '@apps/domains'
import { WEB } from '@apps/constants'
import MallModal from '../MallModal'
import { MallItemType } from '../../types'
import { MALL_STATUS_TYPE } from '../../constants'
import useEditMall from '../../hooks/useEditMall'
import styles from './index.less'
import { history } from '@linkseeks/router-manager'
interface MallItemProps {
  mallInfo: MallItemType
  /** 已有相同环境下的默认商城信息 */
  defaultMall: MallItemType | undefined
  /** 更新列表数据 */
  onRefresh: () => void
}

const MallItem: React.FC<MallItemProps> = (props) => {
  const { mallInfo, defaultMall, onRefresh } = props
  const {
    saveLoading,
    editVisible,
    editForm,
    setEditVisible,
    setDeafultMall,
    editMallInfo,
    createShopAdorn,
    changeMallState,
  } = useEditMall({
    refreshFn: onRefresh,
  })

  /**
   * 设置默认商城
   */
  const handleSetDefault = () => {
    if (defaultMall) {
      Modal.confirm({
        content: `当前默认商城为${defaultMall.name}，是否替换默认商城？`,
        onOk: async () => {
          await setDeafultMall(mallInfo)
        },
      })
    } else {
      setDeafultMall(mallInfo)
    }
  }

  /**
   * 停用商城
   */
  const handleStopMall = () => {
    Modal.confirm({
      content: `停用商城后该商城将不允许再访问!`,
      onOk: async () => {
        await changeMallState(mallInfo?.id, false)
      },
    })
  }

  /**
   * 访问商城链接
   */
  const handleInterview = () => {
    const mallLink = getMallLink(mallInfo?.url)
    if (mallLink) {
      history.open(mallLink)
    }
  }

  const handleJumpAdorn = (adornId: number, preview = false) => {
    if (mallInfo?.environment === WEB) {
      history.jump(
        `/mallManage/jointManage/joint/design${preview ? '' : '/edit'}?adornId=${adornId}&environment=${
          mallInfo?.environment
        }&shopId=${mallInfo?.id}`,
      )
    } else {
      if (mallInfo?.property === 2) {
        history.jump(
          `/mallManage/jointManage/joint/design/mobileClient${preview ? '' : '/edit'}?adornId=${adornId}&environment=${
            mallInfo?.environment
          }&shopId=${mallInfo?.id}`,
        )
      } else {
        history.jump(
          `/mallManage/jointManage/joint/design/mobile${preview ? '' : '/edit'}?adornId=${adornId}&environment=${
            mallInfo?.environment
          }&shopId=${mallInfo?.id}`,
        )
      }
    }
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

  const items: MenuProps['items'] = useMemo(() => {
    const actioinsMap = {
      preview: true,
      edit: customAuthUrl('edit'),
      enable: !mallInfo?.enabled && customAuthUrl('enable'),
      stop: mallInfo?.enabled && customAuthUrl('stop'),
      interview: mallInfo?.url && mallInfo?.environment === 1,
      default: !mallInfo?.isDefault && mallInfo?.enabled && customAuthUrl('default'),
    }
    const actionsKeys = Object.keys(actioinsMap).filter((key) => actioinsMap[key])

    const actioinsButtons = [
      {
        key: 'preview',
        disabled: !Boolean(mallInfo?.adornId),
        label: <div onClick={() => handleJumpAdorn(mallInfo?.adornId, true)}>预览</div>,
      },
      {
        key: 'edit',
        label: <div onClick={() => setEditVisible(true)}>编辑</div>,
      },
      {
        key: 'enable',
        label: <div onClick={() => changeMallState(mallInfo?.id, true)}>启用</div>,
      },
      {
        key: 'stop',
        label: <div onClick={() => handleStopMall()}>停用</div>,
      },
      {
        key: 'interview',
        label: <div onClick={handleInterview}>访问</div>,
      },
      {
        key: 'default',
        label: <div onClick={handleSetDefault}>设为默认商城</div>,
      },
    ]
    return actioinsButtons.filter((item) => actionsKeys.includes(item.key))
  }, [mallInfo])

  return (
    <div className={styles['mall-item']}>
      {Boolean(mallInfo?.isDefault) && Boolean(mallInfo?.enabled) && (
        <Tag
          className={styles['mall-item-tag']}
          color={MALL_STATUS_TYPE.default.background}
          style={{
            color: MALL_STATUS_TYPE.default.color,
          }}
        >
          {MALL_STATUS_TYPE.default.name}
        </Tag>
      )}
      {!Boolean(mallInfo?.enabled) && (
        <Tag
          className={styles['mall-item-tag']}
          color={MALL_STATUS_TYPE.deactivate.background}
          style={{
            color: MALL_STATUS_TYPE.deactivate.color,
          }}
        >
          {MALL_STATUS_TYPE.deactivate.name}
        </Tag>
      )}
      <div className={styles['mall-item-main']}>
        <ImageBox
          className={styles['mall-item-info-img']}
          width={132}
          height={88}
          round={8}
          src={mallInfo?.logoUrl || defaultLogo}
        />
        <div className={styles['mall-item-info']}>
          <div className={styles['mall-item-info-name']}>{mallInfo?.name}</div>
          <div className={styles['mall-item-info-line']}>
            <Tag className={styles['mall-item-info-tag']} color="#F5F6F7">
              {mallInfo?.property === 1 ? 'B端' : 'C端'}
            </Tag>
            <Tag
              className={styles['mall-item-info-tag']}
              color={ENVIRONMENT_TYPE[mallInfo?.environment].background}
              style={{
                color: ENVIRONMENT_TYPE[mallInfo?.environment].color,
              }}
            >
              {ENVIRONMENT_TYPE[mallInfo?.environment].name}
            </Tag>
          </div>
          <div className={styles['mall-item-info-line']}>
            <label>商城描述：</label>
            <span>{mallInfo?.describe}</span>
          </div>
        </div>
      </div>
      <div className={styles['mall-item-actions']}>
        <Space>
          <AuthButton type="custom" code="design/edit">
            <Button onClick={handleAdorn} icon={<LayoutIcon />} type="primary">
              装修
            </Button>
          </AuthButton>
          <Dropdown menu={{ items }} placement="bottomRight">
            <div className={styles['mall-item-actions-dropdown-btn']}>
              <span>更多</span>
              <ArrowDownFillIcon size={16} />
            </div>
          </Dropdown>
        </Space>
      </div>
      <MallModal
        mro
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

export default MallItem
