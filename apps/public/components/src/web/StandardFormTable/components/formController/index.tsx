import React, { Fragment, useEffect, useMemo, useState } from 'react'
import { useFormTable } from '../../contexts'
import { RecordColumns, SearchButtonsType, SearchFieldProps } from '../../types'
import { Button, Col, Dropdown, Form, Row, Tooltip, Space, Tabs } from '@linkseeks/ui'
import {
  ArrowDownFillIcon,
  ArrowUpFillIcon,
  FileRemoveFillIcon,
  PlusCircleIcon,
  QuestionCircleIcon,
} from '@linkseeks/icons'
import { useToggle } from '@linkseeks/hooks'
import { useWebIntl } from '@apps/locales'
import { FormProvider } from '../../contexts/formContext'
import FormField from '../formField'
import AuthButton from '../../../AuthButton'
import { StandardFormTableTypes } from '../../standardFormTable'
import '../../index.less'

interface FormControllerProps<RecordType> {
  searchButtons?: SearchButtonsType[]
  mainCol?: RecordColumns<RecordType>[]
  searchFormFields: SearchFieldProps[]
  /**
   * 表格表单类型
   * table: 通用列表搜索模式，左边按钮，右边筛选
   * modal: 弹窗模式，左边筛选，右边分页
   */
  type: StandardFormTableTypes
  tabsItems?: { label: string; key?: string; value?: string }[]
  tabsKey?: string
  tabsDefaultAll?: boolean
  pagination?: React.ReactNode
  resetSearchField: any
  initalValue: any
  handleUpdateColumns: any
  tabChange?: (params: any) => void
}

