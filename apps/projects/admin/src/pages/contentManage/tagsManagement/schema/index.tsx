import React from 'react'
import { EyeAuthButton } from '@apps/components'
const columns = [
  { title: 'ID', dataIndex: 'id' },
  {
    title: '标签名称',
    dataIndex: 'name',
    render: (text: string, record: any) => (
      <EyeAuthButton url={`/contentManage/tagsManagement/detail?id=${record.id}&preview=1`}>{text}</EyeAuthButton>
    ),
  },
  { title: '标签说明', dataIndex: 'explain' },
  { title: '状态', dataIndex: 'status', render: '{{renderStatus}}', width: 120 },
  { title: '操作', render: '{{renderOperation}}', width: 150 },
]

const schema = {
  type: 'object',
  properties: {
    layout: {
      type: 'object',
      // 'x-component': 'mega-layout',
      'x-component': 'CustomFlexRowLayout',
      'x-component-props': {
        justify: 'space-between',
      },
      properties: {
        createBtn: {
          type: 'object',
          name: 'createBtn',
          'x-component': 'createBtn',
          'x-component-props': {
            children: '新建',
            type: 'primary',
          },
        },
        'right-layout': {
          type: 'object',
          name: 'rigth-layout',
          'x-component': 'CustomFlexRowLayout',
          'x-component-props': {
            justify: 'center',
          },
          properties: {
            search: {
              type: 'string',
              name: 'search',
              'x-component': 'CustomSearch',
              'x-component-props': {
                placeholder: '标签名称',
                onSearch: '{{search}}',
              },
            },
            searchBtn: {
              type: 'string',
              name: 'searchBtn',
              'x-component': 'button',
              'x-component-props': {
                onClick: '{{reset}}',
                children: '重置',
                style: {
                  marginLeft: '15px',
                },
              },
            },
          },
        },
      },
    },
    table: {
      key: 'table',
      type: 'object',
      name: 'table',
      'x-component': 'table',
      'x-component-props': {
        dataSource: [],
        columns: columns,
        rowKey: 'id',
        pagination: false,
      },
    },
    pagination: {
      type: 'object',
      'x-component': 'TablePagination',
      'x-style': {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
      },
      'x-component-props': {
        showQuickJumper: true,
        pageSize: 10,
        size: 'small',
      },
    },
  },
}

export default schema
