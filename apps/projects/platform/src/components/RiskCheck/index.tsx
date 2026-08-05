import React, { useState, useRef, useEffect } from 'react'
import { DoubleRightOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons'
import cx from 'classnames'
import './style'

export interface IRiskCheckProps {
  xPoint: number
  yPoint: number
  imgUrl: string
  imgWidth?: number
  imgHeight?: number
  differ?: number
  shadowSize?: number
  successText?: React.ReactNode
  tipText?: React.ReactNode
  className?: string
  onStart?()
  onSuccess?(callback)
  onError?(callback)
  onReload?()
}

export enum RiskCheckStatus {
  LOADING = 0,
  READY = 1,
  SUCCESS = 2,
  ERROR = 3,
}

const createClipPath = (ctx, size: number, styleIndex: number) => {
  const styles = [
    [0, 0, 0, 0],
    [0, 0, 0, 1],
    [0, 0, 1, 0],
    [0, 0, 1, 1],
    [0, 1, 0, 0],
    [0, 1, 0, 1],
    [0, 1, 1, 0],
    [0, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 0, 0, 1],
    [1, 0, 1, 0],
    [1, 0, 1, 1],
    [1, 1, 0, 0],
    [1, 1, 0, 1],
    [1, 1, 1, 0],
    [1, 1, 1, 1],
  ]
  const style = styles[styleIndex]
  const r = 0.1 * size
  ctx.save()
  ctx.beginPath()
  // left
  ctx.moveTo(r, r)
  ctx.lineTo(r, 0.5 * size - r)
  ctx.arc(r, 0.5 * size, r, 1.5 * Math.PI, 0.5 * Math.PI, style[0])
  ctx.lineTo(r, size - r)
  // bottom
  ctx.lineTo(0.5 * size - r, size - r)
  ctx.arc(0.5 * size, size - r, r, Math.PI, 0, style[1])
  ctx.lineTo(size - r, size - r)
  // right
  ctx.lineTo(size - r, 0.5 * size + r)
  ctx.arc(size - r, 0.5 * size, r, 0.5 * Math.PI, 1.5 * Math.PI, style[2])
  ctx.lineTo(size - r, r)
  // top
  ctx.lineTo(0.5 * size + r, r)
  ctx.arc(0.5 * size, r, r, 0, Math.PI, style[3])
  ctx.lineTo(r, r)

  ctx.clip()
  ctx.closePath()
}

const RiskCheck: React.FC<IRiskCheckProps> = (props) => {
  const [crlStatus, setCrlStatus] = useState<RiskCheckStatus>(RiskCheckStatus.LOADING)
  const [currentX, setCurrentX] = useState<number>(0)
  const [isMoviable, setIsMoviable] = useState<boolean>(false)
  let oldX = 0
  const fragmentSize = props.shadowSize
  const RiskBoxCanvas = useRef(null)
  const RiskShadowCanvas = useRef(null)

  const boxRef = useRef(null)
  const saveHandler = useRef<any>()

  useEffect(() => {
    renderImg()
  }, [props.imgUrl])

  const renderImg = () => {
    setCrlStatus(RiskCheckStatus.LOADING)

    const objImg = new Image()

    objImg.addEventListener('load', () => {
      const { xPoint, yPoint } = props
      const ctxShadow = (RiskShadowCanvas.current as unknown as HTMLCanvasElement).getContext('2d')
      const ctxBox = (RiskBoxCanvas.current as unknown as HTMLCanvasElement).getContext('2d')

      const styleIndex = Math.floor(Math.random() * 16)

      createClipPath(ctxBox, fragmentSize, styleIndex)
      createClipPath(ctxShadow, fragmentSize, styleIndex)

      const x = (xPoint / props.imgWidth) * objImg.width
      const y = (yPoint / props.imgHeight) * objImg.height

      const transformSize = (fragmentSize / props.imgWidth) * objImg.width
      ctxBox.drawImage(objImg, x, y, transformSize, transformSize, 0, 0, fragmentSize, fragmentSize)

      ctxShadow.fillStyle = 'rgba(0, 0, 0, 1)'
      ctxShadow.fill()

      ctxShadow.restore()
      ctxBox.restore()

      setCrlStatus(RiskCheckStatus.READY)
    })

    objImg.src = props.imgUrl
  }

  const onMoveStart = (e: React.MouseEvent) => {
    if (crlStatus !== RiskCheckStatus.READY) {
      return
    }
    e.persist()
    // 记录滑动开始时的绝对坐标x
    setIsMoviable(true)
    props?.onStart()
  }

  const onMoving = (e: React.MouseEvent) => {
    if (crlStatus !== RiskCheckStatus.READY || !isMoviable) {
      return
    }
    e.persist()
    const distance = e.clientX - boxRef.current.getBoundingClientRect().left - fragmentSize
    let currX = oldX + distance

    const minX = 0
    const maxX = props.imgWidth - fragmentSize
    currX = currX < minX ? 0 : currX > maxX ? maxX : currX
    setCurrentX(currX)
  }

  const onMoveEnd = () => {
    if (crlStatus !== RiskCheckStatus.READY || !isMoviable) {
      return
    }
    oldX = currentX
    setIsMoviable(false)

    const isMatch = Math.abs(currentX - props.xPoint) < props.differ
    if (isMatch) {
      setCrlStatus(RiskCheckStatus.SUCCESS)
      setCurrentX(props.xPoint)
      props.onSuccess(onReset)
      // this.props.onMatch()
    } else {
      setCrlStatus(RiskCheckStatus.ERROR)
      setTimeout(() => {
        onReset()
        props.onError(onReset)
      }, 1000)
    }
  }

  // 如果 handler 变化了，就更新 ref.current 的值。
  // 这个让我们下面的 effect 永远获取到最新的 handler
  useEffect(() => {
    saveHandler.current = onMoveEnd
  }, [onMoveEnd])

  useEffect(
    () => {
      // 确保元素支持 addEventListener
      const isSupported = window && window.addEventListener
      if (!isSupported) return

      // 创建事件监听调用存储在 ref 的处理方法
      const eventListener = (event) => saveHandler.current(event)

      // 添加事件监听
      window.addEventListener('mouseup', eventListener)

      // 清除的时候移除事件监听
      return () => {
        window.removeEventListener('mouseup', eventListener)
      }
    },
    [onMoveEnd], // 如果 eventName 或 element 变化，就再次运行
  )

  // useEventListener('mouseup', onMoveEnd);

  const onReset = () => {
    const timer = setTimeout(() => {
      oldX = 0
      setCurrentX(0)
      setCrlStatus(RiskCheckStatus.READY)
      clearTimeout(timer)
    }, 0)
  }

  const onReload = () => {
    if (crlStatus !== RiskCheckStatus.READY && crlStatus !== RiskCheckStatus.SUCCESS) {
      return
    }
    const ctxShadow = (RiskShadowCanvas.current as unknown as HTMLCanvasElement).getContext('2d')
    const ctxBox = (RiskBoxCanvas.current as unknown as HTMLCanvasElement).getContext('2d')

    // 清空画布
    ctxShadow.clearRect(0, 0, fragmentSize, fragmentSize)
    ctxBox.clearRect(0, 0, fragmentSize, fragmentSize)

    setIsMoviable(false)
    setCrlStatus(RiskCheckStatus.LOADING)
    props.onReload()
  }
  return (
    <div
      className={cx(
        'god-riskcheck-container',
        crlStatus === RiskCheckStatus.ERROR ? 'animate__animated animate__shakeX' : '',
        props.className,
      )}
      ref={boxRef}
    >
      <div
        className="god-riskcheck-img-container"
        style={{
          width: props.imgWidth,
          height: props.imgHeight,
          backgroundImage: `url("${props.imgUrl}")`,
        }}
      >
        <canvas
          className="god-riskcheck-canvas"
          style={{
            left: currentX + 'px',
            top: props.yPoint + 'px',
            zIndex: 20,
          }}
          ref={RiskBoxCanvas}
          width={fragmentSize}
          height={fragmentSize}
        ></canvas>
        <canvas
          className="god-riskcheck-canvas"
          ref={RiskShadowCanvas}
          width={fragmentSize}
          height={fragmentSize}
          style={{
            left: props.xPoint + 'px',
            top: props.yPoint + 'px',
            zIndex: 10,
          }}
        ></canvas>
      </div>

      <div
        className="god-riskcheck-slider"
        style={{ width: props.imgWidth }}
        onMouseMove={onMoving}
        onMouseLeave={onMoveEnd}
      >
        <div className="god-riskcheck-slider-tip">{props.tipText}</div>
        <div
          className={cx('god-riskcheck-slider-button', RiskCheckStatus.ERROR === crlStatus && 'god-riskcheck-error')}
          onMouseDown={onMoveStart}
          onMouseUp={onMoveEnd}
          style={{ left: currentX + 'px' }}
        >
          {crlStatus === RiskCheckStatus.READY && <DoubleRightOutlined />}
          {crlStatus === RiskCheckStatus.ERROR && <CloseOutlined />}
          {crlStatus === RiskCheckStatus.SUCCESS && <CheckOutlined />}
        </div>
      </div>
    </div>
  )
}

RiskCheck.defaultProps = {
  // 图片路径
  imgUrl: '',
  // 图片宽高
  imgWidth: 200,
  imgHeight: 100,
  // 生成的阴影位置，基于左上角
  xPoint: 100,
  yPoint: 30,

  // 位置匹配允许的误差值
  differ: 5,
  // 移动块的大小
  shadowSize: 60,

  // 最外层容器class
  className: '',
  // 提示语
  tipText: '按住滑块, 拖动拼图',
  // 废弃
  successText: '恭喜你，你打败了地球上100%的人!',

  onStart: () => {},
  onError: () => {},
  onReload: () => {},
  onSuccess: () => {},
}

export default RiskCheck
