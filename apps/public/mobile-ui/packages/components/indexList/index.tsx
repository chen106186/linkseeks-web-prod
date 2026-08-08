import classNames from 'classnames'
import PropTypes, { InferProps } from 'prop-types'
import React from 'react'
import { ScrollView, View } from '@tarojs/components'
import { CommonEvent, ITouchEvent } from '@tarojs/components/types/common'
import { getEnv, ENV_TYPE, vibrateShort } from '@tarojs/taro'
import { GodIndexesListProps, GodIndexesState, IndexItem } from '../../types/index-list'
import { delayQuerySelector, isTest, uuid } from '../../common/utils'
import GodList from '../list/index'
import GodListItem from '../list/item/index'
import GodToast from '../toast/index'

const ENV = getEnv()

export default class GodIndexes extends React.Component<GodIndexesListProps, GodIndexesState> {
  public static defaultProps: GodIndexesListProps
  public static propTypes: InferProps<GodIndexesListProps>

  private menuHeight: number
  private startTop: number
  private itemHeight: number
  private listId: string
  private scrollHeight: Array<number> = []
  // private listRef: any

  public constructor(props: GodIndexesListProps) {
    super(props)
    this.state = {
      _scrollIntoView: '',
      _scrollTop: 0,
      _tipText: '',
      isWEB: getEnv() === ENV_TYPE.WEB,
      // 当前索引
      currentIndex: 0,
    }
    // 右侧导航高度
    this.menuHeight = 0
    // 右侧导航距离顶部高度
    this.startTop = 0
    // 右侧导航元素高度
    this.itemHeight = 0
    this.listId = isTest() ? 'indexes-list-AOTU2018' : `list-${uuid()}`
    this.scrollHeight = []
  }

  private handleClick = (item: IndexItem): void => {
    this.props.onClick && this.props.onClick(item)
  }

  private handleTouchMove = (event: ITouchEvent): void => {
    event.stopPropagation()
    event.preventDefault()

    const { list } = this.props
    const pageY = event.touches[0].pageY
    const index = Math.floor((pageY - this.startTop) / this.itemHeight)

    if (index >= 0 && index <= list.length && this.state.currentIndex !== index) {
      const key = index > 0 ? list[index - 1].key : 'top'
      const touchView = `at-indexes__list-${key}`
      this.jumpTarget(touchView, index)
    }
  }

  private handleTouchEnd = (): void => {
    // this.currentIndex = -1
  }

  private jumpTarget(_scrollIntoView: string, idx: number): void {
    const { topKey = 'Top', list } = this.props
    const _tipText = idx === 0 ? topKey : list[idx - 1].key

    if (ENV === ENV_TYPE.WEB) {
      const _scrollTop = document.getElementById(_scrollIntoView)?.offsetTop
      this.updateState({
        _scrollTop,
        _scrollIntoView,
        _tipText,
        currentIndex: idx,
      })
      return
    }

    this.updateState({
      _scrollIntoView,
      _tipText,
      currentIndex: idx,
    })
  }

  private __jumpTarget(key: string): void {
    const { list } = this.props
    // const index = _findIndex(list, ['key', key])
    const index = list.findIndex((item) => item.key === key)
    const targetView = `at-indexes__list-${key}`
    this.jumpTarget(targetView, index + 1)
  }

	private handleClickTopKey() {
		this.jumpTarget('at-indexes__top', 0)
		this.handleClick({
			name: 'top',
		})
	}

  private updateState(state: Partial<GodIndexesState>): void {
    const { isVibrate, isShowToast } = this.props
    const { _scrollIntoView, _tipText, _scrollTop, currentIndex } = state
    // TODO: Fix dirty hack
    this.setState(
      {
        _scrollIntoView: _scrollIntoView!,
        _scrollTop: _scrollTop!,
        currentIndex: currentIndex,
      },
      () => {
        if (isShowToast) {
          GodToast.show({
            title: _tipText!,
            duration: 3 * 1000,
          })
        }
      },
    )

    if (isVibrate) {
      vibrateShort()
    }
  }

  private initData(): void {
    delayQuerySelector('.at-indexes__menu').then((rect) => {
      const len = this.props.list.length
      if (rect && rect[0]) {
        this.menuHeight = rect[0].height
        this.startTop = rect[0].top
        this.itemHeight = Math.floor(this.menuHeight / (len + 1))
      }
    })
  }

  private initItemData = async (list: any) => {
    let _itemHeight = (await delayQuerySelector('#at-indexes__top', 0))[0]?.height || 0
    const scrollHeight = [_itemHeight]
    for (let key in list) {
      const rect = await delayQuerySelector(`#at-indexes__list-${list[key]['key']}`, 0)
      _itemHeight += rect[0]?.height
      scrollHeight.push(_itemHeight)
    }
    this.scrollHeight = scrollHeight
  }

