import React, { useState, useEffect } from 'react'
import { useIntl } from '@linkseeks/i18n'
import styles from './index.less'
import { LeftOutlined, RightOutlined, CloseOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import moment from 'moment'
import { Modal } from 'antd'
import { getManageContentNoticeFindNewestNotice } from '@apps/apis'
interface Iprops {}

const LatestAnnouces: React.FC = () => {
  const intl = useIntl()
  const [data, setData] = useState([])
  const [totalCount, setTotalCount] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [currnetNotice, setCurrnetNotice] = useState<any>({})
  const [visible, setVisible] = useState<boolean>(false)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
  })

  const getList = (params) => {
    setLoading(true)
    getManageContentNoticeFindNewestNotice(params).then(({ data, code }) => {
      setLoading(false)
      if (code === 1000) {
        setTotalCount(data.totalCount)
        setData(data.data)
      }
    })
  }

  useEffect(() => {
    getList(pagination)
  }, [])

  const handlePrev = () => {
    const data = {
      ...pagination,
      current: pagination.current - 1,
    }
    setPagination(data)
    getList(data)
  }

  const handleNext = () => {
    const data = {
      ...pagination,
      current: pagination.current + 1,
    }
    setPagination(data)
    getList(data)
  }

  const handleViewDetail = (row) => {
    setVisible(true)
    setCurrnetNotice(row)
  }
  const length = data.length
  return (
    <div className={styles.announces}>
      <div className={styles.header}>
        <div className={styles.title}>{intl.formatMessage({ id: 'home.latestAnnouces.title' })}</div>
        {length >= 6 ? (
          <div className={styles.nextOrPreview}>
            <Button
              onClick={handlePrev}
              icon={<LeftOutlined />}
              className={styles.prev}
              disabled={pagination.current <= 1}
            ></Button>
            <Button
              onClick={handleNext}
              icon={<RightOutlined />}
              disabled={pagination.current * 5 >= totalCount}
            ></Button>
          </div>
        ) : null}
      </div>
      <div className={styles.body}>
        {data.map((item, key) => {
          const date = moment(item.createTime)
          const month = date.month()
          const day = date.date()
          return (
            <div className={styles.item} key={item.id}>
              <div className={styles.date}>
                <div className={styles.month}>
                  {month + 1}
                  {intl.formatMessage({ id: 'home.latestAnnouces.month' })}
                </div>
                <div className={styles.day}>{day}</div>
              </div>
              <div className={styles.content} onClick={() => handleViewDetail(item)}>
                {item.title}
              </div>
            </div>
          )
        })}
      </div>
      <Modal
        width={800}
        visible={visible}
        footer={false}
        onCancel={() => setVisible(false)}
        closable={false}
        bodyStyle={{ padding: 0 }}
      >
        <div className={styles.notice}>
          <div className={styles.noticeHeader}>
            <div className={styles.title}>{currnetNotice.title}</div>
            <div className={styles.icon}>
              <CloseOutlined onClick={() => setVisible(false)} />
            </div>
          </div>
          <div className={styles.noticeBody}>
            <div dangerouslySetInnerHTML={{ __html: currnetNotice.content }}></div>
          </div>
          <div className={styles.noticeFooter}>
            <Button onClick={() => setVisible(false)} type={'primary'}>
              {intl.formatMessage({ id: 'home.latestAnnouces.noticeFooter' })}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default LatestAnnouces
