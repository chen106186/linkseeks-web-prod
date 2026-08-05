import { FC, useEffect, useState } from 'react'
import { RouterProvider as BrowserProvider, useOutlet } from 'react-router-dom'

const RouterInit: FC<any> = (props: any) => {
  const [initState, setInitState] = useState(false)
  const { baseRoutePrefix } = props
  const outlet = useOutlet()
  useEffect(() => {
    init()
  }, [baseRoutePrefix])

  const init = async () => {
    if (!props.routerRender) {
      setInitState(true)
    }

    const resultState = await props.routerRender({ basename: baseRoutePrefix || '' })

    setInitState(resultState)
  }

  return initState ? outlet : props.loading
}

export default RouterInit
