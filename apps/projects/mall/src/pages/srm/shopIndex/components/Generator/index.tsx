import * as React from 'react'

export const ConfigContext = React.createContext<any>({
  getPrefixCls: (suffixCls: string, customizePrefixCls?: string) => {
    if (customizePrefixCls) return customizePrefixCls

    return suffixCls ? `lingxi-${suffixCls}` : 'lingxi'
  },
})

export const ConfigConsumer = ConfigContext.Consumer

export interface BasicProps extends React.HTMLAttributes<HTMLDivElement> {
  prefixCls?: string
}

export interface GeneratorProps {
  suffixCls: string
  tagName: 'section' | 'nav' | 'div' | 'span'
  displayName: string
}

export const Generator = ({ suffixCls, tagName, displayName }: GeneratorProps) => {
  return (BasicComponent: any) => {
    return class Adapter extends React.Component<BasicProps, any> {
      static displayName: string = displayName

      renderComponent = ({ getPrefixCls }: any) => {
        const { prefixCls: customizePrefixCls } = this.props
        const prefixCls = getPrefixCls(suffixCls, customizePrefixCls)

        return <BasicComponent prefixCls={prefixCls} tagName={tagName} {...this.props} />
      }

      render() {
        return <ConfigConsumer>{this.renderComponent}</ConfigConsumer>
      }
    }
  }
}
