/*
 * @Author: XieZhiXiong
 * @Date: 2021-11-04 11:04:52
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-04 17:06:32
 * @Description: Progress 进度组件
 */
import React, { useState, useEffect } from 'react'
import { View, Text } from '@apps/mobile-ui'
// import classNames from 'classnames';
import { circumference } from './utils'
import './index.scss'

interface ProgressProps {
  /**
   * 百分比
   */
  percent: number | number[]
  /**
   * 是否显示进度数值或状态图标，默认为 true
   */
  showInfo?: boolean
  /**
   * 进度条的色彩
   */
  strokeColor?: string | string[]
  /**
   * 未完成的分段的颜色
   */
  trailColor?: string
  /**
   * 自定义 text 样式
   */
  customTextStyle?: React.CSSProperties
  /**
   * 自定义渲染 text
   */
  customRenderText?: React.ReactNode
  /**
   * 类型，可选 line 直线、 circle 圆、 semicircle 半圆，默认 line
   */
  type?: 'line' | 'circle' | 'semicircle'
  /**
   * type="circle"
   * 圆形进度条画布宽度，默认值 88
   */
  width?: number
  /**
   * type="circle"
   * 圆形进度条线的宽度，默认值 4
   */
  strokeWidth?: number
  /** 再进度条里的文字 */
  innerText?: string
}

const Progress: React.FC<ProgressProps> = (props: ProgressProps) => {
  const {
    percent,
    showInfo,
    strokeColor,
    trailColor,
    customTextStyle,
    customRenderText,
    type,
    width = 88,
    strokeWidth = 4,
    innerText = '',
  } = props
  const result = circumference(width)
  const [dashArray, setDashArray] = useState(type === 'circle' ? `${result}` : `${result / 2} ${result}`)
  // const [dashOffset, setDashOffset] = useState(parseFloat(dashArray));

  const finalStrokeColor = strokeColor || '#C45124'

  const getFinalStrokeColor = (position = 0) =>
    Array.isArray(finalStrokeColor) ? finalStrokeColor[position] : finalStrokeColor

  // const getPercent = (position = 0) => (Array.isArray(percent) ? percent[position] : percent);

  useEffect(() => {
    // if (type === 'circle' || type === 'semicircle') {
    //   const next = (1 - getPercent() / 100) * parseFloat(dashArray);
    //   setDashOffset(next);
    // }
  }, [percent, dashArray])

  useEffect(() => {
    const result2 = circumference(width)
    setDashArray(type === 'circle' ? `${result2}` : `${result2 / 2} ${result2}`)
  }, [width, strokeWidth, type])

  // const halfWidth = parseInt(`${width / 2}`, 10);
  // const halfWidth = width / 2;
  // const isSemicircle = type === 'semicircle';

  const percentArr = Array.isArray(percent) ? percent : [percent]

  if (type === 'line') {
    return (
      <View className="progressT">
        <View className="progressT-outer">
          <View
            className="progressT-inner"
            style={{
              backgroundColor: trailColor,
              height: strokeWidth,
            }}
          >
            <Text className="progressT-inner-text">{innerText}</Text>
            {percentArr.map((item, index) => {
              const final = Math.max(0, Math.min(100, item))
              return (
                <View
                  key={index}
                  className="progressT-bg"
                  style={{
                    width: `${final}%`,
                    backgroundColor: getFinalStrokeColor(index),
                  }}
                />
              )
            })}
          </View>
        </View>
        {showInfo &&
          (!customRenderText ? (
            <View className="progressT-text" style={customTextStyle}>
              {`${percent}%`}
            </View>
          ) : (
            customRenderText
          ))}
      </View>
    )
  }

  if (type === 'circle' || type === 'semicircle') {
    return (
      <View>暂不支持</View>
      // <View
      //   className='progressT-circle'
      //   style={{
      //     width,
      //     height: !isSemicircle ? width : halfWidth + 5,
      //   }}
      // >
      //   <Svg height={width} width={width} viewBox={`0 0 ${width} ${width}`}>
      //     <Circle
      //       cx={halfWidth}
      //       cy={halfWidth}
      //       r={halfWidth}
      //       stroke={trailColor}
      //       strokeWidth={strokeWidth}
      //       fill="transparent"
      //       strokeLinecap="round"
      //       strokeDasharray={dashArray}
      //       rotation={!isSemicircle ? -90 : -180}
      //       scale={0.9}
      //       originX={halfWidth}
      //       originY={halfWidth}
      //     />
      //     <Circle
      //       cx={halfWidth}
      //       cy={halfWidth}
      //       r={halfWidth}
      //       stroke={getFinalStrokeColor()}
      //       strokeWidth={strokeWidth}
      //       fill="transparent"
      //       strokeLinecap="round"
      //       strokeDasharray={dashArray}
      //       strokeDashoffset={dashOffset}
      //       scale={0.9}
      //       rotation={!isSemicircle ? -90 : -180}
      //       originX={halfWidth}
      //       originY={halfWidth}
      //     />
      //   </Svg>
      //   {showInfo && (
      //     <View
      //       className={classNames(
      //         'progressT-circle-textWrap',
      //         {
      //           'progressT-circle-textWrap__semi': isSemicircle,
      //         }
      //       )}
      //     >
      //       {!customRenderText ? (
      //         <Text
      //           className='progressT-circle-text'
      //           style={{
      //             fontSize: Math.floor(width * 0.28),
      //             ...(customTextStyle || {}),
      //           }}
      //         >
      //           {`${percent}%`}
      //         </Text>
      //       ) : (
      //         customRenderText
      //       )}
      //     </View>
      //   )}
      // </View>
    )
  }

  return null
}

Progress.defaultProps = {
  showInfo: true,
  strokeColor: undefined,
  trailColor: '#F0DED1',
  customTextStyle: {},
  customRenderText: null,
  type: 'line',
  width: 88,
  strokeWidth: 4,
}

export default Progress
