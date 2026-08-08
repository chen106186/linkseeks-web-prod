import { ClockCircleOutlined } from '@ant-design/icons';
import { Button, Drawer, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './index.less'

interface CirculationRecordPorps {
  fetchApi: Function;
  params?: Object;
  columns: any[];
  rowKey?: string;
}

function CirculationRecords({ fetchApi, params = {}, columns, rowKey = 'id' }: CirculationRecordPorps) {
  const [visible, setVisible] = useState<boolean>(false)
  const [listData, setListData] = useState<any[]>([])

  useEffect(() => {
    if (visible && fetchApi) {
      fetchApi(params).then(({ code, data }) => {
        if (code === 1000) {
          setListData(data)
        }
      })
    }
  }, [visible])

  return (
    <div>
      <div
        className={styles['icon-box']}
        onClick={() => { setVisible(true) }}
      >
        <ClockCircleOutlined />
      </div>

      <Drawer
        width={800}
        visible={visible}
        onClose={() => setVisible(false)}
        title="流转记录"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type='primary' onClick={() => { setVisible(false) }} >关闭</Button>
          </div>
        }
      >
        <Table
          rowKey={rowKey}
          dataSource={listData}
          columns={columns}
          pagination={false}
        />
      </Drawer>
    </div>
  )
}

export default CirculationRecords;
