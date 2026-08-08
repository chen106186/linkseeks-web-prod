import React, { useState, useEffect, useCallback } from 'react'
import { history } from '@linkseeks/router-manager'
import { useLocation } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { Card, List, Avatar, Button } from 'antd'
import styles from './index.less'
import { PageHeaderWrapper } from '@apps/components'
import StatusTag from '@/components/StatusTag'
import { formatTimeString } from '@/utils'
import msg_system from '@/assets/imgs/msg_system.png'
import msg_platform from '@/assets/imgs/msg_platform.png'
import { BookOutlined, ReadOutlined } from '@ant-design/icons'
import {
  getSupportMessagePage,
  GetSupportMessagePageRequest,
  postSupportMessageRead,
  postSupportMessageReadAll,
} from '@apps/apis'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
const Message: React.FC<{}> = () => {
  const intl = useIntl()
  const { pathname } = useLocation()
  const [dataSource, setDataSource] = useState<any>({ totalCount: 0, data: [] })
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  })

  useEffect(() => {
    // @ts-ignore
    getList(pagination)
  }, [])

  const getList = useCallback(async (params: GetSupportMessagePageRequest) => {
    const { data, code } = await getSupportMessagePage(params)
    if (code === 1000) {
      setDataSource(data)
    }
  }, [])

  const handlePaginationChange = (page: number, pageSize: number) => {
    setPagination({ current: page, pageSize })
    getList({ current: page.toString(), pageSize: pageSize.toString() })
  }

  const handleRead = async (id: number, url: string) => {
    const { data, code } = await postSupportMessageRead({ id: id }, { ctlType: 'none' })
    if (authUrl(pathname, 'custom', 'see')) {
      if (url) {
        if (/http/.test(url)) {
          location.href = url
        } else {
          history.push(url)
        }
      } else {
        getList({
          current: pagination.current.toString(),
          pageSize: pagination.pageSize.toString(),
        })
      }
    }
  }
  const handleAllMessageRead = async () => {
    const { data, code } = await postSupportMessageReadAll()
    if (code === 1000) {
      getList({
        current: pagination.current.toString(),
        pageSize: pagination.pageSize.toString(),
      })
    }
  }

  const renderMessage = (data) => {
    const type = data.type
    return (
      <>
        <StatusTag
          type={type == 1 ? 'primary' : 'success'}
          title={
            type == 1
              ? intl.formatMessage({ id: 'systemSetting.message.systemMessage' })
              : intl.formatMessage({ id: 'systemSetting.message.plaformMessage' })
          }
        />
        <span
          className={styles.messageTitle}
          style={{
            minWidth: '100px',
            fontWeight: 600,
            color: !data.isRead ? '#303133' : '#91959B',
            marginRight: '15px',
          }}
        >
          {data.title}
        </span>
        <span
          className={styles.messageText}
          style={{ color: !data.isRead ? '#303133' : '#91959B', marginRight: '15px' }}
          onClick={() => handleRead(data.id, data.url)}
        >
          {data.content}
        </span>
      </>
    )
  }

  const showTotal = (total) => {
    return `${intl.formatMessage({ id: 'systemSetting.message.total' })} ${total} ${intl.formatMessage({
      id: 'systemSetting.message.numble',
    })}`
  }

  return (
    <PageHeaderWrapper>
      <Card
        title={intl.formatMessage({ id: 'systemSetting.message.messageList' })}
        extra={
          dataSource?.totalCount > 0 ? (
            <AuthButton type="custom" code="allRead">
              {' '}
              <Button type="link" onClick={handleAllMessageRead}>
                {intl.formatMessage({ id: 'systemSetting.message.allRead' })}
              </Button>
            </AuthButton>
          ) : null
        }
      >
        <List
          itemLayout="horizontal"
          dataSource={dataSource.data}
          className={styles.customList}
          pagination={{
            onChange: handlePaginationChange,
            pageSize: pagination.pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            total: dataSource.totalCount,
            showTotal: showTotal,
            current: pagination.current,
          }}
          renderItem={(item: any) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={item.type == 1 ? msg_system : msg_platform} />}
                title={renderMessage(item)}
              />
              <div className={styles.section}>
                {!item.isRead ? (
                  <BookOutlined style={{ fontSize: '20px', color: '#909090' }} />
                ) : (
                  <ReadOutlined style={{ fontSize: '24px', color: '#909090' }} />
                )}
                <span className={styles.time}>{formatTimeString(item.sendTime)}</span>
              </div>
            </List.Item>
          )}
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default Message
