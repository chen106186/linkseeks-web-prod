// 全局注册虚拟布局组件
import React, { Fragment } from 'react'
import { registerVirtualBox, SchemaField, FormItemShallowProvider, FormExpressionScopeContext } from '@apps/formily'
import { Col, Row, Space, Form } from 'antd'
import cx from 'classnames'
import styled from 'styled-components'
import MellowCard from '@/components/MellowCard'
import themeConfig from '../../../../config/lingxi.theme.config'

const RowLayout = styled((props) => <Row justify="end" {...props} />)`
  .mega-layout-item {
    margin-bottom: 20px !important;
  }
  .mega-layout-container {
    margin-bottom: 0;
  }
`

const FlagBox = styled((props) => <div {...props} />)`
  .flag-box-title {
    margin-bottom: ${themeConfig['@margin-lg']};
    line-height: ${themeConfig['@font-size-lg']};
    font-size: ${themeConfig['@font-size-lg']};
    font-weight: 500;
  }
  .flag-box-title.border {
    padding-left: ${themeConfig['@padding-xs']};
    border-left: 2px solid ${themeConfig['@primary-color']};
  }
`

const StyleMegalayout = styled((props) => <div {...props} />)`
  .mega-layout-item-content {
    display: flex;
    line-height: 32px;
    & > .ant-form-item {
      margin-bottom: 0px;
    }
    & > .formily-mega-item-before,
    & > .formily-mega-item-after {
      flex: initial;
      margin-right: 10px;
      margin-bottom: 0px;
      display: inline-flex;
      -webkit-box-align: center;
      align-items: center;
      height: 32px;
      font-size: 14px;
    }
    & > .formily-mega-item-after {
      margin-right: 0px;
      margin-left: 10px;
    }
  }
`

const renderCol = (schema, isLast) => {
  const { flexcol = {} } = schema['x-component-props']
  return (
    <Col style={isLast ? {} : { marginRight: 24 }} {...flexcol} key={schema.path}>
      <SchemaField schema={schema.toJSON()} path={schema.path} />
    </Col>
  )
}
// 自定义flex布局容器
registerVirtualBox('flex-box', (props) => {
  const childProperties = props.schema.getOrderProperties()
  const { title, required } = props.props
  const { labelcol, wrappercol } = props.schema.getExtendsComponentProps()
  return (
    <Row>
      {title && (
        <Col span={labelcol} className={cx(required ? 'flex-layout-label-required' : '')}>
          {title}
        </Col>
      )}
      <Col span={wrappercol}>
        <Row>{childProperties.map((v, i, arr) => renderCol(v.schema, arr.length - 1 === i))}</Row>
      </Col>
    </Row>
  )
})

registerVirtualBox('flex-layout', (_props) => {
  const { children, props } = _props
  const rowStyle = props['x-component-props'] ? props['x-component-props'].rowStyle : {}
  const colStyle = props['x-component-props'] ? props['x-component-props'].colStyle : {}
  return (
    <RowLayout style={rowStyle}>
      {children.map((v, i) => {
        const visible = v?.props.schema?.visible ?? true
        // console.log(v.props)
        if (!visible) {
          return null
        }
        return (
          <Col style={colStyle} key={i}>
            {v}
          </Col>
        )
      })}
    </RowLayout>
  )
})
registerVirtualBox('empty-layout', (_props) => {
  const { children, props } = _props
  return <div>{children}</div>
})

// 操作按钮集合
registerVirtualBox('controller-group', (_props) => {
  const { children, props } = _props
  return <Space>{children}</Space>
})

// 左右两列布局
registerVirtualBox('LeftRightLayout', (_props) => {
  const { children, props } = _props
  const leftItems = children.filter(
    (child) => child.props.schema['x-component-props'] && child.props.schema['x-component-props'].position === 'left',
  )
  const rightItems = children.filter(
    (child) => child.props.schema['x-component-props'] && child.props.schema['x-component-props'].position === 'right',
  )
  const wrapProps = props['x-component-props'] ? props['x-component-props'].wrapProps : {}
  const leftProps = props['x-component-props'] ? props['x-component-props'].leftProps : {}
  const rightProps = props['x-component-props'] ? props['x-component-props'].rightProps : {}

  return (
    <Row align="middle" {...wrapProps}>
      {leftItems.map((item, index) => (
        <Col span={18} {...leftProps} key={index}>
          {item}
        </Col>
      ))}
      {rightItems.map((item, index) => (
        <Col span={6} {...rightProps} key={index}>
          {item}
        </Col>
      ))}
    </Row>
  )
})

