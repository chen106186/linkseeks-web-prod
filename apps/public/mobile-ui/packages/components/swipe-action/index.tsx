import classNames from 'classnames'
import { getEnv, ENV_TYPE, getSystemInfoSync } from '@tarojs/taro'
import PropTypes, { InferProps } from 'prop-types'
import React from 'react'
import { Text, View, MovableArea, MovableView } from '@tarojs/components'
import { CommonEvent } from '@tarojs/components/types/common'
import { GodSwipeActionProps, GodSwipeActionState, SwipeActionOption } from '../../types/swipe-action'
import { uuid } from '../../common/utils'
import GodSwipeActionOptions from './options/index'

const ENV = getEnv()
const IS_WEB = ENV === ENV_TYPE.WEB

export default class GodSwipeAction extends React.Component<GodSwipeActionProps, GodSwipeActionState> {
  public static propTypes: InferProps<GodSwipeActionProps>
  public static defaultProps: GodSwipeActionProps

  private maxOffsetSize: number
  private moveX: number
  private eleWidth: number
  private moveRatio: number
  private lastPointX: number = 0
  private lastPointY: number = 0
  private isH5: boolean = IS_WEB

  public constructor(props: GodSwipeActionProps) {
    super(props)
    const { isOpened, areaWidth, moveRatio, options, maxDistance } = props
    this.maxOffsetSize = maxDistance || (options ? options.length * (this.isH5 ? 152 : 120) : 0)
    this.state = {
      componentId: uuid(),
      // eslint-disable-next-line no-extra-boolean-cast
      offsetSize: !!isOpened ? -this.maxOffsetSize : 0,
      _isOpened: !!isOpened,
      moveXH5: 0,
      // needAnimation: false
    }
    this.moveX = this.state.offsetSize
    this.eleWidth = areaWidth
    this.moveRatio = moveRatio || 0.5
  }

  public UNSAFE_componentWillReceiveProps(nextProps: GodSwipeActionProps): void {
    const { isOpened } = nextProps
    const { _isOpened } = this.state

    if (isOpened !== _isOpened) {
      this.moveX = isOpened ? 0 : this.maxOffsetSize
      this._reset(!!isOpened) // TODO: Check behavior
    }
  }

  private _reset(isOpened: boolean): void {
    if (isOpened) {
      if (ENV === ENV_TYPE.JD) {
        this.setState({
          _isOpened: true,
          moveXH5: this.maxOffsetSize + 0.01,
          offsetSize: -this.maxOffsetSize + 0.01,
        })
      } else {
        this.setState({
          _isOpened: true,
          offsetSize: -this.maxOffsetSize,
          moveXH5: this.maxOffsetSize,
        })
      }
    } else {
      this.setState(
        {
          offsetSize: this.moveX,
        },
        () => {
          this.setState({
            offsetSize: 0,
            moveXH5: 0,
            _isOpened: false,
          })
        },
      )
    }
  }

  private handleOpened = (event: CommonEvent): void => {
    const { onOpened } = this.props
    if (typeof onOpened === 'function') {
      onOpened(event)
    }
  }

  private handleClosed = (event: CommonEvent): void => {
    const { onClosed } = this.props
    if (typeof onClosed === 'function') {
      onClosed(event)
    }
  }

  private handleClick = (item: SwipeActionOption, index: number, event: CommonEvent): void => {
    const { onClick, autoClose } = this.props
    if (typeof onClick === 'function') {
      onClick(item, index, event)
    }
    if (autoClose) {
      this._reset(false) // TODO: Check behavior
      this.handleClosed(event)
    }
  }

  onTouchEnd = (e) => {
    if (this.isH5 && e.target.className.indexOf('at-swipe-action__option') >= 0) {
      return
    }
    if (this.moveX === -this.maxOffsetSize) {
      this._reset(true)
      this.handleOpened(e)
      return
    }
    if (this.moveX === 0) {
      this._reset(false)
      this.handleClosed(e)
      return
    }
    if (this.state._isOpened && this.moveX > 0 && this.isH5) {
      this._reset(false)
      this.handleClosed(e)
      return
    }
    if (this.state._isOpened && this.moveX < 0) {
      this._reset(false)
      this.handleClosed(e)
      return
    }
    if (Math.abs(this.moveX) < this.maxOffsetSize * this.moveRatio) {
      this._reset(false)
      this.handleClosed(e)
    } else {
      this._reset(true)
      this.handleOpened(e)
    }
  }

  handleTouchStart = (e: any) => {
    this.lastPointY = e.touches[0].clientY
    this.lastPointX = e.touches[0].clientX
  }

