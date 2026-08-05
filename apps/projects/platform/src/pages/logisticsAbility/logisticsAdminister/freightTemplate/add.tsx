/*
 * @Author: LeeJiancong
 * @Date: 2020-07-15 10:31:55
 * @LastEditors: LeeJiancong
 * @LastEditTime: 2020-10-16 14:51:25
 */
import React, { useState, useEffect } from 'react'
import { SchemaForm, SchemaMarkupField as Field, createFormActions } from '@apps/formily'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link, usePrompt, useQuery, useLocation } from '@linkseeks/router-core'
import { Row, Col, Card, Button, Select as ISelect } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import { Input, Switch, Select, FormMegaLayout, FormTab, Radio, ArrayTable, ArrayCards, Transfer } from '@apps/formily'
import styles from './index.less'
import ReturnEle from '@/components/ReturnEle'
import { PATTERN_MAPS } from '@/constants/regExp'
import { getManageAreaByPcodeAll } from '@apps/apis'
import {
  getLogisticsFreightTemplateGet,
  postLogisticsFreightTemplateAdd,
  postLogisticsFreightTemplateUpdate,
} from '@apps/apis'
import SringField from '@/components/NiceForm/components/SringField'
import { getWebIntl } from '@apps/locales'
const intl = getIntl()
const translate = getWebIntl()
//列表带来的参数
export interface ListProps {
  title?: React.ReactNode
}
export interface ListType {
  checked: boolean //可选
}

/**
 * @description: 自定义formilyjs 有图标的select组件
 * @param {type}
 * @return:
 */

