import React, { useMemo } from 'react'
import { ImageBox } from '@apps/components'
import cx from 'classnames'
import { Tag, Button, Space } from '@linkseeks/ui'
import defaultLogo from '@/assets/default_logo.jpg'
import defaultWhiteLogo from '@/assets/default_white_logo.jpg'
import { EditIcon } from '@linkseeks/icons'
import { ENVIRONMENT_TYPE } from '@apps/constants'
import MallModal from '../MallModal'
import { MallFormType, SelfMallItemType, MallItemType } from '../../types'
import useEditSelfMall from '../../hooks/useEditSelfMall'
import styles from './index.less'

interface SelfMallItemProps {
  mallInfo: SelfMallItemType
  canEdit?: boolean
  /** 是否显示边框 */
  bordered?: boolean
  /** 是否可以选择 */
  selected?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 选中状态 */
  actived?: boolean
  /**
   * 选中事件
   */
  onSelect?: (id: number) => void
  /** 更新列表数据 */
  onRefresh?: () => void
}

const SelfMallItem: React.FC<SelfMallItemProps> = (props) => {
  const { mallInfo, canEdit = true, bordered, selected, actived, disabled, onSelect, onRefresh } = props
  const { editVisible, setEditVisible, editForm, saveLoading, editMallModelInfo } = useEditSelfMall({
    refreshFn: () => onRefresh?.(),
  })

  const handleClick = () => {
    if (selected && !disabled) {
      onSelect?.(mallInfo.id)
    }
  }

  return (
    <div
      className={cx(
        styles['mall-item'],
        bordered && styles['bordered'],
        selected && styles['selected'],
        actived && styles['actived'],
        disabled && styles['disabled'],
      )}
      onClick={handleClick}
    >
      <div className={styles['mall-item-main']}>
        <ImageBox
          className={styles['mall-item-logo']}
          width={168}
          height={112}
          round={8}
          src={mallInfo?.logoUrl || (selected ? defaultWhiteLogo : defaultLogo)}
        />
        <div className={styles['mall-item-info']}>
          <div className={styles['mall-item-info-name']}>{mallInfo?.name}</div>
          <div className={styles['mall-item-info-line']}>
            <Tag className={styles['mall-item-info-tag']} color="#F5F6F7">
              {mallInfo?.property === 1 ? 'B端' : 'C端'}
            </Tag>
            <Tag
              className={styles['mall-item-info-tag']}
              color={ENVIRONMENT_TYPE[mallInfo?.environment]?.background}
              style={{
                color: ENVIRONMENT_TYPE[mallInfo?.environment]?.color,
              }}
            >
              {ENVIRONMENT_TYPE[mallInfo?.environment]?.name}
            </Tag>
          </div>
          <div className={styles['mall-item-info-line']}>
            <Space size={16}>
              <div>
                <label>国家/地区：</label>
                <span>{mallInfo?.countryName}</span>
              </div>
              <div>
                <label>语言：</label>
                <span>{mallInfo?.languageName}</span>
              </div>
              <div>
                <label>币种：</label>
                <span>{mallInfo?.currencyName}</span>
              </div>
            </Space>
          </div>
          <div className={styles['mall-item-info-line']}>
            <label>商城描述：</label>
            <span>{mallInfo?.describe}</span>
          </div>
        </div>
      </div>
      <div className={styles['mall-item-actions']}>
        {canEdit && (
          <Space>
            <Button
              className={styles['mall-item-actions-edit']}
              icon={<EditIcon />}
              onClick={() => setEditVisible(true)}
            >
              编辑
            </Button>
          </Space>
        )}
      </div>
      <MallModal
        form={editForm}
        visible={editVisible}
        mallInfo={mallInfo as unknown as MallItemType}
        setVisible={setEditVisible}
        saveLoading={saveLoading}
        onOk={editMallModelInfo}
      />
    </div>
  )
}

export default SelfMallItem
