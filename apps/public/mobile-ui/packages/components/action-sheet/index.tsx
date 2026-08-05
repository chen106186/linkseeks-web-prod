import classNames from 'classnames'
import PropTypes, { InferProps } from 'prop-types'
import React from 'react'
import { View } from '@tarojs/components'
import { CommonEvent } from '@tarojs/components/types/common'
import { GodActionSheetProps, GodActionSheetState } from '../../types/action-sheet'
import GodActionSheetBody from './body/index'
import GodActionSheetFooter from './footer/index'
import GodActionSheetHeader from './header/index'
import GodActionSheetItem from './body/item'

export default class GodActionSheet extends React.Component<GodActionSheetProps, GodActionSheetState> {
  public static defaultProps: GodActionSheetProps
  public static propTypes: InferProps<GodActionSheetProps>

  public constructor(props: GodActionSheetProps) {
    super(props)
    const { isOpened } = props
    this.state = {
      _isOpened: isOpened,
    }
  }

  public UNSAFE_componentWillReceiveProps(nextProps: GodActionSheetProps): void {
    const { isOpened } = nextProps
    if (isOpened !== this.state._isOpened) {
      this.setState({
        _isOpened: isOpened,
      })

      !isOpened && this.handleClose()
    }
  }

  private handleClose = (): void => {
    if (typeof this.props.onClose === 'function') {
      this.props.onClose()
    }
  }

  private handleCancel = (): void => {
    if (typeof this.props.onCancel === 'function') {
      return this.props.onCancel()
    }
    this.close()
  }

  private close = (): void => {
    this.setState(
      {
        _isOpened: false,
      },
      this.handleClose,
    )
  }

  private handleTouchMove = (e: CommonEvent): void => {
    e.stopPropagation()
    e.preventDefault()
  }

  public render(): JSX.Element {
    const { title, cancelText, className, actions, onSelect, customContainerStyle, customStyle, bodyStyle } = this.props
    const { _isOpened } = this.state

    const rootClass = classNames(
      'at-action-sheet',
      {
        'at-action-sheet--active': _isOpened,
      },
      className,
    )

    return (
      <View className={rootClass} onTouchMove={this.handleTouchMove}>
        <View onClick={this.close} className="at-action-sheet__overlay" />
        <View
          className={classNames('at-action-sheet__container', customContainerStyle && customContainerStyle)}
          style={customStyle}
        >
          {title && <GodActionSheetHeader>{title}</GodActionSheetHeader>}
          <GodActionSheetBody bodyStyle={bodyStyle}>
            {actions
              ? actions.map((v) => (
                  <GodActionSheetItem onClick={(e) => onSelect && onSelect(e, v)}>{v.name}</GodActionSheetItem>
                ))
              : this.props.children}
          </GodActionSheetBody>
          {cancelText && <GodActionSheetFooter onClick={this.handleCancel}>{cancelText}</GodActionSheetFooter>}
        </View>
      </View>
    )
  }
}

GodActionSheet.defaultProps = {
  title: '',
  cancelText: '',
  isOpened: false,
}

GodActionSheet.propTypes = {
  title: PropTypes.string,
  onClose: PropTypes.func,
  onCancel: PropTypes.func,
  isOpened: PropTypes.bool.isRequired,
  cancelText: PropTypes.string,
}
