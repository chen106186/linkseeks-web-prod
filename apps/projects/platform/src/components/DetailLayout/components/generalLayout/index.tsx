/** 详情通用 - 基本信息 */
import React, { Fragment, ReactNode } from 'react'
import { Row, Col, Empty } from 'antd'
import Card from '../card'
import style from './index.less'

export interface GeneraInfoProps {
  /** 数据 */
  effect?: any
  /** 锚点 */
  anchor?: string
  /** 标题 */
  title: string
  /** extra */
  extra?: ReactNode
  /** 是否开启没数据不显示字段 */
  visible?: boolean
  /** 栅格 */
  span?: number
}

const count = 0

const GeneralLayout: React.FC<GeneraInfoProps> = (props: any) => {
  const { effect, anchor, title, extra, visible, span } = props

  console.log(effect, 'effect')

  return (
    <Card id={anchor} title={title} extra={extra}>
      <>
        <Row gutter={[8, 8]}>
          {effect.length > count &&
            effect.map((item, index) => (
              <Col key={`effect_${index + 1}`} span={span}>
                {item.col.map((it, idx) => (
                  <Fragment key={`effect_col_${idx + 1}`}>
                    {visible ? (
                      <>
                        {it.extra && (
                          <div className={style.cell}>
                            {it.label && <div className={style.label}>{it.label}: </div>}
                            <div className={style.content}>{it.extra}</div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className={style.cell}>
                        {it.label && <div className={style.label}>{it.label}: </div>}
                        <div className={style.content}>{it.extra}</div>
                      </div>
                    )}
                  </Fragment>
                ))}
              </Col>
            ))}
        </Row>
        {effect.length === count && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
      </>
    </Card>
  )
}
GeneralLayout.defaultProps = {
  span: 8,
}
export default GeneralLayout
