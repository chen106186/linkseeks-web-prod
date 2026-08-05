import React, { Fragment, useState } from 'react'
import { DatePicker, Form, Input, InputNumber, Modal, Select, Switch, TreeSelect } from 'antd'
import { FormInstance } from 'antd/es/form/Form'
import { Rule } from 'antd/lib/form'
import { SingleCardUpload } from '@apps/components'
import { getWebIntl } from '@apps/locales'
import { Button } from '@linkseeks/ui'
import { NAV_TYPE } from '@apps/design-ui'
import CommodityDrawer from '@/pages/pageCustomized/components/drawers/commodityDrawer'
import ActivityDrawer from '@/pages/pageCustomized/components/drawers/activityDrawer'
import MixDrawer from '@/pages/pageCustomized/components/drawers/mixDrawer'
import { LAYOUT_TYPE } from '@apps/design-ui/src/Web/constants'
import { NAV_TYPE_OPTION } from '../MallNav/constants'
import useSelectOptions from './useSelectOption'
import styles from './index.less'

export enum ModalFormType {
  /** 文本输入框 */
  Input = 'input',
  /** 数字输入框 */
  InputNumber = 'inputNumber',
  /** 图片上传 */
  Upload = 'upload',
  /** 跳转类型 */
  NavType = 'navType',
  /** 开关 */
  Switch = 'switch',
  /** 日期范围 */
  DateRange = 'dateRange',
}

interface SchemaType {
  type: ModalFormType
  name: string
  label?: string
  hidden?: boolean
  rules?: Rule[]
  disabled?: boolean
  onTypeClick?: (type: NAV_TYPE) => void
}

interface IProps {
  visible?: boolean
  title: string
  formSchema: SchemaType[]
  form: FormInstance<any>
  layoutType: LAYOUT_TYPE
  onValuesChange?: () => void
  onOk?: () => void
  onCancel?: () => void
}

const { RangePicker } = DatePicker

