import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import styles from './index.less'
import { DoubleRightOutlined, CloseCircleOutlined, RedoOutlined } from '@ant-design/icons'
import { createClipPath } from './utils'
import { Spin } from 'antd'
import { useIntl } from '@linkseeks/i18n'

const fragmentSize = 37
const imageWidth = 250
const imageHeight = 150
// const imageUrl = 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1689053532,4230915864&fm=26&gp=0.jpg'
const differ = 5
const READY = 0
const SUCCESS = 1
const ERROR = 2

interface SliderVerifyProps {
  visible: boolean
  onCancel: any
  onSuccess?: any
  imageUrl: string
}

const SliderVerify: React.FC<SliderVerifyProps> = (props) => {
  const intl = useIntl()
  const [dragging, setDragging] = useState(false)
  const [origin, setOrigin] = useState({ x: 0, y: 0 })
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [loading, setLoading] = useState(false)
  const [clipImagePosition, setClipImagePosition] = useState({ x: 0, y: 0 })
  const [status, setStatus] = useState(READY)
  // const [visible, setVisible] = useState(props.visible || false)
  const { visible, imageUrl } = props

  const shadowCanvas = useRef(null)
  const fragmentCanvas = useRef(null)

  const mouseDown = ({ clientX, clientY }) => {
    console.log('mouseDown', clientX)
    setOrigin((state) => ({ x: clientX, y: clientY }))
    setDragging(true)
  }

  const mouseMove = ({ clientX, clientY }) => {
    if (!dragging || status !== READY) {
      return
    }
    let x = clientX - origin.x // 计算拖动的距离

    const min = 0
    const max = imageWidth - fragmentSize
    let currX = x
    currX = currX < min ? 0 : currX > max ? max : currX
    const transition = { x: currX, y: origin.y }
    setOffset((state) => {
      return { ...state, ...transition }
    })
  }

  const mouseUp = () => {
    if (!dragging || status !== READY) {
      return
    }
    console.log('up')
    setDragging(false)
    const targetX = clipImagePosition.x
    const currentX = offset.x
    const match = Math.abs(targetX - currentX) <= 5
    if (match) {
      onSuccess()
    } else {
      onError()
    }
  }

  useEffect(() => {
    if (visible) {
      reRender()
    }
  }, [visible])

  const sliderHandleStyle = useMemo(
    () => ({
      left: offset.x,
      transition: !dragging ? 'left 500ms' : 'none',
    }),
    [offset, dragging],
  )

  const trackStyle = useMemo(
    () => ({
      width: !dragging && status == READY ? 0 : offset.x + 22.5 + 'px',
      transition: !dragging ? 'left 500ms' : 'none',
    }),
    [offset, dragging],
  )

  const onSuccess = () => {
    console.log('success')
    setStatus(SUCCESS)
    props.onSuccess && props.onSuccess()
    setOffset({ x: 0, y: 0 })
  }

  const onError = () => {
    console.log('error')
    setStatus(ERROR)
    setTimeout(() => {
      reRender()
    }, 500)
    // setOffset({x: 0, y: 0})
  }

  const onReset = () => {
    reRender()
  }

  const reRender = () => {
    setLoading(true)
    const objImage = new Image()
    objImage.addEventListener('load', () => {
      // 先获取两个ctx
      const ctxShadow = shadowCanvas.current.getContext('2d')
      const ctxFragment = fragmentCanvas.current.getContext('2d')

      // 让两个ctx拥有同样的裁剪路径(可滑动小块的轮廓)
      const styleIndex = Math.floor(Math.random() * 16)
      createClipPath(ctxShadow, fragmentSize, styleIndex)
      createClipPath(ctxFragment, fragmentSize, styleIndex)

      // 随机生成裁剪图片的开始坐标
      const clipX = Math.floor(fragmentSize + (imageWidth - 2 * fragmentSize) * Math.random())
      const clipY = Math.floor((imageHeight - fragmentSize) * Math.random())
      console.log(clipX, clipY)

      const scaleWidth = objImage.width / imageWidth
      const scaleHeight = objImage.height / imageHeight

      // 让小块绘制出被裁剪的部分
      // 175 是小图的， 还原成原图 应该是 x / 175 = objImage.width / imageWidth;
      ctxFragment.drawImage(
        objImage,
        clipX * scaleWidth,
        clipY * scaleHeight,
        fragmentSize * scaleWidth,
        fragmentSize * scaleHeight,
        0,
        0,
        fragmentSize,
        fragmentSize,
      )

      // 让阴影canvas带上阴影效果
      ctxShadow.fillStyle = 'rgba(0, 0, 0, 0.5)'
      ctxShadow.fill()

      // 恢复画布状态
      ctxShadow.restore()
      ctxFragment.restore()

      // 设置裁剪小块的位置
      setClipImagePosition({ x: clipX, y: clipY })

      // 修改状态
      setLoading(false)
      setStatus(READY)
      setOffset({ x: 0, y: 0 })
    })
    objImage.src = imageUrl
  }

  const handleClose = () => {
    props.onCancel && props.onCancel()
  }
  return (
    <>
      {!visible ? null : (
        <div>
          {/* {
                loading
                ? <div className={styles.loading}><Spin /></div>
                : null
              } */}

          <div className={styles.sliderContainer} style={{ visibility: !loading ? 'visible' : 'hidden' }}>
            <div className={styles.container}>
              <div
                className={styles.imageContainer}
                style={{ width: imageWidth, height: '150px', backgroundImage: `url("${imageUrl}")` }}
              >
                <canvas
                  className={styles.canvas}
                  width={37}
                  height={37}
                  ref={shadowCanvas}
                  style={{ left: clipImagePosition.x + 'px', top: clipImagePosition.y + 'px' }}
                />
                <canvas
                  className={styles.target}
                  width={37}
                  height={37}
                  ref={fragmentCanvas}
                  style={{ left: offset.x + 'px', top: clipImagePosition.y + 'px' }}
                ></canvas>
                {status === ERROR ? (
                  <div className={styles.status}>{intl.formatMessage({ id: 'accountSetting.verifyError' })}</div>
                ) : null}
              </div>
              <div className={styles.slider} onMouseMove={mouseMove} onMouseLeave={mouseUp}>
                <div
                  className={styles.sliderHandle}
                  onMouseDown={mouseDown}
                  onMouseUp={mouseUp}
                  style={sliderHandleStyle}
                >
                  <DoubleRightOutlined />
                </div>
                <div className={styles.sliderRail}>
                  <div className={styles.text}>{intl.formatMessage({ id: 'accountSetting.verifyRightSlide' })}</div>
                </div>
                <div className={styles.sliderTrack} style={trackStyle}></div>
              </div>
              <div className={styles.footer}>
                <div className={styles.cancel} onClick={handleClose}>
                  <CloseCircleOutlined />
                </div>
                <div className={styles.reset} onClick={onReset}>
                  <RedoOutlined />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default SliderVerify
