import React from 'react'
import { Card } from '@linkseeks/ui'
import { getIntl } from '@linkseeks/i18n'
import { Checkbox, Radio, Table } from 'antd'
import { ColumnType } from 'antd/lib/table'
import style from './index.less'

const intl = getIntl()

const Docking: React.FC<any> = (props: any) => {
  const { tableMessage = [], type = 1, selectKey = [] } = props

  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'transaction_components.xuhao', defaultMessage: '序号' }),
      key: 'index',
      dataIndex: 'index',
      render: (test, re, index) => {
        return index + 1
      },
    },
    {
      title: intl.formatMessage({
        id: 'transaction_components.huiyuanmingcheng',
        defaultMessage: '会员名称',
      }),
      key: 'memberName',
      dataIndex: 'memberName',
    },
    {
      title: intl.formatMessage({
        id: 'transaction_components.huiyuanleixing',
        defaultMessage: '会员类型',
      }),
      key: 'memberType',
      dataIndex: 'memberType',
    },
    {
      title: intl.formatMessage({
        id: 'transaction_components.huiyuanjuese',
        defaultMessage: '会员角色',
      }),
      key: 'memberRoleName',
      dataIndex: 'memberRoleName',
    },
    {
      title: intl.formatMessage({
        id: 'transaction_components.huiyuandengji',
        defaultMessage: '会员等级',
      }),
      key: 'memberGrade',
      dataIndex: 'memberGrade',
    },
  ]

  const fnGetPlainOptions = (name: string) => {
    const arr = selectKey?.map((item) => {
      return item[name]
    })
    return arr || []
  }

  return (
    <Card
      id="docking"
      title={intl.formatMessage({
        id: 'transaction_components.xuqiuduijie',
        defaultMessage: '需求对接',
      })}
    >
      <Radio.Group name="radiogroup" value={type} style={{ marginBottom: '16px' }} disabled>
        <Radio value={1}>
          {intl.formatMessage({
            id: 'transaction_components.fabuzhishangcheng',
            defaultMessage: '发布至商城',
          })}
        </Radio>
        <Radio value={2}>
          {intl.formatMessage({
            id: 'transaction_components.zhidinggongyinghuiyuan',
            defaultMessage: '指定供应会员',
          })}
        </Radio>
      </Radio.Group>
      {type === 2 && <Table columns={columns} dataSource={tableMessage} />}
      {type === 1 && (
        <div>
          <div className={style.shopWarp} style={{ marginBottom: '24px' }}>
            {' '}
            {intl.formatMessage({
              id: 'transaction_components.yifabushangcheng',
              defaultMessage: '已发布商城',
            })}
          </div>
          <Checkbox.Group options={fnGetPlainOptions('shopName')} value={fnGetPlainOptions('shopName')} disabled />
        </div>
      )}
    </Card>
  )
}

export default Docking
