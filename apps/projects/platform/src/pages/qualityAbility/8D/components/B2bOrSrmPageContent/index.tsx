import React, { useRef, useState, useMemo, useEffect, useCallback } from 'react'
import { Button, message } from 'antd'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link } from '@linkseeks/router-core'
import { ParsedQuery } from 'query-string'
import { FormDetailContext } from '@/formSchema/context'
import NiceForm from '@/components/NiceForm'
import FormDetailHeader from '@/components/FormDetailHeader'
import FormDetailWrapper from '@/components/FormDetailWrapper'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { mergeAllSchemas } from './schema'
import { teamColumns } from './columns'
import moment from 'moment'
import { cloneDeep, debounce } from 'lodash'
import { createFormActions, FormEffectHooks } from '@apps/formily'
import { useFormDetail } from '@/formSchema/effects/useFormDetail'
import { SaveOutlined, LinkOutlined } from '@ant-design/icons'
import FormilyUploadFiles from '@/components/UploadFiles/FormilyUploadFiles'
import DrawerTabTable from '../DrawerTabTable'
import AddTemaTableModal from '../AddTemaTableModal'
import { EditableBody } from '../TableCell'
import DrawerSearchTable from '../DrawerSearchTable'
import usePrompt from '@/hooks/usePrompt'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { getMemberManageSupplyMember, postMemberManageLowerProviderPage } from '@apps/apis'
import {
  postOrderEightDRectificationEnumSourceTypes,
  postOrderEightDRectificationEnumJudgments,
  postOrderEightDRectificationEnumProblemDegrees,
  postOrderEightDRectificationSaveOrUpdate,
  postOrderEightDRectificationDetail,
} from '@apps/apis'

type InitFormValue = Record<string, any>
type InitFormSchema = Record<string, any>

const addSchemaAction = createFormActions()

const MemberApi = {
  '1': postMemberManageLowerProviderPage, //srm会员接口
  '2': getMemberManageSupplyMember, //b2b会员接口
}

const setSchemaEnum = async (name: string, api: Function) => {
  try {
    const { data } = await api({}, { ctlType: 'none' })
    addSchemaAction.setFieldState(`*(${name})`, (state) => {
      state.props['enum'] = data.map((item) => ({ label: item['text'], value: item['id'] }))
      state.props['default'] = data[0].id
    })
  } catch (error) {}
}

const setFieldValueAndState = ({
  key,
  value,
  disabled = false,
  defaultEnum = false,
}: {
  key: string
  value: unknown
  disabled?: boolean
  defaultEnum?: boolean
}) => {
  let newValue = value
  addSchemaAction.setFieldState(`*(${key})`, (state) => {
    const [getEnum] = state.props?.['enum'] || []
    state.props['x-component-props'].disabled = disabled
    if (defaultEnum && getEnum) {
      newValue = getEnum['value']
    }
  })
  addSchemaAction.setFieldValue(`*(${key})`, newValue)
}

const setPcaAndIcaDisabledDay = (createTime: moment.Moment) => {
  addSchemaAction.setFieldState('*(icaReplyTime)', (state) => {
    state.props['x-component-props'].disabledDate = (date: moment.Moment) => {
      return date && date < moment(createTime).startOf('day')
    }
  })

  addSchemaAction.setFieldState('*(pcaReplyTime)', (state) => {
    state.props['x-component-props'].disabledDate = (date: moment.Moment) => {
      return date && date < moment(createTime).startOf('day')
    }
  })
}

const { onFormMount$, onFieldValueChange$ } = FormEffectHooks

type Props = {
  roleType: number
  query: ParsedQuery
}

