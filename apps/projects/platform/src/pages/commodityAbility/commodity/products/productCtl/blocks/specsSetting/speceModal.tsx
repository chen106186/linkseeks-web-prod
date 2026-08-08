import { useMemoizedFn, usePagination, useSelections, useToggle } from '@linkseeks/hooks'
import { Table, Modal, Select } from '@linkseeks/ui'
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react'
import { isEqual, omit } from 'lodash'
import { SpecsAttributeTableRow, useProductForm } from '@apps/services/commodity'
import { StandardFormTable, useTableSelection } from '@apps/components'
import { useWebIntl } from '@apps/locales'
import { getDiffDataSource } from './getDiffDataSource'

// 选择商品规格
/**
 *
 * 	1. 展示数据：
			【规格属性】配置中，选择的所有属性值的排列组合；
			已被选取作为商品规格的组合，不展示在当前弹窗展示
			属性名作为列标题，行数据为该属性已选择属性值；
		2. 操作定义：
		表头筛选操作：
			筛选该列下属性值；
		行选择操作：
			可多选行，分页情况下可跨页多选
		确认操作：
			将选中的组合回显到商品规格中
 */
const SpecsModal = forwardRef<any>((props, ref) => {
  // ----
  const [visible, toggle] = useToggle()
  const { specsSettingDataSource, specsAttributeSKU, setSpecsSelections, handleChangeDataSource } = useProductForm()
  const [columns, setColumns] = useState<any[]>([])
  const [dataSource, setDataSource] = useState<any[]>([])
  // const { selected, setSelected, select, unSelect, isSelected } = useSelections<any>([])
  const { rowSelection, setSelected, selected, onRow } = useTableSelection({
    getRowKey: (record) => record.getRowKey(),
  })
  const translate = useWebIntl()
  useImperativeHandle(ref, () => {
    return {
      toggle() {
        if (specsAttributeSKU.current) {
          // 这里需要过滤一下已经处于选中状态的数据项,
          const attributeDataSource = specsAttributeSKU.current?.generateSKUData()
          // 生成的是sku数据列表
          setDataSource(attributeDataSource || [])
          setColumns(specsAttributeSKU.current?.generateSKUColumns(true) || [])
          toggle()

          const selectedKeys = specsSettingDataSource.map((v) => v.getRowKey())
          // 回填一下已经选中的值, 这里会在context文件中，由规格设置的表格改动而自动变更
          setSelected(selectedKeys)
        }
      },
    }
  })

  // const onRow = useMemoizedFn((record: SpecsAttributeTableRow) => {
  //   return {
  //     // 出现勾选项时，支持点击当前行也可自动勾选
  //     onClick(e) {
  //       const id = record.getRowKey()
  //       // fix 由于表格中有些控件会冒泡上来导致勾选事件触发，这里做写死判断
  //       if (e.target.classList.contains('ant-table-cell')) {
  //         if (isSelected(id)) {
  //           unSelect(id)
  //         } else {
  //           select(id)
  //         }
  //       }
  //     },
  //   }
  // })
  // const rowSelection = {
  //   selectedRowKeys: selected,
  //   onChange(selectedRowKeys) {
  //     setSelected(selectedRowKeys)
  //   },
  // }

  // 选择规格时的提交
  const handleSubmit = () => {
    toggle()
    console.log(selected, 'selected')
    setSpecsSelections(selected)
    handleChangeDataSource(selected)
  }

  const renderTable = () => {
    // 过滤解决已经选中的规格，不需要再次回显到弹窗中
    return getDiffDataSource(dataSource, specsSettingDataSource)
  }
  const dataRenderSource = renderTable()

  return (
    <Modal
      title={translate('web.resource.commodity.xuanzeshanpinguige')}
      closable
      open={visible}
      onCancel={toggle}
      onOk={handleSubmit}
      width={1200}
    >
      <Table
        columns={columns}
        dataSource={dataRenderSource}
        rowKey={(record) => record.getRowKey()}
        // pagination={false}
        rowSelection={rowSelection}
        onRow={onRow}
        scroll={{ x: columns.length * 200 }}
      />
    </Modal>
  )
})

export default SpecsModal
