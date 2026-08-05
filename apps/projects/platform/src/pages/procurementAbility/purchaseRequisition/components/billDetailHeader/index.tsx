import React, { ReactNode, useEffect, useRef, useState } from 'react'
import { Row, Col, Skeleton, Anchor } from 'antd'
import { history } from '@linkseeks/router-manager'
import { ArrowLeftOutlined } from '@ant-design/icons'
import style from './index.less'
import { anchorItemProps } from '../billDetailSection'

const { Link } = Anchor

export interface BillDetailHeaderProps {
  extraRight?: ReactNode
  formContext?: any
  anchorList?: anchorItemProps[]
  backLink?: string
  contentRef?: any
}

/**
 * 招标详情头部
 */
const BillDetailHeader: React.FC<BillDetailHeaderProps> = ({ extraRight, formContext, anchorList = [], backLink }) => {
  const isLoading = !!formContext.data

  const flagRef = useRef({
    flag: false,
    distanceTop: 0,
  })
  const [current, setCurrent] = useState<number>(0)
  const [isFixed, setIsFixed] = useState<boolean>(false)

  useEffect(() => {
    window.addEventListener('scroll', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const onScroll = () => {
    let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    let floors = document.querySelectorAll('.anchorContent>div')
    floors.forEach((floor: any, index: any) => {
      if (floor.offsetTop - 100 <= scrollTop) {
        setCurrent(index)
      }
    })
    // 锚点导航距离顶端距离
    let navDom: any = document.getElementById('anchorTitle')
    if (navDom) {
      let distance = navDom.offsetTop - document.documentElement.scrollTop
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

  return (
    <div
      className={isFixed ? [style.detailHeader, style.anchorTitleFixed].join(' ') : style.detailHeader}
      id="detailHeader"
    >
      {isLoading ? (
        <Row>
          {
            <>
              <Col span={22}>
                <Row align="middle">
                  <Col>
                    <ArrowLeftOutlined onClick={() => (backLink ? history.push(backLink) : history.goBack())} />
                  </Col>
                  <Col>
                    <div
                      className={style.titleAvatorText}
                    >{`${formContext.data.digest}|${formContext.data.requisitionNo}`}</div>
                  </Col>
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
                        {anchorList.map((item, index) => (
                          <Link key={index} href={`#${item['id']}`} title={item['title']} />
                        ))}
                      </Anchor>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col span={2}>{extraRight}</Col>
            </>
          }
        </Row>
      ) : (
        <Skeleton avatar={{ shape: 'square' }} active paragraph={{ rows: 3 }} />
      )}
    </div>
  )
}

BillDetailHeader.defaultProps = {}

export default BillDetailHeader
