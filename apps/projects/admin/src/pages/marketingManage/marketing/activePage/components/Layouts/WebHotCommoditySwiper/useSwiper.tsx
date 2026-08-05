import { useState } from 'react'

type Options = {
  /** swiper 子组件数量， 我们已3个一组 */
  count: number
}

function useSwiper(options: Options) {
  const { count } = options
  const [current, setCurrent] = useState(0)

  const onPrev = () => {
    if (current === 0) {
      return
    }
    setCurrent(current - 1)
  }

  const onNext = () => {
    if ((current + 1) * 3 >= count) {
      return
    }
    setCurrent(current + 1)
  }

  return {
    current,
    onNext,
    onPrev,
  }
}

export default useSwiper
