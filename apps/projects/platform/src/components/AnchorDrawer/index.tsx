import React, { ReactNode, useEffect, useState } from 'react'
import { Drawer, Row, Col, Anchor } from 'antd'
import style from './index.less'
import NiceForm from '../NiceForm'
import { IAntdSchemaFormProps, registerVirtualBox } from '@apps/formily'

/**
 * 带锚点定位跳转的抽屉 Drawer
 */

const { Link } = Anchor

export interface AnchorProps extends IAntdSchemaFormProps {
  /** 数据源 用于渲染对应的字段值 */
  data?: any
  /** 数据项和render渲染函数 仅预览功能下使用 */
  dataRenderList?: { title: string; name: string; render?(data?: any); [key: string]: any }[]
  /** NiceForm表单模式下 锚点定位title和idName列表 此项生效必须isForm属性为true */
  dataIdList?: { title: string; idName: string }[]
  title?: string
  visible?: boolean
  /** 自定义底部布局 */
  footer?: ReactNode
  /** 点击遮罩回调 */
  onClose?: any
  /** 是否使用NiceForm表单 */
  isForm?: boolean
  /** Drawer其他配置 */
  restDrawer?: any
  /** 重载的字段 */
  reloadFields?: string[]
}

const AnchorDrawer: React.FC<AnchorProps> = ({
  data,
  dataRenderList = [],
  dataIdList = [],
  title = '',
  visible = false,
  footer,
  onClose,
  isForm = false,
  actions,
  restDrawer,
  reloadFields,
  ...restProps
}) => {
  const [current, setCurrent] = useState<number>(0)
  const [offsetTopList, setOffsetTopList] = useState<number[]>([])

  useEffect(() => {
    let tempArr: any = []
    let floors: any = []
    if (visible) {
      // 获取各个子div距父级的高度
      floors = isForm
        ? document.querySelectorAll('.drawerContent>div>div>form.ant-form>div')
        : document.querySelectorAll('.drawerContent>div')
      floors.forEach((floor: any, index: any) => {
        tempArr.push(floor.offsetTop)
      })
      setOffsetTopList(tempArr)
    }

    /**
     * 开启滚动事件冒泡 (传参说明)
     * e: 事件对象
     * tempArr: 各目标元素距父级顶部距离数组
     * floors: 各锚点目标HTML元素
     */
    window.addEventListener('scroll', (e?: any) => onScroll(e, tempArr, floors), true)
    // @ts-ignore
    return () => window.removeEventListener('scroll', onScroll)
  }, [visible])

  const onScroll = (e?: { target: { className: string } }, arr?: any, floors?: any) => {
    if (visible)
      if (e.target.className === 'ant-drawer-body') {
        let scrollTop = document.querySelectorAll('.ant-drawer-body')[0].scrollTop
        floors.forEach((floor: any, index: any) => {
          if (arr[index] - 40 <= scrollTop) {
            setCurrent(index)
          }
        })
      }
  }

  const handleClick = (i: number) => {
    let dom = document.querySelectorAll('.ant-drawer-body')[0]
    dom.scroll({
      top: offsetTopList[i] - 16,
      behavior: 'smooth',
    })
    if (offsetTopList[i] + dom.clientHeight >= dom.scrollHeight) {
      // @tofix 此状态的变更会影响表单某些字段的显示
      setCurrent(i)
    }
    // @tofixed 重置字段值
    if (reloadFields?.length) {
      for (let i = 0; i < reloadFields.length; i++) {
        actions.getFieldValue(reloadFields[i]).then((value) => {
          actions.setFieldValue(reloadFields[i], value)
        })
      }
    }
  }

  registerVirtualBox('CustomTitle', ({ children, schema }) => {
    return (
      <div>
        <p className={style.paneTitle}>
          <span className={style.longString}>|</span>
          {schema['x-component-props']['text']}
        </p>
        {children}
      </div>
    )
  })

  return (
    <div id="content">
      <Drawer
        title={title}
        width={800}
        bodyStyle={{ paddingLeft: 0, paddingTop: 0 }}
        onClose={onClose}
        visible={visible}
        footer={footer}
        {...restDrawer}
      >
        <div className={style.drawerContainer}>
          <Row>
            <Col span={6}>
              <div className={style.drawerNav}>
                <ul>
                  {isForm
                    ? dataIdList.map((item, index) => (
                        <li key={index} onClick={() => handleClick(index)} title={item['title']}>
                          <a className={current === index ? style.current : null}>{item['title']}</a>
                        </li>
                      ))
                    : dataRenderList.map((item, index) => (
                        <li key={index} onClick={() => handleClick(index)} title={item['title']}>
                          <a className={current === index ? style.current : null}>{item['title']}</a>
                        </li>
                      ))}
                </ul>
              </div>
            </Col>
            <Col span={18}>
              <div className={[style.drawerContent, 'drawerContent'].join(' ')}>
                {isForm ? (
                  <NiceForm
                    actions={actions}
                    {...restProps}
                    // onSubmit={values => ref.current.reload(values)}
                  />
                ) : (
                  dataRenderList.map((item, index) => (
                    <div className={style.drawerContentItem} id={item['id']} key={index}>
                      <div className={style.drawerContentTitle}>
                        <p>
                          <span className={style.longString}>|</span>
                          {item['title']}
                        </p>
                      </div>
                      <div className={style.drawerContentInfo}>
                        {item.render ? item.render(data) : <span>{data[item.name]}</span>}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Col>
          </Row>
        </div>
      </Drawer>
    </div>
  )
}

AnchorDrawer.defaultProps = {}

export default AnchorDrawer
