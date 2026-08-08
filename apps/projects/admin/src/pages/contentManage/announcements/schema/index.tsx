import { EyeAuthButton } from '@apps/components'
import { DownOutlined } from '@ant-design/icons'
import { TimeList } from '../../statusList'
import { formatTimeString } from '@/utils'
import React from 'react'
import { ANNOUNCE_COLUMN_TYPE, transfer2Options } from '../../utils/utils'

const ALL = [{ label: '栏目（全部）', value: 0 }]
const COLUMNSOPTIONS = ALL.concat(transfer2Options(ANNOUNCE_COLUMN_TYPE))

const columns = [
  { title: 'ID', dataIndex: 'id' },
  {
    title: '栏目',
    dataIndex: 'columnType',
    render: (text, record) => {
      return <div>{ANNOUNCE_COLUMN_TYPE[text]}</div>
    },
  },
  {
    title: '标题',
    dataIndex: 'title',
    render: (text: string, record: any) => (
      <EyeAuthButton url={`/contentManage/announcements/detail?id=${record.id}&preview=1`}>{text}</EyeAuthButton>
    ),
  },
  {
    title: '发布时间',
    dataIndex: 'createTime',
    render: (text) => formatTimeString(text),
  },
  { title: '状态', dataIndex: 'status', render: '{{renderStatus}}' },
  { title: '操作', render: '{{renderOperation}}' },
]
/**
 * 公告管理列表也 schemat
 */

const announcementSchema = {
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
                    placeholder: '请填写标题名称',
                    onSearch: '{{search}}',
                  },
                },
                HIGHT_FILTER_BTN: {
                  type: 'string',
                  name: 'HIGHT_FILTER_BTN',
                  'x-component': 'button',
                  'x-component-props': {
                    children: (
                      <div>
                        高级搜索 <DownOutlined />
                      </div>
                    ),
                    onClick: '{{toggleFilters}}',
                    style: {
                      margin: '0 15px',
                    },
                  },
                },
                reset: {
                  type: 'string',
                  name: 'reset',
                  'x-component': 'button',
                  'x-component-props': {
                    onClick: '{{reset}}',
                    children: '重置',
                  },
                },
              },
            },
            FILTERS: {
              type: 'object',
              name: 'FILTERS',
              'x-component': 'CustomFlexRowLayout',
              'x-component-props': {
                justify: 'end',
              },
              properties: {
                columnType: {
                  type: 'string',
                  'x-component': 'Select',
                  'x-component-props': {
                    style: {
                      width: '160px',
                    },
                    options: COLUMNSOPTIONS,
                    defaultValue: 0,
                  },
                },
                status: {
                  name: 'status',
                  type: 'string',
                  'x-component': 'Select',
                  'x-component-props': {
                    options: [
                      { label: '状态（全部）', value: '0' },
                      { label: '待上架', value: '1' },
                      { label: '已上架', value: '2' },
                      { label: '已下架', value: '3' },
                    ],
                    defaultValue: '0',
                    placeholder: '请选择状态',
                    style: {
                      width: '160px',
                      margin: '0 15px',
                    },
                  },
                },
                time: {
                  name: 'time',
                  type: 'string',
                  'x-component': 'Select',
                  'x-component-props': {
                    placeholder: '发布时间（全部）',
                    options: TimeList,
                    style: {
                      width: '160px',
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
        // "pagination": {
        // 	showQuickJumper: true,
        //   size: "small",
        //   "onChange": "{{paginationChange}}",
        // },
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

export default announcementSchema
