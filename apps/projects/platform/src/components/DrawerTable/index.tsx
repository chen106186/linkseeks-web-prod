import React, { ReactText, useRef, useEffect, useLayoutEffect } from 'react'
import StandardTable, { IStandardTableProps } from '@/components/StandardTable'
import NestTable from '@/components/NestTable'
import { Row, Col, Drawer, Space, Button } from 'antd'
import styles from './index.less'
import { useIntl } from '@linkseeks/i18n'

/**
 * 抽屉嵌套 业务表格控件
 */
export interface DrawerTableProps extends IStandardTableProps<any> {
  width?: number
  drawerTitle?: ReactText
  /** 点确定按钮的回调 */
  confirm?()
  /** 点击遮罩层或关闭或取消按钮的回调 */
  cancel?()
  visible?: boolean
  /** Drawer属性配置 */
  resetDrawer?: object
  /** 是否使用嵌套表格 */
  useNestTable?: boolean
  nestColumns?: any[]
  /** 嵌套表格配置属性 */
  nestTableProps?: any
  // fix: 新增参数， 为true时每次开启弹窗都会重新reload接口
  forceRender?: boolean
  searchName?: string
  /** schema 筛选的一些配置 */
  formilyProps?: any
  /**
   * 确定按钮弹窗文案
   */
  confirmText?: string
}

const DrawerTable: React.FC<DrawerTableProps> = (props) => {
  const intl = useIntl()
  const {
    width = 1000,
    drawerTitle,
    confirm,
    cancel,
    visible,
    currentRef,
    resetDrawer,
    forceRender,
    useNestTable = false,
    nestColumns,
    nestTableProps,
    searchName,
    formilyProps,
    confirmText = intl.formatMessage({ id: 'components.baocun' }),
    ...resetTable
  } = props

  const selfRef = currentRef || useRef<any>({})

  useEffect(() => {
    if (visible && forceRender) {
      // 重新开启时需reload接口
      // fix: 去掉自动reload接口, 防止重复请求
      // fix: 新增forceRender接口， 用于控制弹窗是否需要reload
      selfRef.current.reloadCurrent && selfRef.current.reloadCurrent()
    } else {
      selfRef.current.resetField &&
        selfRef.current.resetField({
          validate: false,
        })
    }
  }, [visible])

  const onClick = () => {
    confirm && confirm()
  }

  return (
    <Drawer width={width} title={drawerTitle} onClose={cancel} visible={visible} {...resetDrawer}>
      {useNestTable ? (
        <NestTable
          NestColumns={nestColumns}
          className="common_tb"
          rowClassName={(_, index) => index % 2 === 0 && 'tb_bg'}
          {...nestTableProps}
        />
      ) : (
        <StandardTable currentRef={selfRef} formilyProps={formilyProps} {...resetTable} />
      )}
      <div style={{ height: 56, width: '100%' }}></div>
      <Row className={styles.footer}>
        <Col span={24}>
          <Space size={[16, 0]}>
            <Button onClick={cancel}>{intl.formatMessage({ id: 'components.quxiao' })}</Button>
            <Button type="primary" onClick={onClick}>
              {confirmText}
            </Button>
          </Space>
        </Col>
      </Row>
    </Drawer>
  )
}

DrawerTable.defaultProps = {}

export default DrawerTable
