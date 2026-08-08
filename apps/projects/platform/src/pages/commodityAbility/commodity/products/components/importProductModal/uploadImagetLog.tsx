import React, { useEffect, useRef } from 'react'
import { StandardFormTable, LineTitle } from '@apps/components'
import { useWebIntl } from '@apps/locales'
import { getSupportDatasheetFileLogImportPage, GetSupportDatasheetFileLogImportPageResponseDetail } from '@apps/apis'
import { Button, Space } from 'antd'
import moment from 'moment'
import { downloadFileByNameAndUrl } from '@apps/utils'

interface IProps {
  tableRef: any
  visible: boolean
}

const UploadImageLog: React.FC<IProps> = ({ tableRef, visible }) => {
  const translate = useWebIntl()

  useEffect(() => {
    if (visible) {
      tableRef.current?.reload?.()
    }
  }, [visible])

  const download_txt = (filename: string, content: string, contentType?: string) => {
    if (!contentType) contentType = 'application/octet-stream'
    var a = document.createElement('a')
    var blob = new Blob([content], { type: contentType })
    a.href = window.URL.createObjectURL(blob)
    a.download = filename
    a.click()
  }

  const exportErrorLog = (exceptionContent: any[]) => {
    if (exceptionContent) {
      const fileName = `images-error-log-${new Date().getTime()}.txt`
      if (Array.isArray(exceptionContent) && exceptionContent.length > 0) {
        download_txt(
          fileName,
          exceptionContent
            .map((item) => {
              return `${translate('web.resource.commodity.wenjianlujing')}：${item.location}  ${translate(
                'web.resource.member.yuanyin',
              )}：${item.reason}`
            })
            .join('\n'),
        )
      } else {
        download_txt(fileName, JSON.stringify(exceptionContent))
      }
    }
  }

  const columns = StandardFormTable.createColumns<GetSupportDatasheetFileLogImportPageResponseDetail>([
    {
      title: translate('web.common.wenjian'),
      key: 'fileName',
      ellipsis: true,
      width: 260,
    },
    {
      title: translate('web.resource.commodity.zhixingjieguo'),
      key: 'status',
      width: 240,
      render: (status, record) => {
        switch (status) {
          case 1:
            return translate('web.resource.commodity.zhixingzhong')
          case 2:
            return `${translate('web.resource.commodity.gongtotalnumtiao', { totalNum: record.totalNum })}｜${translate(
              'web.common.success',
            )} ${record.successNum || 0} ${translate('web.common.tiao')}｜${translate('web.common.fail')} ${
              record.failNum || 0
            } ${translate('web.common.tiao')}`
          case 3:
            return translate('web.resource.commodity.xitongyichangzhixingshibai')
          default:
            return ''
        }
      },
    },
    {
      title: translate('web.common.control'),
      key: 'failResult',
      width: 220,
      render: (failResult, record) => {
        return (
          <Space>
            <Button type="link" onClick={() => downloadFileByNameAndUrl(record.fileUrl, record.fileName)}>
              <span>{translate('web.resource.commodity.xiazaiyuanwenjian')}</span>
            </Button>
            {record.status === 2 && record.failResult.length > 0 && (
              <Button type="link" onClick={() => exportErrorLog(failResult)}>
                {translate('web.resource.commodity.xiazaishibairizhi')}
              </Button>
            )}
          </Space>
        )
      },
    },
    {
      title: translate('web.common.caozuoren'),
      key: 'optUserName',
      width: 140,
    },
    {
      title: translate('web.resource.commodity.daorushijian'),
      key: 'createTime',
      width: 150,
      render: (text) => text && moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: translate('web.resource.commodity.zhixingjieshushijian'),
      key: 'completedTime',
      width: 150,
      render: (text) => text && moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
  ])

  const fetchDate = async (params) => {
    if (visible) {
      const res = await getSupportDatasheetFileLogImportPage({ ...params, bizType: 4 })
      return res
    } else {
      return {
        data: [],
        totalCount: 0,
      }
    }
  }

  const handleRefresh = () => {
    tableRef.current?.reload?.()
  }

  return (
    <div>
      <LineTitle
        extra={
          <Button type="primary" onClick={handleRefresh}>
            {translate('web.common.refresh')}
          </Button>
        }
      >
        {translate('web.resource.commodity.daoruzhixingjilu')}
      </LineTitle>
      <StandardFormTable
        actionRef={tableRef}
        bodyStyle={{ padding: 0 }}
        columns={columns}
        request={fetchDate}
        autoScrollX
        tableProps={{
          size: 'small',
        }}
      />
    </div>
  )
}

export default UploadImageLog
