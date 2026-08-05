import { useRef } from 'react'
import { Button } from 'antd'
import { StatusAuthButton, EditAuthButton, StandardFormTable, PageHeaderWrapper } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { useEffect } from 'react'
import { getManageAppDownloadLinkFind, postManageAppDownloadLinkUpdate } from '@apps/apis'

const AppLink = () => {
  const ref = useRef({} as ActionType)

  const handleChangeStatus = async (record) => {
    const _status = record.status === 1 ? 0 : 1
    await postManageAppDownloadLinkUpdate({ id: record.id, status: _status, link: record.link || '未设置' })
    ref.current.reload()
  }

  useEffect(() => {
    if (ref.current) {
      ref.current.reload()
    }
  }, [])

  const columns: RecordColumns<any>[] = [
    {
      title: '类型',
      key: 'title',
      dataIndex: 'title',
      render: (title: number) => (title === 1 ? 'IOS' : '安卓'),
    },
    {
      title: 'APP下载链接',
      key: 'link',
      dataIndex: 'link',
    },
    {
      title: '状态',
      key: 'status',
      dataIndex: 'status',
      fixed: 'right',
      render: (_, record: any) => (
        <StatusAuthButton
          customStyle={{ paddingLeft: 0 }}
          fieldNames="status"
          handleConfirm={() => handleChangeStatus(record)}
          record={record}
          expectTrueValue={1}
        />
      ),
    },
    {
      title: '操作',
      key: 'options',
      dataIndex: 'options',
      fixed: 'right',
      render: (_, record: any) => (
        <EditAuthButton>
          <Button
            style={{ paddingLeft: 0 }}
            type="link"
            href={`/systemManage/basicBusinessManage/appLink/edit?id=${record.id}&link=${record.link}&status=${record.status}`}
          >
            修改
          </Button>
        </EditAuthButton>
      ),
    },
  ]

  const fetchData = () => {
    return new Promise((resolve) => {
      getManageAppDownloadLinkFind().then((res) => {
        if (res.code === 1000) {
          resolve({
            data: res.data,
            totalCount: 2,
          })
        }
      })
    })
  }

  return (
    <PageHeaderWrapper>
      <StandardFormTable actionRef={ref} columns={columns} rowKey="id" request={fetchData} autoScrollX />
    </PageHeaderWrapper>
  )
}

export default AppLink
