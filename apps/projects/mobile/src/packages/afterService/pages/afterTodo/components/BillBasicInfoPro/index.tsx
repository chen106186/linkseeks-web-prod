/*
 * @Author: XieZhiXiong
 * @Date: 2021-11-24 15:15:19
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-01 11:35:16
 * @Description: 单据基本信息Pro
 */
import React, { useState, useEffect } from 'react'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { useIntl } from '@linkseeks/i18n'
import { Picker, Input as TextInput, View, Text } from '@apps/mobile-ui'
import { dateFormat } from '@/utils/date'
import { themeLayout } from '@/constants/theme'
import MellowCard from '@/components/MellowCard'
import Cell from '@/components/Cell'
import Descriptions from '@/components/Descriptions'
import styles from './index.module.scss'

export interface Values {
  /**
   * 仓库负责人
   */
  inventoryRole: string
  /**
   * 仓库名称
   */
  inventoryName: string
  /**
   * 单据时间
   */
  transactionTime: number
  /**
   * 单据摘要
   */
  invoicesAbstract: string
}

interface IProps {
  /**
   * 是否可以编辑
   */
  isEdit?: boolean
  /**
   * 值
   */

  value?: Values
  /**
   * 数据变化时触发事件
   */
  onChange?: (values: Values) => void
  /**
   * 自定义外部样式
   */
  customStyle?: React.CSSProperties
}

const BillBasicInfoPro: React.FC<IProps> = (props: IProps) => {
  const { isEdit, value, onChange, customStyle } = props
  const [visiblePicker, setVisiblePicker] = useState(false)
  const nowTime = new Date()
  const [pickerValue, setPickerValue] = useState<Date | undefined>()
  const [transactionTime, setTransactionTime] = useState(dateFormat(nowTime, 'YYYY-MM-DD'))

  const intl = useIntl()

  useEffect(() => {
    if ('value' in props && value) {
      const date = new Date(value.transactionTime)
      setPickerValue(date)
      setTransactionTime(dateFormat(date, 'YYYY-MM-DD'))
    }
  }, [value])

  const triggerChange = (values: Values) => {
    if (onChange) {
      onChange(values)
    }
  }

  // 申请摘要变化
  const handleAbstractChange = (next: string) => {
    triggerChange({
      ...(value || ({} as Values)),
      invoicesAbstract: next,
    })
  }

  // 仓库变化
  const handleInventoryNameChange = (next: string) => {
    triggerChange({
      ...(value || ({} as Values)),
      inventoryName: next,
    })
  }

  // 仓库人员变化
  const handleStaffChange = (next: string) => {
    triggerChange({
      ...(value || ({} as Values)),
      inventoryRole: next,
    })
  }

  // 单据时间确认变化
  const handlePickerConfirm = (next: number) => {
    setVisiblePicker(false)
    triggerChange({
      ...(value || ({} as Values)),
      transactionTime: next,
    })
  }

  if (!isEdit) {
    return (
      <View className={styles['bill-basic-info']} style={customStyle}>
        <MellowCard
          title={
            <View className={styles['bill-basic-info-titleWrap']}>
              <Text className={styles['bill-basic-info-title']}>{value?.invoicesAbstract}</Text>
              <View className={styles['bill-basic-info-ribbon']} />
            </View>
          }
          headStyle={{
            borderBottomWidth: pxTransform(0),
          }}
          bodyStyle={{
            paddingTop: pxTransform(0),
            paddingRight: pxTransform(themeLayout['padding-xs']),
          }}
        >
          <Descriptions column={1}>
            <Descriptions.Item
              label={intl.formatMessage({
                id: 'afterTodo.components.billBasicInfoPro.inventoryName',
                defaultMessage: '对应仓库',
              })}
            >
              {value?.inventoryName}
            </Descriptions.Item>
            <Descriptions.Item
              label={intl.formatMessage({
                id: 'afterTodo.components.billBasicInfoPro.inventoryRole',
                defaultMessage: '仓库人员',
              })}
            >
              {value?.inventoryRole}
            </Descriptions.Item>
            <Descriptions.Item
              label={intl.formatMessage({
                id: 'afterTodo.components.billBasicInfoPro.transactionTime',
                defaultMessage: '单据时间',
              })}
              customStyle={{ marginBottom: pxTransform(0) }}
            >
              {transactionTime}
            </Descriptions.Item>
          </Descriptions>
        </MellowCard>
      </View>
    )
  }

  const basicCell = [
    {
      key: 1,
      title: intl.formatMessage({
        id: 'afterTodo.components.billBasicInfoPro.invoicesAbstract',
        defaultMessage: '单据摘要',
      }),
      value: isEdit ? (
        <TextInput
          placeholder={intl.formatMessage({
            id: 'afterTodo.components.billBasicInfoPro.invoicesAbstract.placeholder',
            defaultMessage: '点击输入',
          })}
          style={{
            flex: 1,
            padding: 0,
          }}
          value={value?.invoicesAbstract}
          onChange={handleAbstractChange}
        />
      ) : (
        value?.invoicesAbstract
      ),
    },
    {
      key: 2,
      title: intl.formatMessage({
        id: 'afterTodo.components.billBasicInfoPro.transactionTime',
        defaultMessage: '单据时间',
      }),
      value: transactionTime,
      hasArrow: isEdit,
      clickable: isEdit,
      onPress: () => {
        setVisiblePicker(true)
      },
    },
    {
      key: 3,
      title: intl.formatMessage({
        id: 'afterTodo.components.billBasicInfoPro.inventoryName',
        defaultMessage: '对应仓库',
      }),
      value: isEdit ? (
        <TextInput
          placeholder={intl.formatMessage({
            id: 'afterTodo.components.billBasicInfoPro.inventoryName.placeholder',
            defaultMessage: '点击输入',
          })}
          style={{
            flex: 1,
            padding: 0,
          }}
          value={value?.inventoryName}
          onChange={handleInventoryNameChange}
        />
      ) : (
        value?.inventoryName
      ),
    },
    {
      key: 4,
      title: intl.formatMessage({
        id: 'afterTodo.components.billBasicInfoPro.inventoryRole',
        defaultMessage: '仓库人员',
      }),
      value: isEdit ? (
        <TextInput
          placeholder={intl.formatMessage({
            id: 'afterTodo.components.billBasicInfoPro.inventoryRole.placeholder',
            defaultMessage: '点击输入',
          })}
          style={{
            flex: 1,
            padding: 0,
          }}
          value={value?.inventoryRole}
          onChange={handleStaffChange}
        />
      ) : (
        value?.inventoryRole
      ),
    },
  ]

  return (
    <>
      <MellowCard
        title={intl.formatMessage({ id: 'afterTodo.components.billBasicInfoPro.title', defaultMessage: '基本信息' })}
        style={customStyle}
        bodyStyle={{
          padding: 0,
        }}
      >
        <Cell>
          {basicCell.map((item) => (
            <Cell.Item
              key={item.key}
              title={item.title}
              value={item.value}
              hasArrow={!!item.hasArrow}
              clickable={!!item.clickable}
              onPress={item.onPress || undefined}
            />
          ))}
        </Cell>
      </MellowCard>
      {/* <DatePicker
       visible={visiblePicker}
       value={pickerValue}
       onCacel={() => setVisiblePicker(false)}
       onConfirm={handlePickerConfirm}
     /> */}
    </>
  )
}

BillBasicInfoPro.defaultProps = {
  isEdit: false,
  customStyle: {},
  onChange: undefined,
}

export default BillBasicInfoPro
