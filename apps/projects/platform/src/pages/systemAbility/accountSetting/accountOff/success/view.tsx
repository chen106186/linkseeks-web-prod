import { PageHeaderWrapper } from '@apps/components'
import accountOff from '@/assets/imgs/accountOff.png'
import { Result, Card, Button } from '@linkseeks/ui'
import { useCountDown } from '@linkseeks/hooks'
import { history } from '@linkseeks/router-manager'
import { authService } from '@apps/services/auth/index.service'

const Pages = () => {
  const [countdown] = useCountDown({
    leftTime: 3 * 1000,
    onEnd() {
      authService.removeAuth()
      authService.removeAuthRouteCache()
      history.goLogin()
    },
  })
  return (
    <PageHeaderWrapper title="提交成功" backDom>
      <Card>
        <Result
          icon={<img src={accountOff} />}
          title="您的注销申请已提交成功"
          subTitle={
            <div>
              <p>注销申请已提交给运营方审核确认</p>
              <p>您的注销审核结果将以短信形式告知，请注意查收</p>
            </div>
          }
          extra={<Button type="primary">即将自动返回({Math.round(countdown / 1000)}s)</Button>}
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default Pages