  onChangeH5 = (e) => {
    let maxLeft = this.maxOffsetSize
    let changeX = ~(e.touches[0].clientX - this.lastPointX)
    let changeY = ~(e.touches[0].clientY - this.lastPointY)
    let _moveX = 0
    if (
      (Math.abs(changeX) > Math.abs(changeY) && changeX > 0) ||
      (Math.abs(changeX) > Math.abs(changeY) && changeX < 0)
    ) {
      if (changeX > 0 && changeX < maxLeft) {
        _moveX = changeX
      } else if (changeX >= maxLeft) {
        _moveX = maxLeft
      } else if (changeX <= 0) {
        _moveX = this.maxOffsetSize + changeX
      }
    }

    this.setState({ moveXH5: _moveX })
    this.moveX = _moveX
  }

  onChange = (e) => {
    this.moveX = e.detail.x
  }

  public render(): JSX.Element {
    const { componentId, offsetSize } = this.state
    const { options } = this.props
    const rootClass = classNames('at-swipe-action', this.props.className)

    return this.isH5 ? (
      <View
        id={`swipeAction-${componentId}`}
        className={rootClass}
        style={{
          width: `${this.eleWidth}px`,
        }}
      >
        <View
          className="at-swipe-action__area"
          style={{
            width: `${this.eleWidth + this.maxOffsetSize}px`,
            transform: `translate(-${this.maxOffsetSize}px, 0)`,
          }}
        >
          <View
            className="at-swipe-action__content"
            style={{
              width: `${this.eleWidth}px`,
              left: `${this.maxOffsetSize}px`,
              transform: `translateX(-${this.state.moveXH5}px) translateY(0px) translateZ(0px) scale(1)`,
              transformOrigin: 'center center',
              transitionDuration: '0.2s',
              transitionTimingFunction: 'linear',
              willChange: 'auto',
            }}
            onTouchStart={this.handleTouchStart}
            onTouchMove={this.onChangeH5}
            onTouchEnd={this.onTouchEnd}
          >
            {this.props.children}
            {Array.isArray(options) && options.length > 0 ? (
              <GodSwipeActionOptions
                options={options}
                componentId={componentId}
                customStyle={{
                  transform: `translate(${this.maxOffsetSize}px, 0)`,
                  opacity: 1,
                }}
              >
                {options.map((item, key) => (
                  <View
                    key={`${item.text}-${key}`}
                    style={item.style}
                    onClick={(e): void => this.handleClick(item, key, e)}
                    className={classNames('at-swipe-action__option', item.className)}
                  >
                    <Text className="option__text">{item.text}</Text>
                  </View>
                ))}
              </GodSwipeActionOptions>
            ) : null}
          </View>
        </View>
      </View>
    ) : (
      <View
        id={`swipeAction-${componentId}`}
        className={rootClass}
        style={{
          width: `${this.eleWidth}px`,
        }}
      >
        <MovableArea
          className="at-swipe-action__area"
          style={{
            width: `${this.eleWidth + this.maxOffsetSize}px`,
            transform: `translate(-${this.maxOffsetSize}px, 0)`,
          }}
        >
          <MovableView
            className="at-swipe-action__content"
            direction="horizontal"
            damping={50}
            x={offsetSize}
            onTouchEnd={this.onTouchEnd}
            onChange={this.onChange}
            style={{
              width: `${this.eleWidth}px`,
              left: `${this.maxOffsetSize}px`,
            }}
          >
            {this.props.children}
            {Array.isArray(options) && options.length > 0 ? (
              <GodSwipeActionOptions
                options={options}
                componentId={componentId}
                customStyle={{
                  transform: `translate(${this.maxOffsetSize}px, 0)`,
                  opacity: 1,
                }}
              >
                {options.map((item, key) => (
                  <View
                    key={`${item.text}-${key}`}
                    style={item.style}
                    onClick={(e): void => this.handleClick(item, key, e)}
                    className={classNames('at-swipe-action__option', item.className)}
                  >
                    <Text className="option__text">{item.text}</Text>
                  </View>
                ))}
              </GodSwipeActionOptions>
            ) : null}
          </MovableView>
        </MovableArea>
      </View>
    )
  }
}

GodSwipeAction.defaultProps = {
  options: [],
  isOpened: false,
  disabled: false,
  autoClose: false,
  maxDistance: 0,
  areaWidth: getSystemInfoSync().screenWidth,
}

GodSwipeAction.propTypes = {
  isOpened: PropTypes.bool,
  disabled: PropTypes.bool,
  autoClose: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
      style: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
      className: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.array]),
    }),
  ),

  onClick: PropTypes.func,
  onOpened: PropTypes.func,
  onClosed: PropTypes.func,
}
