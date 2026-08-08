import type { RefObject, MouseEvent } from 'react'
import React, { Component } from 'react'
import type { FormInstance, ColProps, RowProps } from 'antd'
import { Row, Col, Input } from 'antd'

import { SchemaForm, setup } from '@apps/formily'
import type { ButtonType } from 'antd/lib/button'
import type { IAntdSchemaFormProps, ISchemaFormAsyncActions } from '@apps/formily'
import SearchFilter from './SearchFilter'

export type EmptyFunction = null | Function

export interface ITableControllerRef {
  reload: () => void
  resetField: (params?: any) => void
  schemaAction: any
}

export interface IExportXslConfig {
  url: string
  fileName: string
}

export type formTypes = 'Input' | 'Select' | 'Select&Input' | 'RangePicker' | 'Search'
export type buttonTypes = ButtonType

export interface IFormFilter {
  type: formTypes
  label?: string
  value: string
  placeHolder?: string
  defaultValue?: string
  resetField?: string
  col?: number
  offset?: number
  statusList?: Array<IFormFilter>
  subValue?: string
  subDefaultValue?: string
}

export interface IButtonFilter {
  type?: buttonTypes
  text?: string
  icon?: JSX.Element
  loading?: boolean

  handler(event: MouseEvent): void
}

export interface ITableControllerProps extends FormilyCustomProps {
  // toolBarCol?: number;
  // addController?: EmptyFunction;
  // exportController?: EmptyFunction;
  // exportXslConfig?: IExportXslConfig;
  /**
   * @description 请求数据的载体
   * @memberof ITableControllerProps
   */
  fetchTableData(queryParams?): Promise<any>
  resetTableData(): void

  /**
   * @description 引入的实例
   * @type {RefObject<any>}
   * @memberof ITableControllerProps
   */
  currentRef?: RefObject<ITableControllerRef>
  // formFilters?: Array<IFormFilter>;
  // formAlign?: 'left' | 'right';
  // parentRef?: RefObject<ITableControllerRef>;
  resetTablagePage?()
  // 控制提升, 用于共享组件实例
  schemaActions: ISchemaFormAsyncActions
}

export interface FormilyCustomProps {
  // v1 新增formily, 可通过formily定制顶部表单
  formilyProps?: {
    // 表单外层的Col布局
    layouts?: ColProps
    ctx: IAntdSchemaFormProps
  }
  formilyChilds?: {
    // 按钮外层的Col布局
    children: React.ReactNode | Function
    layouts?: ColProps
  }
  // 整个渲染层的row布局
  formilyLayouts?: RowProps
}

export interface ITableControllerState {
  /**
   * @description 导出按钮loading
   * @type {boolean}
   * @memberof ITableControllerState
   */
  exportXslBtnLoading: boolean

  /**
   * @description 搜索按钮loading
   * @type {boolean}
   * @memberof ITableControllerState
   */
  submitSearchBtnLoading: boolean
}

const SearchComponent = (props) => {
  return (
    <Input.Search
      value={props.value || ''}
      onChange={(e) => props.mutators.change(e.target.value)}
      onSearch={() => {
        props.form.submit()
      }}
      {...props.props['x-component-props']}
    />
  )
}

SearchComponent.isFieldComponent = true
setup()
class TableController extends Component<ITableControllerProps, ITableControllerState> {
  static defaultProps = {
    // toolBarCol: 6,
    // formFilters: [],
  }

  state = {
    exportXslBtnLoading: false,
    submitSearchBtnLoading: false,
  }

  /**
   * @description Form实例类型定义
   * @memberof TableController
   */
  public formRef = React.createRef<FormInstance>()

  // 发起表格请求
  handleSubmit(values) {
    const { fetchTableData } = this.props
    this.props.resetTablagePage().then(() => {
      this.setState(
        {
          submitSearchBtnLoading: true,
        },
        () => {
          if (typeof fetchTableData === 'function') {
            fetchTableData(values)
              .catch((err) => {
                typeof err === 'string' && console.warn(err)
              })
              .finally(() => {
                this.setState({
                  submitSearchBtnLoading: false,
                })
              })
          } else {
            this.setState({
              submitSearchBtnLoading: false,
            })
          }
        },
      )
    })
  }

  // 重置表格
  resetForm() {
    this.formRef.current.resetFields()
    this.props.resetTableData()
  }

  // 开始导出表格
  // handleExportXsl() {
  //   // exportXslConfig 是传入的excel配置
  //   // const { exportController, exportXslConfig } = this.props;
  //   this.setState(
  //     {
  //       exportXslBtnLoading: true,
  //     },
  //     () => {
  //       // 导出表格 TODO

  //       this.setState(
  //         {
  //           exportXslBtnLoading: false,
  //         },
  //         () => {
  //           // 导出表格后的回调函数
  //           exportController();
  //         },
  //       );
  //     },
  //   );
  // }

  defaultSchemaProps = {
    inline: true,
    onSubmit: this.handleSubmit.bind(this),
  }

  render() {
    const { formilyProps, formilyLayouts, formilyChilds } = this.props
    return (
      // TODO 关于按钮与表单的布局冲突， 可通过formsolt解决或者自己定制rows
      <>
        <Row {...formilyLayouts}>
          {formilyProps && (
            <Col {...formilyProps.layouts}>
              <SchemaForm
                className="god-schema-form"
                {...this.defaultSchemaProps}
                {...formilyProps.ctx}
                components={{
                  Search: SearchComponent,
                  SearchFilter,
                  ...formilyProps.ctx.components,
                }}
                actions={this.props.schemaActions}
              ></SchemaForm>
            </Col>
          )}
          {/* function可直接使用内置的submit方法 */}
          {formilyChilds &&
            (typeof formilyChilds.children === 'function' ? (
              formilyChilds.children({ actions: this.props.schemaActions })
            ) : (
              <Col {...formilyChilds.layouts}>{formilyChilds.children}</Col>
            ))}
        </Row>
      </>
    )
  }
}

export default TableController