const Index: React.FC<Props> = ({ roleType = 1, query }) => {
  const [headerTitle, setHeaderTitle] = useState('')
  const [formLoading, setFormLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [submitBtnDisabled, setSubmitBtnDisabled] = useState(false)
  const [hasEdit, setHasEdit] = useState(false)
  const [initFormValue, setInitFormValue] = useState<InitFormValue>({ effectiveType: 1 })
  const [initFormSchema] = useState<InitFormSchema>({ ...mergeAllSchemas })
  const [editable, setEditable] = useState(true)
  const [productCommodity, setProductCommodity] = useState({})
  // 不良率
  const [defectiveRate, setDefectiveRate] = useState<number | string>()

  const materialRef = useRef<any>({})
  const rowvendorMemberInfoRef = useRef<any>({})

  const { formContext } = useFormDetail()
  const { handleLeave } = usePrompt()

  const providerValue = {
    schemaActions: addSchemaAction,
    formContext,
  }
  const intl = useIntl()

  // 获取会员列表
  const fetchSupplierList = async (params) => {
    const queryParams = {
      ...params,
    }
    if (queryParams.memberName && roleType === 1) {
      // 兼容一下srm会员接口会员搜索名字字段是name
      Object.assign(queryParams, { name: queryParams.memberName })
      delete queryParams.memberName
    }
    try {
      const res = await MemberApi[roleType](queryParams)
      if (res.code === 1000) {
        return res.data
      }
      return { totalCount: 0, data: [] }
    } catch (error) {}
  }

  const setLik = (row, { quality }) => {
    // 获取到我们选中的物料
    rowvendorMemberInfoRef.current = row
    // 选择质检单的时候默认设置值上去，并且disabled
    const changeValue = {
      // 来源单据
      qualityType: quality ? 2 : 1,
      // 来源单号
      orderNo: quality ? row?.qualityNo || '' : '',
      // 质检数量=送检数量
      qualityQuantity: quality ? row?.submissionCount || 0 : undefined,
      // 不良品数量=让步接受数量+拒收数量
      defectiveQuantity: quality ? (row?.concessionToReceiveCount || 0) + (row?.rejectCount || 0) : undefined,
      // 检验方式
      inspectionType: quality ? row?.inspectionType || 2 : 2,
      // 检验结果
      batchJudgmentType: quality ? row?.batchJudgmentType || '' : 1,
    }

    Object.entries(changeValue).forEach(([key, value]) => {
      setFieldValueAndState({ key, value, disabled: quality, defaultEnum: !quality })
    })
  }

  // 校验pca的日期是否正确
  const checkPcaDate = async (value) => {
    const icaReplyTime = await addSchemaAction.getFieldValue('*(icaReplyTime)')
    const ica = moment(icaReplyTime).format('YYYYMMDD')
    const pca = moment(value).format('YYYYMMDD')
    if (pca < ica) {
      return true
    }
  }

  const newTeamColumns = useMemo(() => {
    const { id, edit } = query
    return cloneDeep(teamColumns).map((item) => {
      if (id && !edit) {
        item.editProps = { ...item.editProps, disabled: true }
      }
      return item
    })
  }, [query, teamColumns])

  // 选择会员弹窗
  const handleOrderMember = useCallback(async () => {
    // 判断 会员是否已选再弹窗
    const res = await addSchemaAction.getFieldValue('supplierMember')
    if (res) {
      const [{ memberId, roleId: memberRoleId }] = res
      // memberRoleId和roleId都是roleId值，这里兼容不商品，物料和质检单字段名不同
      setProductCommodity({
        memberId,
        memberRoleId,
        roleId: memberRoleId,
      })
      materialRef.current.setVisible(true)
      materialRef.current.tabKey = '1'
    } else {
      message.error(`${intl.formatMessage({ id: 'eightD.qingxianxuanzehuiyuan', defaultMessage: '请先选择会员' })}`)
    }
  }, [productCommodity])

  // 根据userid去重
  const getNoRepeatDate = (list, userIdList) => {
    let temaList = list
    userIdList.forEach((item) => {
      temaList = temaList.filter((value) => value.userId !== item)
    })
    return temaList ?? []
  }

  // 新增小组成员
  const addMemberHandler = useCallback(
    async (temaList, userIdLists) => {
      const oldTemaList = addSchemaAction.getFieldValue('*(teamMembersList)')

      let updateRow = updateRowIndex(oldTemaList.concat(getNoRepeatDate(temaList, userIdLists)))
      // 找出已经设置为小组长的那条数据
      const groupLeader = updateRow.find((item) => item.isGroupLeader)
      if (groupLeader) {
        updateRow = updateTemaDisabled(updateRow, groupLeader.index)
      }
      addSchemaAction.setFieldValue('*(teamMembersList)', updateRow)
    },
    [addSchemaAction],
  )

  // 校验小组成员是否存在组长
  const checkHasGroupLeader = (temaList: any[]) => {
    return temaList.every((item) => item.isGroupLeader === false)
  }

  // 更新列表小组disabled设置,优先级没有editProps里面的disabled的优先级高
  const updateTemaDisabled = (temaList, index?): any[] => {
    let newTemaList = null
    if (checkHasGroupLeader(temaList)) {
      newTemaList = temaList.map((item) => {
        item['disabled'] = false
        return item
      })
    } else {
      newTemaList = temaList.map((item, i) => {
        if (index !== void 0) {
          item['disabled'] = true
          if (i === index && item['isGroupLeader']) {
            item['disabled'] = false
          }
        } else {
          item['disabled'] = false
        }
        return item
      })
    }
    return newTemaList
  }

  // 设置小组成员组长
  const setGroupLeader = useCallback(
    async (record) => {
      const index = record.index
      const temaList: any[] = await addSchemaAction.getFieldValue('*(teamMembersList)')
      temaList.splice(index, 1, record)
      addSchemaAction.setFieldValue('*(teamMembersList)', updateTemaDisabled(temaList, index))
    },
    [addSchemaAction],
  )

  // 设置小组成员是否可见
  const updateVisibleAndLegend = useCallback(
    async (record) => {
      const index = record.index
      const temaList: any[] = await addSchemaAction.getFieldValue('*(teamMembersList)')
      temaList.splice(index, 1, record)
      addSchemaAction.setFieldValue('*(teamMembersList)', temaList.slice())
    },
    [addSchemaAction],
  )

  // 更新小组成员序号
  const updateRowIndex = (temaList: any[]) => {
    return temaList.map((item, index) => {
      item.index = index
      return item
    })
  }

  // 删除小组成员
  const deleteRow = useCallback(
    async (record) => {
      const index = record.index
      const temaList: any[] = await addSchemaAction.getFieldValue('*(teamMembersList)')
      temaList.splice(index, 1)
      addSchemaAction.setFieldValue('*(teamMembersList)', updateTemaDisabled(updateRowIndex(temaList)))
    },
    [addSchemaAction],
  )

  // 小组成员各种操作的事件
  const temaChange = useMemo(() => {
    return {
      operation: deleteRow,
      isGroupLeader: setGroupLeader,
      isVisible: updateVisibleAndLegend,
      legend: updateVisibleAndLegend,
    }
  }, [])

  // 小组成员操作变更
  const temaHandleChange = (record, key) => {
    temaChange[key]?.(record)
  }

  // 保存提交整个页面数据
  const handleSubmit = useCallback(
    async (value) => {
      try {
        const {
          code,
          skuId,
          name,
          type,
          productName,
          category,
          customerCategoryName,
          customerCategory,
          brandName,
          brand,
          unitName,
          unit,
          materialGroupName = '',
          generalTerm = '',
        } = rowvendorMemberInfoRef.current
        const {
          supplierMember,
          teamMembersList,
          defectiveQuantity,
          qualityQuantity,
          remark,
          icaReplyTime,
          pcaReplyTime,
        } = value
        const params = {
          ...value,
          orderType: roleType, //1:SRM;2:B2B
          supplyMemberId: supplierMember[0].memberId,
          supplyMemberRoleId: supplierMember[0].roleId,
          supplyMemberName: supplierMember[0].name,
          productDetail: {
            code: code || skuId || '',
            name: name || productName || '',
            type: type || '',
            customerCategoryName:
              customerCategoryName || category || (customerCategory ? customerCategory.name : '') || '',
            brandName: brandName || (brand && brand.name ? brand.name : brand) || '',
            unitName: unitName || unit || '',
            materialGroupName: materialGroupName || '',
            // generalTerm: generalTerm || ''
            generalTerm: name || productName || generalTerm || '',
          },
          icaReplyTime: moment(icaReplyTime).format('YYYY-MM-DD'),
          pcaReplyTime: moment(pcaReplyTime).format('YYYY-MM-DD'),
          defectiveRate,
          qualityOrderProductVOS:
            teamMembersList?.map((item) => {
              item.isGroupLeader = item.isGroupLeader ? 1 : 2
              item.isVisible = item.isVisible ? 1 : 2
              return item
            }) || [],
          defectiveQuantity: Number(defectiveQuantity),
          qualityQuantity: Number(qualityQuantity),
          remark: remark || '',
        }
        // 修改的时候需要补充id
        const { id } = query
        if (id) {
          Object.assign(params, { id })
        }
        delete params.supplierMember
        delete params.teamMembersList
        setSubmitLoading(true)
        setSubmitBtnDisabled(true)
        const res = await postOrderEightDRectificationSaveOrUpdate(params)
        if (res.code === 1000) {
          handleLeave(false)
          setSubmitLoading(false)
          setTimeout(() => {
            history.goBack()
          }, 2000)
        }
      } catch (error) {
        setSubmitBtnDisabled(false)
        message.error(`${intl.formatMessage({ id: 'eightD.baocunshibai', defaultMessage: '保存失败' })}!`)
      }
    },
    [rowvendorMemberInfoRef.current, defectiveRate, roleType, query],
  )

  // 初始化小组成员弹窗搜索栏
  const effects = ($, action) => {
    useStateFilterSearchLinkageEffect($, action, 'name', FORM_FILTER_PATH)
  }

  // 编辑的时候更新初始化数据
  const getUpdateDetail = useCallback(async () => {
    const params = { ...query }
    Object.assign(params, { id: Number(query.id) })
    try {
      setFormLoading(true)
      const { data } = await postOrderEightDRectificationDetail(params, { ctlType: 'none' })
      let index = null

      const teamMembersList =
        data?.qualityOrderProductVOS?.map((item, i) => {
          // 存储一下isGroupLeader是组长的索引值,方便更新数组
          if (item.isGroupLeader === 1) {
            index = i
          }
          ;(item as any).index = i
          ;(item.isGroupLeader as unknown as boolean) = item.isGroupLeader === 2 ? false : true
          ;(item.isVisible as unknown as boolean) = item.isVisible === 2 ? false : true
          return item
        }) || []

      const result = {
        materialsInformation: data?.productDetail?.name || '',
        teamMembersList: updateTemaDisabled(teamMembersList, index),
        supplierMember: [
          {
            memberId: data?.supplyMemberId || '',
            roleId: data?.supplyMemberRoleId || '',
            name: data?.supplyMemberName || '',
          },
        ],
      }
      rowvendorMemberInfoRef.current = data.productDetail
      Object.assign(data, result)

      data.createTime && setPcaAndIcaDisabledDay(data.createTime)

      setInitFormValue(data)
      setFormLoading(false)
    } catch (error) {}
  }, [query])

  useEffect(() => {
    setHeaderTitle(intl.formatMessage({ id: 'eightD.xinzeng8D', defaultMessage: '新增8D' }))
    if (query?.id) {
      getUpdateDetail()
      setHeaderTitle(intl.formatMessage({ id: 'eightD.bianji8D', defaultMessage: '编辑8D' }))
      if (!query.edit) {
        // 打开不可编辑
        setEditable(false)
        handleLeave(false)
        setHeaderTitle(intl.formatMessage({ id: 'eightD.zhakan8D', defaultMessage: '查看8D' }))
      }
    }
  }, [query])

  useEffect(() => {
    if (parseInt((Number(formContext.formProcess || 0) * 100).toFixed(2)) && !hasEdit && editable) {
      handleLeave()
      setHasEdit(true)
    }
  }, [formContext.formProcess, hasEdit, editable])

  const useNiceFormEffect = useCallback(
    ($, ctx) => {
      onFormMount$().subscribe(() => {
        ctx.setFieldState('*(materialsInformation)', (state) => {
          if (roleType == 2) {
            state.props['title'] = intl.formatMessage({ id: 'eightD.shangpinxinxi', defaultMessage: '商品信息' })
            state.props['x-rules'] = [
              {
                required: true,
                message: intl.formatMessage({ id: 'eightD.qingxuanzeshangpinxinxi', defaultMessage: '请选择商品信息' }),
              },
            ]
          }
        })
        // 来源类型枚举列表的下拉选择
        setSchemaEnum('sourceType', postOrderEightDRectificationEnumSourceTypes)
        // 校验结果枚举列表的下拉选择
        setSchemaEnum('batchJudgmentType', postOrderEightDRectificationEnumJudgments)
        // 问题紧张程度枚举列表的下拉选择
        setSchemaEnum('problemDegreeType', postOrderEightDRectificationEnumProblemDegrees)
      })

      // 监听质检数量变化
      onFieldValueChange$('qualityQuantity').subscribe(async (state) => {
        const { value } = state
        const defectiveQuantity = await ctx.getFieldValue('*(defectiveQuantity)')
        if (value == void 0 || Number(value) == 0) {
          ctx.setFieldState('*(defectiveQuantity)', (state) => {
            state.props['x-props'].extra = ''
            setDefectiveRate(0)
          })
          return
        }
        if (defectiveQuantity !== void 0 && defectiveQuantity !== '') {
          const defective = parseFloat((Number(defectiveQuantity) / Number(value)) * 100 + '').toFixed(3)
          ctx.setFieldState('*(defectiveQuantity)', (state) => {
            state.props['x-props'].extra = `${intl.formatMessage({
              id: 'eightD.buliangl',
              defaultMessage: '不良率',
            })}${defective}%`
            setDefectiveRate(() => defective)
          })
        }
      })

      // 监听不良品数量变化
      onFieldValueChange$('defectiveQuantity').subscribe(async (state) => {
        const { value } = state
        if (value == void 0 || value == '') {
          ctx.setFieldState('*(defectiveQuantity)', (state) => {
            state.props['x-props'].extra = ''
            setDefectiveRate(0)
          })
          return
        }
        const qualityQuantity = await ctx.getFieldValue('*(qualityQuantity)')
        if (qualityQuantity !== void 0 && qualityQuantity !== '') {
          const defective = parseFloat((Number(value) / Number(qualityQuantity)) * 100 + '').toFixed(3)
          state.props['x-props'].extra = `${intl.formatMessage({
            id: 'eightD.buliangl',
            defaultMessage: '不良率',
          })}${defective}%`
          setDefectiveRate(() => defective)
        }
      })

      // 注入表单完成进度
      formContext.useAttachmentChangeForContext(ctx)
    },
    [formContext, roleType],
  )

  // 物料信息按钮
  const materialBtn = editable ? (
    <>
      <Button type="primary" className="relevance" icon={<LinkOutlined />} onClick={handleOrderMember} block></Button>
    </>
  ) : null

  return (
    <>
      <FormDetailContext.Provider value={providerValue}>
        <FormDetailHeader
          title={headerTitle}
          schema={initFormSchema}
          extraRight={
            editable
              ? [
                  <Button
                    key="1"
                    onClick={() => addSchemaAction.submit()}
                    loading={submitLoading}
                    type="primary"
                    icon={<SaveOutlined />}
                    disabled={submitBtnDisabled}
                  >
                    {intl.formatMessage({ id: 'eightD.baocun', defaultMessage: '保存' })}
                  </Button>,
                ]
              : []
          }
        />
        <FormDetailWrapper>
          <NiceForm
            loading={formLoading}
            previewPlaceholder=" "
            value={initFormValue}
            actions={addSchemaAction}
            schema={initFormSchema}
            editable={editable}
            effects={useNiceFormEffect}
            components={{
              DrawerSearchTable,
              AddTemaTableModal,
              FormilyUploadFiles,
            }}
            expressionScope={{
              materialBtn,
              paymentComponents: EditableBody,
              newTeamColumns: newTeamColumns,
              checkPcaDate,
              addMemberHandler,
              temaHandleChange,
              showAddTeamBtn: editable,
              effects,
              fetchSupplierList,
            }}
            onSubmit={debounce(handleSubmit, 500)}
          />
        </FormDetailWrapper>
      </FormDetailContext.Provider>
      <DrawerTabTable
        currentRef={materialRef}
        schemaAction={addSchemaAction}
        setLik={setLik}
        searchParams={productCommodity}
        roleType={roleType}
      />
    </>
  )
}

export default Index
