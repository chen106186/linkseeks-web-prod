import React, { ReactText, useRef, useEffect } from 'react'
import StandardTable, { IStandardTableProps } from '@/components/StandardTable'
import NestTable from '@/components/NestTable'
import { Row, Col, Drawer, Button, Input } from 'antd'
import {
  productModalSchema,
  productModalByMemberSchema,
  memberModalSchema,
  inquirySchema,
  demandSchema,
  enquirySchema,
  mergeOrderSchema,
} from './schema'
import Search from '../NiceForm/components/Search'
import SearchSelect from '../NiceForm/components/SearchSelect'
import Submit from '../NiceForm/components/Submit'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import DateSelect from '../NiceForm/components/DateSelect'
import { SchemaForm, SchemaMarkupField as Field, FormButtonGroup, createAsyncFormActions } from '@apps/formily'
import { setup } from '@apps/formily'
import styles from './index.less'
import { useIntl } from '@linkseeks/i18n'
export interface TableDrawerProps extends IStandardTableProps<any> {
  width?: number
  modalTitle?: ReactText
  confirm?()
  cancel?()
  visible?: boolean
  resetModal?: object
  modalType?:
    | 'productByDefault'
    | 'productByMember'
    | 'memberByDefault'
    | 'inquiryByDefault'
    | 'demandByDefault'
    | 'enquiryModel'
    | 'MergeOrderByDefault'
    | 'none'
  useNestTable?: boolean // 是否使用嵌套表格
  nestColumns?: any[]
  nestTableProps?: any
  nestPagination?: React.ReactNode
  nestForm?: boolean
}

export const schemaAction = createAsyncFormActions()

const SearchComponent = (props) => {
  return (
    <Input.Search
      value={props.value || ''}
      onChange={(e) => props.mutators.change(e.target.value)}
      onSearch={() => {
        schemaAction.submit()
      }}
      {...props.props['x-component-props']}
    />
  )
}

SearchComponent.isFieldComponent = true
setup()

const TableDrawer: React.FC<TableDrawerProps> = (props) => {
  const {
    width = 704,
    modalTitle,
    confirm,
    cancel,
    visible,
    currentRef,
    resetModal,
    modalType = 'none',
    useNestTable = false,
    nestColumns,
    nestTableProps = {},
    nestPagination,
    nestForm = false,
    ...resetTable
  } = props

  const selfRef = currentRef || useRef<any>({})
  const intl = useIntl()

  useEffect(() => {
    if (visible) {
      // 重新开启时需reload接口
      selfRef.current.reloadCurrent && selfRef.current.reloadCurrent()
    } else {
      selfRef.current.resetField &&
        selfRef.current.resetField({
          validate: false,
        })
    }
  }, [visible, selfRef.current])

  const modelSchemaRender = () => {
    switch (modalType) {
      case 'productByDefault': {
        return productModalSchema
      }

      case 'productByMember': {
        return productModalByMemberSchema
      }

      case 'memberByDefault': {
        return memberModalSchema
      }

      case 'inquiryByDefault': {
        return inquirySchema
      }

      case 'enquiryModel': {
        return enquirySchema
      }

      case 'demandByDefault': {
        return demandSchema
      }

      case 'MergeOrderByDefault': {
        return mergeOrderSchema
      }
      case 'none': {
        return {}
      }
    }
  }

  const defaultSchemaProps = {
    inline: true,
    onSubmit: () => handleSubmit(),
  }

  const handleSubmit = () => {}

  return (
    <Drawer
      width={width}
      title={modalTitle}
      onClose={cancel}
      footer={
        <div
          style={{
            textAlign: 'right',
          }}
        >
          <Button onClick={cancel} style={{ marginRight: 8 }}>
            {intl.formatMessage({ id: 'components.quxiao' })}
          </Button>
          <Button onClick={confirm} type="primary">
            {intl.formatMessage({ id: 'components.queding' })}
          </Button>
        </div>
      }
      visible={visible}
      {...resetModal}
    >
      {useNestTable ? (
        <div className={styles.drawer_wrap}>
          {nestForm && (
            <Row justify="space-between" style={{ marginBottom: 16 }}>
              <Col span={12} style={{ zIndex: 99 }}>
                <SchemaForm
                  className="god-schema-form"
                  {...defaultSchemaProps}
                  schema={modelSchemaRender()}
                  components={{
                    Search: SearchComponent,
                    ModalSearch: Search,
                    SearchSelect,
                    Submit,
                    DateSelect,
                  }}
                  effects={($, actions) => {
                    useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)
                  }}
                  actions={schemaAction}
                />
              </Col>
            </Row>
          )}
          <div className={styles.drawer_tb_wrap}>
            <NestTable
              NestColumns={nestColumns}
              className="common_tb"
              rowClassName={(_, index) => index % 2 === 0 && 'tb_bg'}
              {...nestTableProps}
            />
          </div>
          {nestPagination && <div className={styles.drawer_tb_pagination}>{nestPagination}</div>}
        </div>
      ) : (
        <StandardTable
          tableType="small"
          currentRef={selfRef}
          formRender={(child, ps) => (
            <Row justify="space-between">
              <Col span={18} style={{ zIndex: 99 }}>
                {child}
              </Col>
              <Col style={{ marginTop: 4 }}>{ps}</Col>
            </Row>
          )}
          formilyProps={
            modalType === 'none'
              ? null
              : {
                  ctx: {
                    schema: modelSchemaRender(),
                    components: {
                      ModalSearch: Search,
                      SearchSelect,
                      Submit,
                      DateSelect,
                    },
                    effects: ($, actions) => {
                      useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)
                    },
                  },
                }
          }
          {...resetTable}
        />
      )}
    </Drawer>
  )
}

TableDrawer.defaultProps = {}

export default TableDrawer
