import React, { useState } from 'react'
import { PageHeaderWrapper, RecordColumns, StandardFormTable, EditAuthButton, DetailAuthButton } from '@apps/components'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { Button, Modal, Space, Tree } from '@linkseeks/ui'
import { getProductCommoditySalesAreaTemplateList, getProductCommoditySalesAreaList } from '@apps/apis'
import { SalesAreaItem } from './form'

const SalesAreaTemplate: React.FC = () => {
  const intl = useIntl()
  const [visible, setVisible] = useState<boolean>(false)
  const [salesAreaList, setSalesAreaList] = useState<SalesAreaItem[]>([])

  const columns: RecordColumns<any>[] = [
    {
      title: intl.formatMessage({
        id: 'commodity.salesAreaTemplate.columns.id',
        defaultMessage: '模板ID',
      }),
      width: 130,
      key: 'id',
    },
    {
      title: intl.formatMessage({
        id: 'commodity.salesAreaTemplate.columns.name',
        defaultMessage: '模板名称',
      }),
      key: 'name',
    },
    {
      title: intl.formatMessage({
        id: 'commodity.salesAreaTemplate.columns.remark',
        defaultMessage: '模板备注',
      }),
      key: 'remark',
    },
    {
      title: intl.formatMessage({
        id: 'commodity.salesAreaTemplate.columns.mode',
        defaultMessage: '限制模式',
      }),
      key: 'limitWay',
      render: (limitWay) => {
        return limitWay === 1
          ? intl.formatMessage({
              id: 'commodity.salesAreaTemplate.columns.mode.1',
              defaultMessage: '只配送选择区域',
            })
          : intl.formatMessage({
              id: 'commodity.salesAreaTemplate.columns.mode.2',
              defaultMessage: '不配送选择区域',
            })
      },
    },
    {
      title: intl.formatMessage({
        id: 'common.table.action',
        defaultMessage: '操作',
      }),
      key: 'options',
      fixed: 'right',
      width: 180,
      render: (_, record) => (
        <Space>
          <EditAuthButton>
            <Button
              type="link"
              onClick={() => {
                history.push(`/commodityAbility/commodity/salesAreaTemplate/edit?id=${record.id}`)
              }}
            >
              {intl.formatMessage({
                id: 'common.button.edit',
                defaultMessage: '编辑',
              })}
            </Button>
          </EditAuthButton>
          <DetailAuthButton>
            <Button type="link" onClick={() => handleLookUpArea(record.id)}>
              {intl.formatMessage({
                id: 'commodity.salesAreaTemplate.button.lookup',
                defaultMessage: '查看区域',
              })}
            </Button>
          </DetailAuthButton>
        </Space>
      ),
    },
  ]

  /**
   * 查看区域
   */
  const handleLookUpArea = (id: string) => {
    getProductCommoditySalesAreaList({ templateId: id }).then((res) => {
      if (res.data) {
        setSalesAreaList(res.data as SalesAreaItem[])
        setVisible(true)
      }
    })
  }

  const fetchData = (params) => {
    const searchParams = {
      ...params,
    }

    return new Promise((resolve) => {
      getProductCommoditySalesAreaTemplateList(searchParams, { ctlType: 'none' }).then((res) => {
        const { data } = res
        resolve(data)
      })
    })
  }

  return (
    <PageHeaderWrapper>
      <StandardFormTable
        request={(params) => fetchData(params)}
        columns={columns}
        autoScrollX
        searchButtons={[
          {
            children: intl.formatMessage({
              id: 'commodity.salesAreaTemplate.button.add',
              defaultMessage: '新建模板',
            }),
            type: 'primary',
            key: 'add',
            icon: 'add',
            onClick() {
              history.push(`/commodityAbility/commodity/salesAreaTemplate/add`)
            },
          },
        ]}
      />
      <Modal
        open={visible}
        onCancel={() => setVisible(false)}
        title={intl.formatMessage({
          id: 'commodity.salesAreaTemplate.button.lookup',
          defaultMessage: '查看区域',
        })}
        footer={null}
      >
        <Tree
          fieldNames={{
            title: 'name',
            key: 'id',
          }}
          treeData={salesAreaList as any[]}
        />
      </Modal>
    </PageHeaderWrapper>
  )
}

export default SalesAreaTemplate
