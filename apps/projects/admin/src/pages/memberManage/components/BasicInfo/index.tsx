import React, { useState } from 'react'
import { Row, Col, Descriptions } from 'antd'
import MellowCard from '@/components/MellowCard'
import { renderFieldTypeContent, ElementType } from '../../utils'
import FlowRecords, { InnerHistoryItem, OuterHistoryItem } from '../FlowRecords'
import styles from './index.less'

interface BasicInfoProps {
  basic?: {
    account?: string
    phone?: string
    email?: string
    created?: string
  }
  channel?: {
    memberType?: number
    level?: string
    type?: string
    areas?: string[]
    desc?: string
  }
  extra?: {
    groupName: string
    elements: {
      /**
       * 注册资料id
       */
      id?: number
      /**
       * 字段名称
       */
      fieldName?: string
      /**
       * 中文名称
       */
      fieldLocalName?: string
      /**
       * 字段类型
       */
      fieldType?: string
      /**
       * 字段类型附加属性(该参数为map)
       */
      attr?: { [key: string]: any }
      /**
       * 字段长度
       */
      fieldLength?: number
      /**
       * 是否可为空0-不能为空1-可以为空
       */
      fieldEmpty?: number
      /**
       * 字段顺序
       */
      fieldOrder?: number
      /**
       * 帮助信息
       */
      fieldRemark?: string
      /**
       * 枚举标签列表
       */
      fieldEnum?: {
        value?: number
        label?: string
      }[]
      /**
       * 字段校验规则枚举：0-无校验规则，1-邮箱规则，2-手机号码规则，3-身份证规则，4-电话号码规则
       */
      ruleEnum?: number
      /**
       * 校验规则的正则表达式
       */
      pattern?: string
      /**
       * 校验错误的提示语
       */
      msg?: string
      /**
       * 值
       */
      fieldValue?: any
      /**
       * 是否禁用
       */
      disabled?: boolean
      /**
       * fieldType为list时，列表数据
       */
      registers?: ElementType[]
    }[]
  }[]
  outerHistory?: OuterHistoryItem[]
  innerHistory?: InnerHistoryItem[]
  channelRender?: React.ReactNode // 自定义渲染渠道信息
}

const BasicInfo: React.FC<BasicInfoProps> = ({
  basic = {},
  channel = {},
  extra = [],
  outerHistory = [],
  innerHistory = [],
  channelRender,
}) => {
  return (
    <div className={styles.basicInfo}>
      <Row gutter={[0, 24]}>
        <Col span={24}>
          <MellowCard title="基本信息">
            <Descriptions column={2} className={styles.descriptions}>
              <Descriptions.Item label="登录账户">{basic.account}</Descriptions.Item>
              <Descriptions.Item label="注册手机号">{basic.phone || '无'}</Descriptions.Item>
              <Descriptions.Item label="注册邮箱">{basic.email || '无'}</Descriptions.Item>
              <Descriptions.Item label="申请时间">{basic.created}</Descriptions.Item>
            </Descriptions>
          </MellowCard>
        </Col>

        {extra.map((item, index) => (
          <Col key={index} span={24}>
            <MellowCard title={item.groupName}>
              <Row gutter={20}>
                <Col span={24}>
                  <Descriptions column={1} className={styles.descriptions}>
                    {item.elements.map((ele, index) =>
                      (index + 1) % 2 !== 0 ? (
                        <Descriptions.Item key={index} label={ele.fieldLocalName}>
                          {renderFieldTypeContent(
                            ele.fieldType as any,
                            ele.fieldType == 'list' ? ele.registers : ele.fieldValue,
                          )}
                        </Descriptions.Item>
                      ) : null,
                    )}
                  </Descriptions>
                </Col>
                <Col span={24}>
                  <Descriptions column={1} className={styles.descriptions}>
                    {item.elements.map((ele, index) =>
                      (index + 1) % 2 === 0 ? (
                        <Descriptions.Item key={index} label={ele.fieldLocalName}>
                          {renderFieldTypeContent(
                            ele.fieldType as any,
                            ele.fieldType == 'list' ? ele.registers : ele.fieldValue,
                          )}
                        </Descriptions.Item>
                      ) : null,
                    )}
                  </Descriptions>
                </Col>
              </Row>
            </MellowCard>
          </Col>
        ))}

        <Col span={24}>
          <FlowRecords outerHistory={outerHistory} innerHistory={innerHistory} />
        </Col>
      </Row>
    </div>
  )
}

export default BasicInfo
