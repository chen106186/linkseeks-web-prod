import { useState, useEffect } from 'react'
import { ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import { generateRemarkTable } from '../constant'
import RemarkTableCell, { RemarkEditableRow } from '../components/remarkTableCell'
import { getPurchaseExpertExtractRecordGetSubmitTenderMemberList, getPurchaseTemplateGetTemplate } from '@apps/apis'

/**
 * @param ctx schemaAction
 * data: 详情数据
 */
export const useRemarkTable = (ctx: ISchemaFormActions | ISchemaFormAsyncActions, data: any) => {
  const [remarkColumns, setRemarkColumns] = useState<any>([])

  // 获取投标会员和模板整合成评标 table
  useEffect(() => {
    if (data?.inviteTender?.id) {
      const getMemberFn = getPurchaseExpertExtractRecordGetSubmitTenderMemberList({
        inviteTenderId: data.inviteTender.id,
      })
      const getCommodityFn = getPurchaseTemplateGetTemplate({ id: data.inviteTender.templateId })
      Promise.all([getMemberFn, getCommodityFn]).then((values) => {
        console.log(values, 'all')
        const { code: memberCode, data: memberData } = values[0]
        const { code: contentCode, data: contentData } = values[1]
        if (
          memberCode === 1000 &&
          contentCode === 1000 &&
          memberData?.length &&
          contentData.templateContentList?.length
        ) {
          const { templateContentList } = contentData
          // 生成在线评标表格
          const { columns, dataSource } = generateRemarkTable(memberData, templateContentList)
          console.log(columns, dataSource, 11)
          setRemarkColumns(columns)
          ctx.setFieldValue('evaluationTenderList', dataSource)
          // 存入备用
          ctx.setFieldValue('membertList', memberData)
          ctx.setFieldValue('templateContentList', templateContentList)
        }
      })
    }
  }, [data])

  const remarkComponents = {
    body: {
      row: RemarkEditableRow,
      cell: RemarkTableCell,
    },
  }

  const handleSave = (row) => {
    return new Promise((resolve, reject) => {
      const newData = [...ctx.getFieldValue('evaluationTenderList')]
      const index = newData.findIndex((item) => row.memberId === item.memberId)
      const item = newData[index]
      newData.splice(index, 1, {
        ...item,
        ...row,
      })
      ctx.setFieldValue('evaluationTenderList', newData)

      resolve({ item, newData })
    })
  }

  const remarkMergeColumns = remarkColumns.map((col) => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: ctx.getFormState().editable === false ? false : col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        formItem: col.formItem,
        formItemProps: col.formItemProps,
        handleSave,
      }),
    }
  })

  return {
    remarkColumns: remarkMergeColumns,
    remarkComponents,
  }
}
