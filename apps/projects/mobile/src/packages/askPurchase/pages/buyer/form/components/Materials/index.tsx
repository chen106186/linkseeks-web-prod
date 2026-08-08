/**
 * 寻源物料
 */
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { View, Text, Input, Image, Button, Upload, Icons, SearchPicker } from '@apps/mobile-ui'
import MellowCard from '@/components/MellowCard'
import plusIcon from '@/assets/plus-icon.png'
import Cell from '@/components/Cell'
import cx from 'classnames'
import { getProductPlatformGetCategoryTree, GetProductSelectGetSelectUnitResponse } from '@apps/apis'
import { useMobileIntl } from '@apps/locales'
import { MaterialsItemType } from '../../../hooks/useAskPurchase'
import uploadFileRequest from '@/utils/uploadFileRequest'
import CategoryPicker from '../CategoryPicker'
import styles from './index.module.scss'
import { getIcon } from '../../../../detail/components/Enclosure'

interface IProps {
  unitList: GetProductSelectGetSelectUnitResponse
  materials: MaterialsItemType[]
  setMaterials: Dispatch<SetStateAction<MaterialsItemType[]>>
  onUnitSearch: (val: string) => void
}

const Materials: React.FC<IProps> = (props) => {
  const { unitList, materials, setMaterials, onUnitSearch } = props
  const [range, setRange] = useState<Record<string, any>[]>([])
  const translate = useMobileIntl()

  const fetchCategoryList = () => {
    getProductPlatformGetCategoryTree().then((res) => {
      if (res.code === 1000 && res.data && res.data.length > 0) {
        const firstList = res.data.map((item) => ({
          id: item.id,
          name: item.name,
        }))
        setRange(firstList)
      }
    })
  }

  useEffect(() => {
    fetchCategoryList()
  }, [])

  const changeMaterials = (key: string, value: any, index) => {
    const newList = [...materials]
    setMaterials(
      newList.map((item, itemIndex) => {
        if (itemIndex === index) {
          return {
            ...item,
            [key]: value,
          }
        }
        return item
      }),
    )
  }

  const handleAddMeteria = () => {
    const list = [...materials]
    list.push({
      goodsNo: '',
      goodsName: '',
      specification: '',
      categoryId: 0,
      categoryName: '',
      unit: '',
      num: 0,
      goodsId: 0,
      enclosureUrls: [],
    })
    setMaterials(list)
  }

  const handleDeleteMaterial = (index: number) => {
    setMaterials(materials.filter((_, itemIndex) => index !== itemIndex))
  }

  // 图片删除
  const removeFile = (index: number, materialsIndex: number, fileList: any[]) => {
    const FileList = [...fileList]
    const imgUrl: any = []
    FileList.forEach((item: any, i: number) => {
      if (index != i) {
        imgUrl.push(item)
      }
    })
    changeMaterials('enclosureUrls', imgUrl, materialsIndex)
  }

  // 图片上传
  const uploadFile = async (result: any, materialsIndex: number, fileList: any[]) => {
    const uploadResult = await uploadFileRequest([result[0]])
    const FileList = [...fileList]
    FileList.push({ url: uploadResult[0].url, name: uploadResult[0].name })

    changeMaterials('enclosureUrls', FileList, materialsIndex)
    return uploadResult
  }

  return (
    <>
      {Array.isArray(materials) &&
        materials.length > 0 &&
        materials.map((materialsItem, materialsIndex) => (
          <MellowCard
            title={materialsIndex === 0 ? translate('mobile.resource.askPurchase.xunyuanwuliao') : ''}
            key={`materials-${materialsIndex}`}
            style={{
              marginTop: 8,
            }}
          >
            <View key={`materials-${materialsIndex}`}>
              <View className={styles['materia-title-wrap']}>
                <View className={styles['materia-title-split']}></View>
                <Text className={styles['materia-title']}>
                  {translate('mobile.resource.askPurchase.wuliao')}
                  {materialsIndex + 1}
                </Text>
                {materials.length > 1 && (
                  <Button onClick={() => handleDeleteMaterial(materialsIndex)} size="small" type="secondary">
                    {translate('mobile.resource.askPurchase.shanchu')}
                  </Button>
                )}
              </View>
              <Cell customStyle={{ padding: 0 }}>
                <Cell.Item
                  customHeadStyle={{ padding: 0 }}
                  title={translate('mobile.resource.askPurchase.wuliaobianma')}
                  value={
                    <Input
                      type="text"
                      className={styles['form-input']}
                      placeholderClass={styles['form-input-placeholder']}
                      placeholder={translate('mobile.resource.askPurchase.qingshuruwuliaobianma')}
                      onChange={(val: string) => changeMaterials('goodsNo', val, materialsIndex)}
                      value={materialsItem?.goodsNo}
                    />
                  }
                />
                <Cell.Item
                  title={translate('mobile.resource.askPurchase.wuliaomingcheng')}
                  customHeadStyle={{ padding: 0 }}
                  value={
                    <Input
                      type="text"
                      className={styles['form-input']}
                      placeholderClass={styles['form-input-placeholder']}
                      placeholder={translate('mobile.resource.askPurchase.tianxiewuliaomingcheng')}
                      onChange={(val: string) => changeMaterials('goodsName', val, materialsIndex)}
                      value={materialsItem?.goodsName}
                    />
                  }
                />
                <Cell.Item
                  customHeadStyle={{ padding: 0 }}
                  title={translate('mobile.resource.askPurchase.guigexinghao')}
                  value={
                    <Input
                      type="text"
                      className={styles['form-input']}
                      placeholderClass={styles['form-input-placeholder']}
                      placeholder={translate('mobile.resource.askPurchase.tianxieguigexinghao')}
                      onChange={(val: string) => changeMaterials('specification', val, materialsIndex)}
                      value={materialsItem?.specification}
                    />
                  }
                />
                <Cell.Item
                  title={translate('mobile.resource.askPurchase.pinlei')}
                  value={
                    <CategoryPicker
                      range={range}
                      onChange={(e) => {
                        const index = Number(e.detail.value)
                        const categoryItem = range[index]
                        if (categoryItem) {
                          const newList = [...materials]
                          setMaterials(
                            newList.map((item, itemIndex) => {
                              if (itemIndex === materialsIndex) {
                                return {
                                  ...item,
                                  categoryId: Number(categoryItem.id),
                                  categoryName: categoryItem.name,
                                }
                              }
                              return item
                            }),
                          )
                        }
                      }}
                      value={
                        materialsItem.categoryId
                          ? range.findIndex((item) => Number(item.id) === Number(materialsItem.categoryId))
                          : 0
                      }
                    >
                      <View className={cx(styles['time'], !materialsItem.categoryName && styles.placeholderColor)}>
                        {materialsItem.categoryName || <Text>{translate('mobile.common.qingxuanze')}</Text>}
                        <Icons name="ChevronRight" size={12} />
                      </View>
                    </CategoryPicker>
                  }
                />
                <Cell.Item
                  customHeadStyle={{ padding: 0 }}
                  title={translate('mobile.resource.askPurchase.pinpai')}
                  value={
                    <Input
                      type="text"
                      className={styles['form-input']}
                      placeholder={translate('mobile.resource.askPurchase.qingtianxiepinpai')}
                      placeholderClass={styles['form-input-placeholder']}
                      onChange={(val: string) => changeMaterials('brandName', val, materialsIndex)}
                      value={materialsItem?.brandName}
                    />
                  }
                />
                <Cell.Item
                  title={translate('mobile.resource.askPurchase.danwei')}
                  value={
                    <SearchPicker
                      range={unitList}
                      rangeKey="label"
                      onConfirm={(val) => {
                        const index = Number(val)
                        const unitItem = unitList[index]
                        if (unitItem) {
                          changeMaterials('unit', unitItem.label, materialsIndex)
                        }
                      }}
                      value={
                        materialsItem.unit
                          ? [unitList.findIndex((item) => item.label === materialsItem.unit)]
                          : undefined
                      }
                      onSearch={onUnitSearch}
                    >
                      <View className={cx(styles['time'], !materialsItem.unit && styles.placeholderColor)}>
                        {materialsItem.unit || <Text>{translate('mobile.common.qingxuanze')}</Text>}
                        <Icons name="ChevronRight" size={12} />
                      </View>
                    </SearchPicker>
                  }
                />
                <Cell.Item
                  customHeadStyle={{ padding: 0 }}
                  title={translate('mobile.resource.askPurchase.xunyuanshuliang')}
                  value={
                    <Input
                      type="number"
                      className={styles['form-input']}
                      placeholder={translate('mobile.resource.askPurchase.tianxiexunyuanshuliang')}
                      placeholderClass={styles['form-input-placeholder']}
                      onChange={(val: string) => changeMaterials('num', val, materialsIndex)}
                      value={materialsItem?.num ? String(materialsItem?.num) : ''}
                    />
                  }
                />
                <Cell.Item title={translate('mobile.resource.askPurchase.fujian')} />
                <View className={styles['Upload']}>
                  {materialsItem.enclosureUrls.map((item: any, index: number) => (
                    <View className={styles['UploadList-item']} key={index}>
                      <Image src={getIcon(item.url)} />
                      <Icons
                        className={styles['remove']}
                        name="Close"
                        size={16}
                        onClick={() => removeFile(index, materialsIndex, materialsItem.enclosureUrls)}
                      />
                    </View>
                  ))}
                  <Upload
                    chooseFile
                    actions={(e) => uploadFile(e, materialsIndex, materialsItem.enclosureUrls)}
                    pickerMax={1}
                  >
                    <View className={styles['UploadList']}>
                      {materialsItem.enclosureUrls.length < 4 && (
                        <View className={styles['UploadList-card']}>
                          <Image src={plusIcon} />
                        </View>
                      )}
                    </View>
                  </Upload>
                </View>
              </Cell>
            </View>
          </MellowCard>
        ))}
      <Button className={styles['materia-button']} type="secondary" onClick={handleAddMeteria}>
        {translate('mobile.resource.askPurchase.tianjiazidingyiwuliao')}
      </Button>
    </>
  )
}

export default Materials
