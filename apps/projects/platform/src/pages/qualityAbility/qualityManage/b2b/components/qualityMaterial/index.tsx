import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Card as CardLayout } from '@linkseeks/ui'
import { PlusOutlined } from '@ant-design/icons'
import { Button, Form, Input, message, Select, Space, Table } from 'antd'
import type { ColumnType } from 'antd/lib/table'
import { AddedContext } from '@/components/DetailLayout/components/context'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import TableModal from '@/pages/transaction/components/tableModal'
import { getProductSelectGetSelectBrand } from '@apps/apis'
import { useAsyncInitSelect } from '@/formSchema/effects/useAsyncInitSelect'
import { useCustomerCategoriesBusinessEffects } from '@/formSchema/effects/useCustomerCategoriesBusinessEffects'
import { fetchTreeData, useAsyncCascader } from '@/formSchema/effects/useAsyncCascader'
import type { DetectionType } from '../../../components/detectionDrawer'
import DetectionDrawer from '../../../components/detectionDrawer'
import { isEmpty } from 'lodash'
import { getProductCommodityCommonGetCommodityListBySellerToQuality } from '@apps/apis'
import { ODR_TWO, ORDERRESOURCE, TYPE } from '../../add'
import styles from './index.less'
import { getIntl } from '@linkseeks/i18n'
import { PATTERN_MAPS } from '@/constants/regExp'

interface QualityMaterialLayoutProps {}

