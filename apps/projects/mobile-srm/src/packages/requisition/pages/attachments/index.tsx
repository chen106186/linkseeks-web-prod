import React, { useState } from 'react'
import { showLoading, hideLoading, chooseMessageFile } from '@apps/mobile-services/utils/taro'
import { View, ScrollView, Text, Icons, Upload } from '@apps/mobile-ui'
import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import uploadFileRequest, { uuid } from '@/utils/uploadFileRequest'
import useStores from '@/store/useStores'
import { useSafeArea } from '@apps/mobile-services'
import NavBar from '@/components/NavBar'
import PageLayout from '@/components/PageLayout'
import UploadItem from '../../components/uploadItem'
import RelationMaterialPopup from '../../components/relationMaterialPopup'
import styles from './index.module.scss'

const Attachments: React.FC = () => {
  const {
    createStore: { attachments, setCreateValues, products },
  } = useStores()
  const { safeBottomHeight } = useSafeArea()
  const [popupVisible, setPopupVisible] = useState<boolean>(false)
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const handleChooseMessageFile = () => {
    chooseMessageFile({
      count: 1,
      type: 'all',
      success: async (res) => {
        const result =
          res?.tempFiles?.length > 0
            ? res.tempFiles.map((_item) => {
                return {
                  status: 'ready',
                  _id: uuid(),
                  path: _item?.path,
                  fileName: _item?.name,
                }
              })
            : []
        await uplaodFile(result)
        // showLoading()
        // const uploadResult = await uploadFile(result);
        // const files = uploadResult?.length > 0 ? uploadResult?.map((_item) => { return { name: _item.name, url: _item.url } }) : []
        // hideLoading()
        // if (uploadResult?.length > 0) {
        //   const filesList = [...toJS(attachments), ...files]
        //   setCreateValues('attachments', filesList);
        // }
      },
    })
  }

  const deleteItem = (index: number) => {
    let _list = [...toJS(attachments)]
    _list.splice(index, 1)
    setCreateValues('attachments', _list)
  }

  const _relationItem = (index: number) => {
    setCurrentIndex(index)
    setPopupVisible(true)
  }

  const renderItem = ({ item, index }: { item: any; index: any }) => {
    return (
      <UploadItem
        data={item}
        editAble
        type={2}
        chooseFunc={() => {
          _relationItem(index)
        }}
        deleteFunc={() => {
          deleteItem(index)
        }}
        key={`UploadItem${index}`}
      />
    )
  }

  const chooseItem = (item) => {
    let _list = [...toJS(attachments)]
    _list[currentIndex]['goodsId'] = item?.productId ?? item?.id
    _list[currentIndex]['goodsName'] = item?.productId ?? item?.id ? item.name : ''
    setCreateValues('attachments', _list)
  }

  // 上传文件
  const uplaodFile = async (result) => {
    showLoading()
    const uploadResult = await uploadFileRequest(result)
    const files =
      uploadResult?.length > 0
        ? uploadResult?.map((_item) => {
            return { ..._item, name: _item.name, url: _item.url }
          })
        : []
    hideLoading()
    if (uploadResult?.length > 0) {
      const filesList = [...toJS(attachments), ...files]
      setCreateValues('attachments', filesList)
    }
    return uploadResult
  }

  return (
    <View>
      <PageLayout
        childrenClass={styles['attachments']}
        style={safeBottomHeight ? { paddingBottom: `${safeBottomHeight}PX` } : {}}
        renderHeader={
          <>
            <NavBar title="附件" />
          </>
        }
      >
        <ScrollView
          horizontal={false}
          data={attachments}
          className={styles['attachments-scrollView']}
          renderItem={renderItem}
          keyExtractor={(item: any) => `UploadItem${item.id}`}
        />
        <View
          className={styles['attachments-fixButton']}
          style={safeBottomHeight ? { paddingBottom: `${safeBottomHeight}PX` } : {}}
        >
          <View className={styles['attachments-fixButton-btn']} onClick={handleChooseMessageFile}>
            <Icons name="FileUpload" size={14} color="#fff" />
            <Text className={styles['attachments-fixButton-btn-text']}>上传附件</Text>
          </View>
          {/* <View className={styles['attachments-fixButton-btn']} onClick={handleChooseMessageFile}>
          <Icons name='FileUpload' size={14} color='#fff' />
          <Text className={styles['attachments-fixButton-btn-text']}>上传附件</Text>
        </View> */}
        </View>
      </PageLayout>
      <RelationMaterialPopup
        visible={popupVisible}
        onChoose={chooseItem}
        onClose={() => {
          setPopupVisible(false)
        }}
        materialData={[{ name: '无' }, ...products]}
        value={toJS(attachments)?.[currentIndex]?.['goodsId'] ?? ''}
      />
    </View>
  )
}

export default observer(Attachments)
