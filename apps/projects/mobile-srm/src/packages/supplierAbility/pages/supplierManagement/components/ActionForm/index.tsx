/*
 * @Description: 供应商管理操作 Form
 */
import React, { useRef } from 'react'
import { showToast, pxTransform } from '@apps/mobile-services/utils/taro'
import { View, TextArea, Button } from '@apps/mobile-ui'
import { themeLayout } from '@/constants/theme'
import { limitByte } from '@/utils'
import { dateFormat } from '@/utils/date'
import MellowCard from '@/components/MellowCard'
import Form from '../../../../components/Form'
import { RuleObject } from '../../../../components/Form/typings'
import { validateFields } from '../../../../components/Form/utils/validateUtil'
import CustomDatePicker from '../../../../components/CustomDatePicker'
import './index.scss'

export type ActionType = 'blacklist' | 'eliminate' | 'freeze' | 'unfreeze'

export interface ActionFormValues {
  /**
   * 操作日期
   */
  date: string
  /**
   * 备注
   */
  remark: string
}

interface ActionFormIProps {
  /**
   * 操作类型
   */
  actionType: ActionType
  /**
   * 点击确认触发事件
   */
  onSubmit: (values: ActionFormValues) => void
}

const titleMap: { [key in ActionType]: string } = {
  blacklist: '拉入黑名单',
  eliminate: '解除关系',
  freeze: '供应商冻结',
  unfreeze: '供应商解冻',
}

const dateTitleMap: { [key in ActionType]: string } = {
  blacklist: '拉黑日期',
  eliminate: '解除日期',
  freeze: '冻结日期',
  unfreeze: '解冻日期',
}

const remarkPlaceholderMap: { [key in ActionType]: string } = {
  blacklist: '点击输入拉黑的原因',
  eliminate: '点击输入解除关系的原因',
  freeze: '点击输入冻结的原因',
  unfreeze: '点击输入解冻的原因',
}

const ActionForm: React.FC<ActionFormIProps> = (props: ActionFormIProps) => {
  const { actionType, onSubmit } = props

  const [form] = Form.useForm()

  const rules = useRef<Map<string, RuleObject[]>>(
    new Map([
      [
        'date',
        [
          {
            required: true,
            message: '请选择进入日期',
          },
        ],
      ],
      [
        'remark',
        [
          {
            required: true,
            message: '请填写原因',
          },
          {
            validator: (_, value) => {
              const resMsg = limitByte(value || '', { maxByte: 120 })
              if (resMsg) {
                return Promise.reject(new Error(resMsg))
              }
              return Promise.resolve()
            },
          },
        ],
      ],
    ]),
  )

  const handleFinish = async (values: ActionFormValues) => {
    try {
      const valueErrors = await validateFields(values, rules.current)
      if (valueErrors.length) {
        showToast({ title: valueErrors[0].errors?.[0], icon: 'none' })
        return
      }
      onSubmit?.(values)
    } catch (error) {}
  }

  const handleConfirm = () => {
    form.submit()
  }

  return (
    <View className="supplier-action-form">
      <View
        style={{
          flex: 1,
        }}
      >
        <Form form={form} onFinish={handleFinish}>
          {actionType === 'blacklist' || actionType === 'eliminate' ? (
            <MellowCard
              headStyle={{
                borderBottomWidth: 0,
              }}
              bodyStyle={{
                paddingTop: 0,
                paddingBottom: 0,
              }}
              style={{
                marginBottom: pxTransform(themeLayout['margin-xs']),
              }}
            >
              <Form.Item
                label={dateTitleMap[actionType]}
                name="date"
                initialValue={dateFormat(new Date(), 'YYYY-MM-DD')}
              >
                <CustomDatePicker placeholder="请选择" contentAlign="right" />
              </Form.Item>
            </MellowCard>
          ) : null}
          <MellowCard
            headStyle={{
              borderBottomWidth: 0,
            }}
            bodyStyle={{
              paddingTop: 0,
              paddingBottom: 0,
            }}
          >
            <Form.Item name="remark">
              <TextArea placeholder={remarkPlaceholderMap[actionType]} count={false} />
            </Form.Item>
          </MellowCard>
        </Form>
        <View className="supplier-action-form-action">
          <Button type="primary" onClick={handleConfirm}>
            确认
          </Button>
        </View>
      </View>
    </View>
  )
}

export default ActionForm
