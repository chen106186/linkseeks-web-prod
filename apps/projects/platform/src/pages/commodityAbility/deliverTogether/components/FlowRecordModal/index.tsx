import { useState } from 'react'
import { ClockCircleOutlined } from '@ant-design/icons'
import { Button, Drawer, Table } from 'antd'
import styles from './index.less'

interface FlowRecordModalPorps {
  dataSource: any[]
  columns: any[]
}

function FlowRecordModal({ columns, dataSource = [] }: FlowRecordModalPorps) {
  const [visible, setVisible] = useState<boolean>(false)

  return (
    <div>
      <div className={styles.icon_box} onClick={() => setVisible(true)}>
        <ClockCircleOutlined />
      </div>
      <Drawer
        width={1000}
        visible={visible}
        onClose={() => setVisible(false)}
        title="流转记录"
        footer={
          <Button className={styles.drawer_footer} type="primary" onClick={() => setVisible(false)}>
            关闭
          </Button>
        }
      >
        <Table dataSource={dataSource} columns={columns} pagination={false} />
      </Drawer>
    </div>
  )
}

export default FlowRecordModal
