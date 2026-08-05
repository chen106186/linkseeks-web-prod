import React, { useContext, useEffect, useState } from 'react'
import {
  Button,
  Col,
  Divider,
  Drawer,
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Radio,
  Row,
  Select,
  Space,
  Table as Badrecord,
  Table as Inspectionrecord,
  Typography,
} from 'antd'
import type { ColumnType } from 'antd/lib/table'
import styles from './index.less'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { validatorByte } from '@/utils/regExp'
import { getProductCustomerGetCategoryInspectionList } from '@apps/apis'
import { isEmpty } from 'lodash'
import { AddedContext } from '@/components/DetailLayout/components/context'
import { getIntl } from '@linkseeks/i18n'
import {
  badCount,
  badDescription,
  badReasons,
  handleType,
  measurements,
  operation,
  receiptJudgmentType,
  remark,
  returnType,
  grouping as _grouping_,
  testItems,
  qualifiedRange,
  inspectionInstructions,
  inspectionValue,
  inspectionJudgmentType,
} from '@/pages/qualityAbility/columns'
import { ORDERRESOURCE } from '../../b2b/add'

export type DetectionType = {
  index: number
  /** 收货数量 */
  receiveCount?: number
  /** 质检单编号 */
  qualityNo?: string
  /** 供应商 */
  vendorMemberName?: string
  /** 供应商会员id */
  vendorMemberId: number
  /** 供应商角色id */
  vendorRoleId: number
  /** 送检数量 */
  submissionCount: number
  /** 抽样数量 */
  samplesCount: number
  /** 让步接收数量 */
  concessionToReceiveCount: number
  /** 批次判定 */
  batchJudgmentType: string
  /** 允收数量 */
  acceptanceCount: number
  /** 拒收数量 */
  rejectCount: number
  /** 品类id */
  categoryId: number
  /** 检验方式 */
  inspectionType?: number
  /** 质检单物料信息不良记录 */
  qualityOrderProductBadRecordVOS?: any[]
  /** 质检单物料信息检验记录 */
  qualityOrderProductTestRecordVOS?: any[]
}

export const layout: any = {
  colon: false,
  labelCol: { style: { width: '144px' } },
  labelAlign: 'left',
}

// 检验方式 InspectionTypeEnum定义 1-免检、2-抽检、3-全检
export enum inspectionType {
  /** 免检 */
  ONE = 1,
  /** 抽检 */
  TWO,
  /** 全检 */
  THREE,
}

const inspectionTypes = {
  1: getIntl().formatMessage({ id: 'quality.mianjian', defaultMessage: '免检' }),
  2: getIntl().formatMessage({ id: 'quality.choujian', defaultMessage: '抽检' }),
  3: getIntl().formatMessage({ id: 'quality.quanjian', defaultMessage: '全检' }),
}

enum JUDGMENTTYPE {
  /** 让步接收 */
  NOUN = 2,
  /** 拒收 */
  REFUSE,
}

enum RETURNTYPE {
  /** 退扣 */
  TUIKOU = 1,
  /** 退补 */
  TUIBU,
}

enum HANDLETYPE {
  /** 维修 */
  WEIXIU = 1,
  /** 就地维修 */
  JDWEIXIU,
  /** 返工 */
  FANGONG,
  /** 报废 */
  BAOFEI,
}

enum TYPE {
  /** 生成B2B质检单 */
  B2B = 1,
  /** 生成SRM质检单 */
  SRM,
}
export interface DetectionDrawerProps {
  /** 订单类型 */
  type?: number
  /** 质检记录信息 */
  detection: DetectionType
  /** 打开关闭 */
  visible: boolean
  /** 关闭 */
  onClose: () => any
  /** 确定 */
  onSubmit: (value) => any
}

const { Option } = Select