const QualityMaterialLayout: React.FC<QualityMaterialLayoutProps> = () => {
  const intl = getIntl()
  const { form, dataSource, PATH, onFieldsChange } = useContext(AddedContext)
  const [current, setCurrent] = useState<number>(1)
  const [_dataSource, setDataSource] = useState<any[]>([])
  const [visible, setVisible] = useState<boolean>(false)
  const [detectionVisible, setDetectionVisible] = useState<boolean>(false)
  const [detection, setDetection] = useState<DetectionType>()

  const handleOnShowSizeChange = (_current) => {
    setCurrent(_current)
  }

  // 当前表格数据的下标
  const _index = (index: number) => {
    return Number((current - 1) * 10 + index)
  }

  const _setFieldsValue = (data) => {
    form.setFieldsValue({
      qualityOrderProductVOS: data,
    })
  }

  /** 删除一条表单数据 */
  const handleDelete = (index: number, remove) => {
    const params = [..._dataSource]
    params.splice(index, 1)
    remove(index)
    setDataSource(params)
  }

  /**检验记录弹窗 */
  const handleInspectionRecord = (record, index) => {
    console.log(record, 'record')
    const { vendorMemberName, vendorMemberId, vendorRoleId, qualityNo } = form.getFieldsValue([
      'vendorMemberName',
      'vendorMemberId',
      'vendorRoleId',
      'qualityNo',
    ])
    const params: DetectionType = {
      receiveCount: record?.receiveCount, // 测试数据
      index: _index(index),
      qualityNo: qualityNo,
      vendorMemberName,
      vendorMemberId,
      vendorRoleId,
      submissionCount: record?.submissionCount,
      samplesCount: record?.samplesCount,
      concessionToReceiveCount: record?.concessionToReceiveCount,
      batchJudgmentType: record?.batchJudgmentType,
      acceptanceCount: record?.acceptanceCount,
      rejectCount: record?.rejectCount,
      categoryId: record?.categoryId,
      inspectionType: record?.inspectionType,
      qualityOrderProductBadRecordVOS:
        record?.qualityOrderProductBadRecordVOS || record?.qualityOrderProductBadRecordDetailVOS,
      qualityOrderProductTestRecordVOS:
        record?.qualityOrderProductTestRecordVOS || record?.qualityOrderProductTestRecordDetailVOS,
    }
    setDetection(params)
    setDetectionVisible(true)
  }

  const toggle = (flag: boolean) => {
    setVisible(flag)
  }

  const handleSelect = () => {
    const { vendorMemberId, vendorRoleId } = form.getFieldsValue(['vendorMemberId', 'vendorRoleId'])
    if (!vendorMemberId && !vendorRoleId) {
      message.warning(
        intl.formatMessage({
          id: 'quality.qingxuanzegongyinghuiyuan',
          defaultMessage: '请选择供应会员',
        }),
      )
      return
    }
    toggle(true)
  }

  const formatdata = (_item) => {
    return {
      inspectionType: _item?.inspectionType,
      submissionCount: _item?.submissionCount,
      samplesCount: _item?.samplesCount,
      concessionToReceiveCount: _item?.concessionToReceiveCount,
      batchJudgmentType: _item?.batchJudgmentType,
      acceptanceCount: _item?.acceptanceCount,
      rejectCount: _item?.rejectCount,
      qualityOrderProductBadRecordVOS: _item?.qualityOrderProductBadRecordVOS,
      qualityOrderProductTestRecordVOS: _item?.qualityOrderProductTestRecordVOS,
    }
  }

  const fetchData = useCallback(
    (params: any) => {
      return new Promise((resolve) => {
        const { vendorMemberId, vendorRoleId } = form.getFieldsValue(['vendorMemberId', 'vendorRoleId'])
        getProductCommodityCommonGetCommodityListBySellerToQuality(
          { ...params, memberId: vendorMemberId, memberRoleId: vendorRoleId },
          { ctlType: 'none' },
        )
          .then((res) => {
            if (res.code !== 1000) {
              return
            }
            const { data } = res
            const _data = {
              totalCount: data?.totalCount,
              data: data.data.map((_item) => {
                return {
                  orderProductId: _item?.commodityId,
                  skuId: _item?.id,
                  productName: _item?.name,
                  type: _item?.type,
                  categoryId: _item?.customerCategoryId,
                  category: _item?.customerCategoryName,
                  brand: _item?.brandName,
                  unit: _item?.unitName,
                  ...formatdata(_item),
                }
              }),
            }
            resolve(_data)
          })
          .catch((error) => {
            console.warn(error)
          })
      })
    },
    [_dataSource],
  )

  const handleSubmit = (_selectRow: number[] | string[], selectedRows: Record<string, any>[]) => {
    const nextList = selectedRows.map((_item) => {
      return {
        orderProductId: _item?.orderProductId,
        skuId: _item?.skuId,
        productName: _item?.productName,
        type: _item?.type,
        categoryId: _item?.categoryId,
        category: _item?.category,
        brand: _item?.brand,
        unit: _item?.unit,
        ...formatdata(_item),
      }
    })
    setDataSource([...nextList])
    _setFieldsValue(nextList)
    toggle(false)
  }

  const useStateEffects = ($, actions) => {
    useAsyncInitSelect(['brandId'], async () => {
      const res = await getProductSelectGetSelectBrand()
      if (res.code === 1000) {
        const { data } = res
        return {
          brandId: data?.map((item) => ({ label: item.name, value: item.id })),
        }
      }
      return {}
    })
    // 初始化品类数据
    useCustomerCategoriesBusinessEffects($, actions, {
      fieldName: 'customerCategoryId',
    })
    // 初始化物料组数据
    useAsyncCascader('materialGroupId', fetchTreeData)
  }

  const handleOnClose = () => {
    setDetectionVisible(false)
  }

  /** 质检物料表头 */
  const columns = (remove) => {
    return [
      {
        title: intl.formatMessage({ id: 'quality.shangpinID', defaultMessage: '商品ID' }),
        key: 'skuId',
        dataIndex: 'skuId',
        width: 96,
        ellipsis: true,
        render: (_text, _record) => (
          <Form.Item name={[_record?.name, 'skuId']} style={{ marginBottom: '0px' }}>
            <Input readOnly bordered={false} />
          </Form.Item>
        ),
      },
      {
        title: intl.formatMessage({ id: 'quality.shangpinmingcheng', defaultMessage: '商品名称' }),
        key: 'productName',
        dataIndex: 'productName',
        width: 256,
        ellipsis: true,
        render: (_text, _record) => (
          <Form.Item name={[_record?.name, 'productName']} style={{ marginBottom: '0px' }}>
            <Input readOnly bordered={false} />
          </Form.Item>
        ),
      },
      {
        title: intl.formatMessage({ id: 'quality.guigexinghao', defaultMessage: '规格型号' }),
        key: 'type',
        dataIndex: 'type',
        width: 128,
        ellipsis: true,
        render: (_text, _record) => (
          <Form.Item name={[_record?.name, 'type']} style={{ marginBottom: '0px' }}>
            <Input readOnly bordered={false} />
          </Form.Item>
        ),
      },
      {
        title: intl.formatMessage({ id: 'quality.pinlei', defaultMessage: '品类' }),
        key: 'category',
        dataIndex: 'category',
        width: 96,
        ellipsis: true,
        render: (_text, _record) => (
          <Form.Item name={[_record?.name, 'category']} style={{ marginBottom: '0px' }}>
            <Input readOnly bordered={false} />
          </Form.Item>
        ),
      },
      {
        title: intl.formatMessage({ id: 'quality.pinpai', defaultMessage: '品牌' }),
        key: 'brand',
        dataIndex: 'brand',
        width: 88,
        ellipsis: true,
        render: (_text, _record) => (
          <Form.Item name={[_record?.name, 'brand']} style={{ marginBottom: '0px' }}>
            <Input readOnly bordered={false} />
          </Form.Item>
        ),
      },
      {
        title: intl.formatMessage({ id: 'quality.danwei', defaultMessage: '单位' }),
        key: 'unit',
        dataIndex: 'unit',
        width: 64,
        ellipsis: true,
        render: (_text, _record) => (
          <Form.Item name={[_record?.name, 'unit']} style={{ marginBottom: '0px' }}>
            <Input readOnly bordered={false} />
          </Form.Item>
        ),
      },
      ...(dataSource?.orderResource !== ORDERRESOURCE.SEND
        ? [
            {
              title: intl.formatMessage({ id: 'quality.dingdanhao', defaultMessage: '订单号' }),
              key: 'orderNo',
              dataIndex: 'orderNo',
              width: 120,
              ellipsis: true,
              render: (_text, _record) => (
                <Form.Item name={[_record?.name, 'orderNo']} style={{ marginBottom: '0px' }}>
                  <Input readOnly bordered={false} />
                </Form.Item>
              ),
            },
          ]
        : []),
      {
        title:
          dataSource?.orderResource !== ORDERRESOURCE.SEND
            ? intl.formatMessage({ id: 'quality.shouhuoshuliang', defaultMessage: '收货数量' })
            : '送样数量',
        key: 'receiveCount',
        dataIndex: 'receiveCount',
        width: 96,
        ellipsis: true,
        render: (_text, _record) => (
          <Form.Item name={[_record?.name, 'receiveCount']} style={{ marginBottom: '0px' }}>
            <Input readOnly bordered={false} />
          </Form.Item>
        ),
      },
      {
        title: intl.formatMessage({ id: 'quality.jianyanfangshi', defaultMessage: '检验方式' }),
        key: 'inspectionType',
        dataIndex: 'inspectionType',
        width: 128,
        ellipsis: true,
        render: (_text, _record) => (
          <Form.Item
            name={[_record?.name, 'inspectionType']}
            style={{ marginBottom: '0px' }}
            rules={[
              {
                required:
                  _dataSource[_record?.name]?.inspectionType !== 1 || !_dataSource[_record?.name]?.inspectionType,
                message: '请先选择检验方式',
              },
            ]}
          >
            <Select disabled bordered={false} placeholder="--" showArrow={false}>
              <Select.Option value={1}>
                {intl.formatMessage({ id: 'quality.mianjian', defaultMessage: '免检' })}
              </Select.Option>
              <Select.Option value={2}>
                {intl.formatMessage({ id: 'quality.quanjian', defaultMessage: '全检' })}
              </Select.Option>
              <Select.Option value={3}>
                {intl.formatMessage({ id: 'quality.choujian', defaultMessage: '抽检' })}
              </Select.Option>
            </Select>
          </Form.Item>
        ),
      },
      {
        title: intl.formatMessage({ id: 'quality.songjianshuliang', defaultMessage: '送检数量' }),
        key: 'submissionCount',
        dataIndex: 'submissionCount',
        width: 88,
        ellipsis: true,
        render: (_text, _record) => (
          <Form.Item name={[_record?.name, 'submissionCount']} style={{ marginBottom: '0px' }}>
            <Input readOnly bordered={false} placeholder="--" />
          </Form.Item>
        ),
      },
      {
        title: intl.formatMessage({ id: 'quality.chouyangshuliang', defaultMessage: '抽样数量' }),
        key: 'samplesCount',
        dataIndex: 'samplesCount',
        width: 88,
        ellipsis: true,
        render: (_text, _record) => (
          <Form.Item name={[_record?.name, 'samplesCount']} style={{ marginBottom: '0px' }}>
            <Input readOnly bordered={false} placeholder="--" />
          </Form.Item>
        ),
      },
      {
        title: intl.formatMessage({ id: 'quality.picipanding', defaultMessage: '批次判定' }),
        key: 'batchJudgmentType',
        dataIndex: 'batchJudgmentType',
        width: 104,
        ellipsis: true,
        render: (_text, _record) => (
          <Form.Item name={[_record?.name, 'batchJudgmentType']} style={{ marginBottom: '0px' }}>
            <Select disabled bordered={false} placeholder="--" showArrow={false}>
              <Select.Option value={1}>
                {intl.formatMessage({ id: 'quality.hege', defaultMessage: '合格' })}
              </Select.Option>
              <Select.Option value={2}>
                {intl.formatMessage({ id: 'quality.bufenhege', defaultMessage: '部分合格' })}
              </Select.Option>
              <Select.Option value={3}>
                {intl.formatMessage({ id: 'quality.rangbujieshou', defaultMessage: '让步接收' })}
              </Select.Option>
              <Select.Option value={4}>
                {intl.formatMessage({ id: 'quality.jushou', defaultMessage: '拒收' })}
              </Select.Option>
            </Select>
          </Form.Item>
        ),
      },
      {
        title: intl.formatMessage({ id: 'quality.yunshoushuliang', defaultMessage: '允收数量' }),
        key: 'acceptanceCount',
        dataIndex: 'acceptanceCount',
        width: 96,
        ellipsis: true,
        render: (_text, _record) => (
          <Form.Item name={[_record?.name, 'acceptanceCount']} style={{ marginBottom: '0px' }}>
            <Input readOnly bordered={false} placeholder="--" />
          </Form.Item>
        ),
      },
      {
        title: intl.formatMessage({
          id: 'quality.rangbujieshoushuliang',
          defaultMessage: '让步接收数量',
        }),
        key: 'concessionToReceiveCount',
        dataIndex: 'concessionToReceiveCount',
        width: 140,
        ellipsis: true,
        render: (_text, _record) => (
          <Form.Item name={[_record?.name, 'concessionToReceiveCount']} style={{ marginBottom: '0px' }}>
            <Input readOnly bordered={false} placeholder="--" />
          </Form.Item>
        ),
      },
      {
        title: intl.formatMessage({ id: 'quality.jushoushuliang', defaultMessage: '拒收数量' }),
        key: 'rejectCount',
        dataIndex: 'rejectCount',
        width: 96,
        ellipsis: true,
        render: (_text, _record) => (
          <Form.Item name={[_record?.name, 'rejectCount']} style={{ marginBottom: '0px' }}>
            <Input readOnly bordered={false} placeholder="--" />
          </Form.Item>
        ),
      },
      {
        title: intl.formatMessage({ id: 'quality.caozuo', defaultMessage: '操作' }),
        key: 'operation',
        dataIndex: 'operation',
        fixed: 'right',
        width: 160,
        render: (_text, _record, index) => (
          <Space>
            {_dataSource[_record?.name]?.inspectionType !== 1 && (
              <Button type="link" onClick={() => handleInspectionRecord(_dataSource[_record?.name], index)}>
                {intl.formatMessage({ id: 'quality.jianyan', defaultMessage: '检验' })}
              </Button>
            )}
            {PATH !== 'formed' &&
              dataSource?.orderResource !== ORDERRESOURCE.SEND &&
              dataSource?.orderResource !== ODR_TWO && (
                <Button type="link" onClick={() => handleDelete(index, remove)}>
                  {intl.formatMessage({ id: 'quality.shanchu', defaultMessage: '删除' })}
                </Button>
              )}
          </Space>
        ),
      },
    ]
  }

  const handleDetection = (value) => {
    const {
      index,
      inspectionType,
      submissionCount,
      samplesCount,
      concessionToReceiveCount,
      batchJudgmentType,
      acceptanceCount,
      rejectCount,
      qualityOrderProductBadRecordVOS,
      qualityOrderProductTestRecordVOS,
    } = value
    const nextList = form.getFieldValue('qualityOrderProductVOS') || []
    nextList[index] = {
      ...nextList[index],
      inspectionType,
      submissionCount,
      samplesCount,
      concessionToReceiveCount,
      batchJudgmentType,
      acceptanceCount,
      rejectCount,
      qualityOrderProductBadRecordVOS: [...qualityOrderProductBadRecordVOS],
      qualityOrderProductTestRecordVOS: [...qualityOrderProductTestRecordVOS],
    }
    setDataSource([...nextList])
    _setFieldsValue(nextList)
  }

  useEffect(() => {
    if (dataSource) {
      setDataSource(
        (dataSource?.qualityOrderProductVOS || []).map((_item) => {
          return {
            ..._item,
            skuId: Number(_item?.skuId),
            qualityOrderProductBadRecordVOS: _item?.qualityOrderProductBadRecordDetailVOS,
            qualityOrderProductTestRecordVOS: _item?.qualityOrderProductTestRecordDetailVOS,
          }
        }),
      )
    }
  }, [dataSource])

  useEffect(() => {
    onFieldsChange()
  }, [_dataSource])

  return (
    <CardLayout
      id="qualityMaterial"
      title={intl.formatMessage({ id: 'quality.zhijianshangpin', defaultMessage: '质检商品' })}
      className={styles.qualityCard}
    >
      <Form.List
        name="qualityOrderProductVOS"
        rules={[
          {
            validator: async (_, qualityOrderProductVOS) => {
              console.log(qualityOrderProductVOS, 'qualityOrderProductVOS')
              if (!qualityOrderProductVOS || isEmpty(qualityOrderProductVOS)) {
                return Promise.reject(
                  new Error(
                    intl.formatMessage({
                      id: 'quality.qingtianjiazhijianshangpin',
                      defaultMessage: '请添加质检商品',
                    }),
                  ),
                )
              }
            },
          },
        ]}
      >
        {(fields, { remove }, { errors }) => (
          <Space direction="vertical" style={{ width: '100%' }} size={16}>
            {PATH !== 'formed' &&
              dataSource?.orderResource !== ORDERRESOURCE.SEND &&
              dataSource?.orderResource !== ODR_TWO && (
                <Button block type="dashed" icon={<PlusOutlined />} onClick={handleSelect}>
                  {intl.formatMessage({
                    id: 'quality.xuanzezhijianshangpin',
                    defaultMessage: '选择质检商品',
                  })}
                </Button>
              )}
            <Table
              columns={columns(remove) as ColumnType<any>[]}
              dataSource={fields}
              scroll={{ x: '100vw' }}
              rowKey={(_record, index) => index}
              pagination={{
                size: 'small',
                onChange: handleOnShowSizeChange,
              }}
            />
            <Form.ErrorList errors={errors} />
          </Space>
        )}
      </Form.List>
      {/* 选择商品 */}
      <TableModal
        modalType="Drawer"
        visible={visible}
        tableProps={{
          rowKey: 'skuId',
        }}
        mode="checkbox"
        customKey="skuId"
        title={intl.formatMessage({ id: 'quality.xuanzeshangpin', defaultMessage: '选择商品' })}
        schema={{
          type: 'object',
          properties: {
            megalayout: {
              type: 'object',
              'x-component': 'mega-layout',
              properties: {
                productId: {
                  type: 'number',
                  'x-component': 'Search',
                  'x-mega-props': {},
                  'x-rules': [
                    {
                      pattern: PATTERN_MAPS.quantity,
                      message: `${intl.formatMessage({
                        id: 'purchaseOrder.qingshurushangpinid',
                        defaultMessage: '请输入商品id',
                      })}`,
                    },
                  ],
                  'x-component-props': {
                    placeholder: intl.formatMessage({
                      id: 'quality.shangpinID',
                      defaultMessage: '商品ID',
                    }),
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
              properties: {
                PRO_LAYOUT: {
                  type: 'object',
                  'x-component': 'mega-layout',
                  'x-mega-props': {
                    span: 5,
                  },
                  'x-component-props': {
                    inline: true,
                  },
                  properties: {
                    name: {
                      type: 'string',
                      'x-component-props': {
                        placeholder: intl.formatMessage({
                          id: 'quality.shangpinmingcheng',
                          defaultMessage: '商品名称',
                        }),
                      },
                    },
                    customerCategoryId: {
                      type: 'string',
                      'x-component': 'Cascader',
                      'x-component-props': {
                        placeholder: intl.formatMessage({
                          id: 'quality.pinlei',
                          defaultMessage: '品类',
                        }),
                        allowClear: true,
                        fieldNames: { label: 'name', value: 'id', children: 'children' },
                        style: { width: '150px' },
                        showSearch: true,
                      },
                    },
                    brandId: {
                      type: 'string',
                      'x-component-props': {
                        placeholder: intl.formatMessage({
                          id: 'quality.pinpai',
                          defaultMessage: '品牌',
                        }),
                        style: {
                          width: 160,
                        },
                      },
                      enum: [],
                    },
                  },
                },
                sumbit: {
                  'x-component': 'Submit',
                  'x-mega-props': {
                    span: 1,
                  },
                  'x-component-props': {
                    children: intl.formatMessage({ id: 'quality.chaxun', defaultMessage: '查询' }),
                  },
                },
              },
            },
          },
        }}
        effects={($, actions) => {
          useStateEffects($, actions)
          useStateFilterSearchLinkageEffect($, actions, 'productId', FORM_FILTER_PATH)
        }}
        columns={[
          {
            title: intl.formatMessage({ id: 'quality.shangpinID', defaultMessage: '商品ID' }),
            key: 'orderProductId',
            dataIndex: 'orderProductId',
          },
          {
            title: intl.formatMessage({
              id: 'quality.shangpinmingcheng',
              defaultMessage: '商品名称',
            }),
            key: 'productName',
            dataIndex: 'productName',
          },
          {
            title: intl.formatMessage({ id: 'quality.pinlei', defaultMessage: '品类' }),
            key: 'category',
            dataIndex: 'category',
          },
          {
            title: intl.formatMessage({ id: 'quality.pinpai', defaultMessage: '品牌' }),
            key: 'brand',
            dataIndex: 'brand',
          },
          {
            title: intl.formatMessage({ id: 'quality.danwei', defaultMessage: '单位' }),
            key: 'unitName',
            dataIndex: 'unitName',
          },
        ]}
        fetchData={fetchData}
        onClose={() => toggle(false)}
        onOk={handleSubmit}
        value={_dataSource}
      />
      {/* 检验记录弹窗 */}
      <DetectionDrawer
        type={TYPE.B2B}
        detection={detection}
        visible={detectionVisible}
        onClose={handleOnClose}
        onSubmit={handleDetection}
      />
    </CardLayout>
  )
}
export default QualityMaterialLayout
