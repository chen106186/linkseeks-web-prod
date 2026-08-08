import { Ref, useEffect, useState } from 'react'

function useDraggable(el: React.MutableRefObject<HTMLDivElement>) {
  const [{ dx, dy }, setOffset] = useState({ dx: 0, dy: 0 })
  useEffect(() => {
    const handleMouseDown = (event) => {
      const startX = event.pageX
      const startY = event.pageY
      el.current.style.cursor = 'grabbing'
      const { scrollLeft, scrollTop } = el.current
      const handleMouseMove = (event) => {
        const newDx = event.pageX - startX
        const newDy = event.pageY - startY
        el.current.scrollLeft = -newDx + scrollLeft
        el.current.scrollTop = -newDy + scrollTop
        // setOffset({ dx: el.current.scrollLeft, dy: newDy });
      }
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener(
        'mouseup',
        () => {
          el.current.style.cursor = 'default'
          document.removeEventListener('mousemove', handleMouseMove)
        },
        { once: true },
      )
    }
    el.current?.addEventListener('mousedown', handleMouseDown)
    return () => {
      el.current?.removeEventListener('mousedown', handleMouseDown)
    }
  }, [dx, dy])
}

export default useDraggable
