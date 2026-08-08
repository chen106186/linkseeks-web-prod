/*
 * @Description: 注册资料列表组件
 */
import React, { useEffect, useState } from 'react'
import { preload, getCurrentInstance } from '@apps/mobile-services/utils/taro'
import { View } from '@apps/mobile-ui'
import Router from '@/utils/router'
import MellowCard from '@/components/MellowCard'
import Shuttle from '@/components/Shuttle'
import Empty from '@/components/Empty'
import Cell from '@/components/Cell'
import {
  ElementType,
  FormFieldType,
  getFieldType,
  renderFieldTypeContent,
  renderFormFieldComponent,
} from '../../common/utils/createMemberSchemaUtil'
import { ElementsItemType } from '../SupplierProfile/interface'
import './index.scss'

export type RegisterListValueType = Record<string, any>[]

export interface RegisterDataListProps {
  /**
   * 标题
   */
  title: string
  /**
   * 是否显示标题，默认 true
   */
  showTitle?: boolean
  /**
   * 列表配置
   */
  configs: ElementType[]
  /**
   * 值
   */
  value?: RegisterListValueType
  /**
   * 资质证明改变触发事件
   */
  onChange?: (value: RegisterListValueType) => void
  /**
   * 是否可编辑
   */
  editable?: boolean
  /**
   * 列表展示数据
   */
  registers?: ElementsItemType['registers']
  /**
   * 自定义渲染样式
   */
  customStyle?: React.CSSProperties
}

const RegisterDataList: React.FC<RegisterDataListProps> = (props: RegisterDataListProps) => {
  const { title, showTitle = true, configs, value, onChange, editable, registers, customStyle } = props

  const params = getCurrentInstance().preloadData as any

  const [registerData, setRegisterData] = useState<FormFieldType[]>([])

  // useEffect(() => {
  //   if ('value' in props && value) {

  //   }
  // }, [value]);

  const normalizeRegisterData = (data: ElementType[]) => {
    if (!data || !data.length) {
      return
    }
    const registerDataGroups: FormFieldType[] = []
    data.forEach((item) => {
      const field = getFieldType(item)
      registerDataGroups.push(field)
    })
    setRegisterData(registerDataGroups)
  }

  useEffect(() => {
    normalizeRegisterData(configs)
  }, [configs])

  const handleRegisterDataListChange = (value: RegisterListValueType) => {
    onChange?.(value)
  }

  const handleJump = () => {
    preload({
      ...params,
      onConfirm: handleRegisterDataListChange,
      defaultValue: value,
      title,
      configs,
    })
    Router.navigateTo('supplierAbility/supplierDepositRegisterDataList/index')
  }

  if (!editable && registers && registers.length) {
    return (
      <MellowCard
        title={showTitle && title}
        extra={editable ? <Shuttle describe={`添加${title}`} onJump={handleJump} /> : null}
        bodyStyle={{
          padding: 0,
        }}
        headStyle={{
          paddingTop: 0,
          paddingRight: 0,
          paddingLeft: 0,
          borderBottom: 'none',
        }}
        style={{
          borderRadius: 0,
        }}
      >
        <View className="register-data-list" style={customStyle}>
          {registers?.map((item, index) => (
            <View className="register-data-list-item" key={index}>
              <View className="register-data-list-item-title">{`${title}${index + 1}`}</View>
              <Cell border={false} transposition>
                {item.map((registersItem) => (
                  <Cell.Item
                    key={registersItem.fieldOrder}
                    title={registersItem.fieldLocalName}
                    value={renderFieldTypeContent(
                      registersItem.fieldType!,
                      registersItem.fieldValue,
                      registersItem.fieldLocalName,
                      registersItem.registers,
                    )}
                    customHeadStyle={{ backgroundColor: '#FAFBFC' }}
                  />
                ))}
              </Cell>
            </View>
          ))}
        </View>
      </MellowCard>
    )
  }

  return (
    <MellowCard
      title={showTitle && title}
      extra={editable ? <Shuttle describe={`添加${title}`} onJump={handleJump} /> : null}
      bodyStyle={{
        padding: 0,
      }}
      headStyle={{
        paddingTop: 0,
        paddingRight: 0,
        paddingLeft: 0,
        borderBottom: 'none',
      }}
      style={{
        borderRadius: 0,
      }}
    >
      <View className="register-data-list" style={customStyle}>
        {value?.map((item, index) => (
          <View className="register-data-list-item" key={index}>
            <View className="register-data-list-item-title">{`${title}${index + 1}`}</View>
            <Cell border={false} transposition>
              {registerData?.map((registerItem) => (
                <Cell.Item
                  key={registerItem.fieldName}
                  title={registerItem.title}
                  value={renderFormFieldComponent(registerItem, false, {
                    value: item[registerItem.fieldName],
                    disabled: true,
                    preview: true,
                    style: {
                      width: '50%',
                    },
                    // 应该统一一下
                    customStyle: {
                      width: '50%',
                    },
                  })}
                />
              ))}
            </Cell>
          </View>
        ))}
        {!value || !value.length ? <Empty /> : null}
      </View>
    </MellowCard>
  )
}

export default RegisterDataList
