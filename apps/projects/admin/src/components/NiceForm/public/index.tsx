// 全局注册虚拟布局组件
import React from 'react'
import { registerVirtualBox, SchemaField, FormItemShallowProvider, FormExpressionScopeContext } from '@apps/formily'
import { Col, Row, Space } from 'antd'
import cx from 'classnames'
import styled from 'styled-components'
import MellowCard from '@/components/MellowCard'

const RowLayout = styled((props) => <Row justify="end" {...props} />)`
  .mega-layout-item {
    margin-bottom: 20px !important;
  }
  .mega-layout-container {
    margin-bottom: 0;
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
      {children.map((v, i) => (
        <Col style={colStyle} key={i}>
          {v}
        </Col>
      ))}
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
  const { column = 3 } = xComponentProps

  const span = 24 / column

  const childNodes: React.ReactElement[] = React.Children.map(children, (child) => child)

  const cols = Array.apply(null, Array(column)).map(() => [])

  childNodes.forEach((item, index) => {
    cols[index % column].push(item as never)
  })

  return (
    <Row gutter={20}>
      {cols.map((item, index) => (
        <Col key={index} span={span}>
          {item}
        </Col>
      ))}
    </Row>
  )
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
                const matched = scopeTitle.match(ExpRE)
                if (!matched) return scopeTitle
                const _title = scopeTitle.replace(/{/g, '').replace(/}/g, '')
                return scope[_title]
              }
              const _render = (scope) => {
                return (
                  <Col span={labelCol} className={`ant-form-item-label ant-form-item-label-${_labelAlign || 'left'}`}>
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
                    <Col span={_containerCol}>
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
            const { span: _span } = _child.props.schema?.['x-mega-props'] || {}
            const { span: _spanCP } = _child.props.schema?.['x-component-props'] || {}
            const _layItemProps: any = {}
            if (grid && hasMegaPropsSpan) {
              _layItemProps.flex = _span || 'auto'
            } else {
              _layItemProps.span = _spanCP ? _spanCP : span || 24 / (columns || 1)
            }
            return (
              <Col {..._layItemProps}>
                <FormItemShallowProvider {...xComponentProps} labelAlign={_labelAlign}>
                  {_child}
                </FormItemShallowProvider>
              </Col>
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
