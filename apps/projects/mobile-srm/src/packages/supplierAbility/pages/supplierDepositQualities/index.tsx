/*
 * @Description: 资质文件
 */
import React, { useRef, useState, useEffect } from 'react'
import { showToast, pxTransform, getCurrentInstance } from '@apps/mobile-services/utils/taro'
import { Icons, View, Button } from '@apps/mobile-ui'
import Router from '@/utils/router'
import { themeLayout } from '@/constants/theme'
import NavBar from '@/components/NavBar'
import PageLayout from '@/components/PageLayout'
import MellowCard from '@/components/MellowCard'
import Cell from '@/components/Cell'
import SpaceshipWrap from '../../components/SpaceshipWrap'
import CustomDatePicker from '../../components/CustomDatePicker'
import CustomUpload from '../../components/CustomUpload'
import CustomSwitch from '../../components/CustomSwitch'
import { RuleObject } from '../../components/Form/typings'
import { validateFields } from '../../components/Form/utils/validateUtil'
import './index.scss'

export type QualitiesType = {
  /**
   * 文件地址
   */
  url: string
  /**
   * 到期日
   */
  expireDay?: string
  /**
   * 有效期
   */
  permanent: boolean
}

export type QualitiesValueType = Omit<QualitiesType, 'permanent'> & {
  /**
   * 是否长期有效，0-否，1-是
   */
  permanent: number
  /**
   * 文件名称
   */
  name?: string
}

type SupplierDepositQualitiesRouteParams = {
  /**
   * 确认回调事件
   */
  onConfirm?: (value: QualitiesValueType[]) => void
  /**
   * 默认值
   */
  defaultValue?: QualitiesType[]
}

const SupplierDepositQualities: React.FC = () => {
  const params = getCurrentInstance().preloadData as SupplierDepositQualitiesRouteParams
  const { onConfirm, defaultValue } = params || {}

  const [qualities, setQualities] = useState<QualitiesType[]>(defaultValue || [])

  const rules = useRef<Map<string, RuleObject[]>>(
    new Map([
      [
        'url',
        [
          {
            required: true,
            message: '请上传资质文件',
          },
        ],
      ],
    ]),
  )

  useEffect(() => {
    // 如果不存在事件，则返回上级页面
    // 一般出现在h5在当前页面进行了刷新操作，导致 preloadData 没有了的问题
    if (!onConfirm) {
      setTimeout(() => {
        Router.navigateBack()
      }, 60)
    }
  }, [])

  const handleAdd = () => {
    const mergedValue: QualitiesType[] = [
      ...qualities,
      {
        url: '',
        expireDay: '',
        permanent: true, // 默认长期有效
      },
    ]
    setQualities(mergedValue)
  }

  const handleQualitiesItemChange = (fileName: string, value: any, index: number) => {
    const mergedValue = [...qualities]
    mergedValue.splice(index, 1, {
      ...mergedValue[index],
      [fileName]: value,
    })
    setQualities(mergedValue)
  }

  const handleItemExpireDayChange = (value: string, index: number) => {
    const mergedValue = [...qualities]
    mergedValue.splice(index, 1, {
      ...mergedValue[index],
      expireDay: value,
      permanent: false, // 重置为 false
    })
    setQualities(mergedValue)
  }

  const handleItemPermanentChange = (value: boolean, index: number) => {
    const mergedValue = [...qualities]
    mergedValue.splice(index, 1, {
      ...mergedValue[index],
      permanent: value,
      expireDay: '', // 重置为 ''
    })
    setQualities(mergedValue)
  }

  const handleRemove = (index: number) => {
    const mergedValue = [...qualities]
    mergedValue.splice(index, 1)
    setQualities(mergedValue)
  }

  const handleSubmit = async () => {
    try {
      const promises = qualities.map(async (item) => {
        const valueErrors = await validateFields(item, rules.current)
        if (valueErrors.length) {
          return Promise.reject(valueErrors)
        }
        return Promise.resolve()
      })
      try {
        await Promise.all(promises)
        const normalized: QualitiesValueType[] = qualities.map((item) => ({
          name: item.url ? item.url.split('/').slice(-1)[0] : '',
          url: item.url,
          expireDay: item.expireDay || '',
          permanent: item.permanent ? 1 : 0,
        }))
        onConfirm?.(normalized)
        Router.navigateBack()
      } catch (err) {
        if (err && err.length) {
          showToast({ title: err[0].errors?.[0], icon: 'none' })
          return
        }
      }
    } catch (error) {}
  }

  return (
    <PageLayout
      renderHeader={
        <>
          <NavBar title="资质证明" />
        </>
      }
    >
      <View className="supplier-deposit-qualities-section">
        <View className="supplier-deposit-qualities-add">
          <Button type="secondary" onClick={handleAdd}>
            <Icons size={16} name="Plus" className="supplier-deposit-qualities-add-icon" />
            添加证明
          </Button>
        </View>
        {qualities.map((item, index) => (
          <MellowCard
            key={index}
            title={`资质证明${index + 1}`}
            extra={<Icons name="Trash" color="#c8cacd" size={16} onClick={() => handleRemove(index)} />}
            headStyle={{
              paddingRight: 0,
              paddingLeft: 0,
              marginRight: pxTransform(themeLayout['margin-s']),
              marginLeft: pxTransform(themeLayout['margin-s']),
            }}
            bodyStyle={{
              padding: 0,
            }}
            style={{
              marginBottom: pxTransform(themeLayout['margin-xs']),
            }}
          >
            <Cell>
              <Cell.Item
                title="附件"
                value={
                  <CustomUpload value={item.url} onChange={(value) => handleQualitiesItemChange('url', value, index)} />
                }
              />
              <Cell.Item
                title="到期日"
                value={
                  <CustomDatePicker
                    placeholder="请选择"
                    contentAlign="right"
                    value={item.expireDay}
                    onChange={(e) => handleItemExpireDayChange(e.detail.value, index)}
                  />
                }
              />
              <Cell.Item
                title="是否长期有效"
                value={
                  <CustomSwitch
                    checked={item.permanent}
                    onChange={(value) => handleItemPermanentChange(value, index)}
                  />
                }
              />
            </Cell>
          </MellowCard>
        ))}
      </View>
      <SpaceshipWrap>
        <Button type="primary" onClick={handleSubmit}>
          确认
        </Button>
      </SpaceshipWrap>
    </PageLayout>
  )
}

export default SupplierDepositQualities
