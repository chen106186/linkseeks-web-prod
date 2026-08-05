import React, { useRef } from 'react'
import TableLayout from '@/components/TableLayout'
import { getIntl } from '@linkseeks/i18n'
import { ColumnType } from 'antd/lib/table/interface'
import {
  createTime,
  digest,
  endTime,
  operation,
  outerStatusName,
  qualityNo,
  receiveNo,
  startTime,
  qualityTypeName,
  vendorMemberName,
} from '../../columns'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { Button, Dropdown, Menu, Popconfirm, Space } from 'antd'
import { CaretDownOutlined, PlusOutlined } from '@ant-design/icons'
import { Link } from '@linkseeks/router-core'
import { history } from '@linkseeks/router-manager'
import { getOrderQualityGetB2BQualityOrderPage } from '@apps/apis'
import { postOrderQualitySubmit } from '@apps/apis'
import { postOrderQualityDeleteById } from '@apps/apis'
import { AuthButton } from '@apps/components'
import { customAuthUrl as AuthUrl } from '@apps/domains'

const QualityManageB2BTable: React.FC<{}> = () => {
  const intl = getIntl()
  const ref = useRef<any>({})
  /** 提交 */
  const handleSubmit = (id) => {
    postOrderQualitySubmit({ id }).then((res) => {
      if (res.code !== 1000) {
        return
      }
      ref.current.reloadCurrent()
    })
  }
  /** 删除 */
  const handleDelete = (id) => {
    postOrderQualityDeleteById({ id }).then((res) => {
      if (res.code !== 1000) {
        return
      }
      ref.current.reloadCurrent()
    })
  }

  const columns: ColumnType<any>[] = [
    {
      ...qualityNo,
      render: (_text, record) => (AuthUrl('detail') ? <Link to={`detail?id=${record?.id}`}>{_text}</Link> : _text),
    },
    {
      ...digest,
    },
    {
      ...startTime,
    },
    {
      ...endTime,
    },
    {
      ...qualityTypeName,
    },
    {
      ...receiveNo,
    },
    {
      ...vendorMemberName,
    },
    {
      ...createTime,
    },
    {
      ...outerStatusName,
    },
    {
      ...operation,
      render: (_text, record) => (
        <>
          <AuthButton type="custom" code="submit">
            <Popconfirm
              title={intl.formatMessage({
                id: 'quality.shifouyizhijianwancheng',
                defaultMessage: '是否已质检完成？提交则表示质检完成，质检完成的质检单不允许修改。',
              })}
              okText={intl.formatMessage({ id: 'quality.shi', defaultMessage: '是' })}
              cancelText={intl.formatMessage({ id: 'quality.fou', defaultMessage: '否' })}
              arrowPointAtCenter
              autoAdjustOverflow={false}
              onConfirm={() => handleSubmit(record?.id)}
            >
              <Button type="link">{intl.formatMessage({ id: 'quality.tijiao', defaultMessage: '提交' })}</Button>
            </Popconfirm>
          </AuthButton>
          <Dropdown
            overlay={() => (
              <Menu>
                {AuthUrl('edit') && (
                  <Menu.Item key="1">
                    {' '}
                    <Button type="link" href={`b2b/edit?id=${record?.id}`}>
                      {intl.formatMessage({ id: 'quality.xiugai', defaultMessage: '修改' })}
                    </Button>
                  </Menu.Item>
                )}
                {AuthUrl('del') && (
                  <Popconfirm
                    title={intl.formatMessage({
                      id: 'quality.shifoushanchudangqianzhijian',
                      defaultMessage: '是否删除当前质检单?',
                    })}
                    okText={intl.formatMessage({ id: 'quality.shi', defaultMessage: '是' })}
                    cancelText={intl.formatMessage({ id: 'quality.fou', defaultMessage: '否' })}
                    onConfirm={() => handleDelete(record?.id)}
                  >
                    <Menu.Item key="2">
                      <Button type="link">
                        {intl.formatMessage({ id: 'quality.shanchu', defaultMessage: '删除' })}
                      </Button>
                    </Menu.Item>
                  </Popconfirm>
                )}
              </Menu>
            )}
          >
            <Button type="link">
              {intl.formatMessage({ id: 'quality.gengduo', defaultMessage: '更多' })}
              <CaretDownOutlined />
            </Button>
          </Dropdown>
        </>
      ),
    },
  ]

  return (
    <TableLayout
      reload={ref}
      columns={columns}
      effects="qualityNo"
      schema={{
        type: 'object',
        properties: {
          megalayout: {
            type: 'object',
            'x-component': 'mega-layout',
            'x-component-props': {
              grid: true,
            },
            properties: {
              ctl: {
                type: 'object',
                'x-component': 'controllerBtns',
              },
              qualityNo: {
                //报价单号
                type: 'string',
                'x-component': 'Search',
                'x-mega-props': {},
                'x-component-props': {
                  placeholder: intl.formatMessage({ id: 'quality.zhijiandanhao', defaultMessage: '质检单号' }),
                },
              },
            },
          },
          [FORM_FILTER_PATH]: {
            type: 'object',
            'x-component': 'flex-layout',
            'x-component-props': {
              rowStyle: {
                flexWrap: 'nowrap',
              },
              colStyle: {
                marginLeft: 20,
              },
            },
            properties: {
              digest: {
                type: 'string',
                'x-component-props': {
                  placeholder: intl.formatMessage({
                    id: 'quality.zhijiandanzhaiyao',
                    defaultMessage: '质检单摘要',
                  }),
                },
              },
              vendorMemberName: {
                type: 'string',
                'x-component-props': {
                  placeholder: intl.formatMessage({ id: 'quality.gongyingshang', defaultMessage: '供应商' }),
                },
              },
              '[startTime,endTime]': {
                type: 'string',
                'x-component': 'DateRangePickerUnix',
                'x-component-props': {
                  placeholder: [
                    intl.formatMessage({ id: 'quality.zhijiankaishishijian', defaultMessage: '质检开始时间' }),
                    intl.formatMessage({ id: 'quality.zhijianjieshushijian', defaultMessage: '质检结束时间' }),
                  ],
                  showTime: false,
                  format: 'YYYY-MM-DD',
                },
              },
              sumbit: {
                'x-component': 'Submit',
                'x-mega-props': {
                  span: 1,
                },
                'x-component-props': {
                  children: intl.formatMessage({ id: 'quality.chaxun', defaultMessage: '查询' }),
                },
              },
            },
          },
        },
      }}
      fetch={getOrderQualityGetB2BQualityOrderPage}
      controllerBtns={
        <Space direction="horizontal" size={16}>
          <AuthButton type="add" code="add">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => history.push('/qualityAbility/qualityManage/b2b/add')}
            >
              {intl.formatMessage({ id: 'quality.xinzeng', defaultMessage: '新增' })}
            </Button>
          </AuthButton>
        </Space>
      }
    />
  )
}
export default QualityManageB2BTable