const iconMaps = {
  add: <PlusCircleIcon />,
  delete: <FileRemoveFillIcon />,
}
function parseIcon(icon: any) {
  if (typeof icon === 'string') {
    return iconMaps[icon]
  } else {
    return icon
  }
}
const FormController = <RecordType,>({
  type,
  tabsItems,
  tabsKey,
  tabsDefaultAll,
  mainCol,
  searchButtons,
  searchFormFields,
  resetSearchField,
  pagination,
  initalValue,
  handleUpdateColumns,
  tabChange,
}: FormControllerProps<RecordType>) => {
  const { formSearchRef, actionRef, handleChangeValues, isCache, cacheQuery, cacheId } = useFormTable()
  const [openFilter, toggleOpenFilter] = useToggle(isCache ? cacheQuery.getCacheData(cacheId)?.filterState : false)
  const translate = useWebIntl()

  const _tabsItems: any[] = useMemo(() => {
    if (tabsItems) {
      const tsbs =
        tabsItems?.map((v) => {
          return {
            ...v,
            // 兼容外部传入的类型是label + value形式
            key: v.key || v.value,
          }
        }) || []
      if (tabsDefaultAll) {
        return [{ label: translate('web.common.all', { defaultMessage: '全部' }), key: '', value: '' }].concat(
          tsbs as any,
        )
      } else {
        return tsbs
      }
    } else {
      return []
    }
  }, [tabsItems])
  const [activeKey, setActiveKey] = useState<string>(_tabsItems && _tabsItems.length > 0 ? _tabsItems[0].key : '')

  const mainSearch = useMemo(() => {
    if (mainCol) {
      return mainCol?.map((item) => item?.searchField) as SearchFieldProps[]
    } else {
      return null
    }
  }, [mainCol])

  useEffect(() => {
    if (initalValue) {
      onValuesChange(Object.keys(initalValue).map((v) => ({ name: [v], value: initalValue[v] })))
    }
  }, [initalValue])
  const renderSearchFormFields = searchFormFields.map((v, index) => {
    return <FormField key={`FormField-${index}`} {...v} hidden={!v.display} />
  })
  // 左侧按钮操作栏
  const renderButtonContainer = () => {
    if (!searchButtons || searchButtons.length === 0) {
      return null
    }

    const moreButtons = searchButtons.filter((v) => v.more)
    const outButtons = searchButtons.filter((v) => !v.more)

    const renderButton = (v, i) => {
      const buttonIcon = parseIcon(v.icon)
      const innerButton = (
        <Button key={`${v.key}-${i}`} {...v} icon={buttonIcon}>
          {v.children}
          {v.toolTip && (
            <Tooltip placement="top" title={v.toolTip}>
              <QuestionCircleIcon size={14} color="#666" style={{ position: 'relative', top: '1px' }} />
            </Tooltip>
          )}
        </Button>
      )

      return v.key ? (
        <AuthButton type="custom" key={v.key} code={v.key}>
          {innerButton}
        </AuthButton>
      ) : (
        innerButton
      )
    }

    const moreMenuProp = {
      items: moreButtons.map(({ more, ...resetProps }, index) => ({
        label: renderButton({ ...resetProps, type: 'text' }, index),
        key: resetProps.key,
      })),
    }
    return (
      <Space style={!searchFormFields || !searchFormFields.length ? { marginBottom: 24 } : {}}>
        {outButtons.map((v, i) => renderButton(v, i))}
        {moreButtons.length > 0 && (
          <Dropdown menu={moreMenuProp as any}>
            <div>
              <Button>
                <Space>
                  {translate('web.common.more', { defaultMessage: '更多' })}
                  <ArrowDownFillIcon />
                </Space>
              </Button>
            </div>
          </Dropdown>
        )}
      </Space>
    )
  }

  const handleReset = () => {
    // 如果是tab的筛选值，则重置前保存，避免重置
    let tabsVal = ''
    if (tabsKey) {
      tabsVal = formSearchRef.getFieldValue(tabsKey)
    }
    resetSearchField()
    const result = formSearchRef.getFieldsValue()
    const resetValues = Object.keys(result).reduce((values, key) => {
      values[key] = undefined
      return values
    }, {})
    formSearchRef.setFieldsValue(resetValues)
    // 不重置tabs的值
    if (tabsKey && tabsVal) {
      formSearchRef.setFieldValue(tabsKey, tabsVal)
    }
    actionRef.current.reset()
  }

  const onValuesChange = (linkageFields) => {
    const findTarget = (name: string) => {
      const target = searchFormFields.find((v) => v.name === name)
      if (target) {
        return {
          show() {
            target.display = true
            handleUpdateColumns()
          },
          hide() {
            target.display = false
            handleUpdateColumns()
          },
        }
      } else {
        throw `未找到${name}在表单中`
      }
    }
    handleChangeValues(linkageFields, findTarget)
  }

  const Filter = ({}) => (
    <Row
      justify={type === 'modal' ? 'start' : 'end'}
      style={
        openFilter || !mainSearch
          ? {}
          : {
              visibility: 'hidden',
              height: 0,
            }
      }
    >
      {searchFormFields && searchFormFields.length > 0 && (
        <Space>
          <Space wrap style={{ justifyContent: 'flex-end', alignItems: 'flex-start' }}>
            {renderSearchFormFields}
          </Space>
          {/* order设置一个特别大的值为了让查询按钮始终在最右边 */}
          <Button type="primary" className="cp-form-field cp-form-query" onClick={() => actionRef.current.submit()}>
            {translate('web.common.chaxun', { defaultMessage: '查询' })}
          </Button>
          {!mainSearch && (
            <Button onClick={handleReset}>{translate('web.common.reset', { defaultMessage: '重置' })}</Button>
          )}
        </Space>
      )}
    </Row>
  )

  const toggleOpenFilterByCache = () => {
    if (isCache) {
      cacheQuery.setCacheData(cacheId, {
        filterState: !openFilter,
      })
    }

    toggleOpenFilter()
  }

  const MainSearch = () => (
    <Space>
      {mainSearch?.map((item, index, arr) => (
        <FormField
          type={index === arr.length - 1 ? 'Search' : item.type}
          name={item?.name}
          style={{ marginBottom: 0 }}
          title={item?.title}
          key={Array.isArray(item.name) ? item.name.join(',') : item.name}
        />
      ))}
      {mainSearch && (
        <Button onClick={toggleOpenFilterByCache} icon={openFilter ? <ArrowUpFillIcon /> : <ArrowDownFillIcon />}>
          {translate('web.common.advancedFilter', { defaultMessage: '高级筛选' })}
        </Button>
      )}
      <Button onClick={handleReset}>{translate('web.common.reset', { defaultMessage: '重置' })}</Button>
    </Space>
  )

  const formTypeRender = () => {
    switch (type) {
      case 'table':
        return (
          <Fragment>
            <Row wrap={false} justify={'space-between'} style={mainSearch ? {} : {}}>
              <Col>{renderButtonContainer()}</Col>
              {mainSearch ? <MainSearch /> : <Filter />}
            </Row>
            {mainSearch && (
              <div style={{ marginTop: 12 }}>
                <Filter />
              </div>
            )}
          </Fragment>
        )
      case 'modal':
        return (
          <Fragment>
            <Row wrap={false} justify={'space-between'} style={mainSearch ? {} : {}}>
              {mainSearch ? <MainSearch /> : <Filter />}
              <Col>{pagination && pagination}</Col>
            </Row>
            {mainSearch && (
              <div style={{ marginTop: 12 }}>
                <Filter />
              </div>
            )}
          </Fragment>
        )
      case 'tabs':
        return (
          <Fragment>
            <Tabs
              items={_tabsItems || []}
              className="standard-form-table-tabs"
              accessKey={activeKey}
              tabBarExtraContent={tabsKey && <FormField type="Input" name={tabsKey} hidden />}
              onChange={(key) => {
                setActiveKey(key)
                tabChange && tabChange(key)
                if (tabsKey) {
                  formSearchRef.setFieldValue(tabsKey, key)
                  actionRef.current.submit()
                }
              }}
            />
            <Row wrap={false} justify={'space-between'} style={mainSearch ? {} : {}}>
              <Col>{renderButtonContainer()}</Col>
              {mainSearch ? <MainSearch /> : <Filter />}
            </Row>
            {mainSearch && (
              <div style={{ marginTop: 12 }}>
                <Filter />
              </div>
            )}
          </Fragment>
        )
    }
  }

  return (
    <FormProvider>
      <Form
        className="standard-form-table-form-controller"
        form={formSearchRef}
        onFieldsChange={onValuesChange}
        initialValues={initalValue}
      >
        {formTypeRender()}
      </Form>
    </FormProvider>
  )
}

export default FormController
