import bind from 'bind-decorator'

import { Config } from '@tarojs/taro'
import { View } from '@tarojs/components'

import { Calendar } from '../../../../packages'

import './index.scss'

import DocsHeader from '../../../components/doc-header'
import React from 'react'

export default class Index extends React.Component {
  config: Config = {
    navigationBarTitleText: 'Taro日历组件展示'
  }

  state = {
    now: Date.now(),
    minDate: '2018/06/11',
    maxDate: '2020/12/12',
    multiCurentDate: {
      start: Date.now()
    },
    mark: [
      {
        value: '2018/11/11'
      }
    ]
  }

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  @bind
  handleClick(key: string, value: string) {
    this.setState({
      [key]: value
    })
  }

  @bind
  handleDayClick(...arg) {
    console.log('handleDayClick', arg)
  }

  @bind
  handleDayLongClick(...arg) {
    console.log('handleDayLongClick', arg)
  }

  @bind
  handleDateChange(arg) {
    console.log('handleDateChange', arg)
  }

  @bind
  handleMonthChange(arg) {
    console.log('handleMonthChange', arg)
  }

  render() {
    return (
      <View className='page calendar-page'>
        <DocsHeader title='Calendar 日历' />

        <View className='doc-body'>
          <View className='panel'>
            <View className='panel__title'>一般案例</View>
            <View className='panel__content'>
              <Calendar
                currentDate={''}
                isSelect
                isHolidaySelect
                holidays={['01-01', '01-02', '01-03', '05-01', '05-02', '05-03', '05-04', '05-05', '10-01', '10-02', '10-03', '10-04', '10-05', '10-05', '10-07']}
                disableDays={['2022-09-19', '2022-09-20', '2022-09-21']}
                disableWeek={[5, 6]}
                onDayClick={this.handleDayClick}
                minDate='2022-8-30'
              />
            </View>
          </View>
        </View>
      </View>
    )
  }
}
