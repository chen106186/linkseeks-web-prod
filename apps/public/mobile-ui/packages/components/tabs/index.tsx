import classNames from 'classnames'
import PropTypes, { InferProps } from 'prop-types'
import React from 'react'
import { ScrollView, View } from '@tarojs/components'
import { CommonEvent, ITouchEvent } from '@tarojs/components/types/common'
import { getEnv, ENV_TYPE } from '@tarojs/taro'
import { GodTabsProps, GodTabsState } from '../../types/tabs'
import { isTest, mergeStyle, uuid } from '../../common/utils'
import Badge from '../badge'

const ENV = getEnv()
const MIN_DISTANCE = 100
const MAX_INTERVAL = 10

export default class GodTabs extends React.Component<GodTabsProps, GodTabsState> {
  public static defaultProps: GodTabsProps
  public static propTypes: InferProps<GodTabsProps>

  private _tabId: string
  private _touchDot: number
  private _timer: NodeJS.Timeout | null
  private _interval: number
  private _isMoving: boolean
  private tabHeaderRef: any

  public constructor(props: GodTabsProps) {
    super(props)
    this.state = {
      _scrollLeft: 0,
      _scrollTop: 0,
      _scrollIntoView: '',
    }
    this._tabId = isTest() ? 'tabs-AOTU2021' : uuid()
    // 触摸时的原点
    this._touchDot = 0
    // 定时器
    this._timer = null
    // 滑动时间间隔
    this._interval = 0
    // 是否已经在滑动
    this._isMoving = false
  }

  private updateState = (idx: number): void => {
    if (this.props.scroll) {
      // 标签栏滚动
      switch (ENV) {
        case ENV_TYPE.WEAPP:
        case ENV_TYPE.ALIPAY:
        case ENV_TYPE.SWAN: {
          const index = Math.max(idx - 1, 0)
          this.setState({
            _scrollIntoView: `tab${this._tabId}${index}`,
          })
          break
        }
        case ENV_TYPE.WEB: {
          const index = idx + 1
          const prevTabItem = this.tabHeaderRef.childNodes[index]
          prevTabItem &&
            this.setState({
              _scrollTop: prevTabItem?.['s-nr']?.offsetTop ?? prevTabItem?.offsetTop,
              _scrollLeft: prevTabItem?.['s-nr']?.offsetLeft ?? prevTabItem?.offsetLeft,
            })
          break
        }
        default: {
          console.warn('GodTab 组件在该环境还未适配')
          break
        }
      }
    }
  }

  private handleClick(index: number, event: CommonEvent): void {
    this.props.onClick(index, event)
  }

  private handleTouchStart(e: ITouchEvent): void {
    const { swipeable, tabDirection } = this.props
    if (!swipeable || tabDirection === 'vertical') return
    // 获取触摸时的原点
    this._touchDot = e.touches[0].pageX
    // 使用js计时器记录时间
    this._timer = setInterval(() => {
      this._interval++
    }, 100)
  }

  private handleTouchMove(e: ITouchEvent): void {
    const { swipeable, tabDirection, current, tabList } = this.props
    if (!swipeable || tabDirection === 'vertical') return

    const touchMove = e.touches[0].pageX
    const moveDistance = touchMove - this._touchDot
    const maxIndex = tabList.length

    if (!this._isMoving && this._interval < MAX_INTERVAL && this._touchDot > 20) {
      // 向左滑动
      if (current + 1 < maxIndex && moveDistance <= -MIN_DISTANCE) {
        this._isMoving = true
        this.handleClick(current + 1, e)

        // 向右滑动
      } else if (current - 1 >= 0 && moveDistance >= MIN_DISTANCE) {
        this._isMoving = true
        this.handleClick(current - 1, e)
      }
    }
  }

  private handleTouchEnd(): void {
    const { swipeable, tabDirection } = this.props
    if (!swipeable || tabDirection === 'vertical') return

    clearInterval(this._timer as NodeJS.Timeout)
    this._interval = 0
    this._isMoving = false
  }

  private getTabHeaderRef(): void {
    if (ENV === ENV_TYPE.WEB) {
      this.tabHeaderRef = document.getElementById(this._tabId)
    }
  }

  public UNSAFE_componentWillReceiveProps(nextProps: GodTabsProps): void {
    if (nextProps.scroll !== this.props.scroll) {
      this.getTabHeaderRef()
    }
    if (nextProps.current !== this.props.current) {
      this.updateState(nextProps.current)
    }
  }

