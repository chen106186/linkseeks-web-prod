import React from 'react'
import { Button, Result } from 'antd'
import { getWebIntl } from '@apps/locales'
import { useNavigate, useLocation } from 'react-router-dom'

const translate = getWebIntl()

const withRouter = (Component) => {
  return function WrappedComponent(props) {
    const navigate = useNavigate()
    const location = useLocation()
    return <Component {...props} navigate={navigate} location={location} />
  }
}

// 定义state的类型接口
interface ErrorBoundaryState {
  hasError: boolean
  error: string
}

class ErrorBoundary extends React.Component<{ navigate: any; location: any }, ErrorBoundaryState> {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: '',
    }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error: String(error) })
    console.log('Error caught:', error, JSON.stringify(error), typeof error)
    console.log('Error info:', errorInfo)
    this.setState({ hasError: true })
  }

  componentDidUpdate(prevProps) {
    // 判断 location 是否发生变化
    if (this.props.location !== prevProps.location && this.state.error) {
      console.log('Location changed:', this.props.location)
      // 在此处处理路由变化逻辑，如重新加载数据
      this.handleLocationChange()
    }
  }

  handleLocationChange = () => {
    // 处理路由变化后的逻辑
    console.log('当前路径:', this.props.location.pathname)
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  backPrevPage() {
    this.props.navigate(-1)
  }

  render() {
    if (this.state.hasError) {
      // 跳转到错误页面，假设错误页面路径为 /error
      return (
        <Result
          status="404"
          title={translate('web.resource.mall.chucuole')}
          style={{ marginTop: 100 }}
          subTitle={`${translate('web.resource.mall.cuowuyuanyin')}：${this.state.error}`}
          extra={
            <Button type="primary" onClick={() => this.backPrevPage()}>
              {translate('web.common.fanhui')}
            </Button>
          }
        />
      )
    }
    return this.props.children
  }
}

export default withRouter(ErrorBoundary)
