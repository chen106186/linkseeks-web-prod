import { EyeAuthButton } from '@apps/components'
import React from 'react'
import { SCENE, POSITION } from '../../utils/utils'

const columns = [
  { title: 'ID', dataIndex: 'id' },
  {
    title: '图片名称',
    dataIndex: 'name',
    render: (text: string, record: any) => (
      <EyeAuthButton url={`/contentManage/imagesManagement/detail?id=${record.id}&preview=1`}>{text}</EyeAuthButton>
    ),
  },
  {
    title: '使用场景',
    dataIndex: 'useScene',
    render: (text, record) => {
      return <div>{SCENE[text]}</div>
    },
  },
  {
    title: '所在位置',
    dataIndex: 'position',
    render: (text, record) => {
      return <div>{POSITION[text]}</div>
    },
  },
  { title: '状态', dataIndex: 'status', render: '{{renderStatus}}' },
  { title: '操作', render: '{{renderOperation}}' },
]
/**
 * 图片管理列表页 schema
 */

const schema = {
  type: 'object',
  properties: {
    layout: {
      type: 'object',
      // 'x-component': 'mega-layout',
      'x-component': 'CustomFlexRowLayout',
      'x-component-props': {
        justify: 'space-between',
        align: 'center',
      },
      properties: {
        'left-layout': {
          type: 'object',
          name: 'left-layout',
          'x-component': 'CustomFlexRowLayout',
          'x-component-props': {
            justify: 'start',
            align: 'center',
          },
          properties: {
            createBtn: {
              type: 'object',
              name: 'createBtn',
              'x-component': 'createBtn',
              'x-component-props': {
                children: '新建',
                type: 'primary',
                style: {
                  width: '112px',
                  margin: '0 0 15px 0',
                },
              },
            },
          },
        },
        'right-layout': {
          type: 'object',
          name: 'rigth-layout',
          'x-component': 'CustomFlexColumnLayout',
          properties: {
            controllers: {
              type: 'object',
              name: 'controllers',
              'x-component': 'CustomFlexRowLayout',
              'x-component-props': {
                justify: 'end',
              },
              properties: {
                search: {
                  type: 'string',
                  name: 'name',
                  'x-component': 'CustomSearch',
                  'x-component-props': {
                    placeholder: '请填写图片名称',
                    onSearch: '{{search}}',
                  },
                },
                reset: {
                  type: 'string',
                  name: 'reset',
                  'x-component': 'button',
                  'x-component-props': {
                    onClick: '{{reset}}',
                    children: '重置',
                    style: {
                      margin: '0 10px',
                    },
                  },
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
      'x-component': 'Table',
      'x-component-props': {
        columns: columns,
        rowKey: 'id',
        pagination: false,
        // "rowSelection": "{{rowSelection}}"
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
