/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/consistent-type-imports */
/*
 * @Description: (注册、入库) 查看列表信息
 */
import { useEffect, useState } from 'react'
import { Table } from 'antd'
import ButtonSwitch from '@/components/ButtonSwitch'
import { ElementsItemType } from '../MemberProfile'
import { useIntl } from '@linkseeks/i18n'
import styles from './index.less'

interface ListType {
  /**
   * 新数据
   */
  currentListData: ElementsItemType[]
  /**
   * 旧数据
   */
  oldListData?: ElementsItemType[]
  /**
   * 切换卡的位置（默认false：右浮动）
   */
  tabsLocation?: boolean
}

const ListWrap: React.FC<ListType> = (props) => {
  const { currentListData, oldListData, tabsLocation } = props

  // 列表新旧数据 以及 columns
  const [tableCoumns, setTableCoumns] = useState([])
  const [tableData, setTableData] = useState([])
  const [oldTableData, setOldTableData] = useState([])

  const intl = useIntl()

  // 变更前 / 后 tabs
  const [radioValue, setRadioValue] = useState<'new' | 'old'>('new')
  const options = [
    oldTableData
      ? {
          label: intl.formatMessage({ id: 'member.components.ListWarp.new', defaultMessage: '变更前' }),
          value: 'new',
        }
      : null,
    tableData
      ? {
          label: intl.formatMessage({ id: 'member.components.ListWarp.old', defaultMessage: '变更后' }),
          value: 'old',
        }
      : null,
  ].filter(Boolean) as []

  // 切换选项卡
  const handleRadioChange = (value: 'new' | 'old') => {
    setRadioValue(value)
  }

  useEffect(() => {
    let sumColumns = [],
      sumData = [],
      oldSumData = []
    currentListData &&
      currentListData[0].flat(Infinity).forEach((item) => {
        sumColumns.push({
          title: item.fieldLocalName,
          dataIndex: item.fieldName,
          key: item.fieldValue,
          width: 520,
        })
      })

    currentListData &&
      currentListData.forEach((item, index) => {
        let obj = { key: index }
        item.map((val) => {
          obj[val.fieldName] = val.fieldValue
        })
        sumData.push(obj)
      })

    oldListData &&
      oldListData.forEach((item, index) => {
        let obj = { key: index }
        item.map((val) => {
          obj[val.fieldName] = val.fieldValue
        })
        oldSumData.push(obj)
      })

    setTableCoumns(sumColumns)
    setTableData(sumData)
    setOldTableData(oldSumData)
  }, [])

  return (
    <>
      {oldTableData.length > 0 ? (
        <div className={styles['listWrap']}>
          <div className={!tabsLocation ? styles['default'] : styles['custom']}>
            <ButtonSwitch options={options} onChange={handleRadioChange} value={radioValue} />
          </div>

          <div>
            {radioValue === 'new' ? (
              <Table rowKey="key" columns={tableCoumns} pagination={false} dataSource={oldTableData} />
            ) : null}
            {radioValue === 'old' ? (
              <Table rowKey="key" columns={tableCoumns} pagination={false} dataSource={tableData} />
            ) : null}
          </div>
        </div>
      ) : (
        <Table rowKey="key" columns={tableCoumns} pagination={false} dataSource={tableData} style={{ width: '95%' }} />
      )}
    </>
  )
}

export default ListWrap
