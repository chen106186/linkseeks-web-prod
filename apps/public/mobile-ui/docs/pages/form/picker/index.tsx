import React from 'react'
import { Picker, View } from '@tarojs/components'
import { CommonEvent } from '@tarojs/components/types/common'
import { getEnv, ENV_TYPE } from '@tarojs/taro'
import DocsHeader from '../../../components/doc-header'
import './index.scss'
import { DateTimePicker, PickerView } from '../../../../packages'

interface IndexState {
  selector: string[]
  multiSelector: string[][]
  selectorValue: number
  mulitSelectorValues: number[]
  timeSel: string
  dateSel: string
  isAlipay: boolean
}

const dateTime = [
  { mode: 'year', unit: '年' },
  { mode: 'month', unit: '月' },
  { mode: 'day', duration: 30, unit: '日' },

  // { mode: 'hour', unit: ':00', format: 'H:s', selected: [9, 12] },
  // { mode: 'hour', unit: '时' },
  // {mode: 'year', unit: '年' },
  // {mode: 'month', unit: '月'},
  // { mode: 'day', duration: 30, unit: '日', humanity: true, format: 'M月D日' },
  // {mode: 'day', duration: 30, unit: '日' },
  // { mode: 'hour', unit: ':00', format: 'H:s', selected: [8, 12, 16] },
  // { mode: 'minute', fields: 10, unit: '分' },
  // {mode: 'second', fields: 30, unit: '秒'},
]

export default class Index extends React.Component<{}, IndexState> {
  public config: Taro.PageConfig = {
    navigationBarTitleText: 'Taro UI',
  }

  public state: IndexState = {
    selector: ['中国', '美国', '巴西', '日本'],
    multiSelector: [
      ['饭', '粥', '粉'],
      ['猪肉', '牛肉'],
    ],
    selectorValue: 0,
    mulitSelectorValues: [0, 1],
    timeSel: '06:18',
    dateSel: '2018-06-18',
    isAlipay: false,
  }

  public componentDidMount(): void {
    const env = getEnv()
    this.setState({
      isAlipay: env === ENV_TYPE.ALIPAY,
    })
  }

  private handleChange = (e: CommonEvent): void => {
    this.setState({
      selectorValue: e.detail.value,
    })
  }

  private handleMulitChange = (e: CommonEvent): void => {
    this.setState({
      mulitSelectorValues: e.detail.value,
    })
  }

  private handleTimeChange = (e: CommonEvent): void => {
    this.setState({
      timeSel: e.detail.value,
    })
  }

  private handleDateChange = (e: CommonEvent): void => {
    this.setState({
      dateSel: e.detail.value,
    })
  }

  public render(): JSX.Element {
    const { selector, selectorValue, multiSelector, mulitSelectorValues, timeSel, dateSel, isAlipay } = this.state

    return (
      <View className="page picker__page">
        {/* S Header */}
        <DocsHeader title="Picker 选择器"></DocsHeader>
        {/* E Header */}

        {/* S Body */}
        <View className="doc-body">
          {/* datetime选择器 */}
          <View className="panel">
            <View className="panel__title">datetime选择器</View>
            <View className="panel__content">
              <View className="example-item">
                <DateTimePicker
                  min={new Date()}
                  onConfirm={(e) => console.log(e)}
                  format="YYYY-MM-DD HH:mm:ss"
                  precision="second"
                >
                  <View className="demo-list-item">
                    <View className="demo-list-item__label">时间选择</View>
                    <View className="demo-list-item__value">{selector[selectorValue]}</View>
                  </View>
                </DateTimePicker>
              </View>
            </View>
          </View>

          <View className="panel">
            <View className="panel__title">自定义pickerView选择器</View>
            <View className="panel__content">
              <View className="example-item">
                <PickerView
                  submitText="ok"
                  cancelText="cancel"
                  title="好的"
                  columns={[
                    [
                      { label: '星期一', value: '1' },
                      { label: '星期二', value: '2' },
                    ],
                    [{ label: '第一', value: '1' }],
                  ]}
                  onConfirm={(e) => console.log(e)}
                >
                  <View className="demo-list-item">
                    <View className="demo-list-item__label">picker选择</View>
                    <View className="demo-list-item__value">{selector[selectorValue]}</View>
                  </View>
                </PickerView>
              </View>
            </View>
          </View>

          {/* 普通选择器 */}
          <View className="panel">
            <View className="panel__title">普通选择器</View>
            <View className="panel__content">
              <View className="example-item">
                <Picker mode="selector" range={selector} value={selectorValue} onChange={this.handleChange}>
                  <View className="demo-list-item">
                    <View className="demo-list-item__label">国家地区</View>
                    <View className="demo-list-item__value">{selector[selectorValue]}</View>
                  </View>
                </Picker>
              </View>
            </View>
          </View>

          {/* 多列选择器 */}
          {!isAlipay && (
            <View className="panel">
              <View className="panel__title">多列选择器</View>
              <View className="panel__content">
                <View className="example-item">
                  <Picker
                    mode="multiSelector"
                    range={multiSelector}
                    value={mulitSelectorValues}
                    onChange={this.handleMulitChange}
                  >
                    <View className="demo-list-item">
                      <View className="demo-list-item__label">请选择早餐</View>
                      <View className="demo-list-item__value">{`${multiSelector[0][mulitSelectorValues[0]]} & ${
                        multiSelector[1][mulitSelectorValues[1]]
                      }`}</View>
                    </View>
                  </Picker>
                </View>
              </View>
            </View>
          )}

          {/* 时间选择器 */}
          <View className="panel">
            <View className="panel__title">时间选择器</View>
            <View className="panel__content">
              <View className="example-item">
                <Picker mode="time" value={timeSel} onChange={this.handleTimeChange}>
                  <View className="demo-list-item">
                    <View className="demo-list-item__label">请选择时间</View>
                    <View className="demo-list-item__value">{timeSel}</View>
                  </View>
                </Picker>
              </View>
            </View>
          </View>

          {/* 日期选择器 */}
          <View className="panel">
            <View className="panel__title">日期选择器</View>
            <View className="panel__content">
              <View className="example-item">
                <Picker mode="date" value={dateSel} onChange={this.handleDateChange}>
                  <View className="demo-list-item">
                    <View className="demo-list-item__label">请选择日期</View>
                    <View className="demo-list-item__value">{dateSel}</View>
                  </View>
                </Picker>
              </View>
            </View>
          </View>
        </View>
        {/* E Body */}
      </View>
    )
  }
}
