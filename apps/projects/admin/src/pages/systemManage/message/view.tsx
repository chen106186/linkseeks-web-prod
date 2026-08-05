import React, { useState, useEffect, useCallback } from 'react'
import { Button, Card, Avatar, List } from 'antd'
import { history } from '@linkseeks/router-manager'
import styles from './index.less'
import StatusTag from '@/components/StatusTag'
import { PlusOutlined } from '@ant-design/icons'
import msg_system from '@/assets/msg_system.png'
import msg_platform from '@/assets/msg_platform.png'
import { formatTimeString } from '@/utils'
import { BookOutlined, ReadOutlined } from '@ant-design/icons'
import { AddAuthButton, AuthButton } from '@apps/components'
import { getSupportPlatformPage, postSupportPlatformRead, postSupportPlatformReadAll } from '@apps/apis'

const Message: React.FC<{}> = () => {
  const [dataSource, setDataSource] = useState<any>([])
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  })

  useEffect(() => {
    getList(pagination)
  }, [])

  const getList = useCallback(async (params) => {
    const { data, code } = await getSupportPlatformPage(params)
    if (code === 1000) {
      setDataSource(data)
    }
  }, [])

  const handlePaginationChange = (page: number, pageSize?: number) => {
    setPagination((state) => ({ ...state, current: page, pageSize: pageSize || 10 }))
    getList({ current: page, pageSize })
  }

  const handleRead = (id, url: string) => {
    postSupportPlatformRead({ id: id }, { ctlType: 'none' }).then((data) => {
      if (url) {
        if (/http/.test(url)) {
          location.href = url
        } else {
          history.push(url)
        }
        return
      }
      if (data.code === 1000) {
        getList(pagination)
      }
    })
  }

  const handleAllMessageRead = () => {
    postSupportPlatformReadAll().then(({ code, data }) => {
      if (code === 1000) {
        getList(pagination)
      }
    })
  }

  const renderMessage = (data) => {
    return (
      <div onClick={() => handleRead(data.id, data.url)} style={{ cursor: 'pointer' }}>
        <StatusTag type={data.type == 1 ? 'primary' : 'success'} title={data.type === 1 ? '系统消息' : '平台消息'} />
        <span
          className={styles.messageTitle}
          style={{
            minWidth: '100px',
            fontWeight: 600,
            color: !data.isRead ? '#303133' : '#91959B',
            marginRight: '15px',
          }}
        >
          {data.title || ''}
        </span>
        <span
          className={styles.messageText}
          style={{ color: !data.isRead ? '#303133' : '#91959B', marginRight: '15px' }}
        >
          {data.content || ''}
        </span>
      </div>
    )
  }

  const showTotal = (total) => {
    return `共 ${total} 条`
  }
  return (
    <Card>
      <div className={styles.header}>
        <AddAuthButton>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => history.push('/systemManage/message/add')}>
            新建
          </Button>
        </AddAuthButton>
        {dataSource?.totalCount > 0 ? (
          <AuthButton type="custom" code="allRead">
            <Button type="link" onClick={handleAllMessageRead}>
              全部已读
            </Button>
          </AuthButton>
        ) : null}
      </div>
      <List
        itemLayout="horizontal"
        dataSource={dataSource.data}
        className={styles.customList}
        pagination={{
          onChange: handlePaginationChange,
          current: pagination.current,
          pageSize: pagination.pageSize,
          size: 'small',
          showQuickJumper: true,
          total: dataSource?.totalCount || 0,
          showTotal: showTotal,
        }}
        renderItem={(item: any) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={item.type == 1 ? msg_system : msg_platform} />}
              title={renderMessage(item)}
            />
            <div className={styles.section}>
              {item.isRead ? (
                <ReadOutlined style={{ fontSize: '24px', color: '#909090' }} />
              ) : (
                <BookOutlined style={{ fontSize: '20px', color: '#909090' }} />
              )}
              <span className={styles.time}>{formatTimeString(item.sendTime)}</span>
            </div>
          </List.Item>
        )}
      />
    </Card>
  )
}

export default Message