const DetectionDrawer: React.FC<DetectionDrawerProps> = (props: any) => {
  const intl = getIntl()
  const { type, detection, visible, onClose, onSubmit } = props
  const { dataSource } = useContext(AddedContext)
  const [form] = Form.useForm()
  const [_dataSource, setDataSource] = useState<DetectionType>()
  const [grouping, setGrouping] = useState<string>('')
  const [groupingList, setGroupingList] = useState<any[]>([])
  const [inspectionTypeList, setInspectionTypeList] = useState<any[]>([])
  const [categoryInspectionsList, setCategoryInspectionsList] = useState<any[]>([])
  /** 分组操作 */
  const handleOnChangeGrouping = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGrouping(event.target.value)
  }
  /** 获取分组 */
  const arrGrouping = () => {
    const qualityOrderProductTestRecordVOS = form.getFieldValue('qualityOrderProductTestRecordVOS')
    const _arrGrouping = (qualityOrderProductTestRecordVOS || categoryInspectionsList)
      .filter((_item) => _item?.grouping)
      .map((_item) => _item.grouping)
    setGroupingList([...new Set([..._arrGrouping])])
  }

  /** 新增分组 */
  const handleAddedGrouping = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    let str = grouping
    const maxByte = 12
    str = str.replace(/[\u4e00-\u9fa5]/g, 'OO')
    if (str.length > maxByte) {
      message.warning(`最多输入${maxByte}个字符，${Math.floor(maxByte / 2)}个汉字`)
      return
    }
    if (!grouping) {
      return
    }

    setGroupingList([...groupingList, grouping])
    setGrouping('')
  }

  /** 删除一个分组 */
  const handleDeleteGrouping = (event, value: string) => {
    event.stopPropagation()
    const qualityOrderProductTestRecordVOS = form.getFieldValue('qualityOrderProductTestRecordVOS')
    if (qualityOrderProductTestRecordVOS.some((_item) => value === _item.grouping)) {
      message.warning(
        intl.formatMessage({
          id: 'quality.bukeshanchujianyanxiang',
          defaultMessage: '不可删除,检验项目正在使用分组！',
        }),
      )
      return
    }
    const pramas = groupingList.filter((_item) => _item !== value)
    setGroupingList([...pramas])
  }

  /** 不良记录表头 */
  const badrecordColumns = (remove) => {
    return [
      {
        ...badReasons,
        width: 114,
        render: (_text, _record) => (
          <Form.Item
            name={[_record?.name, 'badReasons']}
            rules={[
              {
                required: true,
                message: intl.formatMessage({
                  id: 'quality.qingshurubuliangyuanyin',
                  defaultMessage: '请输入不良原因',
                }),
              },
              { validator: (rule, value, callback) => validatorByte(rule, value, callback, 30) },
            ]}
          >
            <Input.TextArea rows={1} />
          </Form.Item>
        ),
      },
      {
        ...badDescription,
        width: 114,
        render: (_text, _record) => (
          <Form.Item
            name={[_record?.name, 'badDescription']}
            rules={[
              {
                required: true,
                message: intl.formatMessage({
                  id: 'quality.qingshurubuliangshuoming',
                  defaultMessage: '请输入不良说明',
                }),
              },
              { validator: (rule, value, callback) => validatorByte(rule, value, callback, 40) },
            ]}
          >
            <Input.TextArea rows={1} />
          </Form.Item>
        ),
      },
      {
        ...measurements,
        width: 112,
        render: (_text, _record) => (
          <Form.Item
            name={[_record?.name, 'measurements']}
            rules={[
              {
                pattern: /^([0]|([1-9][0-9]*)|(([0]\.\d{1,3}|[1-9][0-9]*\.\d{1,3})))$/,
                message: intl.formatMessage({
                  id: 'quality.shuzixingzuichangbaoliu',
                  defaultMessage: '数字型，最长保留3位小数',
                }),
              },
            ]}
          >
            <InputNumber />
          </Form.Item>
        ),
      },
      {
        ...badCount,
        width: 112,
        render: (_text, _record) => (
          <Form.Item
            name={[_record?.name, 'badCount']}
            dependencies={['submissionCount']}
            rules={[
              {
                validator: (_, value) => {
                  const _pattern = /^(([1-9][0-9]*)|(([0]\.\d{1,3}|[1-9][0-9]*\.\d{1,3})))$/
                  if (!value) {
                    return Promise.reject(
                      new Error(
                        intl.formatMessage({
                          id: 'quality.qingshurubuliangshuliang',
                          defaultMessage: '请输入不良数量',
                        }),
                      ),
                    )
                  }
                  if (value > (form.getFieldValue('submissionCount') || 0) || !_pattern.test(value)) {
                    return Promise.reject(
                      new Error(
                        intl.formatMessage({
                          id: 'quality.yaoqiudayu0qiexiaoyu',
                          defaultMessage: '要求大于0且小于或等于送检数量,最多保留3位小数',
                        }),
                      ),
                    )
                  }
                  return Promise.resolve()
                },
              },
            ]}
          >
            <InputNumber />
          </Form.Item>
        ),
      },
      {
        ...receiptJudgmentType,
        width: 112,
        render: (_text, _record) => (
          <Form.Item
            name={[_record?.name, 'receiptJudgmentType']}
            rules={[
              {
                required: true,
                message: intl.formatMessage({
                  id: 'quality.qingxuanzeshouhuopanding',
                  defaultMessage: '请选择收货判定',
                }),
              },
            ]}
          >
            <Select>
              <Option value={JUDGMENTTYPE.NOUN}>
                {intl.formatMessage({ id: 'quality.rangbujieshou', defaultMessage: '让步接收' })}
              </Option>
              <Option value={JUDGMENTTYPE.REFUSE}>
                {intl.formatMessage({ id: 'quality.jushou', defaultMessage: '拒收' })}
              </Option>
            </Select>
          </Form.Item>
        ),
      },
      {
        ...returnType,
        width: 112,
        render: (_text, _record) => (
          <Form.Item
            name={[_record?.name, 'returnType']}
            rules={[
              {
                validator: (_, value) => {
                  const _receiptJudgmentType = form.getFieldValue([
                    'qualityOrderProductBadRecordVOS',
                    _record?.name,
                    'receiptJudgmentType',
                  ])
                  if (_receiptJudgmentType === JUDGMENTTYPE.REFUSE && !value) {
                    return Promise.reject(
                      new Error(
                        intl.formatMessage({
                          id: 'quality.qingxuanzetuihuoleixing',
                          defaultMessage: '请选择退货类型',
                        }),
                      ),
                    )
                  }
                  return Promise.resolve()
                },
              },
            ]}
          >
            <Select>
              <Option value={RETURNTYPE.TUIKOU}>
                {intl.formatMessage({ id: 'quality.tuikou', defaultMessage: '退扣' })}
              </Option>
              <Option value={RETURNTYPE.TUIBU}>
                {intl.formatMessage({ id: 'quality.tuibu', defaultMessage: '退补' })}
              </Option>
            </Select>
          </Form.Item>
        ),
      },
      {
        ...handleType,
        width: 112,
        render: (_text, _record) => (
          <Form.Item name={[_record?.name, 'handleType']}>
            <Select>
              <Option value={HANDLETYPE.WEIXIU}>
                {intl.formatMessage({ id: 'quality.weixiu', defaultMessage: '维修' })}
              </Option>
              <Option value={HANDLETYPE.JDWEIXIU}>
                {intl.formatMessage({ id: 'quality.jiudiweixiu', defaultMessage: '就地维修' })}
              </Option>
              <Option value={HANDLETYPE.FANGONG}>
                {intl.formatMessage({ id: 'quality.fangong', defaultMessage: '返工' })}
              </Option>
              <Option value={HANDLETYPE.BAOFEI}>
                {intl.formatMessage({ id: 'quality.baofei', defaultMessage: '报废' })}
              </Option>
            </Select>
          </Form.Item>
        ),
      },
      {
        ...remark,
        width: 328,
        render: (_text, _record) => (
          <Form.Item
            name={[_record?.name, 'remark']}
            rules={[{ validator: (rule, value, callback) => validatorByte(rule, value, callback, 60) }]}
          >
            <Input.TextArea rows={1} />
          </Form.Item>
        ),
      },
      {
        ...operation,
        width: 80,
        fixed: 'right',
        render: (_text, _record) => (
          <Popconfirm
            title={intl.formatMessage({
              id: 'quality.shifoushanchu',
              defaultMessage: '是否删除！',
            })}
            okText={intl.formatMessage({ id: 'quality.shi', defaultMessage: '是' })}
            cancelText={intl.formatMessage({ id: 'quality.fou', defaultMessage: '否' })}
            onConfirm={() => remove(_record?.name)}
          >
            <Button type="link">{intl.formatMessage({ id: 'quality.shanchu', defaultMessage: '删除' })}</Button>
          </Popconfirm>
        ),
      },
    ]
  }

  /**
   * @param index
   * @returns false: 可编辑, true: 不可编辑
   */
  const inspectionrecordDisabled = (index: number) => {
    const qualityOrderProductTestRecordVOS = form.getFieldValue('qualityOrderProductTestRecordVOS')
    return !qualityOrderProductTestRecordVOS[index]?.edit
  }

  /** 检验记录表头 */
  const inspectionrecordColumns = (remove) => {
    return [
      {
        ..._grouping_,
        width: 212,
        render: (_text, _record) => (
          <Form.Item
            name={[_record?.name, 'grouping']}
            rules={[
              {
                required: true,
                message: intl.formatMessage({
                  id: 'quality.qingxuanzefenzu',
                  defaultMessage: '请选择分组',
                }),
              },
            ]}
          >
            <Select
              disabled={inspectionrecordDisabled(_record?.name)}
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <Divider style={{ margin: '8px 0' }} />
                  <Space align="center" style={{ padding: '0 8px 4px' }}>
                    <Input
                      placeholder={intl.formatMessage({
                        id: 'quality.shuruxinxuanxiang',
                        defaultMessage: '输入新选项',
                      })}
                      value={grouping}
                      onChange={handleOnChangeGrouping}
                    />
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={handleAddedGrouping}
                      style={{ padding: '0px 4px' }}
                    >
                      {intl.formatMessage({ id: 'quality.xinzeng', defaultMessage: '新增' })}
                    </Button>
                  </Space>
                </>
              )}
              optionLabelProp="value"
            >
              {groupingList.map((_item, index) => (
                <Option key={index} value={_item}>
                  <Row>
                    <Col span={22}>{_item}</Col>
                    <Col span={2} onClick={(e) => handleDeleteGrouping(e, _item)}>
                      <DeleteOutlined />
                    </Col>
                  </Row>
                </Option>
              ))}
            </Select>
          </Form.Item>
        ),
      },
      {
        ...testItems,
        width: 176,
        render: (_text, _record) => (
          <Form.Item
            name={[_record?.name, 'testItems']}
            rules={[
              {
                required: true,
                message: intl.formatMessage({
                  id: 'quality.qingshurujianyanxiangmu',
                  defaultMessage: '请输入检验项目',
                }),
              },
              { validator: (rule, value, callback) => validatorByte(rule, value, callback, 30) },
            ]}
          >
            <Input disabled={inspectionrecordDisabled(_record?.name)} />
          </Form.Item>
        ),
      },
      {
        ...qualifiedRange,
        width: 190,
        render: (_text, _record) => (
          <Input.Group compact>
            <Form.Item
              style={{ textAlign: 'center', width: 64, borderRadius: 0 }}
              name={[_record?.name, 'startValue']}
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({
                    id: 'quality.qingshuru',
                    defaultMessage: '请输入',
                  }),
                },
                { validator: (rule, value, callback) => validatorByte(rule, value, callback, 20) },
              ]}
            >
              <Input
                disabled={inspectionrecordDisabled(_record?.name)}
                style={{ textAlign: 'center', width: 64, borderRight: 0, borderRadius: 0 }}
              />
            </Form.Item>
            <Input
              style={{
                width: 30,
                height: 32.84,
                backgroundColor: 'transparent',
                borderLeft: 0,
                borderRight: 0,
                pointerEvents: 'none',
              }}
              placeholder="~"
              disabled
            />
            <Form.Item
              style={{ textAlign: 'center', width: 64, borderRadius: 'revert' }}
              name={[_record?.name, 'endValue']}
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({
                    id: 'quality.qingshuru',
                    defaultMessage: '请输入',
                  }),
                },
                { validator: (rule, value, callback) => validatorByte(rule, value, callback, 20) },
              ]}
            >
              <Input
                disabled={inspectionrecordDisabled(_record?.name)}
                style={{
                  textAlign: 'center',
                  width: 64,
                  borderLeft: 0,
                  borderRadius: 0,
                }}
              />
            </Form.Item>
          </Input.Group>
        ),
      },
      {
        ...inspectionInstructions,
        width: 200,
        render: (_text, _record) => (
          <Form.Item
            name={[_record?.name, 'inspectionInstructions']}
            rules={[{ validator: (rule, value, callback) => validatorByte(rule, value, callback, 40) }]}
          >
            <Input.TextArea disabled={inspectionrecordDisabled(_record?.name)} rows={1} />
          </Form.Item>
        ),
      },
      {
        ...inspectionValue,
        width: 112,
        render: (_text, _record) => (
          <Form.Item
            name={[_record?.name, 'inspectionValue']}
            rules={[
              {
                required: true,
                message: intl.formatMessage({
                  id: 'quality.qingshurujiancezhi',
                  defaultMessage: '请输入检测值',
                }),
              },
              { validator: (rule, value, callback) => validatorByte(rule, value, callback, 20) },
            ]}
          >
            <Input />
          </Form.Item>
        ),
      },
      {
        ...remark,
        width: 272,
        render: (_text, _record) => (
          <Form.Item
            name={[_record?.name, 'remark']}
            rules={[{ validator: (rule, value, callback) => validatorByte(rule, value, callback, 60) }]}
          >
            <Input.TextArea rows={1} />
          </Form.Item>
        ),
      },
      {
        ...inspectionJudgmentType,
        width: 112,
        render: (_text, _record) => (
          <Form.Item
            name={[_record?.name, 'inspectionJudgmentType']}
            rules={[{ required: true, message: '请选择检验判断' }]}
          >
            <Select>
              <Option value={1}>{intl.formatMessage({ id: 'quality.hege', defaultMessage: '合格' })}</Option>
              <Option value={2}>{intl.formatMessage({ id: 'quality.buhege', defaultMessage: '不合格' })}</Option>
            </Select>
          </Form.Item>
        ),
      },
      {
        ...operation,
        width: 80,
        fixed: 'right',
        render: (_text, _record) => (
          <>
            <Form.Item hidden name={[_record?.name, 'edit']}>
              <Input />
            </Form.Item>
            <Popconfirm
              title={intl.formatMessage({
                id: 'quality.shifoushanchu',
                defaultMessage: '是否删除！',
              })}
              okText={intl.formatMessage({ id: 'quality.shi', defaultMessage: '是' })}
              cancelText={intl.formatMessage({ id: 'quality.fou', defaultMessage: '否' })}
              onConfirm={() => remove(_record?.name)}
            >
              <Button type="link">{intl.formatMessage({ id: 'quality.shanchu', defaultMessage: '删除' })}</Button>
            </Popconfirm>
          </>
        ),
      },
    ]
  }

  const handleClose = () => {
    form.resetFields([
      'inspectionType',
      'inspectionTypeName',
      'qualityOrderProductBadRecordVOS',
      'qualityOrderProductTestRecordVOS',
    ])
    onClose()
  }

  /** 提交表单 */
  const handleConfirm = () => {
    console.log(1111)
    form
      .validateFields()
      .then((res) => {
        const params = {
          index: _dataSource?.index,
          inspectionType: res?.inspectionType,
          submissionCount: res?.submissionCount,
          samplesCount: res.samplesCount,
          concessionToReceiveCount: res.concessionToReceiveCount,
          batchJudgmentType: res?.batchJudgmentType,
          acceptanceCount: res?.acceptanceCount,
          rejectCount: res?.rejectCount,
          qualityOrderProductBadRecordVOS: res?.qualityOrderProductBadRecordVOS || [],
          qualityOrderProductTestRecordVOS: res?.qualityOrderProductTestRecordVOS || [],
        }
        onSubmit(params)
        handleClose()
      })
      .catch((errorInfo) => {
        console.log(errorInfo)
      })
  }

  const handleInspectionType = (e) => {
    const { value } = e.target
    form.resetFields([
      'submissionCount',
      'samplesCount',
      'concessionToReceiveCount',
      'batchJudgmentType',
      'acceptanceCount',
      'rejectCount',
    ])
    if (value === inspectionType.ONE && _dataSource?.receiveCount) {
      form.setFieldsValue({ acceptanceCount: _dataSource?.receiveCount })
      return
    }
    if (value !== inspectionType.ONE) {
      const qualityOrderProductTestRecordVOS = form.getFieldValue('qualityOrderProductTestRecordVOS')
      arrGrouping()
      form.setFieldsValue({
        qualityOrderProductTestRecordVOS: qualityOrderProductTestRecordVOS || categoryInspectionsList,
      })
    }
    form.setFieldsValue({ acceptanceCount: undefined })
  }

  const renderFooter = () => {
    return (
      <div style={{ textAlign: 'right' }}>
        <Button style={{ marginRight: 8 }} onClick={() => handleClose()}>
          {intl.formatMessage({ id: 'quality.quxiao', defaultMessage: '取消' })}
        </Button>
        <Button type="primary" onClick={handleConfirm}>
          {intl.formatMessage({ id: 'quality.tijiao', defaultMessage: '提交' })}
        </Button>
      </div>
    )
  }

  const otherProps = { footer: renderFooter() }

  useEffect(() => {
    if (detection) {
      const _detection: DetectionType = { ...detection }
      if (detection?.categoryId && type !== TYPE.B2B) {
        getProductCustomerGetCategoryInspectionList({ categoryId: detection?.categoryId }).then((res) => {
          if (res.code !== 1000) {
            return
          }
          const { data } = res
          setCategoryInspectionsList(data?.categoryInspections || [])
          if (!isEmpty(data?.inspectionTypes)) {
            setInspectionTypeList(data?.inspectionTypes)
            return
          }
          setInspectionTypeList([1, 2, 3])
        })
      } else {
        setCategoryInspectionsList([])
        setInspectionTypeList([1, 2, 3])
      }
      form.setFieldsValue({
        ..._detection,
      })
      arrGrouping()
      setDataSource(_detection)
    }
  }, [detection])

  const handleSetValue = (value) => {
    const _inspectionType = form.getFieldValue('inspectionType')
    if (_inspectionType === inspectionType.TWO) {
      form.setFieldsValue({ samplesCount: value })
    }
  }

  return (
    <Drawer
      width={1100}
      title={intl.formatMessage({ id: 'quality.jianyanjilu', defaultMessage: '检验记录' })}
      closable
      visible={visible}
      onClose={handleClose}
      className={styles['detection-drawer']}
      {...otherProps}
    >
      <Form form={form} {...layout}>
        <Space direction="vertical" size={16} className={styles['table-form-item']}>
          <Form.Item
            label={intl.formatMessage({
              id: 'quality.zhijiandanbianhao',
              defaultMessage: '质检单编号',
            })}
          >
            <span>{_dataSource?.qualityNo}</span>
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({
              id: 'quality.gongyingshangmingcheng',
              defaultMessage: '供应商名称',
            })}
          >
            <span>{_dataSource?.vendorMemberName}</span>
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({ id: 'quality.jianyanfangshi', defaultMessage: '检验方式' })}
            name="inspectionType"
            rules={[
              {
                required: true,
                message: intl.formatMessage({
                  id: 'quality.qingxuanzejianyanfangshi',
                  defaultMessage: '请选择检验方式',
                }),
              },
            ]}
          >
            {JSON.stringify(inspectionTypeList) === '[]' ? (
              <Typography.Text type="secondary">
                -- {intl.formatMessage({ id: 'quality.zanwushuju', defaultMessage: '暂无数据' })} --
              </Typography.Text>
            ) : (
              <Radio.Group onChange={handleInspectionType}>
                {inspectionTypeList.map((_item) => (
                  <Radio key={_item} value={_item}>
                    {inspectionTypes[_item]}
                  </Radio>
                ))}
              </Radio.Group>
            )}
          </Form.Item>
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, curValues) => prevValues.inspectionType !== curValues.inspectionType}
          >
            {({ getFieldValue }) => {
              const disabled =
                getFieldValue('inspectionType') === inspectionType.ONE || getFieldValue('inspectionType') === undefined
              const pattern = /^([0]|([1-9][0-9]*)|(([0]\.\d{1,3}|[1-9][0-9]*\.\d{1,3})))$/
              return (
                <Space direction="vertical" size={16}>
                  <Row gutter={[16, 36]}>
                    <Col span={12}>
                      <Space direction="vertical" size={16}>
                        <Form.Item
                          label={intl.formatMessage({
                            id: 'quality.songjianshuliang',
                            defaultMessage: '送检数量',
                          })}
                          name="submissionCount"
                          required={getFieldValue('inspectionType') !== inspectionType.ONE}
                          rules={[
                            {
                              validator: async (_, value) => {
                                const _pattern = /^(([1-9][0-9]*)|(([0]\.\d{1,3}|[1-9][0-9]*\.\d{1,3})))$/
                                if (getFieldValue('inspectionType') !== inspectionType.ONE) {
                                  if (!value) {
                                    return Promise.reject(
                                      new Error(
                                        intl.formatMessage({
                                          id: 'quality.qingshurusongjianshuliang',
                                          defaultMessage: '请输入送检数量',
                                        }),
                                      ),
                                    )
                                  }
                                  if (!_pattern.test(value)) {
                                    return Promise.reject(
                                      new Error(
                                        intl.formatMessage({
                                          id: 'quality.shuzixingzuiduobaoliu',
                                          defaultMessage: '数字型,最多保留3位小数,大于0',
                                        }),
                                      ),
                                    )
                                  }
                                  if (_dataSource?.receiveCount && value > _dataSource?.receiveCount) {
                                    return Promise.reject(
                                      new Error(
                                        `送检数量≤${
                                          dataSource?.orderResource === ORDERRESOURCE.SEND ? '送样数量' : '收货数量'
                                        }`,
                                      ),
                                    )
                                  }
                                }
                                return Promise.resolve()
                              },
                            },
                          ]}
                        >
                          <InputNumber disabled={disabled} onChange={handleSetValue} />
                        </Form.Item>
                        <Form.Item
                          label={intl.formatMessage({
                            id: 'quality.chouyangshuliang',
                            defaultMessage: '抽样数量',
                          })}
                          name="samplesCount"
                          dependencies={['submissionCount']}
                          rules={[
                            {
                              validator: async (_, value) => {
                                const _pattern = /^(([1-9][0-9]*)|(([0]\.\d{1,3}|[1-9][0-9]*\.\d{1,3})))$/
                                if (getFieldValue('inspectionType') !== inspectionType.ONE) {
                                  if (
                                    getFieldValue('samplesCount') > (getFieldValue('submissionCount') || 0) ||
                                    !_pattern.test(value)
                                  ) {
                                    return Promise.reject(
                                      new Error(
                                        intl.formatMessage({
                                          id: 'quality.yaoqiudayu0qiexiaoyu',
                                          defaultMessage: '要求大于0且小于或等于送检数量,最多保留3位小数',
                                        }),
                                      ),
                                    )
                                  }
                                }
                                return Promise.resolve()
                              },
                            },
                          ]}
                        >
                          <InputNumber disabled={disabled || getFieldValue('inspectionType') === inspectionType.TWO} />
                        </Form.Item>
                        <Form.Item
                          label={intl.formatMessage({
                            id: 'quality.rangbujieshoushuliang',
                            defaultMessage: '让步接收数量',
                          })}
                          name="concessionToReceiveCount"
                          dependencies={['acceptanceCount', 'rejectCount']}
                          rules={[
                            {
                              validator: async (_, value) => {
                                if (getFieldValue('concessionToReceiveCount')) {
                                  const acceptanceCount = +getFieldValue('acceptanceCount') || 0
                                  const rejectCount = +getFieldValue('rejectCount') || 0
                                  if (
                                    (getFieldValue('concessionToReceiveCount') > (_dataSource?.receiveCount || 0) ||
                                      !pattern.test(value)) &&
                                    dataSource?.receiveNo
                                  ) {
                                    return Promise.reject(
                                      new Error(
                                        `空值，或 0≤让步接收数量≤${
                                          dataSource?.orderResource === ORDERRESOURCE.SEND ? '送样数量' : '收货数量'
                                        }`,
                                      ),
                                    )
                                  }
                                  if (
                                    (getFieldValue('concessionToReceiveCount') >
                                      (getFieldValue('submissionCount') || 0) ||
                                      !pattern.test(value)) &&
                                    !dataSource?.receiveNo
                                  ) {
                                    return Promise.reject(new Error('空值，或 0≤让步接收数量≤送检数量'))
                                  }
                                  if (
                                    value &&
                                    +value + acceptanceCount + rejectCount !== (_dataSource?.receiveCount || 0) &&
                                    dataSource?.receiveNo
                                  ) {
                                    return Promise.reject(
                                      new Error(
                                        `允收数量+让步接收数量+拒收数量≤${
                                          dataSource?.orderResource === ORDERRESOURCE.SEND ? '送样数量' : '收货数量'
                                        }`,
                                      ),
                                    )
                                  }
                                  if (
                                    +value + acceptanceCount + rejectCount > (getFieldValue('submissionCount') || 0) &&
                                    !dataSource?.receiveNo
                                  ) {
                                    return Promise.reject(new Error('0≤允收数量+让步接收数量+拒收数量≤送检数量'))
                                  }
                                }
                                return Promise.resolve()
                              },
                            },
                          ]}
                        >
                          <InputNumber disabled={disabled} />
                        </Form.Item>
                      </Space>
                    </Col>
                    <Col span={12}>
                      <Space direction="vertical" size={16}>
                        <Form.Item
                          label={intl.formatMessage({
                            id: 'quality.picipanding',
                            defaultMessage: '批次判定',
                          })}
                          name="batchJudgmentType"
                          rules={[
                            {
                              required: getFieldValue('inspectionType') !== inspectionType.ONE,
                              message: intl.formatMessage({
                                id: 'quality.qingxuanzepicipanding',
                                defaultMessage: '请选择批次判定',
                              }),
                            },
                          ]}
                        >
                          <Select disabled={disabled}>
                            <Select.Option value={1}>
                              {intl.formatMessage({ id: 'quality.hege', defaultMessage: '合格' })}
                            </Select.Option>
                            <Select.Option value={2}>
                              {intl.formatMessage({
                                id: 'quality.bufenhege',
                                defaultMessage: '部分合格',
                              })}
                            </Select.Option>
                            <Select.Option value={3}>
                              {intl.formatMessage({
                                id: 'quality.rangbujieshou',
                                defaultMessage: '让步接收',
                              })}
                            </Select.Option>
                            <Select.Option value={4}>
                              {intl.formatMessage({ id: 'quality.jushou', defaultMessage: '拒收' })}
                            </Select.Option>
                          </Select>
                        </Form.Item>
                        <Form.Item
                          label={intl.formatMessage({
                            id: 'quality.yunshoushuliang',
                            defaultMessage: '允收数量',
                          })}
                          name="acceptanceCount"
                          dependencies={['concessionToReceiveCount', 'rejectCount']}
                          rules={[
                            {
                              validator: async (_, value) => {
                                if (getFieldValue('acceptanceCount')) {
                                  const concessionToReceiveCount = +getFieldValue('concessionToReceiveCount') || 0
                                  const rejectCount = +getFieldValue('rejectCount') || 0

                                  if (
                                    (getFieldValue('acceptanceCount') > (_dataSource?.receiveCount || 0) ||
                                      !pattern.test(value)) &&
                                    dataSource?.receiveNo
                                  ) {
                                    return Promise.reject(
                                      new Error(
                                        `空值，或 0≤允收数量≤${
                                          dataSource?.orderResource === ORDERRESOURCE.SEND ? '送样数量' : '收货数量'
                                        }`,
                                      ),
                                    )
                                  }
                                  if (
                                    (getFieldValue('acceptanceCount') > (getFieldValue('submissionCount') || 0) ||
                                      !pattern.test(value)) &&
                                    !dataSource?.receiveNo
                                  ) {
                                    return Promise.reject(new Error('空值，或 0≤允收数量≤送检数量'))
                                  }
                                  if (
                                    value &&
                                    +value + concessionToReceiveCount + rejectCount !==
                                      (_dataSource?.receiveCount || 0) &&
                                    dataSource?.receiveNo
                                  ) {
                                    return Promise.reject(
                                      new Error(
                                        `允收数量+让步接收数量+拒收数量=${
                                          dataSource?.orderResource === ORDERRESOURCE.SEND ? '送样数量' : '收货数量'
                                        }`,
                                      ),
                                    )
                                  }
                                  if (
                                    +value + concessionToReceiveCount + rejectCount >
                                      (getFieldValue('submissionCount') || 0) &&
                                    !dataSource?.receiveNo
                                  ) {
                                    return Promise.reject(new Error('0≤允收数量+让步接收数量+拒收数量≤送检数量'))
                                  }
                                }
                                return Promise.resolve()
                              },
                            },
                          ]}
                        >
                          <InputNumber disabled={disabled} />
                        </Form.Item>
                        <Form.Item
                          label={intl.formatMessage({
                            id: 'quality.jushoushuliang',
                            defaultMessage: '拒收数量',
                          })}
                          name="rejectCount"
                          dependencies={['concessionToReceiveCount', 'acceptanceCount']}
                          rules={[
                            {
                              validator: async (_, value) => {
                                if (getFieldValue('rejectCount')) {
                                  const concessionToReceiveCount = +getFieldValue('concessionToReceiveCount') || 0
                                  const acceptanceCount = +getFieldValue('acceptanceCount') || 0
                                  if (
                                    (getFieldValue('rejectCount') > (_dataSource?.receiveCount || 0) ||
                                      !pattern.test(value)) &&
                                    dataSource?.receiveNo
                                  ) {
                                    return Promise.reject(
                                      new Error(
                                        `空值，或  0≤拒收数量=${
                                          dataSource?.orderResource === ORDERRESOURCE.SEND ? '送样数量' : '收货数量'
                                        }`,
                                      ),
                                    )
                                  }
                                  if (
                                    (getFieldValue('rejectCount') > (getFieldValue('submissionCount') || 0) ||
                                      !pattern.test(value)) &&
                                    !dataSource?.receiveNo
                                  ) {
                                    return Promise.reject(new Error('空值，或 0≤拒收数量≤送检数量'))
                                  }
                                  if (
                                    value &&
                                    +value + concessionToReceiveCount + acceptanceCount !==
                                      (_dataSource?.receiveCount || 0) &&
                                    dataSource?.receiveNo
                                  ) {
                                    return Promise.reject(
                                      new Error(
                                        `允收数量+让步接收数量+拒收数量=${
                                          dataSource?.orderResource === ORDERRESOURCE.SEND ? '送样数量' : '收货数量'
                                        }`,
                                      ),
                                    )
                                  }
                                  if (
                                    +value + concessionToReceiveCount + acceptanceCount >
                                      (getFieldValue('submissionCount') || 0) &&
                                    !dataSource?.receiveNo
                                  ) {
                                    return Promise.reject(new Error('0≤允收数量+让步接收数量+拒收数量≤送检数量'))
                                  }
                                }
                                return Promise.resolve()
                              },
                            },
                          ]}
                        >
                          <InputNumber disabled={disabled} />
                        </Form.Item>
                      </Space>
                    </Col>
                  </Row>
                </Space>
              )
            }}
          </Form.Item>
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, curValues) => prevValues.inspectionType !== curValues.inspectionType}
          >
            {({ getFieldValue }) =>
              getFieldValue('inspectionType') !== inspectionType.ONE &&
              getFieldValue('inspectionType') !== undefined ? (
                <Space direction="vertical" size={16}>
                  <Form.List
                    name="qualityOrderProductBadRecordVOS"
                    // rules={[
                    //   {
                    //     validator: async (_, qualityOrderProductBadRecordVOS) => {
                    //       if (getFieldValue('inspectionType') !== inspectionType.ONE) {
                    //         if (!qualityOrderProductBadRecordVOS || isEmpty(qualityOrderProductBadRecordVOS)) {
                    //           return Promise.reject(new Error(intl.formatMessage({ id: 'quality.qingtianjiabuliangjilu', defaultMessage: '请添加不良记录' })));
                    //         }
                    //       }
                    //       return Promise.resolve();
                    //     },
                    //   },
                    // ]}
                  >
                    {(fields, { add, remove }, {}) => (
                      <Space direction="vertical" size={16}>
                        <div className={styles.vertical}>
                          {intl.formatMessage({
                            id: 'quality.buliangjilu',
                            defaultMessage: '不良记录',
                          })}
                        </div>
                        <Badrecord
                          rowKey={(_record, index) => index}
                          pagination={false}
                          columns={badrecordColumns(remove) as ColumnType<any>[]}
                          dataSource={fields}
                          scroll={{ x: '100%' }}
                        />
                        <Button type="dashed" block icon={<PlusOutlined />} onClick={() => add()}>
                          {intl.formatMessage({
                            id: 'quality.tianjiabuliangjilu',
                            defaultMessage: '添加不良记录',
                          })}
                        </Button>
                        {/* <Form.ErrorList errors={errors} /> */}
                      </Space>
                    )}
                  </Form.List>
                  <Form.List
                    name="qualityOrderProductTestRecordVOS"
                    rules={[
                      {
                        validator: async (_, qualityOrderProductTestRecordVOS) => {
                          if (getFieldValue('inspectionType') !== inspectionType.ONE) {
                            if (!qualityOrderProductTestRecordVOS || isEmpty(qualityOrderProductTestRecordVOS)) {
                              return Promise.reject(
                                new Error(
                                  intl.formatMessage({
                                    id: 'quality.qingtianjiajianyanxiangmu',
                                    defaultMessage: '请添加检验项目',
                                  }),
                                ),
                              )
                            }
                          }
                          return Promise.resolve()
                        },
                      },
                    ]}
                  >
                    {(fields, { add, remove }, { errors }) => (
                      <Space direction="vertical" size={16}>
                        <div className={styles.vertical}>
                          {intl.formatMessage({
                            id: 'quality.jianyanjilu',
                            defaultMessage: '检验记录',
                          })}
                        </div>
                        <Inspectionrecord
                          rowKey={(_record, index) => index}
                          pagination={false}
                          columns={inspectionrecordColumns(remove) as ColumnType<any>[]}
                          dataSource={fields}
                          scroll={{ x: '100%' }}
                        />
                        <Button type="dashed" block icon={<PlusOutlined />} onClick={() => add({ edit: true })}>
                          {intl.formatMessage({
                            id: 'quality.tianjiajianyanxiangmu',
                            defaultMessage: '添加检验项目',
                          })}
                        </Button>
                        <Form.ErrorList errors={errors} />
                      </Space>
                    )}
                  </Form.List>
                </Space>
              ) : null
            }
          </Form.Item>
        </Space>
      </Form>
    </Drawer>
  )
}
export default DetectionDrawer
