import React, { useContext } from 'react'
import { render, screen, fireEvent, getByRole } from '@testing-library/react'
import { NestContainer } from '@feature/container'
import { I18nextProvider, init, useIntl, i18n } from '@linkseeks/i18n'

const DemoContext1 = React.createContext<any>({})
const DemoContext2 = React.createContext<any>({})
const DemoProvider1 = (props: any) => {
  return <DemoContext1.Provider value={props.value}>{props.children}</DemoContext1.Provider>
}
const DemoProvider2 = (props: any) => (
  <DemoContext2.Provider value={props.value}>{props.children}</DemoContext2.Provider>
)
DemoProvider1.displayName = 'Provider'
DemoProvider2.displayName = 'Provider'

const TestComponent = () => {
  const value1 = useContext(DemoContext1)
  const value2 = useContext(DemoContext2)
  return (
    <div>
      <span>{value1.foo}</span>
      <span>{value2.foo}</span>
    </div>
  )
}

// 切换成英文
const ChangeLng = () => {
  const { i18n } = useIntl()
  return <button onClick={() => i18n.changeLanguage('en-US')}>change</button>
}

const I18nComponent = () => {
  const { t } = useIntl()
  return (
    <div>
      {t('hello')}
      <ChangeLng />
    </div>
  )
}

function addResource(i18n: i18n) {
  i18n.changeLanguage('zh-CN')
  i18n.addResources('zh-CN', 'translation', { hello: '你好' })
  i18n.addResources('en-US', 'translation', { hello: 'hello,world' })
}

// -------测试用例开始 --------
describe('NestContainer', () => {
  const testProviders = [
    { type: DemoProvider1, props: { value: { foo: 'Bob' } } },
    { type: DemoProvider2, props: { value: { foo: 'Linda' } } },
  ]
  it('should render children correctly', () => {
    render(
      <NestContainer containers={testProviders}>
        <div>Test Children</div>
      </NestContainer>,
    )

    expect(screen.getByText('Test Children')).toBeInTheDocument()
  })

  it('should render Providers with children correctly', () => {
    const app = (
      <NestContainer containers={testProviders}>
        <TestComponent />
      </NestContainer>
    )
    render(app)
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('Linda')).toBeInTheDocument()
  })

  it('should throw error if a Provider does not have children prop', () => {
    const invalidProviders = [
      { type: DemoProvider1, props: {} },
      { type: DemoProvider2, props: { children: <div>Test 2</div> } },
    ]

    const spy = vi.spyOn(console, 'warn')

    render(
      <NestContainer containers={invalidProviders}>
        <div>Test Children</div>
      </NestContainer>,
    )
    expect(spy).toHaveBeenCalledWith('All containers must be Provider components with value prop')
  })

  it('should render i18next', async () => {
    const { i18n } = await init()
    addResource(i18n)

    const app = render(
      <NestContainer containers={[{ type: I18nextProvider, props: { i18n } }]}>
        <I18nComponent />
      </NestContainer>,
    )

    expect(screen.getByText('你好')).toBeInTheDocument()

    const button = app.getByRole('button')
    fireEvent.click(button)

    expect(screen.getByText('hello,world')).toBeInTheDocument()
  })
})
