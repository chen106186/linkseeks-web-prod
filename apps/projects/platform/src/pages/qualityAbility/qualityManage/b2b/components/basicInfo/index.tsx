import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Card as CardLayout } from '@linkseeks/ui'
import { getIntl } from '@linkseeks/i18n'
import { Button, Col, DatePicker, Form, Input, message, Row, Select } from 'antd'
import { LinkOutlined } from '@ant-design/icons'
import type { ColumnType } from 'antd/lib/table'
import styles from './index.less'
import TableModal from '@/pages/transaction/components/tableModal'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { getMemberManageSupplyMember } from '@apps/apis'
import { AddedContext } from '@/components/DetailLayout/components/context'
import { getOrderQualityGetQualityNo } from '@apps/apis'
import { validatorByte } from '@/utils/regExp'
import moment from 'moment'
import type { RangePickerProps } from 'antd/lib/date-picker'
import { ORDERRESOURCE } from '../../add'

interface BasicInfoLaoutProps {}
const index = 0

const BasicInfoLaout: React.FC<BasicInfoLaoutProps> = () => {
  const intl = getIntl()
  const id = null
  const { form, dataSource, PATH, onFieldsChange } = useContext(AddedContext)
  const [visible, setVisible] = useState<boolean>(false)
  const [menberValue, setMenberValue] = useState<any[]>([])
  const [qualityNo, setQualityNo] = useState<string>('')
  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'quality.huiyuanID', defaultMessage: '会员ID' }),
      key: 'memberId',
      dataIndex: 'memberId',
    },
    {
      title: intl.formatMessage({ id: 'quality.huiyuanmingcheng', defaultMessage: '会员名称' }),
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: intl.formatMessage({ id: 'quality.huiyuanleixing', defaultMessage: '会员类型' }),
      key: 'memberTypeName',
      dataIndex: 'memberTypeName',
    },
    {
      title: intl.formatMessage({ id: 'quality.huiyuanjuese', defaultMessage: '会员角色' }),
      key: 'roleName',
      dataIndex: 'roleName',
    },
    {
      title: intl.formatMessage({ id: 'quality.huiyuandengji', defaultMessage: '会员等级' }),
      key: 'levelTag',
      dataIndex: 'levelTag',
    },
  ]

  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    return current && current < moment().startOf('day')
  }

  const handleFetchData = useCallback((params: any) => {
    return new Promise((resolve) => {
      getMemberManageSupplyMember({ ...params }, { ctlType: 'none' })
        .then((res) => {
          if (res.code !== 1000) {
            return
          }
          const data = {
            data: res.data.data.map((_item) => {
              return {
                ..._item,
                mrId: `${_item.memberId}_${_item.roleId}`,
              }
            }),
            totalCount: res.data.totalCount,
          }
          resolve(data)
        })
        .catch((error) => {
          console.warn(error)
        })
    })
  }, [])

  const toggle = (flag: boolean) => {
    setVisible(flag)
  }

  const handleSubmit = (_selectRow: number[] | string[], selectedRows: Record<string, any>[]) => {
    form?.setFieldsValue({
      vendorMemberName: selectedRows[index]?.name,
      vendorMemberId: selectedRows[index]?.memberId,
      vendorRoleId: selectedRows[index]?.roleId,
    })
    setMenberValue(selectedRows)
    onFieldsChange()
    toggle(false)
  }

  useEffect(() => {
    if (!id) {
      getOrderQualityGetQualityNo().then((res) => {
        if (res.code !== 1000) {
          message.error(res.message)
          return
        }
        setQualityNo(res.data)
        form.setFieldsValue({
          qualityNo: res.data,
          startTime: moment(),
          endTime: moment(),
        })
        onFieldsChange()
      })
    }
  }, [id])

  useEffect(() => {
    if (dataSource && PATH !== 'formed' && PATH !== 'send') {
      setQualityNo(dataSource?.qualityNo)
      onFieldsChange()
    }
  }, [dataSource])

  return (
    <CardLayout
      id="basicInfo"
      title={intl.formatMessage({ id: 'quality.jibenxinxi', defaultMessage: '基本信息' })}
      bodyStyle={{ paddingBottom: '0px' }}
      className={styles['basic-layout']}
    >
      <Row gutter={[16, 36]}>
        <Col span={12}>
          <Form.Item
            label={intl.formatMessage({
              id: 'quality.zhijiandanbianhao',
              defaultMessage: '质检单编号',
            })}
          >
            <span>{qualityNo}</span>
          </Form.Item>
          <Form.Item
            hidden
            name="qualityNo"
            label={intl.formatMessage({
              id: 'quality.zhijiandanbianhao',
              defaultMessage: '质检单编号',
            })}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="digest"
            label={intl.formatMessage({
              id: 'quality.zhijiandanzhaiyao',
              defaultMessage: '质检单摘要',
            })}
            rules={[
              {
                required: true,
                message: intl.formatMessage({
                  id: 'quality.qingshuruzhijiandanzhaiyao',
                  defaultMessage: '请输入质检单摘要',
                }),
              },
            ]}
          >
            <Input
              placeholder={intl.formatMessage({
                id: 'quality.qingshuruzhijiandanzhaiyao',
                defaultMessage: '请输入质检单摘要',
              })}
            />
          </Form.Item>
          <Form.Item
            name="qualityType"
            label={intl.formatMessage({ id: 'quality.zhijianleixing', defaultMessage: '质检类型' })}
            rules={[
              {
                required: true,
                message:
                  intl.formatMessage({ id: 'quality.qingxuanze', defaultMessage: '请选择' }) +
                  intl.formatMessage({ id: 'quality.zhijianleixing', defaultMessage: '质检类型' }),
              },
            ]}
          >
            <Select>
              <Select.Option value={1}>
                {intl.formatMessage({ id: 'quality.lailiaozhijian', defaultMessage: '来料质检' })}
              </Select.Option>
              <Select.Option value={2}>
                {intl.formatMessage({ id: 'quality.yangpinzhijian', defaultMessage: '样品质检' })}
              </Select.Option>
              <Select.Option value={3}>
                {intl.formatMessage({
                  id: 'quality.shizhipinzhijian',
                  defaultMessage: '试制品质检',
                })}
              </Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="vendorMemberName"
            label={intl.formatMessage({
              id: 'quality.gongyinghuiyuan',
              defaultMessage: '供应会员',
            })}
            rules={[
              {
                required: true,
                message:
                  intl.formatMessage({ id: 'quality.qingxuanze', defaultMessage: '请选择' }) +
                  intl.formatMessage({ id: 'quality.gongyinghuiyuan', defaultMessage: '供应会员' }),
              },
            ]}
          >
            <Input.Search
              disabled={
                PATH === 'formed' ||
                PATH === 'send' ||
                dataSource?.orderResource === ORDERRESOURCE.ORDER ||
                dataSource?.orderResource === ORDERRESOURCE.SEND
              }
              onSearch={() => toggle(true)}
              readOnly
              enterButton={<LinkOutlined />}
            />
          </Form.Item>
          <Form.Item
            hidden
            name="vendorMemberId"
            label={intl.formatMessage({
              id: 'quality.gongyingshanghuiyuanId',
              defaultMessage: '供应商会员Id',
            })}
            rules={[
              {
                required: true,
                message:
                  intl.formatMessage({ id: 'quality.qingxuanze', defaultMessage: '请选择' }) +
                  intl.formatMessage({ id: 'quality.gongyinghuiyuan', defaultMessage: '供应会员' }),
              },
            ]}
          >
            <Input
              placeholder={intl.formatMessage({
                id: 'quality.gongyingshanghuiyuanId',
                defaultMessage: '供应商会员Id',
              })}
            />
          </Form.Item>
          <Form.Item hidden name="vendorRoleId" label="供应商会员角色Id" rules={[{ required: true }]}>
            <Input placeholder="供应商会员角色Id" />
          </Form.Item>
          <Form.Item
            name="digest"
            label={intl.formatMessage({ id: 'quality.zhijianriqi', defaultMessage: '质检日期' })}
            required
          >
            <div className={styles.digest}>
              <Form.Item
                name="startTime"
                validateFirst
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'quality.qingxuanze',
                      defaultMessage: '请选择',
                    }),
                  },
                ]}
              >
                {/* @ts-ignore */}
                <DatePicker showNow={false} allowClear format="YYYY-MM-DD" disabledDate={disabledDate} />
              </Form.Item>
              <div style={{ height: '32.84px', lineHeight: '2.3715' }}>-</div>
              <Form.Item
                name="endTime"
                dependencies={['startTime']}
                rules={[
                  {
                    validator: (_, value) => {
                      const _startTime = form.getFieldValue('startTime')
                      if (!value) {
                        return Promise.reject(
                          new Error(
                            intl.formatMessage({
                              id: 'quality.qingxuanze',
                              defaultMessage: '请选择',
                            }),
                          ),
                        )
                      }
                      if (_startTime && !moment(value).isSameOrAfter(_startTime)) {
                        return Promise.reject(
                          new Error(
                            intl.formatMessage({
                              id: 'quality.zhijianjieshuriqidayu',
                              defaultMessage: '质检结束日期大于或等于质检开始日期',
                            }),
                          ),
                        )
                      }
                      return Promise.resolve()
                    },
                  },
                ]}
              >
                {/* @ts-ignore */}
                <DatePicker showNow={false} allowClear format="YYYY-MM-DD" disabledDate={disabledDate} />
              </Form.Item>
            </div>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="qualityInspector"
            label={intl.formatMessage({ id: 'quality.zhijianren', defaultMessage: '质检人' })}
            rules={[{ validator: (rule, value, callback) => validatorByte(rule, value, callback, 40) }]}
          >
            <Input
              placeholder={intl.formatMessage(
                {
                  id: 'common.maxTextnumberLength',
                  defaultMessage: '最多输入{char}个字符，{hanzi}个汉字',
                },
                { char: 40, hanzi: 20 },
              )}
            />
          </Form.Item>
          <Form.Item
            name="remark"
            label={intl.formatMessage({ id: 'quality.beizhu', defaultMessage: '备注' })}
            rules={[{ validator: (rule, value, callback) => validatorByte(rule, value, callback, 300) }]}
          >
            <Input
              placeholder={intl.formatMessage(
                {
                  id: 'common.maxTextnumberLength',
                  defaultMessage: '最多输入{char}个字符，{hanzi}个汉字',
                },
                { char: 300, hanzi: 150 },
              )}
            />
          </Form.Item>
          <Form.Item
            label={
              dataSource?.orderResource !== ORDERRESOURCE.SEND
                ? intl.formatMessage({ id: 'quality.shouhuodanhao', defaultMessage: '收货单号' })
                : '送样需求单号'
            }
          >
            {dataSource?.orderResource !== ORDERRESOURCE.SEND ? (
              <Button
                target="_blank"
                type="link"
                href={`/orderAbility/receivingNote/deliveryNoteManage/detail?id=${dataSource?.receiveId}`}
              >
                {dataSource?.receiveNo}
              </Button>
            ) : (
              <Button
                target="_blank"
                type="link"
                href={`/commodityAbility/deliverManagement/requestSheetQuery/detail?id=${dataSource?.receiveId}`}
              >
                {dataSource?.receiveNo}
              </Button>
            )}
          </Form.Item>
          <Form.Item hidden name="receiveId" label="收货单号ID">
            <Input />
          </Form.Item>
          <Form.Item hidden name="receiveNo" label="收货单号">
            <Input />
          </Form.Item>
        </Col>
      </Row>
      {/* 选择供应会员 */}
      <TableModal
        modalType="Drawer"
        visible={visible}
        tableProps={{
          rowKey: 'mrId',
        }}
        mode="radio"
        customKey="mrId"
        title={intl.formatMessage({
          id: 'quality.xuanzegongyingshang',
          defaultMessage: '选择供应商',
        })}
        schema={{
          type: 'object',
          properties: {
            megalayout: {
              type: 'object',
              'x-component': 'mega-layout',
              properties: {
                memberName: {
                  type: 'string',
                  'x-component': 'Search',
                  'x-mega-props': {},
                  'x-component-props': {
                    placeholder: intl.formatMessage({
                      id: 'quality.huiyuanmingcheng',
                      defaultMessage: '会员名称',
                    }),
                    advanced: false,
                    align: 'flex-left',
                  },
                },
              },
            },
            [FORM_FILTER_PATH]: {
              type: 'object',
              'x-component': 'flex-layout',
              'x-component-props': {
                rowStyle: {
                  justifyContent: 'flex-start',
                  flexWrap: 'nowrap',
                },
                colStyle: {
                  //改变间隔
                  marginRight: 20,
                },
              },
            },
          },
        }}
        effects={($, actions) => {
          actions.reset()
          useStateFilterSearchLinkageEffect($, actions, 'memberName', FORM_FILTER_PATH)
        }}
        columns={columns}
        fetchData={handleFetchData}
        onClose={() => toggle(false)}
        onOk={handleSubmit}
        value={menberValue}
      />
    </CardLayout>
  )
}
export default BasicInfoLaout
