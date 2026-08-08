import { Modal } from 'antd'
import { useEffect, useState } from 'react'

/**
 *
 * @param param0
 * isShow %2 === 0 的时候显示,父元素必须又0开始
 * @returns
 */
function AutoCancelModel(props: {
  isShow: number
  children?: JSX.Element | string | JSX.Element[]
  title?: string
  width?: number
  onOk?: Function
}) {
  const { isShow, children, title, width } = props

  const [visible, setVisible] = useState<boolean>()

  useEffect(() => {
    setVisible(isShow > 0 && isShow % 2 === 0)
  }, [isShow])

  return (
    <Modal
      title={title}
      visible={visible}
      onCancel={() => {
        setVisible(false)
      }}
      width={width}
      onOk={async () => {
        let isClose = await props.onOk()
        setVisible(isClose)
      }}
    >
      {children}
    </Modal>
  )
}

export default AutoCancelModel
