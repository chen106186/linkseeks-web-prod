import React, { useState } from 'react'
import {
  View,
  Text,
  Radio,
  CheckboxGroup,
  Checkbox,
  Input,
  Image,
  ScrollView,
  Upload,
  Icons,
  ActionSheet,
  Button,
  Toast,
} from '@apps/mobile-ui'
import MellowCard from '@/components/MellowCard'
import Cell from '@/components/Cell'
import plusIcon from '@/assets/plus-icon.png'
import cx from 'classnames'
import ImageBox from '@/components/ImageBox'
import useAskPurchase from '../hooks/useAskPurchase'
import Materials from './components/Materials'
import Trading from './components/Trading'
import styles from './index.module.scss'
import { getCurrentInstance, preload, pxTransform } from '@apps/mobile-services/utils/taro'
import Router from '@/utils/router'
import { GetMemberManagePlatformProviderPageResponseDetail } from '@apps/apis'
import useSafeArea from '@/hooks/useSafeArea'
import { themeLayout } from '@/constants/theme'
import { useMobileIntl } from '@apps/locales'
import { getIcon } from '../../detail/components/Enclosure'

const AskPurchaseForm: React.FC = () => {
  const {
    query,
    materials,
    fileList,
    userList,
    shopList,
    selectShops,
    submitLoading,
    selectMembers,
    unitList,
    setSelectShops,
    setQuery,
    setMaterials,
    removeFile,
    uploadFile,
    setSelectMembers,
    handleSubmit,
    fetchUnitList,
  } = useAskPurchase()
  const [optionModalVisible, setOptionModalVisible] = useState<boolean>(false)
  const [selectIds, setSelectIds] = useState<number[]>([])
  const { safeBottomHeight } = useSafeArea()
  const translate = useMobileIntl()

  const handleChange = (key: string, value: string) => {
    const parmas = { ...query }
    parmas[key] = value
    setQuery(parmas)
  }

  const handleOptionConfirm = () => {
    const list: { shopId: number; shopName: string }[] = []
    if (selectIds && selectIds.length > 0) {
      for (const id of selectIds) {
        const shopItem = shopList.find((item) => item.id === id)
        if (shopItem) {
          list.push({
            shopId: shopItem.id,
            shopName: shopItem.name,
          })
        }
      }
      setSelectShops(list)
      setOptionModalVisible(false)
    } else {
      Toast.show({
        title: translate('mobile.resource.askPurchase.qingxuanzefabushangcheng'),
        icon: 'none',
      })
    }
  }

  const handleDeleteSelectMember = (info: any) => {
    setSelectMembers(selectMembers.filter((item) => item.memberId !== info.memberId))
  }

  const renderPublishType = () => {
    if (query?.publishType === 1) {
      return (
        <View className={styles['publishType-list']}>
          {selectShops &&
            selectShops.length > 0 &&
            selectShops.map((shopItem) => (
              <View className={styles['publishType-list-item']} key={shopItem.shopId}>
                {shopItem.shopName}
              </View>
            ))}
        </View>
      )
    } else {
      return (
        <View className={styles['publishType-list']}>
          {selectMembers &&
            selectMembers.length > 0 &&
            selectMembers.map((memberItem) => (
              <View className={styles['publishType-list-item']} key={memberItem.memberId}>
                <Text className={styles['publishType-list-item-name']}>{memberItem.memberName}</Text>
                <Icons size={16} name="Close" onClick={() => handleDeleteSelectMember(memberItem)} />
              </View>
            ))}
        </View>
      )
    }
  }

  return (
    <View className={styles['container']}>
      <ScrollView showScrollbar={false} className={styles['form-scrollView']}>
        <MellowCard
          title={translate('mobile.resource.contract.jibenxinxi')}
          bodyStyle={{
            padding: 0,
          }}
        >
          <Cell>
            <Cell.Item
              customHeadStyle={{
                padding: 0,
              }}
              title={translate('mobile.resource.askPurchase.xunyuanxuqiudanzhaiyao')}
              value={
                <Input
                  type="text"
                  placeholder={translate('mobile.common.dianjitianxie')}
                  maxlength={60}
                  className={styles['form-input']}
                  placeholderClass={styles['form-input-placeholder']}
                  onChange={(e) => {
                    const parmas = { ...query }
                    parmas.name = e
                    setQuery(parmas)
                  }}
                  value={query?.name}
                />
              }
            />
          </Cell>
        </MellowCard>
        {/* 求购物料 */}
        <Materials
          unitList={unitList}
          materials={materials}
          setMaterials={setMaterials}
          onUnitSearch={(val) => fetchUnitList(val)}
        />
        {/* 交易条件 */}
        <Trading query={query} setQuery={setQuery} userList={userList} onChange={handleChange} />
        <MellowCard
          title={translate('mobile.resource.askPurchase.fujianxuantian')}
          style={{
            marginTop: 8,
          }}
        >
          <View className={styles['Upload']}>
            {fileList.map((item: any, index: number) => (
              <View className={styles['UploadList-item']} key={index}>
                <Image src={getIcon(item.url)} />
                <Icons className={styles['remove']} name="Close" size={16} onClick={() => removeFile(index)} />
              </View>
            ))}
            <Upload chooseFile actions={(e) => uploadFile(e)} pickerMax={1}>
              <View className={styles['UploadList']}>
                {fileList.length < 4 && (
                  <View className={styles['UploadList-card']}>
                    <Image src={plusIcon} />
                  </View>
                )}
              </View>
            </Upload>
          </View>
        </MellowCard>
        <MellowCard
          title={translate('mobile.resource.askPurchase.xuqiuduijie')}
          style={{
            marginTop: 8,
          }}
          bodyStyle={{
            padding: 0,
          }}
        >
          <Cell>
            <Cell.Item
              title={translate('mobile.resource.askPurchase.duijiefangshi')}
              value={
                <Radio.Group
                  value={query?.publishType}
                  onChange={(val) => {
                    const parmas = { ...query }
                    parmas.publishType = val
                    setQuery(parmas)
                  }}
                >
                  <Radio size={18} value={1}>
                    {translate('mobile.resource.askPurchase.fabupingtai')}
                  </Radio>
                  <Radio size={18} value={2}>
                    {translate('mobile.resource.askPurchase.zhidinggongyingshang')}
                  </Radio>
                </Radio.Group>
              }
            />
            <Cell.Item
              title={
                query.publishType === 1
                  ? translate('mobile.resource.askPurchase.xuanzefabushangcheng')
                  : translate('mobile.resource.askPurchase.xuanzegongyingshang')
              }
              value={
                <View
                  className={cx(styles['time'], styles.placeholderColor)}
                  onClick={(e) => {
                    if (query?.publishType === 1) {
                      setOptionModalVisible(true)
                    } else {
                      e.stopPropagation()
                      preload({
                        preloadDate: getCurrentInstance().preloadData,
                        ids: selectMembers.map((item) => item.memberId),
                        onSelect: (selectList: GetMemberManagePlatformProviderPageResponseDetail[]) => {
                          setSelectMembers(
                            selectList.map((item) => ({
                              memberId: item.memberId,
                              memberRoleId: item.roleId,
                              memberName: item.name,
                              memberType: item.memberTypeName,
                              memberRoleName: item.roleName,
                              memberGrade: item.levelTag,
                            })),
                          )
                        },
                      })
                      Router.navigateTo('askPurchase/supplierList')
                    }
                  }}
                >
                  <Text>{translate('mobile.common.qingxuanze')}</Text>
                  <Icons name="ChevronRight" size={12} />
                </View>
              }
            />
          </Cell>
          {renderPublishType()}
        </MellowCard>
      </ScrollView>
      <View
        className={styles['EditRfqOrder-container-actions']}
        style={{ paddingBottom: safeBottomHeight ? `${safeBottomHeight}PX` : pxTransform(themeLayout['padding-xs']) }}
      >
        <Button type="primary" onClick={handleSubmit} loading={submitLoading}>
          {translate('mobile.common.save')}
        </Button>
      </View>

      <ActionSheet
        isOpened={optionModalVisible}
        onClose={() => setOptionModalVisible(false)}
        customContainerStyle={styles['ActionSheet-round']}
      >
        <View className={styles['ActionSheet-wrap']}>
          <View className={styles['ActionSheet-title']}>
            {translate('mobile.resource.askPurchase.xuanzefabushangcheng')}
          </View>
          <View className={styles['ActionSheet-content']}>
            <CheckboxGroup value={selectIds} onChange={(val: number[]) => setSelectIds(val)}>
              {shopList &&
                shopList.length > 0 &&
                shopList.map((shopItem) => (
                  <View className={styles['ActionSheet-formItem']} key={shopItem.id}>
                    <ImageBox width={32} height={32} source={shopItem.logoUrl} />
                    <Text className={styles['ActionSheet-formItem-shopName']}>{shopItem.name}</Text>
                    <Checkbox value={shopItem.id} style={{ paddingLeft: 24 }} />
                  </View>
                ))}
            </CheckboxGroup>
          </View>
          <View onClick={handleOptionConfirm} className={cx(styles['ActionSheet-button-wrap'])}>
            <Button className={cx(styles['ActionSheet-button'])}>{translate('mobile.common.confirm')}</Button>
          </View>
        </View>
      </ActionSheet>
    </View>
  )
}

export default AskPurchaseForm
