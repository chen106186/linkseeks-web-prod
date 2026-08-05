import React, { useEffect, useState, useRef } from 'react'
import NiceForm from '@/components/NiceForm'
import { PageHeaderWrapper } from '@apps/components'
import { createFormActions, FormEffectHooks, FormPath, ISchema, Schema } from '@apps/formily'
import { Button, Cascader, message } from 'antd'
import { LinkOutlined } from '@ant-design/icons'
import { getSchema, propsCardSchema } from './schema'
import FormilyUploadFiles from '@/components/UploadFiles/FormilyUploadFiles'
import styles from './add.less'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { UploadChangeParam, UploadFile } from 'antd/lib/upload/interface'
import UploadFileTip from '../components/uploadFileTip'
import FormilyUploadEnclosure from '../components/formilyUploadEnclosure'
import UploadFiles from '@/components/UploadFiles/UploadFiles'
import FileItem from '../components/fileItem'
import RequisitionerTable from './components/requisitionerTable'
import {
  fetchBrand,
  fetchCategoryData,
  fetchTreeData,
  fetchUnit,
  useAsyncCascader,
  fetchUserPage,
} from '../common/useGetTableSearchData'
import { getProductCustomerGetCustomerCategoryById, postProductMaterielSaveOrUpdateMateriel } from '@apps/apis'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import { usePageStatus } from '@/hooks/usePageStatus'
import useInitialValue, { Options } from './useInitialValue'
import { HAS_CONFIRM, FROZEN } from '@/constants/material'
import { history } from '@linkseeks/router-manager'
import { usePrompt, useQuery, useLocation } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { merge } from 'lodash'

const { onFormInputChange$ } = FormEffectHooks

const formActions = createFormActions()

