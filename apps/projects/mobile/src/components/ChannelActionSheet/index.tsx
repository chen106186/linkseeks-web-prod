import React, { useState } from 'react'
import { View, Text, Icons } from '@apps/mobile-ui'
import { observer } from 'mobx-react-lite'
import { useStores } from '../../store/useStores'
import { SuperiorChannelItemType } from '../../store/userStore/model'
import ImageBox from '../ImageBox'
import Overlay from '../Overlay'
import './index.scss'
import cx from 'classnames'

interface ModalActionSheetPropsType {
  visible: boolean,
  onClose: () => void,
  onConfirm: (state: boolean, info?: any) => void,
}

const ChannelActionSheet = (props: ModalActionSheetPropsType) => {
  const { visible, onClose, onConfirm } = props
  const [selectActionItem, setSelectActionItem] = useState<SuperiorChannelItemType>()
  const { userStore: { memberSuperiorChannelList, updateCurrMemberSuperiorChannel }, templateStore: { resetChannelMallDesignConfig } } = useStores()

  const handleSelectActionItem = (actionItem: SuperiorChannelItemType) => {
    if (selectActionItem) {
      if (selectActionItem.memberId !== actionItem.memberId) {
        setSelectActionItem(actionItem)
      }
    } else {
      setSelectActionItem(actionItem)
    }
  }

  const handleConfirm = () => {
    if (selectActionItem) {
      resetChannelMallDesignConfig()
      updateCurrMemberSuperiorChannel(selectActionItem)
      onConfirm(true)
    }
  }

  return (
    <Overlay
      visible={visible}
      onClick={onClose}
      position='center'
    >
      <View className='modal-action-sheet-modal'>
        <View className='modal-title'>
          <Text className='modal-title-text'>请选择进入的渠道商城</Text>
        </View>
        <View className='modal-body'>
          <View className='modal-action-list'>
            {
              (memberSuperiorChannelList && memberSuperiorChannelList.length > 0) ? memberSuperiorChannelList.map((actionItem) => (
                <View
                  className='modal-action-list-item'
                  key={`actionItem${actionItem.memberId}`}
                  onClick={() => handleSelectActionItem(actionItem)}
                >
                  <ImageBox borderRadius={32} source={actionItem.logo} width={32} height={32} />
                  <View className='modal-action-list-item-content'>
                    <Text className={cx('modal-action-list-item-text', (selectActionItem && selectActionItem.memberId === actionItem.memberId) && 'modal-action-list-item-text-active')}>{actionItem.memberName}</Text>
                  </View>
                  {
                      (selectActionItem && selectActionItem.memberId === actionItem.memberId) && <Icons name="check" color='#00A98F' />
                    }
                </View>
              )) : null
            }
          </View>
        </View>
        <View
          className='modal-confirm-btn'
          onClick={handleConfirm}
        >
          <Text className='modal-confirm-btn-text'>进入商城</Text>
        </View>
      </View>
    </Overlay>
  )
}

export default observer(ChannelActionSheet)
