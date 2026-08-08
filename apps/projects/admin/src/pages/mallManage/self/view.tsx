import React, { useState, useRef } from 'react'
import { Switch, Popconfirm, Button } from '@linkseeks/ui'
import { SetUpIcon } from '@linkseeks/icons'
import defaultLogo from '@/assets/default_logo.jpg'
import { AuthButton, ImageBox, PageHeaderWrapper, RecordColumns, StandardFormTable } from '@apps/components'
import { GetCommodityShopSelfShopListResponseDetail, getCommodityShopSelfShopList } from '@apps/apis'
import { history } from '@linkseeks/router-manager'
import { customAuthUrl } from '@apps/domains'
import { ENVIRONMENT_NAME } from '@apps/constants'
import useEditSelfMall from '../services/hooks/useEditSelfMall'
import MallModal from '../services/components/MallModal'
import { MallItemType } from '../services/types'
import MemberInfo from '../services/components/MemberInfo'
import useSelfModelOptions from '../services/hooks/useSelfModelOptions'

const Self: React.FC = () => {
  const tableRef = useRef<any>({})
  const { editVisible, setEditVisible, editForm, saveLoading, editMallInfo, changeMallState } = useEditSelfMall({
    refreshFn: () => {
      tableRef.current?.reload()
    },
  })
  const [editInfo, setEditInfo] = useState<any>()
  const selectData = useSelfModelOptions()

  const fetchData = async (params: any) => {
    const res = await getCommodityShopSelfShopList(params)
    if (res.code === 1000) {
      return res.data
    }
    return { data: [], totalCount: 0 }
  }

  const columns: RecordColumns<GetCommodityShopSelfShopListResponseDetail>[] = [
    {
      title: '会员名称',
      key: 'memberName',
      hidden: true,
      searchField: {
        main: true,
      },
    },
    {
      title: '会员ID',
      key: 'memberId',
      hidden: true,
      searchField: 'Input',
    },
    {
      title: '商城ID',
      key: 'id',
      fixed: 'left',
      width: 70,
    },
    {
      title: '商城LOGO',
      key: 'logoUrl',
      fixed: 'left',
      width: 100,
      render: (logoUrl) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ImageBox width={32} height={32} src={logoUrl || defaultLogo} />
        </div>
      ),
    },
    {
      title: '商城名称',
      key: 'selfShopModelId',
      dataIndex: 'name',
      fixed: 'left',
      width: 180,
      searchField: 'Select',
    },
    {
      title: '商城环境',
      key: 'environment',
      width: 90,
      render: (environment) => ENVIRONMENT_NAME[environment],
    },
    {
      title: '国家/地区｜语言｜币种',
      key: 'language',
      width: 200,
      render: (_, record) => (
        <span>
          {record.country}｜{record.language}｜{record.currency}
        </span>
      ),
    },
    {
      title: '商城描述',
      key: 'describe',
      ellipsis: true,
    },
    {
      title: '归属会员',
      key: 'memberName',
      render: (_, record) => <MemberInfo data={record} />,
    },
    {
      title: '创建时间',
      key: 'createTime',
      format: 'Date',
      width: 160,
    },
    {
      title: '商城状态',
      key: 'enabled',
      fixed: 'right',
      width: 100,
      render: (enabled, record) => {
        return (
          <AuthButton type="custom" code="enabled">
            {enabled ? (
              <Popconfirm
                title="停用商城后该商城将不允许再被访问！"
                onConfirm={() => {
                  changeMallState(record.id, false)
                }}
                okText="确认"
                cancelText="取消"
              >
                <Switch checked />
              </Popconfirm>
            ) : (
              <Switch checked={false} onClick={() => changeMallState(record.id, true)} />
            )}
          </AuthButton>
        )
      },
    },
    {
      title: '操作',
      key: 'id',
      fixed: 'right',
      width: 80,
      format: 'Control',
      formatPayload: {
        controlList: [
          {
            children: '编辑',
            key: 'edit',
            show: () => customAuthUrl('edit'),
            onClick: (record) => {
              setEditInfo(record)
              setEditVisible(true)
            },
          },
        ],
      },
    },
  ]

  return (
    <PageHeaderWrapper
      backDom={false}
      extra={
        <AuthButton type="custom" code="configure">
          <Button
            type="normal"
            onClick={() => history.push('/mallManage/self/configure')}
            icon={<SetUpIcon size={20} />}
          />
        </AuthButton>
      }
    >
      <StandardFormTable
        actionRef={tableRef}
        request={(params) => fetchData(params)}
        autoScrollX
        columns={columns}
        searchSelectMaps={selectData}
        searchButtons={
          customAuthUrl('allocation')
            ? [
                {
                  children: '分配自营商城',
                  type: 'primary',
                  onClick: () => {
                    history.push('/mallManage/self/allocation')
                  },
                },
              ]
            : []
        }
      />
      <MallModal
        form={editForm}
        visible={editVisible}
        mallInfo={editInfo as unknown as MallItemType}
        setVisible={setEditVisible}
        saveLoading={saveLoading}
        onOk={editMallInfo}
      />
    </PageHeaderWrapper>
  )
}

export default Self
