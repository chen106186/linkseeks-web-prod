import React, { useCallback, useEffect, useMemo } from 'react'
import { Col, Drawer, Form, InputNumber, Row, Select, Space, Table as Badrecord, Table as Inspectionrecord } from 'antd'
import { ColumnType } from 'antd/lib/table'
import styles from './index.less'
import { getIntl } from '@linkseeks/i18n'
import {
  badCount,
  badDescription,
  badReasons,
  grouping,
  handleType,
  inspectionInstructions,
  inspectionJudgmentType,
  inspectionValue,
  measurements,
  qualifiedRange,
  receiptJudgmentType,
  remark,
  returnType,
  testItems,
} from '@/pages/qualityAbility/columns'

export type DetectionType = {
  /** 质检单编号 */
  qualityNo: string
  /** 供应商 */
  vendorMemberName: string
  /** 检验方式 */
  inspectionType: number
  inspectionTypeName: string
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
  /** 质检单物料信息不良记录 */
  qualityOrderProductBadRecordDetailVOS: object[]
  /** 质检单物料信息检验记录 */
  qualityOrderProductTestRecordDetailVOS: object[]
}

export interface DetectionDrawerProps {
  /** 质检记录信息 */
  detection: DetectionType
  /** 打开关闭 */
  visible: boolean
  /** 关闭 */
  onClose()
}

enum inspectionType {
  /** 免检 */
  ONE = 1,
  /** 全检 */
  TWO,
  /** 抽检 */
  THREE,
}

export const layout: any = {
  colon: false,
  labelCol: { style: { width: '144px' } },
  labelAlign: 'left',
}

const DetectionDrawer: React.FC<DetectionDrawerProps> = (props: any) => {
  const intl = getIntl()
  const { detection, visible, onClose } = props
  const [form] = Form.useForm()
  /** 不良记录表头 */
  const badrecordColumns: ColumnType<any>[] = [
    {
      ...badReasons,
    },
    {
      ...badDescription,
    },
    {
      ...measurements,
    },
    {
      ...badCount,
    },
    {
      ...receiptJudgmentType,
      render: (_text, record) => record?.receiptJudgmentTypeName,
    },
    {
      ...returnType,
      render: (_text, record) => record?.returnTypeName,
    },
    {
      ...handleType,
      render: (_text, record) => record?.handleTypeName,
    },
    {
      ...remark,
    },
  ]
  /** 检验记录表头 */
  const inspectionrecordColumns: ColumnType<any>[] = [
    {
      ...grouping,
    },
    {
      ...testItems,
    },
    {
      ...qualifiedRange,
      render: (_text, record) => <>{`${record.startValue}~${record.endValue}`}</>,
    },
    {
      ...inspectionInstructions,
    },
    {
      ...inspectionValue,
    },
    {
      ...remark,
    },
    {
      ...inspectionJudgmentType,
      render: (_text, record) => record?.inspectionJudgmentTypeName,
    },
  ]

  const data = useMemo(() => {
    return detection
  }, [detection])

  useEffect(() => {
    form.setFieldsValue({
      submissionCount: detection?.submissionCount,
      samplesCount: detection?.samplesCount,
      concessionToReceiveCount: detection?.concessionToReceiveCount,
      batchJudgmentType: detection?.batchJudgmentType,
      acceptanceCount: detection?.acceptanceCount,
      rejectCount: detection?.rejectCount,
    })
  }, [detection])

  return (
    <Drawer
      width={1000}
      title={intl.formatMessage({ id: 'quality.jianyanjilu', defaultMessage: '检验记录' })}
      closable
      visible={visible}
      onClose={onClose}
      className={styles['detection-drawer']}
    >
      <Form form={form} {...layout}>
        <Space direction="vertical" size={16}>
          <Space direction="vertical" size={16}>
            <div className={styles['info']}>
              <span>{intl.formatMessage({ id: 'quality.zhijiandanbianhao', defaultMessage: '质检单编号' })}</span>
              <span>{data?.qualityNo}</span>
            </div>
            <div className={styles['info']}>
              <span>{intl.formatMessage({ id: 'quality.gongyingshangmingcheng', defaultMessage: '供应商名称' })}</span>
              <span>{data?.vendorMemberName}</span>
            </div>
            <div className={styles['info']}>
              <span>{intl.formatMessage({ id: 'quality.jianyanfangshi', defaultMessage: '检验方式' })}</span>
              <span>{data?.inspectionTypeName}</span>
            </div>
          </Space>
          <Space direction="vertical" size={16}>
            <Row gutter={[16, 36]}>
              <Col span={12}>
                <Space direction="vertical" size={16}>
                  <Form.Item
                    label={intl.formatMessage({ id: 'quality.songjianshuliang', defaultMessage: '送检数量' })}
                    name="submissionCount"
                  >
                    <InputNumber disabled />
                  </Form.Item>
                  <Form.Item
                    label={intl.formatMessage({ id: 'quality.chouyangshuliang', defaultMessage: '抽样数量' })}
                    name="samplesCount"
                    dependencies={['submissionCount']}
                  >
                    <InputNumber disabled />
                  </Form.Item>
                  <Form.Item
                    label={intl.formatMessage({ id: 'quality.rangbujieshoushuliang', defaultMessage: '让步接收数量' })}
                    name="concessionToReceiveCount"
                  >
                    <InputNumber disabled />
                  </Form.Item>
                </Space>
              </Col>
              <Col span={12}>
                <Space direction="vertical" size={16}>
                  <Form.Item
                    label={intl.formatMessage({ id: 'quality.picipanding', defaultMessage: '批次判定' })}
                    name="batchJudgmentType"
                  >
                    <Select disabled>
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
                  <Form.Item
                    label={intl.formatMessage({ id: 'quality.yunshoushuliang', defaultMessage: '允收数量' })}
                    name="acceptanceCount"
                  >
                    <InputNumber disabled />
                  </Form.Item>
                  <Form.Item
                    label={intl.formatMessage({ id: 'quality.jushoushuliang', defaultMessage: '拒收数量' })}
                    name="rejectCount"
                  >
                    <InputNumber disabled />
                  </Form.Item>
                </Space>
              </Col>
            </Row>
          </Space>
          {detection?.inspectionType !== inspectionType.ONE && (
            <>
              <Space direction="vertical" size={16}>
                <div className={styles['vertical']}>
                  {intl.formatMessage({ id: 'quality.buliangjilu', defaultMessage: '不良记录' })}
                </div>
                <Badrecord
                  rowKey="id"
                  pagination={false}
                  columns={badrecordColumns}
                  dataSource={data?.qualityOrderProductBadRecordDetailVOS}
                />
              </Space>
              <Space direction="vertical" size={16}>
                <div className={styles['vertical']}>
                  {intl.formatMessage({ id: 'quality.jianyanjilu', defaultMessage: '检验记录' })}
                </div>
                <Inspectionrecord
                  rowKey="id"
                  pagination={false}
                  columns={inspectionrecordColumns}
                  dataSource={data?.qualityOrderProductTestRecordDetailVOS}
                />
              </Space>
            </>
          )}
        </Space>
      </Form>
    </Drawer>
  )
}
export default DetectionDrawer