  public componentDidMount(): void {
    this.getTabHeaderRef()
    this.updateState(this.props.current)
  }

  public componentWillUnmount(): void {
    this.tabHeaderRef = null
  }

  public render(): JSX.Element {
    const {
      customStyle = '',
      className,
      height,
      tabDirection,
      transparentBg,
      animated,
      display,
      tabList,
      scroll,
      current,
    } = this.props
    const { _scrollLeft, _scrollTop, _scrollIntoView } = this.state

    const heightStyle = { height }
    const underlineStyle = {
      height: tabDirection === 'vertical' ? `${tabList.length * 100}%` : '1PX',
      width: tabDirection === 'horizontal' ? `${tabList.length * 100}%` : '1PX',
    }
    const bodyStyle: React.CSSProperties = {}
    let transformStyle = `translate3d(0px, -${current * 100}%, 0px)`
    if (tabDirection === 'horizontal') {
      transformStyle = `translate3d(-${current * 100}%, 0px, 0px)`
    }
    if (!display) {
      Object.assign(bodyStyle, {
        transform: transformStyle,
        WebkitTransform: transformStyle,
      })
    }
    if (!animated) {
      bodyStyle.transition = 'unset'
    }

    const tabItems = tabList.map((item, idx) => {
      const { hideUnderLine, activeColor } = this.props
      const itemCls = classNames({
        'at-tabs__item': true,
        'at-tabs__item--active': current === idx,
      })

      return (
        <View
          className={itemCls}
          style={current === idx && activeColor ? { color: activeColor } : {}}
          id={`tab${this._tabId}${idx}`}
          key={`at-tabs-item-${idx}`}
          onClick={this.handleClick.bind(this, idx)}
        >
          {item.title}
          {item?.badge !== 0 && item?.badge && <Badge count={item?.badge} className="at-tabs__item-badge" />}
          {!hideUnderLine && <View className="at-tabs__item-underline"></View>}
        </View>
      )
    })
    const rootCls = classNames(
      {
        'at-tabs': true,
        'at-tabs--scroll': scroll,
        [`at-tabs--${tabDirection}`]: true,
        [`at-tabs--${ENV}`]: true,
      },
      className,
    )
    const scrollX = tabDirection === 'horizontal'
    const scrollY = tabDirection === 'vertical'

    return (
      <View className={rootCls} style={mergeStyle(heightStyle, customStyle)}>
        {scroll ? (
          <ScrollView
            id={this._tabId}
            className="at-tabs__header"
            style={mergeStyle(heightStyle, transparentBg ? { backgroundColor: 'transparent' } : {})}
            scrollX={scrollX}
            scrollY={scrollY}
            scrollWithAnimation
            scrollLeft={_scrollLeft}
            scrollTop={_scrollTop}
            scrollIntoView={_scrollIntoView}
          >
            {tabItems}
          </ScrollView>
        ) : (
          <View
            id={this._tabId}
            className="at-tabs__header"
            style={transparentBg ? { backgroundColor: 'transparent' } : {}}
          >
            {tabItems}
          </View>
        )}
        <View className="at-tabs__body">
          <View
            className="at-tabs-transform"
            onTouchStart={this.handleTouchStart.bind(this)}
            onTouchEnd={this.handleTouchEnd.bind(this)}
            onTouchMove={this.handleTouchMove.bind(this)}
            style={mergeStyle(bodyStyle, heightStyle)}
          >
            <View className="at-tabs__underline" style={underlineStyle}></View>
            {this.props.children}
          </View>
        </View>
      </View>
    )
  }
}

GodTabs.defaultProps = {
  customStyle: '',
  className: '',
  tabDirection: 'horizontal',
  hideUnderLine: false,
  transparentBg: false,
  activeColor: undefined,
  height: '',
  current: 0,
  swipeable: true,
  isDisplay: false,
  scroll: false,
  animated: true,
  tabList: [],
  onClick: (): void => {},
}

GodTabs.propTypes = {
  customStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  className: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  height: PropTypes.string,
  tabDirection: PropTypes.oneOf(['horizontal', 'vertical']),
  hideUnderLine: PropTypes.bool,
  transparentBg: PropTypes.bool,
  activeColor: PropTypes.string,
  current: PropTypes.number,
  swipeable: PropTypes.bool,
  isDisplay: PropTypes.bool,
  scroll: PropTypes.bool,
  animated: PropTypes.bool,
  tabList: PropTypes.array,
  onClick: PropTypes.func,
}
