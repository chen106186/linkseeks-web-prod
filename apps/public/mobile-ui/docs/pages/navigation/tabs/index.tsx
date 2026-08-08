import React from 'react'
import { Tabs, TabsPane } from '@apps/mobile-ui'
import './index.scss'

interface TabsPageState {
  current: number
}

export default class TabsPage extends React.Component<{}, TabsPageState> {
  public constructor(props: any) {
    super(props)
    this.state = {
      current: 0,
    }
  }

  private onButtonClick(e: number): void {
    this.setState({
      current: e,
    })
  }

  public render(): JSX.Element {
    return (
      <Tabs
        display
        tabList={[{ title: '测试1' }, { title: '测试2' }]}
        current={this.state.current}
        onClick={this.onButtonClick.bind(this)}
      >
        <TabsPane display current={this.state.current} index={0}>
          测试1
        </TabsPane>
        <TabsPane display current={this.state.current} index={1}>
          测试2
        </TabsPane>
      </Tabs>
    )
  }
}
