import React from 'react'
import { PlusCircleOutlined } from '@ant-design/icons'
import cx from 'classnames'
import styles from './index.less'
import { addComponentByName, PROPS_SETTING_TYPES, selectComponent, SelectedInfoBaseType } from '@apps/design-core'

interface AddGoodsItemProps {
  className?: string
}

const AddGoodsItem: React.FC<AddGoodsItemProps> = (props) => {
  const { className, ...others } = props

  const classNameString = cx(styles.add_goods_item, className)

  const handleAddPlatformGoods = () => {
    console.log('addPlatformGoodsComponent')
    let newAddKey = ''
    addComponentByName({
      position: '99',
      parentKey: '1',
      componentName: 'PlatformGoods',
      componentProps: {
        canDelete: true,
        visible: true,
        dataInfo: {},
      },
      addBefore: true,
      reset: {
        canDelete: true,
        firstLevel: true,
        componentTitle: '商品推荐',
        componentType: PROPS_SETTING_TYPES.platformGoods,
      },
      callback: (key) => {
        newAddKey = key
      },
    })

    if (newAddKey) {
      const specialProps: SelectedInfoBaseType = {
        parentKey: '0',
        key: newAddKey,
        domTreeKeys: ['0', newAddKey],
      }
      selectComponent(specialProps)
    }
  }

  return (
    <div className={classNameString} {...others} onClick={handleAddPlatformGoods}>
      <PlusCircleOutlined className={styles.add_icon} />
      <span className={styles.add_text}>添加新的推荐商品模块</span>
    </div>
  )
}

export default AddGoodsItem
