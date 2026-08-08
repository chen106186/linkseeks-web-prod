import classNames from 'classnames'
import React from 'react'
import { ScrollView } from '@tarojs/components'
import { GodModalContentProps } from '../../../types/modal'

export default class GodModalContent extends React.Component<
  GodModalContentProps
> {
  public render(): JSX.Element {
    const rootClass = classNames('at-modal__content', this.props.className)
    return (
      <ScrollView scrollY className={rootClass}>
        {this.props.children}
      </ScrollView>
    )
  }
}
