import React, { useState, useEffect, useRef } from 'react';


const useCountDown = (timeStamp: number) => {
    const intervalRef = useRef<any>(null);

    const now: any = Math.round(new Date().getTime() / 1000).toString();
    const end: any = timeStamp;

    const [leftTime, setLeftTime] = useState(end - now);
    const [h, setHours] = useState<any>('');
    const [m, setMinutes] = useState<any>('');
    const [s, setSeconds] = useState<any>('');

    useEffect(() => {
        setLeftTime(end - now)
    }, [end, now])


    useEffect(() => {
        if (leftTime > 0) {
            intervalRef.current = setInterval(() => {
                const newNow: any = Math.round(new Date().getTime() / 1000).toString();

                let newLeftTime = timeStamp - newNow
                setLeftTime(() => newLeftTime)

                const _hours = Math.floor(newLeftTime / 60 / 60);
                const _minutes = Math.floor(newLeftTime / 60 % 60);
                const _seconds = Math.floor(newLeftTime % 60);

                let hours = _hours < 10 ? `0${_hours}` : _hours;
                let minutes = _minutes < 10 ? `0${_minutes}` : _minutes;
                let seconds = _seconds < 10 ? `0${_seconds}` : _seconds;
                setHours(() => hours)
                setMinutes(() => minutes)
                setSeconds(() => seconds)

            }, 1000);
        } else {
            setLeftTime(0)
            setHours(0)
            setMinutes(0)
            setSeconds(0)
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [leftTime]);

    if (leftTime <= 0) {
        return ['00', '00', '00', false]
    } else {
        return [h, m, s, true];
    }
}

export default useCountDown;