  private handleScroll(e: CommonEvent): void {
    if (e && e.detail) {
      const offsetY = e.detail.scrollTop

      let _currentIndex = 0

      // 当滚动到最顶部，offset < 0
      if (offsetY < 0) {
        _currentIndex = 0
        this.setState({
          _scrollTop: e.detail.scrollTop,
          currentIndex: _currentIndex,
        })
        return
      }
      // 在中间部分滚动
      for (let i = 0; i < this.scrollHeight.length - 1; i += 1) {
        const height1 = this.scrollHeight[i]
        const height2 = this.scrollHeight[i + 1]
        if (offsetY >= height1 && offsetY < height2) {
          _currentIndex = i + 1
          this.setState({
            _scrollTop: e.detail.scrollTop,
            currentIndex: _currentIndex,
          })
          return
        }
      }
      // 滚动到最底部，offsetY 大于最后一个元素的上限
      _currentIndex = this.scrollHeight.length - 2
      this.setState({
        _scrollTop: e.detail.scrollTop,
        currentIndex: _currentIndex,
      })
    }
  }

  public UNSAFE_componentWillReceiveProps(nextProps: GodIndexesListProps): void {
    if (nextProps.list.length !== this.props.list.length) {
      this.initData()
      this.initItemData(nextProps.list)
    }
  }

  public componentDidMount(): void {
    // if (ENV === ENV_TYPE.WEB) {
    //   this.listRef = document.getElementById(this.listId)
    // }
    this.initData()
  }

  public UNSAFE_componentWillMount(): void {
    this.props.onScrollIntoView && this.props.onScrollIntoView(this.__jumpTarget.bind(this))
  }

  public render(): JSX.Element {
    const { className, customStyle, animation, topKey, list, itemWrapClassName, renderItem } = this.props
    const { _scrollTop, _scrollIntoView, isWEB, currentIndex } = this.state

    const rootCls = classNames('at-indexes', className)

    const menuList = list.map((dataList, i) => {
      const { key } = dataList
      const targetView = `at-indexes__list-${key}`
      return (
        <View
          className={classNames('at-indexes__menu-item', currentIndex === i + 1 && 'at-indexes__menu-item-act')}
          key={key}
          onClick={this.jumpTarget.bind(this, targetView, i + 1)}
        >
          {key}
        </View>
      )
    })

    const renderInnerItem = (item: any, index?: number) => {
      if (!renderItem) return null
      return (
        <View key={item.value} className="at-indexes__list-content">
          {renderItem(item, index)}
        </View>
      )
    }

    const indexesList = list.map((dataList) => {
      let Item = renderItem ? View : GodList
      return (
        <View id={`at-indexes__list-${dataList.key}`} className="at-indexes__list" key={dataList.key}>
          <View className="at-indexes__list-title">{dataList.title}</View>
          <Item className={itemWrapClassName}>
            {dataList.items &&
              dataList.items.map((item, index) => {
                // 图片
                const prop = item?.thumb
                  ? {
                      thumb: item.thumb,
                    }
                  : {}
                return renderItem ? (
                  renderInnerItem(item, index)
                ) : (
                  <GodListItem
                    key={`${item.name}-${index}`}
                    title={item.name}
                    {...prop}
                    onClick={this.handleClick.bind(this, item)}
                  />
                )
              })}
          </Item>
        </View>
      )
    })

    return (
      <View className={rootCls} style={customStyle}>
        <View className="at-indexes__menu" onTouchMove={this.handleTouchMove} onTouchEnd={this.handleTouchEnd}>
          <View
            className={classNames(
              'at-indexes__menu-item',
              this.state.currentIndex === 0 && 'at-indexes__menu-item-act',
            )}
						onClick={this.handleClickTopKey.bind(this)}
          >
            {topKey}
          </View>
          {menuList}
        </View>
        <ScrollView
          className="at-indexes__body"
          id={this.listId}
          scrollY
          scrollWithAnimation={animation}
          // eslint-disable-next-line no-undefined
          scrollTop={isWEB ? _scrollTop : undefined}
          scrollIntoView={!isWEB ? _scrollIntoView : ''}
          onScroll={this.handleScroll.bind(this)}
        >
          <View className="at-indexes__content" id="at-indexes__top">
            {this.props.children}
          </View>
          <View className="at-indexes__list-wrapper">{indexesList}</View>
        </ScrollView>
      </View>
    )
  }
}

GodIndexes.propTypes = {
  customStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  className: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  animation: PropTypes.bool,
  isVibrate: PropTypes.bool,
  isShowToast: PropTypes.bool,
  topKey: PropTypes.string,
  list: PropTypes.array,
  onClick: PropTypes.func,
  onScrollIntoView: PropTypes.func,
}

GodIndexes.defaultProps = {
  customStyle: '',
  className: '',
  animation: false,
  topKey: 'Top',
  isVibrate: true,
  isShowToast: true,
  list: [],
}
