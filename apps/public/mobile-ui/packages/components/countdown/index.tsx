import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import classnames from 'classnames'
import View from '../view';
import { GodCountDownProps, appState, FormatTime } from '../../types/countdown'
import { onAppShow, onAppHide, offAppShow, offAppHide } from '../../common/utils';

function fomatFloat(src: number, pos: number) {
  // eslint-disable-next-line no-restricted-properties
  return Math.round(src * Math.pow(10, pos)) / Math.pow(10, pos);
}

function padZero(data: number | string, length: number = 2) {
  const temp = data.toString();
  return temp.padStart(length, '0');
}

function parseTime(format: string, currentTime: FormatTime['formatTime']): string {
  const { day } = currentTime;
  let { hour, minute, second } = currentTime;
  let result = format;

  if (result.includes('DD')) {
    result = result.replace('DD', padZero(day));
  } else {
    hour += day * 24;
  }

  if (result.includes('HH')) {
    result = result.replace('HH', padZero(hour))
  } else {
    minute += minute * 60
  }

  if (result.includes('mm')) {
    result = result.replace('mm', padZero(minute))
  } else {
    second += minute * 60;
  }

  if (result.includes('ss')) {
    result = result.replace('ss', padZero(second))
  }

  return result;
}


const CountDown = (props: GodCountDownProps) => {
  const { count, onFinish, min, children, onClick, format } = props;
  const [time, setTime] = useState(count);
  const ref = useRef<null | ReturnType<typeof setInterval>>(null);
  const backgroundTime = useRef<number>(0);
  const appState = useRef<appState>('unknown');

  const handleAppShow = useCallback(() => {
    backgroundTime.current = fomatFloat(new Date().getTime() / 1000 - backgroundTime.current, 0);
    appState.current = "active";
    setTime((prev) => ((prev! - backgroundTime.current - 1) > min! ? (prev! - backgroundTime.current - 1) : min!))
  }, [])

  const handleAppHide = useCallback(() => {
    backgroundTime.current = new Date().getTime() / 1000;
    appState.current = "background";
  }, [])

  useEffect(() => {
    // fix: 修复当处于h5模式下时，无法使用onAppShow生命周期
    // Taro.onAppShow(handleAppShow)
    // Taro.onAppHide(handleAppHide)
    onAppShow(handleAppShow)
    onAppHide(handleAppHide)
    return () => {
      // Taro.offAppHide(handleAppHide)
      // Taro.offAppShow(handleAppShow)
      offAppShow(handleAppShow)
      offAppHide(handleAppHide)
    }
  }, [])

  useEffect(() => {
    if (typeof count !== 'number') {
      return () => {}
    }
    ref.current = setInterval(() => {
      setTime((prev: any) => prev - 1)
    }, 1000);

    return () => {
      clearInterval(ref.current as ReturnType<typeof setInterval>)
    }
  }, [count])

  useEffect(() => {
    if (time as number <= 0) {
      clearInterval(ref.current as ReturnType<typeof setInterval>);
    }
    if (onFinish && (time === min)) {
      onFinish(time as number);
    }
  }, [time])

  useEffect(() => {
    if (count !== null) {
      setTime(count);
      // targetTime.current = new Date(now.getTime() + count * 1000)
    }
  }, [count])

  const handlePress = () => {
    if (onClick) {
      onClick()
    }
  }

  const formatedData = useMemo(() => {
    if (time! <= 0) {
      return {
        formatTime: {
          day: 0,
          hour: 0,
          minute: 0,
          second: 0,
        },
        formatTimeString: "00:00:00",
      }
    }
    const day = Math.floor(time! / (24 * 60 * 60));
    const hour = Math.floor(time! / (60 * 60) % 24);
    const minute = Math.floor(time! / (60) % 60);
    const second = Math.floor(time! % 60)

    const restTime = {
      day,
      hour,
      minute,
      second,
    }
    return {
      formatTime: restTime,
      formatTimeString: parseTime(format!, restTime),
    }
  }, [format, time])

  const rootClassName = ['god-countdown']

  const classObject = {}

  return (
    <View className={classnames(rootClassName, classObject)} onClick={handlePress}>{children(time as number, formatedData)}</View>
  )
}

CountDown.defaultProps = {
  onFinish: null,
  onClick: null,
  min: 0,
  format: 'HH:mm:ss'
}

export default CountDown