// 标题带右边框的容器
registerVirtualBox('FlagBox', (_props) => {
  const { children, props } = _props
  const title = props['x-component-props'] ? props['x-component-props'].title : ''
  const border = props['x-component-props'] ? props['x-component-props'].border || true : true
  const wrapProps = props['x-component-props'] ? props['x-component-props'].wrapProps : {}

  const titleCls = cx('flag-box-title', { border: border })

  return (
    <FlagBox {...wrapProps}>
      <div className={titleCls}>{title}</div>
      <div>{children}</div>
    </FlagBox>
  )
})

// Card 容器
registerVirtualBox('MellowCardBox', (_props) => {
  const { children, props: outerProps } = _props
  const props = outerProps['x-component-props'] || {}
  return <MellowCard {...props}>{children}</MellowCard>
})

// 分列 容器
registerVirtualBox('ColumnLayout', (_props) => {
  const { children, props } = _props
  const xComponentProps = props['x-component-props'] || {}
  const { column = 3, gutter = 20 } = xComponentProps

  const span = 24 / column

  const childNodes: React.ReactElement[] = React.Children.map(children, (child) => child)

  const cols = Array.apply(null, Array(column)).map(() => [])

  childNodes.forEach((item, index) => {
    cols[index % column].push(item)
  })

  return (
    <Row gutter={gutter}>
      {cols.map((item, index) => (
        <Col key={index} span={span}>
          {item}
        </Col>
      ))}
    </Row>
  )
})

