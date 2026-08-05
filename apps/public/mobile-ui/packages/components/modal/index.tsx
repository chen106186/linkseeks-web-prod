import classNames from 'classnames'
import PropTypes, { InferProps } from 'prop-types'
import React from 'react'
import { Button, Text, View } from '@tarojs/components'
import { CommonEvent } from '@tarojs/components/types/common'
import { getEnv, ENV_TYPE } from '@tarojs/taro'
import { GodModalProps, GodModalState } from '../../types/modal'
import { handleTouchScroll } from '../../common/utils'
import GodModalAction from './action/index'
import GodModalContent from './content/index'
import GodModalHeader from './header/index'

export default class GodModal extends React.Component<GodModalProps, GodModalState> {
  public static defaultProps: GodModalProps
  public static propTypes: InferProps<GodModalProps>

  public constructor(props: GodModalProps) {
    super(props)
    const { isOpened } = props
    this.state = {
      _isOpened: isOpened,
      isWEB: getEnv() === ENV_TYPE.WEB,
    }
  }

  public UNSAFE_componentWillReceiveProps(nextProps: GodModalProps): void {
    const { isOpened } = nextProps

    if (this.props.isOpened !== isOpened) {
      handleTouchScroll(isOpened)
    }

    if (isOpened !== this.state._isOpened) {
      this.setState({
        _isOpened: isOpened,
      })
    }
  }

  private handleClickOverlay = (): void => {
    if (this.props.closeOnClickOverlay) {
      this.setState(
        {
          _isOpened: false,
        },
        this.handleClose,
      )
    }
  }

  private handleClose = (event?: CommonEvent): void => {
    if (typeof this.props.onClose === 'function') {
      this.props.onClose(event!)
    }
  }

  private handleCancel = (event: CommonEvent): void => {
    if (typeof this.props.onCancel === 'function') {
      this.props.onCancel(event)
    }
  }

  private handleConfirm = (event: CommonEvent): void => {
    if (typeof this.props.onConfirm === 'function') {
      this.props.onConfirm(event)
    }
  }

  private handleTouchMove = (e: CommonEvent): void => {
    e.stopPropagation()
  }

  public render(): JSX.Element {
    const { _isOpened, isWEB } = this.state
    const { title, content, cancelText, confirmText } = this.props
    const rootClass = classNames(
      'at-modal',
      {
        'at-modal--active': _isOpened,
      },
      this.props.className,
    )

    if (title || content) {
      const isRenderAction = cancelText || confirmText
      return (
        <View className={rootClass}>
          <View onClick={this.handleClickOverlay} className="at-modal__overlay" />
          <View className="at-modal__container">
            {title && (
              <GodModalHeader>
                <Text>{title}</Text>
              </GodModalHeader>
            )}
            {content && (
              <GodModalContent>
                <View className="content-simple">
                  {isWEB ? (
                    <Text
                      // @ts-ignore
                      dangerouslySetInnerHTML={{
                        __html: content.replace(/\n/g, '<br/>'),
                      }}
                    ></Text>
                  ) : (
                    <Text>{content}</Text>
                  )}
                </View>
              </GodModalContent>
            )}
            {isRenderAction && (
              <GodModalAction isSimple>
                {cancelText && <Button onClick={this.handleCancel}>{cancelText}</Button>}
                {confirmText && <Button onClick={this.handleConfirm}>{confirmText}</Button>}
              </GodModalAction>
            )}
          </View>
        </View>
      )
    }

    return (
      <View onTouchMove={this.handleTouchMove} className={rootClass}>
        <View className="at-modal__overlay" onClick={this.handleClickOverlay} />
        <View className="at-modal__container">{this.props.children}</View>
      </View>
    )
  }
}

GodModal.defaultProps = {
  isOpened: false,
  closeOnClickOverlay: true,
}

GodModal.propTypes = {
  title: PropTypes.string,
  isOpened: PropTypes.bool,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
  onClose: PropTypes.func,
  content: PropTypes.string,
  closeOnClickOverlay: PropTypes.bool,
  cancelText: PropTypes.string,
  confirmText: PropTypes.string,
}
