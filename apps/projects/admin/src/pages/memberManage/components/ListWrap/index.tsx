import { useEffect, useState } from 'react'
import { Table } from 'antd'

type ElementsItemType = {
  /**
   * 分组内的字段顺序
   */
  fieldOrder?: number
  /**
   * 字段类型
   */
  fieldType?: string
  /**
   * 字段中文名称
   */
  fieldLocalName?: string
  /**
   * 字段值
   */
  fieldValue?: string
  /**
   * 修改之前的值，如果没有为空字符串
   */
  lastValue?: string
  /**
   * fieldType为list的数据
   */
  registers?: ElementsItemType[]
}

interface ListType {
  currentListData: ElementsItemType[]
}

interface Columns {
  title: string
  dataIndex: any
  key: any
  width: number
  [props: string]: any
}

const ListWrap: React.FC<ListType> = (props) => {
  const { currentListData } = props

  // 列表新旧数据 以及 columns
  const [tableCoumns, setTableCoumns] = useState<Columns[]>([])
  const [tableData, setTableData] = useState([])

  useEffect(() => {
    let sumColumns: Columns[] = [],
      sumData = []
    currentListData.length &&
      currentListData[0].forEach((item) => {
        sumColumns.push({
          title: item.fieldLocalName,
          dataIndex: item.fieldName,
          key: item.fieldValue,
          width: 520,
        })
      })

    currentListData.length &&
      currentListData.forEach((item) => {
        let obj = {}
        item.map((val) => {
          obj[val.fieldName] = val.fieldValue
          obj.key = val.fieldOrder
        })
        sumData.push(obj)
      })

    setTableCoumns(sumColumns)
    setTableData(sumData)
  }, [currentListData])

  return <Table rowKey="key" columns={tableCoumns} pagination={false} dataSource={tableData} style={{ width: '95%' }} />
}

export default ListWrap