// 复写mega-layout
registerVirtualBox('mega-layout', (_props) => {
  const { children, props }: any = _props
  const xComponentProps = props['x-component-props'] || {}
  const {
    columns,
    grid,
    autoRow,
    full,
    span,
    labelCol,
    wrapperCol,
    labelAlign,
    labelWidth,
    wrapperWidth,
    label,
    megaLayoutClassName,
    ...others
  } = xComponentProps

  const hasMegaPropsSpan = children?.filter((item) => item?.props?.schema?.['x-mega-props']?.span)?.length > 0

  const isRenderRows = labelCol || wrapperCol || labelAlign || labelWidth || wrapperWidth || columns

  const _renderChildren = () => {
    if (grid) {
      return React.Children.map(children, (_child: any) => {
        if (_child === null) {
          return null
        }
        const { span: _span } = _child.props.schema?.['x-mega-props'] || {}
        const { span: _spanCP } = _child.props.schema?.['x-component-props'] || {}
        const _layItemProps: any = {
          flex: _span || 'auto',
        }
        if (!_span) {
          _layItemProps.span = _spanCP ? _spanCP : span || 24 / (columns || 1)
        }
        return (
          <Col {..._layItemProps} key={_child.props.schema.path}>
            <FormItemShallowProvider {...xComponentProps}>
              <SchemaField schema={_child.props.schema.toJSON()} path={_child.props.schema.path} />
            </FormItemShallowProvider>
          </Col>
        )
      })
    } else {
      return (
        <Col span={24} {...others}>
          {children}
        </Col>
      )
    }
  }

  const _renderRow = () => {
    if (isRenderRows) {
      return (
        <Row wrap={autoRow} gutter={20} {...others}>
          {React.Children.map(children, (_child: any) => {
            if (_child === null) {
              return null
            }
            const _labelAlign = labelAlign !== 'top' ? labelAlign : 'left'
            const _isMega = _child['props']['schema']['x-component'] === 'mega-layout'
            const _parentHadLabel = _child.props.schema.parent['x-component-props']?.['label']
            const _parentHadFull = _child.props.schema.parent['x-component-props']?.['full']
            const _parentHadLayoutProps = _child.props.schema.parent['x-component-props']?.['layoutProps']
            const _parentColumn = _child.props.schema.parent['x-component-props']?.['columns']

            if (_isMega) {
              // 手动传递labelAlign
              _child['props']['schema']['x-component-props'] = {
                ..._child['props']['schema']['x-component-props'],
                labelAlign: _labelAlign,
              }
              const { label: title, required, layoutProps } = _child.props.schema.getExtendsComponentProps()
              const _containerCol = title && layoutProps ? layoutProps?.wrapperCol : title ? wrapperCol : 24
              const _renderTitle = (scope, scopeTitle) => {
                const ExpRE = /^\s*\{\{(.*)\}\}\s*$/
                const matched = typeof scopeTitle === 'string' ? scopeTitle.match(ExpRE) : undefined
                if (!matched) return scopeTitle
                const _title = scopeTitle.replace(/{/g, '').replace(/}/g, '')
                return scope[_title]
              }
              const _render = (scope) => {
                return (
                  <Col
                    span={labelAlign === 'top' ? 24 : labelCol}
                    className={`ant-form-item-label ant-form-item-label-${_labelAlign || 'left'}`}
                  >
                    <label className={required ? 'ant-form-item-required' : ''} title={title}>
                      {_renderTitle(scope, title)}
                    </label>
                  </Col>
                )
              }
              return (
                <Col span={24 / (columns || 1)}>
                  <Row>
                    {title && (
                      <FormExpressionScopeContext.Consumer>
                        {(scope) => _render(scope)}
                      </FormExpressionScopeContext.Consumer>
                    )}
                    <Col span={labelAlign === 'top' ? 24 : _containerCol}>
                      <FormItemShallowProvider {...xComponentProps} labelAlign={_labelAlign}>
                        {_child}
                      </FormItemShallowProvider>
                    </Col>
                  </Row>
                </Col>
              )
            }
            // 父级带有label属性子元素隔绝label
            if (_parentHadLabel) {
              delete xComponentProps.label
            }
            // 父级带有full属性子元素设置width: 100%
            if (_parentHadFull) {
              const _childStyle = _child.props.schema?.['x-component-props']?.['style'] || {}
              const _mixChildStyle = { ..._childStyle, width: '100%' }
              _child.props.schema['x-component-props'] = {
                ..._child.props.schema['x-component-props'],
                style: _mixChildStyle,
              }
            }
            // 父级带有layoutProps属性
            if (_parentHadLayoutProps) {
              if (_parentHadLayoutProps?.wrapperCol && !_parentHadLayoutProps?.labelCol) {
                xComponentProps.wrapperCol = _parentHadLayoutProps?.wrapperCol
                xComponentProps.labelCol = 24 - _parentHadLayoutProps?.wrapperCol
              } else if (!_parentHadLayoutProps?.wrapperCol && _parentHadLayoutProps?.labelCol) {
                xComponentProps.wrapperCol = 24 - _parentHadLayoutProps?.labelCol
                xComponentProps.labelCol = _parentHadLayoutProps?.labelCol
              } else if (_parentHadLayoutProps?.wrapperCol && _parentHadLayoutProps?.labelCol) {
                xComponentProps.wrapperCol = _parentHadLayoutProps?.wrapperCol
                xComponentProps.labelCol = _parentHadLayoutProps?.labelCol
              }
              delete xComponentProps.layoutProps
            }
            const { span: _span, addonBefore, addonAfter } = _child.props.schema?.['x-mega-props'] || {}
            const { span: _spanCP } = _child.props.schema?.['x-component-props'] || {}

            const hasMegaProps = _child.props.schema?.['x-mega-props']

            const _layItemProps: any = {
              // span: _span ? _span : _spanCP || 24 / (columns || 1)
            }

            if (grid && hasMegaProps) {
              _layItemProps.flex = _span || 'auto'
            } else {
              _layItemProps.span = _spanCP ? _spanCP : span || 24 / (columns || 1)
            }

            // 兼容addonBefore, addonAfter 情况
            const childSchema = _child.props.schema.toJSON()
            const { title, required, description, visible, display } = childSchema
            const schema = {
              ...childSchema,
              title: '',
            }

            const WraoComponent =
              (visible !== false && display !== false) || !_parentColumn || (_parentColumn && _parentColumn < 2)
                ? Col
                : Fragment

            return (
              <WraoComponent {..._layItemProps}>
                <FormItemShallowProvider {...xComponentProps} labelAlign={_labelAlign}>
                  {/* {_child} */}
                  {/*bug visible 设置为false 时候 还显示 addonBefore addonAfter*/}
                  {addonBefore || addonAfter ? (
                    <StyleMegalayout>
                      <Form.Item
                        label={title}
                        required={required}
                        help={description}
                        labelAlign={labelAlign || undefined}
                        labelCol={{
                          span: labelCol,
                        }}
                      >
                        <div className="mega-layout-item-content">
                          {addonBefore ? <p className="formily-mega-item-before">{addonBefore}</p> : null}
                          <SchemaField schema={schema} path={_child.props.schema.path} />
                          {addonAfter ? <p className="formily-mega-item-after">{addonAfter}</p> : null}
                        </div>
                      </Form.Item>
                    </StyleMegalayout>
                  ) : (
                    _child
                  )}
                </FormItemShallowProvider>
              </WraoComponent>
            )
          })}
        </Row>
      )
    } else {
      return (
        <Row wrap={autoRow} gutter={20} {...others}>
          {_renderChildren()}
        </Row>
      )
    }
  }

  return <>{_renderRow()}</>
})
