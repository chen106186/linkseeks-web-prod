import type { ReactNode } from 'react'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Row, Col, Anchor } from 'antd'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { ArrowLeftOutlined } from '@ant-design/icons'
import style from './index.less'
import type { ISchema } from '@apps/formily'
import { FormDetailContext } from '@/formSchema/context'

const { Link } = Anchor
export interface FormDetailHeaderProps {
  /**
   * 是否显示信息完成度
   */
  showProcess?: boolean
  title: string
  /**
   * 右侧额外操作
   */
  extraRight?: ReactNode
  /**
   * 返回操作跳转链接
   */
  backLink?: string
  /**
   * 表单描述schema
   */
  schema: ISchema
  /**
   * tabList
   */
  tabList?: {
    key: string
    label: ReactNode
  }[]
  styles?: any
  hideBack?: boolean
}

interface itemProps extends ISchema {
  ['x-component-props']?: any
}

/**
 * NiceForm表单详情的锚点头部
 *
 */

const FormDetailHeader: React.FC<FormDetailHeaderProps> = ({
  showProcess,
  title,
  extraRight,
  backLink,
  schema,
  tabList,
  styles,
  hideBack = false,
}) => {
  const intl = useIntl()
  const ctx = useContext(FormDetailContext)
  const flagRef = useRef({
    flag: false,
    distanceTop: 0,
  })
  const [, setCurrent] = useState<number>(0)
  const [isFixed, setIsFixed] = useState<boolean>(false)

  const onScroll = () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    const floors = document.querySelectorAll('.anchorContent>div')
    floors.forEach((floor: any, index: any) => {
      if (floor.offsetTop - 100 <= scrollTop) {
        setCurrent(index)
      }
    })
    // 锚点导航距离顶端距离
    const navDom: any = document.getElementById('anchorTitle')
    if (navDom) {
      const distance = navDom.offsetTop - document.documentElement.scrollTop
      if (!flagRef.current.flag) {
        flagRef.current.distanceTop = navDom.offsetTop
        flagRef.current.flag = true
      }

      if (distance <= 0) {
        setIsFixed(true)
      }

      if (document.documentElement.scrollTop <= flagRef.current.distanceTop) {
        setIsFixed(false)
      }
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <div
      className={isFixed ? [style.detailHeader, style.anchorTitleFixed].join(' ') : style.detailHeader}
      id="detailHeader"
      style={styles}
    >
      <Row>
        <Col span={22}>
          <Row align="middle">
            {!hideBack && (
              <Col>
                <ArrowLeftOutlined size={14} onClick={() => (backLink ? history.push(backLink) : history.goBack())} />
              </Col>
            )}
            <Col>
              <div className={style.titleAvatorText}>{title}</div>
            </Col>
            {showProcess && (
              <Col>
                <div className={style.titleCompleteProcess}>
                  {intl.formatMessage({ id: 'components.xinxiwanchengdu' })}
                  {`  ${parseInt((Number(ctx.formContext.formProcess || 0) * 100).toFixed(2))}%`}
                </div>
              </Col>
            )}
          </Row>
          <Row>
            <Col>
              <div className={style.anchorTitle} id="anchorTitle">
                <Anchor
                  onClick={(e) => e.preventDefault()}
                  showInkInFixed={false}
                  targetOffset={200}
                  getContainer={() => document.querySelector('main.ant-layout-content') as HTMLElement}
                >
                  {tabList && tabList.length > 0 ? (
                    <>
                      {tabList.map((_item, index) => (
                        <Link key={index} href={`#${_item?.key}`} title={_item?.label} />
                      ))}
                    </>
                  ) : (
                    <>
                      {schema.properties &&
                        Object.values(schema.properties).map((item: itemProps, index) => {
                          const { countAmountMap } = ctx.formContext
                          const { id, showTotal = false } = item['x-component-props']
                          const __title = item['x-component-props']?.title
                          if (id && __title) {
                            const _title = showTotal
                              ? countAmountMap
                                ? `${__title}(${countAmountMap[id]})`
                                : `${__title}(0)`
                              : __title
                            return <Link key={index} href={`#${id}`} title={_title} />
                          }
                        })}
                    </>
                  )}
                </Anchor>
              </div>
            </Col>
          </Row>
        </Col>
        <Col className={style.fixedBtn}>{extraRight}</Col>
      </Row>
    </div>
  )
}

FormDetailHeader.defaultProps = {
  showProcess: true,
}

export default FormDetailHeader
