import { useState, useEffect, useRef } from 'react'

const getClassNames = (name: string, classPrefix = 'god') => ({
  enter: `${classPrefix}-transition ${classPrefix}-${name}-enter ${classPrefix}-${name}-enter-active`,
  'enter-to': `${classPrefix}-transition ${classPrefix}-${name}-enter-to ${classPrefix}-${name}-enter-active`,
  leave: `${classPrefix}-transition ${classPrefix}-${name}-leave ${classPrefix}-${name}-leave-active`,
  'leave-to': `${classPrefix}-transition ${classPrefix}-${name}-leave-to ${classPrefix}-${name}-leave-active`,
})

const nextTick = () => new Promise((resolve) => setTimeout(resolve, 1000 / 30))

/**
 * 过度hook
 */
const useTransition = (properties) => {
  const { visible, duration, name = 'fade', classPrefix = 'god', onAfterClose } = properties

  const [display, setDisplay] = useState(false)
  const [inited, setInited] = useState(false)
  const [classes, setClasses] = useState('')

  const status = useRef<'enter' | 'leave'>('enter')
  const transitionEnded = useRef<boolean>(false)

  const onTransitionEnd = () => {
    if (transitionEnded.current) {
      return
    }
    transitionEnded.current = true

    if (!visible && display) {
      setDisplay(false)
      onAfterClose?.()
    }
  }

  const enter = () => {
    const fadeClasses = getClassNames(name, classPrefix)

    status.current = 'enter'

    Promise.resolve()
      .then(nextTick)
      .then(() => {
        if (status.current !== 'enter') {
          return
        }
        setDisplay(true)
        setInited(true)
        setClasses(fadeClasses.enter)
      })
      .then(nextTick)
      .then(() => {
        if (status.current !== 'enter') {
          return
        }
        setClasses(fadeClasses['enter-to'])
      })
      .catch(() => {})
  }

  const leave = () => {
    if (!display) {
      return
    }
    const fadeClasses = getClassNames(name, classPrefix)

    status.current = 'leave'
    Promise.resolve()
      .then(nextTick)
      .then(() => {
        if (status.current !== 'leave') {
          return
        }
        setClasses(fadeClasses.leave)
      })
      .then(() => {
        if (status.current !== 'leave') {
          return
        }
        transitionEnded.current = false
        setTimeout(() => onTransitionEnd(), duration)
        setClasses(fadeClasses['leave-to'])
      })
      .catch(() => {})
  }

  const observeShow = (value: boolean) => {
    value ? enter() : leave()
  }

  useEffect(() => {
    observeShow(visible)
  }, [visible])

  return {
    display,
    classes,
    inited,
  }
}

export default useTransition
