import React, { useEffect, useState } from 'react'
import { showToast } from '@apps/mobile-services/utils/taro'
import { Checkbox, View, Text } from '@apps/mobile-ui'
import cx from 'classnames'
import Router from '@/utils/router'
import { getManageContentNoticeFindWithOutContent } from '@apps/apis'
import './index.scss'

interface AgreementProps {
  /** 文字 */
  consentText?: string
  /** 自定义外部className */
  customClassName?: string
  /** 事件 */
  click: (resovle: boolean) => void
  /** 公告类型 */
  columnType?: string

  color?: string
}

const AgreementLayout: React.FC<AgreementProps> = (props: AgreementProps) => {
  const { consentText, customClassName, click, columnType, color } = props
  /** 协议默认勾选 */
  const [active, setActive] = useState<boolean>(false)
  const [agrList, setAgrList] = useState<any[]>([]) // 协议数据

  const handleClick = () => {
    const atv = active
    setActive(!atv)
  }

  const findAllByColumnType = async () => {
    const { code, data, message } = await getManageContentNoticeFindWithOutContent({ columnType })
    if (code === 1000) {
      setAgrList(data)
    } else {
      showToast({ title: message, icon: 'none' })
    }
  }

  useEffect(() => {
    findAllByColumnType()
  }, [])

  useEffect(() => {
    click(active)
  }, [active])

  const webView = (item: any) => {
    Router.navigateTo('basicSetting/webView', { id: item.id, type: 'sign', columnType: item.columnType })
  }

  return (
    <View className={cx('agrbox', customClassName)} onClick={() => handleClick()}>
      <Checkbox color={color} checked={active} size={14} onChange={() => handleClick()} />
      <View className="agrbox-text">
        <Text className="agrbox-consent">{consentText}</Text>
        {agrList.map((items: any) => (
          <Text
            key={items.id}
            className="agrbox-signRight"
            onClick={(e) => {
              e.stopPropagation()
              webView(items)
            }}
          >{`《${items.title}》`}</Text>
        ))}
      </View>
    </View>
  )
}

AgreementLayout.defaultProps = {
  consentText: '已阅读并同意',
}

export default AgreementLayout
