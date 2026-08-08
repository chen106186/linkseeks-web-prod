import React, { useState, useEffect, useCallback } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Modal } from 'antd'
import styles from './index.less'
import { CloseOutlined } from '@ant-design/icons'
import DragSortList from './DragSortList'
import home_workBench from '@/assets/imgs/home_workBench.png'
import { useToggle } from '@linkseeks/hooks'
import { DndContextProvider, useDnd } from './useDnd'
import { arrayMove } from '@linkseeks/tools'

export type LayoutType = {
  code: number
  name: string
  sort: number
  isShow: 1 | 2 | (number & {})
  id: null | number
}

interface Iprops {
  layouts: LayoutType[]
  handleChangeOrder: (list: LayoutType[]) => void
}

const CustomWorkBench: React.FC<Iprops> = (props) => {
  const intl = useIntl()
  const { layouts, handleChangeOrder } = props
  const [cards, setCards] = useState<LayoutType[]>([])
  const [visible, setVisible] = useToggle(false)
  const dndProps = useDnd()

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (active.id !== over.id) {
      const oldIndex = cards.findIndex((v) => v.code === active.id)
      const newIndex = cards.findIndex((v) => v.code === over.id)
      setCards(arrayMove(cards, oldIndex, newIndex))
    }
  }

  const handleVisible = () => {
    setVisible(true)
  }

  const handleCancel = () => {
    setVisible(false)
  }

  useEffect(() => {
    if (visible) {
      return
    }
    setCards(layouts)
  }, [visible, layouts])

  const handleChangeShow = useCallback((index, isShow) => {
    setCards((state) => {
      const item = state[index]
      item.isShow = isShow ? 1 : 0
      return [...state]
    })
  }, [])

  const handleOk = () => {
    const sortedData = cards.map((item, key) => {
      return {
        ...item,
        sort: key + 1,
      }
    })
    handleChangeOrder?.(sortedData)
    setVisible(false)
  }

  return (
    <div className={styles.customWorkBench}>
      <div className={styles.btn} onClick={handleVisible}>
        <span className={styles.icon}>
          <img src={home_workBench} />
        </span>
        {intl.formatMessage({ id: 'home.customWorkBench.customWorkBench' })}
      </div>
      <Modal
        width={800}
        open={visible}
        onCancel={handleCancel}
        closable={false}
        bodyStyle={{ padding: 0 }}
        onOk={handleOk}
      >
        <div className={styles.modalContainer}>
          <div className={styles.header}>
            <div className={styles.left}>
              <div className={styles.title}>{intl.formatMessage({ id: 'home.customWorkBench.title' })}</div>
              <div className={styles.tips}>{intl.formatMessage({ id: 'home.customWorkBench.tips' })}</div>
            </div>
            <div className={styles.close} onClick={handleCancel}>
              <CloseOutlined />
            </div>
          </div>
          <div className={styles.content}>
            <DndContextProvider {...dndProps} handleDragEnd={handleDragEnd} items={cards.map((item) => item.code)}>
              <DragSortList cards={cards} handleChangeShow={handleChangeShow} />
            </DndContextProvider>
          </div>
          <div className={styles.footer}>
            <div className={styles.sortTips}>({intl.formatMessage({ id: 'home.customWorkBench.sortTips' })})</div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default CustomWorkBench
