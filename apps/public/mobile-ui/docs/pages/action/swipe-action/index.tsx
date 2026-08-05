import React from 'react'
import { Button, List, ListItem, SwipeAction } from '../../../../packages'
import { SwipeActionOption } from '../../../../packages/types/swipe-action'
import { View } from '@tarojs/components'
import { showToast } from '@tarojs/taro'
import DocsHeader from '../../../components/doc-header'
import './index.scss'

const OPTIONS: SwipeActionOption[] = [
  {
    text: '删除',
    style: {
      color: '#333',
      backgroundColor: '#F7F7F7',
    },
  },
  {
    text: '确认',
    style: {
      backgroundColor: '#E93B3D',
    },
  },
]

type ActionListItem = {
  title: string
  isOpened: boolean
  options: SwipeActionOption[]
}

interface SwipeActionPageState {
  isOpened2: boolean
  list: ActionListItem[]
}

export default class SwipeActionPage extends React.Component<{}, SwipeActionPageState> {
  public config: Taro.PageConfig = {
    navigationBarTitleText: 'Taro UI',
  }

  public constructor(props: any) {
    super(props)
    this.state = {
      isOpened2: false,
      list: [
        {
          title: 'item1',
          isOpened: false,
          options: OPTIONS,
        },
        {
          title: 'item2',
          isOpened: false,
          options: OPTIONS,
        },
        {
          title: 'item3',
          isOpened: false,
          options: OPTIONS,
        },
        {
          title: 'item4',
          isOpened: false,
          options: OPTIONS,
        },
        {
          title: 'item5',
          isOpened: false,
          options: OPTIONS,
        },
        {
          title: 'item6',
          isOpened: false,
          options: OPTIONS,
        },
      ],
    }
  }

  private handleClick = (item: SwipeActionOption, key: number): void => {
    this.showToast(`点击了${item.text}按钮，Key: ${key}`)
  }

  private handleClicked = (index: number): void => {
    const list = this.state.list.filter((_item, key) => key !== index)
    // console.log(list)
    this.setState({
      list,
    })
  }

  private handleStatusClick = (): void => {
    this.setState({
      isOpened2: !this.state.isOpened2,
    })
  }

  private handleStatusOpened = (): void => {
    this.setState({
      isOpened2: true,
    })
  }

  private handleStatusClosed = (): void => {
    this.setState({
      isOpened2: false,
    })
  }

  private handleSingle = (index: number): void => {
    const list = this.state.list.map((item, key) => {
      item.isOpened = key === index
      return item
    })
    this.setState({
      list,
    })
  }

  private handleOpened = (): void => {
    this.showToast('Handle Opened')
  }

  private handleClosed = (): void => {
    this.showToast('Handle Closed')
  }

  private showToast = (name: string): void => {
    showToast({
      icon: 'none',
      title: name,
    })
  }

  public render(): JSX.Element {
    const { list, isOpened2 } = this.state

    return (
      <View className="page swipe-action-page">
        {/* S Header */}
        <DocsHeader title="SwipeAction 滑动操作" />
        {/* E Header */}

        {/* S Body */}
        <View className="doc-body">
          {/* 无 Title */}
          <View className="panel">
            <View className="panel__title">一般用法</View>
            <View className="panel__content no-padding">
              <View className="example-item example-item--border">
                <SwipeAction onClick={this.handleClick} options={OPTIONS}>
                  <View className="normal">SwipeAction 一般使用场景</View>
                </SwipeAction>
              </View>
            </View>
          </View>

          <View className="panel">
            <View className="panel__title">禁止滑动</View>
            <View className="panel__content no-padding">
              <View className="example-item example-item--border">
                <SwipeAction disabled options={OPTIONS}>
                  <View className="normal">禁止滑动展示</View>
                </SwipeAction>
              </View>
            </View>
          </View>

          <View className="panel">
            <View className="panel__title">使用变量控制开关</View>
            <View className="panel__controller" style="margin-bottom: 10px">
              <Button size="small" onClick={this.handleStatusClick}>
                当前状态: {isOpened2 ? '开' : '关'}{' '}
              </Button>
            </View>

            <View className="panel__content no-padding">
              <View className="example-item example-item--border">
                <SwipeAction
                  options={OPTIONS}
                  isOpened={isOpened2}
                  onClosed={this.handleStatusClosed}
                  onOpened={this.handleStatusOpened}
                >
                  <View className="normal">使用变量控制开关</View>
                </SwipeAction>
              </View>
            </View>
          </View>

          <View className="panel">
            <View className="panel__title">自动关闭</View>
            <View className="panel__content no-padding">
              <View className="example-item example-item--border">
                <SwipeAction onClick={this.handleClick} autoClose options={OPTIONS}>
                  <View className="normal">点击按钮自动关闭</View>
                </SwipeAction>
              </View>
            </View>
          </View>

          <View className="panel">
            <View className="panel__title">传递点击事件</View>
            <View className="panel__content no-padding">
              <View className="example-item example-item--border">
                <SwipeAction onClick={this.handleClick} options={OPTIONS}>
                  <View className="normal">点击事件触发</View>
                </SwipeAction>
              </View>
            </View>
          </View>

          <View className="panel">
            <View className="panel__title">开启和关闭事件</View>
            <View className="panel__content no-padding">
              <View className="example-item example-item--border">
                <SwipeAction
                  options={OPTIONS}
                  onClick={this.handleClick}
                  onOpened={this.handleOpened}
                  onClosed={this.handleClosed}
                >
                  <View className="normal">开启和关闭时触发事件</View>
                </SwipeAction>
              </View>
            </View>
          </View>

          <View className="panel">
            <View className="panel__title">与List组件使用</View>
            <View className="panel__content no-padding">
              <View className="example-item">
                <List>
                  <SwipeAction options={OPTIONS}>
                    <ListItem title="Item1" />
                  </SwipeAction>
                  <SwipeAction options={OPTIONS}>
                    <ListItem title="Item2" />
                  </SwipeAction>
                  <SwipeAction
                    options={[
                      {
                        text: '警告',
                        style: {
                          backgroundColor: '#FFC82C',
                        },
                      },
                    ]}
                  >
                    <ListItem title="Item3123123123123" />
                  </SwipeAction>
                </List>
              </View>
            </View>
          </View>

          <View className="panel">
            <View className="panel__title">控制只显示单个</View>
            <View className="panel__content no-padding">
              <View className="example-item">
                <List>
                  {list.map((item, index) => (
                    <SwipeAction
                      key={item.title}
                      options={item.options}
                      isOpened={item.isOpened}
                      onClick={this.handleClicked.bind(this, index)}
                      onOpened={this.handleSingle.bind(this, index)}
                    >
                      <ListItem title={item.title} />
                    </SwipeAction>
                  ))}
                </List>
              </View>
            </View>
          </View>
        </View>
      </View>
    )
  }
}
