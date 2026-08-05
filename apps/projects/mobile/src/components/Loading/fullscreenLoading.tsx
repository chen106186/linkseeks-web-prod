import React, { PureComponent } from 'react'
import { getIntl } from '@linkseeks/i18n'
import { pxTransform } from '@apps/mobile-services/utils/taro'
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
              width: pxTransform(100),
              height: pxTransform(100),
              backgroundColor: 'rgba(0,0,0,0.6)',
              opacity: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: pxTransform(7),
            }}
          >
            <ActivityIndicator color="#FFF" />
            <Text style={{ marginLeft: pxTransform(10), color: '#FFF', marginTop: pxTransform(10) }}>
              {getIntl().formatMessage({ id: 'loading.jiazaizhong', defaultMessage: '加载中...' })}
            </Text>
          </View>
        </Overlay>
      )
    }
    return <View />
  }
}

export default FullScreenLoading
