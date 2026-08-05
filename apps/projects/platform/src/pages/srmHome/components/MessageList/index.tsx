/**
 * @Description 消息提醒
 */
import React, { useEffect, useState } from 'react'
import { history } from '@linkseeks/router-manager'
import { List, Space, Button, Spin, Tooltip } from 'antd'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import moment from 'moment'
import { getSupportMessagePage, GetSupportMessagePageResponseDetail, postSupportMessageRead } from '@apps/apis'
import { checkMore } from '@/utils'
import MellowCard from '@/components/MellowCard'
import styles from './index.less'
import { useWebIntl } from '@apps/locales'

const PAGE_SIZE = 5

interface ListParams {
  /**
   * 页数
   */
  current?: string
}

const TodoCard: React.FC = () => {
  const [list, setList] = useState<GetSupportMessagePageResponseDetail[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const translate = useWebIntl()
  const fetchMsgList = (extraParams?: ListParams): Promise<GetSupportMessagePageResponseDetail[]> => {
    setLoading(true)
    const compoundedCurrent = +extraParams?.current || currentPage
    return new Promise((resolve, reject) => {
      getSupportMessagePage({
        current: `${currentPage}`,
        pageSize: `${PAGE_SIZE}`,
        ...extraParams,
      })
        .then((res) => {
          if (res.code === 1000) {
            setHasMore(checkMore(compoundedCurrent, PAGE_SIZE, (res.data.data || []).length, res.data.totalCount))
            resolve(res.data.data)
          } else {
            reject()
          }
        })
        .catch(() => {
          reject()
        })
        .finally(() => {
          setLoading(false)
        })
    })
  }

  useEffect(() => {
    fetchMsgList()
      .then((res) => {
        setList(res)
      })
      .catch(() => {})
  }, [])

  const handlePaginationChange = (action: 'next' | 'prev') => {
    if (loading || (!hasMore && action === 'next')) {
      return
    }
    const nextPage = action === 'next' ? currentPage + 1 : currentPage - 1
    setCurrentPage(nextPage)
    fetchMsgList({ current: `${nextPage}` })
      .then((res) => {
        setList(res)
      })
      .catch(() => {})
  }

  /**
   * 搬运消息列表的逻辑
   */
  const handleRead = async (id: number, url: string) => {
    const { code } = await postSupportMessageRead({ id: id }, { ctlType: 'none' })
    if (code !== 1000) {
      return
    }
    if (url) {
      if (/http/.test(url)) {
        location.href = url
      } else {
        history.push(url)
      }
    } else {
      fetchMsgList()
        .then((res) => {
          setList(res)
        })
        .catch(() => {})
    }
  }

  return (
    <MellowCard
      title={<div className={styles['message-title']}>{translate('web.resource.srmHome.messageNotice')}</div>}
      extra={
        <Space>
          <Button
            disabled={currentPage === 1 || loading}
            icon={<LeftOutlined />}
            onClick={() => handlePaginationChange('prev')}
          />
          <Button
            disabled={loading || !hasMore}
            icon={<RightOutlined />}
            onClick={() => handlePaginationChange('next')}
          />
        </Space>
      }
    >
      <Spin spinning={loading}>
        <List
          className={styles['message-list']}
          itemLayout="horizontal"
          dataSource={list}
          renderItem={(item) => (
            <Tooltip title={item.content}>
              <div className={styles['message-item']} onClick={() => handleRead(item.id, item.url)}>
                <div className={styles['message-item-content']}>{item.content}</div>
                <div className={styles['message-item-date']}>{moment(item.sendTime).format('YYYY-MM-DD HH:mm')}</div>
              </div>
            </Tooltip>
          )}
          bordered={false}
        />
      </Spin>
    </MellowCard>
  )
}

export default TodoCard