const actions = createFormActions()
const diaLogForm: React.FC<ListProps> = (props) => {
  const { id } = useQuery()
  const { pathname } = useLocation()
  const [path] = useState(pathname.split('/')[pathname.split('/').length - 1])
  const [formIsHalfFilledOut, setFormIsHalfFilledOut] = useState(true)
  usePrompt({
    when: formIsHalfFilledOut,
    message: intl.formatMessage({
      id: 'common.tip.save.confirm',
      defaultMessage: '您还有未保存的内容，是否确定要离开？',
    }),
  })
  const [provinceList, setProvinceList] = useState([])
  const [editable, setEditable] = useState<boolean>(true)
  const [headerTitle, setHeaderTitle] = useState('')

  /**
   * @description: useEffect
   * @param {type}
   * @return:
   */
  useEffect(() => {
    let _title =
      path === 'detail'
        ? intl.formatMessage({ id: 'logistics.zhakan' })
        : !id
        ? intl.formatMessage({ id: 'logistics.xinjian' })
        : intl.formatMessage({ id: 'logistics.bianji' })
    if (path === 'detail') {
      setEditable(false)
    }
    setHeaderTitle(`${_title}${intl.formatMessage({ id: 'logistics.yunfeimuban' })}`)
    getManageAreaByPcodeAll({ pcode: '100000' })
      .then((res) => {
        let list = []
        res.data.forEach((item: any, index: number) => {
          list.push({ label: item.name, value: item.code })
        })
        setProvinceList(list)
      })
      .catch((error) => {
        console.warn(error)
      })
    if (id) {
      getLogisticsFreightTemplateGet({ id: id })
        .then((res) => {
          if (res.code == 1000) {
            let data = res.data
            actions.setFieldValue('freight', {
              weight: res.data.weight,
              price: res.data.price,
              incrementWeight: res.data.incrementWeight,
              incrementPrice: res.data.incrementPrice,
            })
            Object.keys(data).forEach((key) => {
              actions.setFieldState(key, (state) => {
                state.value = data[key]
              })
            })
          }
        })
        .catch((error) => {
          console.warn(error)
        })
    }

    if (path === 'detail') {
      setFormIsHalfFilledOut(false)
    }
  }, [])

  const FormSumbit = (values: any) => {
    let value = {
      ...values,
      ...values.freight,
    }
    if (value.designateList.length === 1 && JSON.stringify(value.designateList[0]) === '{}') {
      delete value.designateList
    }
    if (!id) {
      postLogisticsFreightTemplateAdd(value)
        .then((res) => {
          if (res.code === 1000) {
            setTimeout(() => {
              history.goBack()
            }, 1000)
          }
        })
        .catch((error) => {
          console.warn(error)
        })
    } else {
      value.id = Number(id)
      postLogisticsFreightTemplateUpdate(value)
        .then((res) => {
          if (res.code === 1000) {
            setTimeout(() => {
              history.goBack()
            }, 1000)
          }
        })
        .catch((error) => {
          console.warn(error)
        })
    }
    setFormIsHalfFilledOut(false)
  }

  const onSearch = () => {}
  return (
    <PageHeaderWrapper
      title={headerTitle}
      extra={
        editable && (
          <Button type="primary" onClick={() => actions.submit()}>
            {' '}
            {intl.formatMessage({ id: 'logistics.baocun' })}
          </Button>
        )
        //外层调用form API
      }
    >
      <Card>
        <Row>
          <Col span={24}>
            <SchemaForm
              editable={editable}
              autoComplete="off"
              className={styles.schemaform}
              actions={actions} //要传递
              initialValues={{
                // provic: '广东省',
                pricingMode: 1,
                transportMode: 1,
                designateList: [{}],
              }}
              previewPlaceholder=" "
              onSubmit={(values) => FormSumbit(values)}
              components={{
                Input,
                Select,
                TextArea: Input.TextArea,
                Switch,
                Radio,
                RadioGroup: Radio.Group,
                ArrayTable,
                ArrayCards,
                Transfer,
                SringField,
              }}
            >
              <FormTab name="tabs" defaultActiveKey={'tab-1'}>
                <FormTab.TabPane name="tab-1" tab={intl.formatMessage({ id: 'logistics.jibenxinxi' })}>
                  <FormMegaLayout labelCol={2} full labelAlign="left">
                    <Field
                      x-rules={[
                        {
                          required: true,
                          message: intl.formatMessage({ id: 'common.form.input.placeholder' }),
                        },
                      ]}
                      title={intl.formatMessage({ id: 'logistics.mubanmingcheng' })}
                      name="name"
                      maxLength={15}
                      x-component="Input"
                      x-component-props={{
                        placeholder: intl.formatMessage({ id: 'logistics.qingshurumuban' }),
                      }}
                    />
                    <Field
                      title={intl.formatMessage({ id: 'logistics.jijiafangshi' })}
                      name="pricingMode"
                      required
                      x-component="RadioGroup"
                      enum={[{ label: intl.formatMessage({ id: 'logistics.anzhongliang' }), value: 1 }]}
                    />
                    <Field
                      title={intl.formatMessage({ id: 'logistics.yunsongfangshi' })}
                      name="transportMode"
                      required
                      x-component="RadioGroup"
                      enum={[{ label: intl.formatMessage({ id: 'logistics.kuaidi' }), value: 1 }]}
                    />
                    <Field
                      name="freight"
                      type="object"
                      required
                      title={intl.formatMessage({ id: 'logistics.morenyunfei' })}
                    >
                      <FormMegaLayout className="morenyunfei-inline" inline>
                        <Field
                          name="weight"
                          x-props={{
                            style: {
                              width: 160,
                            },
                          }}
                          x-component="Input"
                          x-component-props={{
                            inline: true,
                            placeholder: '',
                            addonAfter: `KG${intl.formatMessage({ id: 'logistics.nei' })}`,
                          }}
                          x-rules={[
                            {
                              required: true,
                              message: intl.formatMessage({ id: 'common.form.input.placeholder' }),
                            },
                            {
                              pattern: PATTERN_MAPS.weight,
                              message: intl.formatMessage({ id: 'logistics.shuzileixing3' }),
                            },
                          ]}
                        />
                        <Field
                          name="price"
                          required
                          x-props={{
                            style: {
                              width: 160,
                            },
                          }}
                          x-component="Input"
                          x-component-props={{
                            placeholder: '',
                            addonAfter: intl.formatMessage({ id: 'logistics.yuan' }),
                          }}
                          x-rules={[
                            {
                              required: true,
                              message: intl.formatMessage({ id: 'common.form.input.placeholder' }),
                            },
                            {
                              pattern: PATTERN_MAPS.money,
                              message: intl.formatMessage({ id: 'logistics.shuzileixing2' }),
                            },
                          ]}
                        />
                        <Field
                          name="incrementWeight"
                          required
                          x-props={{
                            style: {
                              width: 250,
                            },
                          }}
                          x-component="Input"
                          x-component-props={{
                            placeholder: '',
                            addonBefore: intl.formatMessage({ id: 'logistics.meizengjia' }),
                            addonAfter: 'KG',
                          }}
                          x-rules={[
                            {
                              required: true,
                              message: intl.formatMessage({ id: 'common.form.input.placeholder' }),
                            },
                            {
                              pattern: PATTERN_MAPS.weight,
                              message: intl.formatMessage({ id: 'logistics.shuzileixing3' }),
                            },
                          ]}
                        />
                        <Field
                          name="incrementPrice"
                          required
                          x-props={{
                            style: {
                              width: 250,
                            },
                          }}
                          x-component="Input"
                          x-component-props={{
                            placeholder: '',
                            addonBefore: intl.formatMessage({ id: 'logistics.zengjiayunfei' }),
                            addonAfter: intl.formatMessage({ id: 'logistics.yuan' }),
                          }}
                          x-rules={[
                            {
                              required: true,
                              message: intl.formatMessage({ id: 'common.form.input.placeholder' }),
                            },
                            {
                              pattern: PATTERN_MAPS.money,
                              message: intl.formatMessage({ id: 'logistics.shuzileixing2' }),
                            },
                          ]}
                        />
                      </FormMegaLayout>
                    </Field>
                  </FormMegaLayout>
                  <FormMegaLayout wrapperWidth={570} labelWidth={174} labelCol={2} labelAlign="left">
                    <Field
                      title={intl.formatMessage({ id: 'logistics.yunfeishuoming' })}
                      name="explain"
                      x-component="TextArea"
                      x-component-props={{
                        placeholder: intl.formatMessage({ id: 'logistics.zuichang60gezi' }),
                      }}
                      x-rules={{
                        max: 30,
                      }}
                    />
                  </FormMegaLayout>
                </FormTab.TabPane>
                <FormTab.TabPane name="tab-2" tab={intl.formatMessage({ id: 'logistics.zhidingdiquyun' })}>
                  <Row>
                    <Col span={24}>
                      <Field
                        name="designateList"
                        minItems={0}
                        type="array"
                        x-component="ArrayTable"
                        x-component-props={{
                          operationsWidth: 200,
                          operations: {
                            title: intl.formatMessage({ id: 'logistics.caozuo' }),
                          },
                          renderAddition: () => (
                            <div style={{ padding: '2px 0', textAlign: 'center' }}>
                              +{intl.formatMessage({ id: 'logistics.tianjiazhidingdi' })}
                            </div>
                          ),
                          renderMoveDown: () => null,
                          renderMoveUp: () => null,
                          renderRemove: (idx: any) => {
                            const mutators = actions.createMutators('designateList')
                            return (
                              <Button
                                type="link"
                                style={{ color: '#00A98F' }}
                                onClick={() => {
                                  mutators.remove(idx)
                                }}
                              >
                                {intl.formatMessage({ id: 'logistics.shanchu' })}
                              </Button>
                            )
                          },
                        }}
                      >
                        <Field type="object">
                          <Field
                            x-component="Select"
                            title={intl.formatMessage({ id: 'logistics.yunsongdao' })}
                            name="areaIds"
                            enum={provinceList}
                            x-component-props={{
                              showSearch: true,
                              mode: 'multiple', //"multiple",
                              onSearch: () => {
                                onSearch
                              },
                              optionFilterProp: 'children', //指定回显
                            }}
                          />
                          <Field
                            name="weight"
                            x-component="Input"
                            type="number"
                            title={intl.formatMessage({ id: 'logistics.shoujian' })}
                            x-component-props={{
                              onChange: (e: any) => {
                                console.log(e.target.value)
                                // actions.validate()
                              },
                            }}
                            x-rules={{
                              pattern: PATTERN_MAPS.weight,
                              message: intl.formatMessage({ id: 'logistics.shuzileixing3' }),
                            }}
                          />
                          <Field
                            name="price"
                            x-component="Input"
                            type="number"
                            title={translate.formatCurrencyWith(translate('web.resource.logistics.shoufei'))}
                            x-rules={{
                              pattern: PATTERN_MAPS.money,
                              message: intl.formatMessage({ id: 'logistics.shuzileixing2' }),
                            }}
                          />
                          <Field
                            name="incrementWeight"
                            x-component="Input"
                            type="number"
                            title={intl.formatMessage({ id: 'logistics.xujian' })}
                            x-rules={{
                              pattern: PATTERN_MAPS.weight,
                              message: intl.formatMessage({ id: 'logistics.shuzileixing3' }),
                            }}
                          />
                          <Field
                            name="incrementPrice"
                            x-component="Input"
                            type="number"
                            title={translate.formatCurrencyWith(translate('web.resource.logistics.xufei'))}
                            x-rules={{
                              pattern: PATTERN_MAPS.money,
                              message: intl.formatMessage({ id: 'logistics.shuzileixing2' }),
                            }}
                          />
                        </Field>
                      </Field>
                    </Col>
                  </Row>
                </FormTab.TabPane>
              </FormTab>
              {/* <FormButtonGroup offset={4}>
                <Submit> 保存</Submit>
                <Popconfirm
                  title="未保存，是否确定执行这个操作?"
                  onConfirm={confirm}
                  onCancel={cancel}
                  okText={intl.formatMessage({ id: 'logistics.shi' })}
                  cancelText={intl.formatMessage({ id: 'logistics.fou' })}
                >
                  <Button>取消</Button>
                </Popconfirm>
              </FormButtonGroup> */}
            </SchemaForm>
          </Col>
        </Row>
      </Card>
    </PageHeaderWrapper>
  )
}
diaLogForm.defaultProps = {
  title: '新建发货地址',
}
export default diaLogForm
