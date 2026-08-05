import { EditCircleFillIcon, PlusFillIcon } from '@linkseeks/icons'
import { Col, Form, Popover, Row, Typography } from 'antd'
import { isEmpty, isObject } from 'lodash'
import React, { Fragment } from 'react'
import { ALTERATION } from '../orderDetailSection'
import styles from './index.less'

interface RenderCardProps {
  /**
   * 列信息
   */
  infoList?: {
    title?: string
    childKey?: string
    name: string
    render?: <T>(arg: T, arg1?: T) => void
  }[]
  /**
   * 数据
   */
  dataSource: any
  /**
   * 列占位
   */
  colSpan?: number
  /**
   * 变更数据
   */
  versionContext?: any
  /**
   * 当前变更按钮
   */
  alteation?: number
}
/** 首字母大写 */
export const titleCase = (str) => {
  const newStr = str.replace(/^\S/, (s) => s.toUpperCase())
  return newStr
}

export const StatusCase = ({ versionContext, v, alteation }) => {
  const isObj = isObject(versionContext?.detailBO['before' + titleCase(v.name)])
    ? (versionContext?.detailBO['before' + titleCase(v.name)])[v.childKey]
    : versionContext?.detailBO['before' + titleCase(v.name)]
  const flag = alteation === ALTERATION.AFTER_ALTERATION && versionContext?.detailBO[v.name + 'ChangeStatus'] && isObj
  return (
    <>
      {flag ? (
        <Popover
          overlayClassName={styles['popover']}
          title={
            <>
              <EditCircleFillIcon style={{ color: '#4888F0', fontSize: '16px' }} />
              <Typography.Text>数据已变更</Typography.Text>
            </>
          }
          content={
            isObject(versionContext?.detailBO['before' + titleCase(v.name)])
              ? (versionContext?.detailBO['before' + titleCase(v.name)])[v.childKey]
              : versionContext?.detailBO['before' + titleCase(v.name)]
          }
        >
          <EditCircleFillIcon style={{ color: '#4888F0', fontSize: '16px' }} />
        </Popover>
      ) : (
        <Popover
          overlayClassName={styles['popover-success']}
          title={
            <>
              <PlusFillIcon style={{ color: '#00A98F', fontSize: '16px' }} />
              <Typography.Text>当前为新增数据</Typography.Text>
            </>
          }
        >
          <PlusFillIcon style={{ color: '#00A98F', fontSize: '16px' }} />
        </Popover>
      )}
    </>
  )
}

const RenderCard: React.FC<RenderCardProps> = (props) => {
  const { infoList, dataSource, colSpan, versionContext, alteation } = props

  return (
    <Row gutter={[128, 16]}>
      {!isEmpty(dataSource) &&
        infoList.map((v, i) => {
          console.log(v.name)
          const newDataSource = isObject(dataSource[v.name]) ? dataSource[v.name][v.childKey] : dataSource[v.name]
          return (
            <Fragment key={`${v.name}_${i + 1}`}>
              {!versionContext ||
              ((alteation === ALTERATION.BEFORE_ALTERATION ||
                (alteation === ALTERATION.AFTER_ALTERATION && versionContext?.detailBO[v.name + 'ChangeStatus'])) &&
                newDataSource) ? (
                <Col span={colSpan}>
                  <Form.Item
                    noStyle={!v.title}
                    label={v.title}
                    labelCol={{ style: { width: '144px' } }}
                    labelAlign="left"
                    style={{ marginBottom: 0 }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      {v.render ? v.render(dataSource[v.name], dataSource) : dataSource[v.name] || '-'}
                      {versionContext &&
                        alteation === ALTERATION.AFTER_ALTERATION &&
                        versionContext?.detailBO[v.name + 'ChangeStatus'] && (
                          <StatusCase versionContext={versionContext} v={v} alteation={alteation} />
                        )}
                    </div>
                  </Form.Item>
                </Col>
              ) : null}
            </Fragment>
          )
        })}
    </Row>
  )
}

RenderCard.defaultProps = {
  colSpan: 12,
}

export default RenderCard
