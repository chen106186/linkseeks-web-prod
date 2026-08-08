import React, { PureComponent } from 'react'
import { getIntl } from '@linkseeks/i18n'
import { Text, View, ActivityIndicator } from '@apps/mobile-ui'
import Overlay from '../Overlay'

interface Props {}
interface State {
  show: boolean
}

let _this: any = null

class FullScreenLoading extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
    _this = this
    this.state = {
      show: false,
    }
  }

  static show = () => {
    if (_this) {
      console.log(_this, '_this')
      _this.setState({ show: true })
    }
  }

  static hide = () => {
    if (_this) {
      _this.setState({ show: false })
    }
  }

  render() {
    const { show } = this.state
    console.log(show, 'show')
    const intl = getIntl()
    if (show) {
      return (
        <Overlay
          visible
          position="center"
          // style={{
          //   flex: 1,
          // }}
        >
          <View
            style={{
              width: 100,
              height: 100,
              backgroundColor: 'rgba(0,0,0,0.6)',
              opacity: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 7,
            }}
          >
            <ActivityIndicator color="#FFF" />
            <Text style={{ marginLeft: 10, color: '#FFF', marginTop: 10 }}>
              {intl.formatMessage({ id: 'common.data.loading', defaultMessage: '加载中...' })}
            </Text>
          </View>
        </Overlay>
      )
    }
    return <View />
  }
}

export default FullScreenLoading
