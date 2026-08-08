import React, { useState } from 'react'
import { Modal } from 'antd'
import { clearSelectedStatus, changeProps } from '@apps/design-core'
import { filterPropsFunction } from '../../../utils'
import SettingPanel from '../../../components/SettingPanel'

interface GoodsItemType {
  advertImg: string
  describe: string
  firstId: number | undefined
  goodsIdList: number[]
  name: string
  secondId: number | undefined
  shopId: number | undefined
  thirdlyId: number | undefined
}

interface PlatformGoodsProps {
  dataInfo: GoodsItemType
}

const Demo: React.FC<PlatformGoodsProps> = (props) => {
  const { dataInfo } = props
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
  const [newProps, setNewProps] = useState(props)

  const changeNewProps = (key: string, data: any) => {
    const newProps = filterPropsFunction(props)
    newProps[key] = data
    setNewProps(newProps)
  }

  const handleCancel = () => {
    if (JSON.stringify(props) !== JSON.stringify(newProps)) {
      Modal.confirm({
        content: '您还没有保存修改的内容，是否确认关闭？',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          clearSelectedStatus()
        },
      })
    } else {
      clearSelectedStatus()
    }
  }

  const handleConfirmSave = () => {
    console.log()
  }

  return <SettingPanel confirmLoading={confirmLoading} onCancel={handleCancel} onOK={handleConfirmSave}></SettingPanel>
}

export default Demo