const MaterialAdd: React.FC<{}> = (props) => {
  const intl = useIntl()
  const { id, lastTypeParams } = usePageStatus()
  const query = useQuery()
  const { state, pathname } = useLocation()
  const isAdd = lastTypeParams === '/add' && !id
  const isEdit = lastTypeParams === '/edit' && id
  const isedtails = lastTypeParams === '/detail' && id
  // const isDetail = !isAdd && !isEdit;
  const { loading, formatInitialValue } = useInitialValue({ id: id, query, state })
  const [submitLoading, setSubmitLoading] = useState(false)
  const [schema, setSchema] = useState(getSchema(null))
  const [unsaved, setUnsaved] = useState(false)
  usePrompt({
    when: unsaved,
    message: intl.formatMessage({
      id: 'common.tip.save.confirm',
      defaultMessage: '您还有未保存的内容，是否确定要离开？',
    }),
  })
  // 这里维护多一个变量来控制是否显示 商品属性 锚点
  // 实际上可以 一个变量就解决，但是现有 schema 的组装的做法不允许
  // 所以加多一个变量
  // 需要注意的是 这个需要跟 setSchema 一同使用
  const [hasProperties, setHasProperties] = useState(false)

  const RequisRef = useRef<any>({}) // 请购人
  /*联系人选择*/
  const handleOrder = () => {
    RequisRef.current.setVisible(true)
  }
  const RequisitionerBtn = (
    <div className="connectBtn" onClick={handleOrder}>
      <LinkOutlined style={{ marginRight: 4 }} />
      {intl.formatMessage({ id: 'purchaseRequisition.xuanze', defaultMessage: '选择' })}
    </div>
  )

  useEffect(() => {
    if (query?.type === 'sourceData') {
      formActions.setFieldState('sourceListCard', (state) => {
        FormPath.setIn(state, 'visible', true)
      })
      console.log(state)

      if (!(state as Options['state']).dataSource) {
        message.error(
          intl.formatMessage({ id: 'material.should.select.purchaseSelection', defaultMessage: '请选择采购选品' }),
        )
      }
    }
  }, [])

  useEffect(() => {
    if (!formatInitialValue) {
      return
    }
    if (formatInitialValue?.interiorState === HAS_CONFIRM || formatInitialValue?.change) {
      formActions.setFieldState('changeCard', (state) => {
        FormPath.setIn(state, 'visible', true)
      })
    }
  }, [formatInitialValue])

  const uploadContainer = (
    <div className={styles.uploadContainer}>
      <span className={styles.icon}>
        <PlusOutlined />
      </span>
      {intl.formatMessage({ id: 'material.upload', defaultMessage: '上传' })}
    </div>
  )

  /** 自定义上传文件显示方式 */
  const customizeFileItemRender = (files: UploadFile[], onRemove) => {
    return (
      <>
        {files.map((_item) => (
          <div className={styles.fileItem} key={_item.name}>
            <div className={styles.actions}>
              <DeleteOutlined className={styles.delete} onClick={() => onRemove(_item)} />
            </div>
            <img src={_item.url} alt={_item.name} />
          </div>
        ))}
      </>
    )
  }

  const handleChange = (info: UploadChangeParam) => {
    const currentValue = formActions.getFieldValue('enclosureCard.urls') || []

    if (info.file.status === 'done' || info.file.status === 'error') {
      const result = currentValue.concat({
        file: { name: info.file.name, url: info.file.response.data },
        description: '',
      })
      formActions.setFieldValue('enclosureCard.urls', result)
    }
  }

  const renderAddition = () => (
    <UploadFiles onChange={handleChange} showFiles={false}>
      <div className={styles.addition}>
        <PlusOutlined />
        <span className={styles.text}>
          {intl.formatMessage({ id: 'material.supplier.addInfo', defaultMessage: '添加附件' })}
        </span>
      </div>
    </UploadFiles>
  )

  const createDescriptionElement = () => {
    return {
      desc() {
        if (query?.type !== 'sourceData') {
          return null
        }
        return React.createElement(
          'div',
          { className: styles['label-required'] },
          `参考品牌: ${state.dataSource?.referenceBrand || ''}`,
        )
      },
    }
  }

  const handleSubmit = async (value) => {
    const {
      urls,
      materielPic,
      category,
      brand,
      name,
      unitId,
      remark,
      costPrice,
      code: codeName,
      memberId,
      memberName,
      memberRoleId,
      memberRoleName,
      deliveryCycle,
      materielNo,
      deliveryMethod,
      departure,
      manufacturer,
      origin,
      phone,
      userName,
      materialGroup,
      type,
      materialsManufacturer,
      materialsOrigin,
      materialsDeliverPeriod,
      materialsDeparture,
      materialsDeliveryMethod,
      contactMemberPhone,
      contactMemberName,
      chargeUserId,
      chargeAccount,
      chargeName,
      chargeRoleName,
      unitConversions,
      ...rest
    } = value
    const formatGoodsPic = materielPic?.map((_item) => _item.url)
    const categoryId = { id: [...category].pop() }
    const withId = isEdit ? { id: id } : {}

    /** 动态内容 */
    const dynamicProps = Object.keys(rest).filter((_item) => /customerAttribute-\d+/.test(_item))

    const formatBrand = brand ? { brand: { id: brand } } : {}
    /** 如果带货源清单 */
    const withSourceList =
      query?.type === 'sourceData'
        ? {
            materielSupplyListRequest: {
              memberId,
              memberName,
              memberRoleId,
              memberRoleName,
              deliveryCycle,
              materielNo,
              deliveryMethod,
              departure,
              manufacturer,
              origin,
              phone,
              userName,
              status: 1,
              materielId: state?.dataSource?.materielId,
            },
          }
        : {}

    /** 物料是否变更 */
    const withChangeData =
      formatInitialValue?.interiorState === HAS_CONFIRM || formatInitialValue?.change
        ? {
            changeRemark: rest.changeRemark || '',
            change: 1,
          }
        : {}

    /** 物料组 */
    const withMaterialGroup = materialGroup ? { materialGroup: { id: [...materialGroup].pop() } } : {}

    const commodityAttributeList = dynamicProps.map((_item) => {
      //@ts-ignore
      const [, customerAttributeId] = _item.match(/customerAttribute-(\d+)/)
      const toArrayData = Array.isArray(rest[_item]) ? rest[_item] : [rest[_item]]

      const customerAttributeValueList = toArrayData.map((_row) => {
        const splitData = _row?.split('-')
        const isInput = splitData.length === 1
        return {
          id: isInput ? null : splitData[0],
          value: isInput ? splitData[0] : splitData[1],
        }
      })

      return {
        customerAttributeId,
        customerAttributeValueId: customerAttributeValueList.map((_item) => _item.id),
        customerAttributeValueName: customerAttributeValueList[0]?.value || '',
      }
    })

    let unitConversionsParam: any[] = []
    // 如果选择了换算单位，则换算比例需必填
    if (Array.isArray(unitConversions)) {
      unitConversionsParam = unitConversions
    } else {
      if (unitConversions && unitConversions.unitId) {
        const filterSubUnitConversionList = unitConversions?.subUnitConversionList?.filter((_item) => Boolean(_item))
        if (filterSubUnitConversionList?.length === 0) {
          message.destroy()
          message.error('请完善单位的换算比例')
          return
        }
      }

      unitConversionsParam = unitConversions ? [unitConversions] : []
    }

    /** 单位换算 */
    // const withUnitConversions = unitConversions
    const postData = {
      materielPic: formatGoodsPic,
      urls: urls?.map((_item) => ({ ..._item.file, description: _item.description })),
      commodityAttributeList: commodityAttributeList,
      customerCategory: categoryId,
      name: name,
      code: codeName,
      costPrice: costPrice,
      remark: remark,
      unitId: unitId,
      type: type,
      contactMemberPhone,
      contactMemberName,
      chargeUserId,
      chargeAccount,
      chargeName,
      chargeRoleName,
      materialsManufacturer,
      materialsOrigin,
      materialsDeliverPeriod,
      materialsDeparture,
      materialsDeliveryMethod,
      deliveryCycle,
      deliveryMethod,
      departure,
      manufacturer,
      origin,
      ...formatBrand,
      ...withId,
      ...withSourceList,
      ...withMaterialGroup,
      ...withChangeData,
      unitConversions: unitConversionsParam,
    }

    setSubmitLoading(true)
    postProductMaterielSaveOrUpdateMateriel(postData)
      .then((res) => {
        const { code, data } = res
        if (code === 1000) {
          setUnsaved(false)
          setTimeout(() => {
            // history.back();
            // 统一 push 到列表页，包括是从
            // 新增采购需求单，新增采购招标，新增采购招标，新增请购单的物料点击新增物料跳转的页面
            history.push(pathname.split('/').slice(0, -1).join('/'))
          }, 100)
        }
      })
      .finally(() => {
        setSubmitLoading(false)
      })
  }

  const renderTitle = () => {
    if (isEdit) {
      return intl.formatMessage({ id: 'material.editing', defaultMessage: '编辑物料' })
    }
    if (isAdd) {
      return intl.formatMessage({ id: 'material.creating', defaultMessage: '新增物料' })
    }
    return intl.formatMessage({ id: 'material.viewDetail', defaultMessage: '查看物料详情' })
  }

  const anchorHeader = [
    {
      key: 'basic',
      label: intl.formatMessage({ id: 'material.basic.title', defaultMessage: '基本信息' }),
    },
    hasProperties
      ? {
          key: 'type',
          label: intl.formatMessage({ id: 'material.props.title', defaultMessage: '属性信息' }),
        }
      : null,
    {
      key: 'output',
      label: intl.formatMessage({ id: 'material.output.title', defaultMessage: '生产与配送' }),
    },
    {
      key: 'unitConversion',
      label: intl.formatMessage({ id: 'material.unitConversion.title', defaultMessage: '单位换算' }),
    },
    {
      key: 'contactInfo',
      label: intl.formatMessage({ id: 'material.contact.title', defaultMessage: '联系信息' }),
    },
    {
      key: 'images',
      label: intl.formatMessage({ id: 'material.images.title', defaultMessage: '物料图片' }),
    },
    {
      key: 'enclosure',
      label: intl.formatMessage({ id: 'material.enclosure.title', defaultMessage: '附件' }),
    },
    formatInitialValue?.interiorState === HAS_CONFIRM || formatInitialValue?.change
      ? {
          key: 'change',
          label: intl.formatMessage({ id: 'material.change.title', defaultMessage: '变更备注' }),
        }
      : null,
    query?.type === 'sourceData'
      ? {
          key: 'source',
          label: intl.formatMessage({ id: 'material.sourceList', defaultMessage: '货源清单' }),
        }
      : null,
  ].filter(Boolean)

  const handleSearchUnit = async (value: string) => {
    try {
      formActions.setFieldState('unitId', (fieldState) => {
        FormPath.setIn(fieldState, 'loading', true)
      })
      const res = await fetchUnit(value)
      formActions.setFieldState('unitId', (fieldState) => {
        FormPath.setIn(
          fieldState,
          'props.enum',
          res.map((item) => ({
            label: item.name,
            value: item.id,
          })),
        )
      })
    } catch (error) {
    } finally {
      formActions.setFieldState('unitId', (fieldState) => {
        FormPath.setIn(fieldState, 'loading', false)
      })
    }
  }

  return (
    <PageHeaderWrapper
      title={renderTitle()}
      items={anchorHeader as { label: string; key: string }[]}
      extra={
        (isAdd || isEdit) && (
          <Button loading={submitLoading} onClick={() => formActions.submit()}>
            {intl.formatMessage({ id: 'material.group.save', defaultMessage: '保存' })}
          </Button>
        )
      }
    >
      <NiceForm
        editable={!!(isAdd || isEdit)}
        previewPlaceholder=" "
        schema={schema}
        actions={formActions}
        onSubmit={handleSubmit}
        // value={formatInitialValue}
        initialValues={formatInitialValue}
        components={{
          Cascader,
          FormilyUploadFiles,
          UploadFileTip,
          FormilyUploadEnclosure,
          FileItem,
        }}
        expressionScope={{
          // renderListTableRemove: renderListTableRemove,
          renderAddition: renderAddition(),
          uploadContainer: uploadContainer,
          customizeFileItemRender: customizeFileItemRender,
          ...createDescriptionElement(),
          handleSearchUnit,
          Requisitioner: Boolean(isedtails) ? '' : RequisitionerBtn,
        }}
        effects={($, actions) => {
          useAsyncCascader('category', fetchCategoryData)
          useAsyncSelect('brand', fetchBrand, ['name', 'id'])
          useAsyncCascader('materialGroup', fetchTreeData)
          useAsyncSelect('unitId', fetchUnit, ['name', 'id'])
          useAsyncSelect('unitConversions', fetchUnit, ['name', 'id'])
          // useAsyncSelect('chargeUserId', fetchUserPage, ["name", "userId"])
          $('onFormMount').subscribe(() => {
            if (isEdit) {
              formActions.setFieldState('code', (state) => {
                FormPath.setIn(state, 'editable', false)
              })
            }
          })
          $('onFieldValueChange', 'category').subscribe((fieldState) => {
            if (!fieldState.value || fieldState.value.length === 0) {
              setSchema(getSchema(null))
              setHasProperties(false)
              return
            }

            const categoryId = [...fieldState.value].pop()
            getProductCustomerGetCustomerCategoryById({ id: categoryId }).then((data) => {
              const { customerAttributeList } = data.data
              if (customerAttributeList?.length === 0) {
                setHasProperties(false)
                return
              }
              const result = {}
              customerAttributeList.forEach((_item) => {
                const { customerAttributeValueList, name, type, isMust, id } = _item
                /** 1-单选、2-多选、3-输入 */
                const withEnum =
                  type === 3
                    ? {
                        'x-rules': [
                          {
                            limitByte: true,
                            maxByte: 60,
                          },
                        ],
                      }
                    : {
                        enum: customerAttributeValueList.map((_row) => ({
                          label: _row.value,
                          value: `${_row.id}-${_row.value}`,
                        })),
                      }
                // 有歧义，品类那边弄反了
                const withRequire = isMust
                  ? {
                      'x-rules': [
                        {
                          required: true,
                          message: intl.formatMessage({
                            id: 'material.props.should.required',
                            defaultMessage: '该属性不允许为空',
                          }),
                        },
                      ],
                    }
                  : {}

                const mergeRes = merge(withEnum, withRequire)

                result[`customerAttribute-${id}`] = {
                  title: name,
                  type: 'string',
                  ...mergeRes,
                }
              })
              setSchema(getSchema(propsCardSchema(result)))
              setHasProperties(true)
            })
          })
          onFormInputChange$().subscribe(() => {
            if (!unsaved) {
              setUnsaved(true)
            }
          })
        }}
      />
      <RequisitionerTable currentRef={RequisRef} schemaAction={formActions} />
    </PageHeaderWrapper>
  )
}

export default MaterialAdd
