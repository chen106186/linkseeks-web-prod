import React, { useRef } from 'react'
import { Button } from 'antd'
import { history } from '@linkseeks/router-manager'
import { StatusAuthButton, EditAuthButton, StandardFormTable, PageHeaderWrapper, ImageBox } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { getManageParameterManagePage, postManageParameterManageUpdateState } from '@apps/apis'
import { useWebIntl } from '@apps/locales'

const SensitiveWords: React.FC = () => {
  const translate = useWebIntl()

  const ref = useRef({} as ActionType)
  /**切换状态 */
  const handleChangeStatus = async (id: any, status: any) => {
    const _status = status === 1 ? 0 : 1
    await postManageParameterManageUpdateState({ id: id, state: _status })
    ref.current.reload()
  }
  const columns: RecordColumns<any>[] = [
    {
      title: translate('web.resource.systemManage.canshubianhao'),
      key: 'code',
      dataIndex: 'code',
    },
    {
      title: translate('web.resource.systemManage.canshumingcheng'),
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: translate('web.resource.systemManage.canshumiaoshu'),
      key: 'details',
      dataIndex: 'details',
    },
    {
      title: translate('web.resource.systemManage.canshuzhi'),
      key: 'parameterValue',
      dataIndex: 'parameterValue',
      width: 300,
      render: (parameterValue, record) => {
        if (record.code === 'A10') {
          return <ImageBox style={{ display: 'flex' }} preview width={145} height={50} src={parameterValue} />
        } else if (record.code === 'A11') {
          if (parameterValue) {
            const parameter = JSON.parse(parameterValue)

            return (
              <div>
                {Array.isArray(parameter?.value) &&
                  parameter?.value.map((item) => (
                    <p>
                      <span>{item.language}：</span>
                      <label>{item.value}</label>
                    </p>
                  ))}
                <span>{parameter?.url ? `备案跳转地址：${parameter?.url}` : ''}</span>
              </div>
            )
          }
          return ''
        } else if (record.code === 'A12') {
          return ''
        } else {
          if (record.code === 'A07') {
            const arr = [
              translate('web.resource.systemManage.xushenhe'),
              translate('web.resource.systemManage.wuxushenhe'),
            ]
            return arr[+parameterValue]
          }
          return parameterValue
        }
      },
    },
    /* {
      title: '状态',
      key: 'state',
      dataIndex: 'state',
      fixed: 'right',
      render: (text: any, record: any) => (
        <StatusAuthButton
          customStyle={{ paddingLeft: 0 }}
          fieldNames="state"
          handleConfirm={() => handleChangeStatus(record.id, record.state)}
          record={record}
          expectTrueValue={1}
        />
      ),
    }, */
    {
      title: translate('web.common.control'),
      key: 'options',
      dataIndex: 'options',
      fixed: 'right',
      render: (text: any, record: any) => (
        <EditAuthButton>
          <Button
            style={{ paddingLeft: 0 }}
            type="link"
            onClick={() =>
              history.push(
                `/systemManage/basicBusinessManage/platformArg/edit?id=${record.id}&code=${record.code}${
                  record.code !== 'A12' ? `&parameterValue=${record.parameterValue}` : ''
                }`,
              )
            }
          >
            {translate('web.common.change')}
          </Button>
        </EditAuthButton>
      ),
    },
  ]

  /**获取单位列表数据 */
  const fetchData = (params: any) => {
    return new Promise((resolve) => {
      getManageParameterManagePage({ ...params }).then((res) => {
        if (res.code === 1000) {
          resolve(res.data)
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
export default SensitiveWords