const CommonItemModal: React.FC<IProps> = (props) => {
  const { visible, title, formSchema, form, layoutType, onOk, onCancel, onValuesChange } = props
  const { categoryOptions } = useSelectOptions()
  const [commodityDrawerVisible, setCommodityDrawerVisible] = useState<boolean>(false)
  const [activityDrawerVisible, setActivityDrawerVisible] = useState<boolean>(false)
  const [mixDrawerVisible, setMixDrawerVisible] = useState<boolean>(false)
  const translate = getWebIntl()

  const getNavOption = () => {
    return NAV_TYPE_OPTION.filter((item) => {
      if (layoutType === LAYOUT_TYPE.shop && item.value === NAV_TYPE.srm) {
        return false
      }
      return true
    }).map((item) => ({
      ...item,
      label:
        layoutType === LAYOUT_TYPE.shop && item.value === NAV_TYPE.mallHome
          ? translate('web.resource.shop.dianpushouye')
          : item.label,
    }))
  }

  const renderFormBySchema = (schema: SchemaType) => {
    switch (schema.type) {
      case ModalFormType.Input:
        return (
          <Form.Item
            key={schema.name}
            name={schema.name}
            label={schema.label || ''}
            rules={schema.rules}
            hidden={schema.hidden ?? false}
          >
            <Input />
          </Form.Item>
        )
      case ModalFormType.InputNumber:
        return (
          <Form.Item
            key={schema.name}
            name={schema.name}
            label={schema.label || ''}
            rules={schema.rules}
            hidden={schema.hidden ?? false}
          >
            <InputNumber style={{ width: '100%' }} addonAfter="px" />
          </Form.Item>
        )
      case ModalFormType.Switch:
        return (
          <Form.Item
            key={schema.name}
            name={schema.name}
            label={schema.label || ''}
            rules={schema.rules}
            hidden={schema.hidden ?? false}
          >
            <Switch />
          </Form.Item>
        )
      case ModalFormType.Upload:
        return (
          <Form.Item
            key={schema.name}
            name={schema.name}
            label={schema.label || ''}
            rules={schema.rules}
            hidden={schema.hidden ?? false}
          >
            <SingleCardUpload maxSize={10} tips />
          </Form.Item>
        )
      case ModalFormType.DateRange:
        return (
          <Form.Item
            key={schema.name}
            name={schema.name}
            label={schema.label || ''}
            rules={schema.rules}
            hidden={schema.hidden ?? false}
          >
            <RangePicker showTime style={{ width: '100%' }} />
          </Form.Item>
        )
      case ModalFormType.NavType:
        return (
          <Fragment key={schema.name}>
            <Form.Item
              name={schema.name}
              label={schema.label || ''}
              rules={schema.rules}
              hidden={schema.hidden ?? false}
            >
              <Select
                disabled={schema.disabled ?? false}
                options={getNavOption()}
                onChange={() => {
                  form.resetFields(['value', 'valueText'])
                }}
              />
            </Form.Item>
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, curValues) => prevValues[schema.name] !== curValues[schema.name]}
            >
              {({ getFieldValue }) => {
                const type: NAV_TYPE = getFieldValue(schema.name)
                switch (type) {
                  case NAV_TYPE.customLink:
                    return (
                      <Form.Item
                        label={translate('web.resource.shop.lianjiedizhi')}
                        name="value"
                        rules={[
                          {
                            required: true,
                            message: translate('web.common.qingshuru'),
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    )
                  case NAV_TYPE.keyword:
                    return (
                      <Form.Item
                        label={translate('web.resource.mall.sousuoguanjiazi')}
                        name="value"
                        rules={[
                          {
                            required: true,
                            message: translate('web.common.qingshuru'),
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    )
                  case NAV_TYPE.category:
                    return (
                      <Fragment>
                        <Form.Item name="valueText" hidden>
                          <Input />
                        </Form.Item>
                        <Form.Item
                          label={translate('web.resource.commodity.category')}
                          name="value"
                          rules={[
                            {
                              required: true,
                              message: translate('web.common.qingxuanze'),
                            },
                          ]}
                        >
                          <TreeSelect
                            showSearch
                            style={{ width: '100%' }}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            placeholder={translate('web.common.qingxuanze')}
                            allowClear
                            treeDefaultExpandAll
                            treeData={categoryOptions}
                            onChange={(_, label) => {
                              form.setFieldValue('valueText', label[0])
                            }}
                          />
                        </Form.Item>
                      </Fragment>
                    )
                  case NAV_TYPE.commodityDetail:
                    return (
                      <Fragment>
                        <Form.Item name="value" hidden>
                          <Input />
                        </Form.Item>
                        <Form.Item
                          label={translate('web.resource.mall.commodity')}
                          name="valueText"
                          rules={[
                            {
                              required: true,
                              message: translate('web.common.qingxuanze'),
                            },
                          ]}
                        >
                          <Input
                            disabled
                            addonAfter={
                              <Button
                                type="primary"
                                className={styles['connect-button']}
                                onClick={() => setCommodityDrawerVisible(true)}
                              >
                                {translate('web.resource.shop.guanlian')}
                              </Button>
                            }
                          />
                        </Form.Item>
                      </Fragment>
                    )
                  case NAV_TYPE.marketing:
                    return (
                      <Fragment>
                        <Form.Item name="value" hidden>
                          <Input />
                        </Form.Item>
                        <Form.Item
                          label={translate('web.resource.shop.yingxiaohuodong')}
                          name="valueText"
                          rules={[
                            {
                              required: true,
                              message: translate('web.common.qingxuanze'),
                            },
                          ]}
                        >
                          <Input
                            disabled
                            addonAfter={
                              <Button
                                type="primary"
                                className={styles['connect-button']}
                                onClick={() => setActivityDrawerVisible(true)}
                              >
                                {translate('web.resource.shop.guanlian')}
                              </Button>
                            }
                          />
                        </Form.Item>
                      </Fragment>
                    )
                  case NAV_TYPE.cpecialPage:
                    return (
                      <Fragment>
                        <Form.Item name="value" hidden>
                          <Input />
                        </Form.Item>
                        <Form.Item
                          label={translate('web.resource.marketing.zhuantiye')}
                          name="valueText"
                          rules={[
                            {
                              required: true,
                              message: translate('web.common.qingxuanze'),
                            },
                          ]}
                        >
                          <Input
                            disabled
                            addonAfter={
                              <Button
                                type="primary"
                                className={styles['connect-button']}
                                onClick={() => setMixDrawerVisible(true)}
                              >
                                {translate('web.resource.shop.guanlian')}
                              </Button>
                            }
                          />
                        </Form.Item>
                      </Fragment>
                    )
                  default:
                    return null
                }
              }}
            </Form.Item>
          </Fragment>
        )
      default:
        return null
    }
  }

  const onChooseConfirm = (chooseItem: any) => {
    form.setFieldsValue({
      value: chooseItem.id,
      valueText: chooseItem.name,
    })
    setCommodityDrawerVisible(false)
  }

  const onChooseActivityConfirm = (chooseItem: any) => {
    form.setFieldsValue({
      value: chooseItem.id,
      valueText: chooseItem.name,
    })
    setActivityDrawerVisible(false)
  }

  const onChooseCpecialPageConfirm = (chooseItem: any) => {
    form.setFieldsValue({
      value: chooseItem.id,
      valueText: chooseItem.name,
    })
    setMixDrawerVisible(false)
  }

  return (
    <Modal title={title} open={visible} centered destroyOnClose onOk={() => onOk?.()} onCancel={() => onCancel?.()}>
      <Form
        form={form}
        labelAlign="left"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        onValuesChange={() => onValuesChange?.()}
      >
        {formSchema && formSchema.length > 0 && formSchema.map((item) => renderFormBySchema(item))}
      </Form>
      <CommodityDrawer
        selectId={form.getFieldValue('value')}
        layoutType={layoutType}
        visible={commodityDrawerVisible}
        onClose={() => setCommodityDrawerVisible(false)}
        onConfirm={onChooseConfirm}
        selectType="radio"
        showActivity={false}
      />
      <ActivityDrawer
        selectId={form.getFieldValue('value')}
        visible={activityDrawerVisible}
        onClose={() => setActivityDrawerVisible(false)}
        onConfirm={onChooseActivityConfirm}
      />
      <MixDrawer
        selectId={form.getFieldValue('value')}
        visible={mixDrawerVisible}
        onClose={() => setMixDrawerVisible(false)}
        onConfirm={onChooseCpecialPageConfirm}
        type={7}
        environment={1}
        property={1}
        layoutType={LAYOUT_TYPE.cpecialPage}
      />
    </Modal>
  )
}

export default CommonItemModal
