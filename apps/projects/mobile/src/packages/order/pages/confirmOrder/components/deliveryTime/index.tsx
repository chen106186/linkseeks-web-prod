import React, { useEffect, useState } from "react";
import { useIntl } from "@linkseeks/i18n";
import { View, Text, Icons, Picker, Toast, DateTimePicker } from '@apps/mobile-ui';
import { observer } from "mobx-react-lite";
import Popup from "@/components/Popup";
import { dateFormat } from "@/utils/date";
import styles from "./index.module.scss";

/**
 * 商户下 商品下 对应选购的规格列表
 */

interface Iprops {
  // logisticsLayer: any,
  showTimeLayer: boolean;
  fnClose: Function;
  newRanTime: any;
  callBlackFn: Function;
  // freightTotal: number,
}

const DeliveryTime: React.FC<Iprops> = (props: Iprops) => {
  const intl = useIntl()
  const { fnClose, showTimeLayer, newRanTime, callBlackFn } = props;
  const [selectData, setSelectData] = useState('');
  const [newSelectTime, setNewSelectTime] = useState(0);
  const [shouldRande, setShouldRande] = useState(0);
  const fnClosePopup = () => {
    if (fnClose) {
      fnClose();
    }
  };
  /**
   * 修改时间
   */
  const handleSelectDatePicker = value => {
    setSelectData(value);
  };
  /**
   * @returns 返回日期的提示语
   */
  const fnGetDataTips = () => {
    if (!selectData) {
      return intl.formatMessage({id: 'confirmOrder_components_deliveryTime_fnGetDataTips'});
    }
    let tips = dateFormat(new Date(selectData.replace(/-/g, '/')), "YY-MM-DD");
    if (!newRanTime.deliveryTime) {
      tips = dateFormat(new Date(selectData.replace(/-/g, '/')), "YY-MM-DD H:m");
    }
    return tips;
  };
  /**
   * @returns 返回日期选择的最大限制
   */
  const fnGetMaxDate = () => {
    if (!newRanTime || !newRanTime.days) {
      return "";
    }
    const newDay = new Date();
    const timeD = newDay.getTime();
    const lastTime = newRanTime.days * 86400000 + timeD;
    return new Date(lastTime);
  };

  /**
   * 确定时间
   */
  const fnDetermine = () => {
    if (newRanTime.deliveryTime) {
      const callObj = {
        selectData,
        startTime: newRanTime.paramList[newSelectTime].startTime,
        endTime: newRanTime.paramList[newSelectTime].endTime
      };
      if (!selectData) {
        Toast.show({ title: intl.formatMessage({id: 'order.qingxuanzesonghuoshijian', defaultMessage: '请选择送货时间'}), icon: "none" });
        return;
      }
      callBlackFn(callObj);
    } else {
      if(new Date().getTime() >= new Date(selectData).getTime()){
        Toast.show({ title: intl.formatMessage({id: 'order.songhuoshijianbixudayudangqianshijian', defaultMessage: '送货时间必须大于当前时间'}), icon: "none" });
        return;
      }
      const callObj = {
        selectData
      };
      callBlackFn(callObj);
    }
  };
  /**
   * 获取明天的日期
   */
  const fnGetTomorrow = () => {
    const today = new Date();
    const tomorrow = today.getTime()+24*60*60*1000;
    return new Date(tomorrow)
  }
  useEffect(() => {
    if (showTimeLayer) {
      setShouldRande(shouldRande);
    }
  }, [showTimeLayer])
  return (
    <Popup visible={showTimeLayer} onClose={fnClosePopup}>
      <View className={styles["warp"]}>
        <View className={styles["title"]}>
          <Text className={styles["text"]}>{intl.formatMessage({id: 'order.songhuoshijian', defaultMessage: '送货时间'})}</Text>
        </View>
        <View className={styles["content-warp"]}>
          <View className={styles["content-item"]}>
            <Text>{intl.formatMessage({id: 'order.songhuoshijian', defaultMessage: '送货时间'})}</Text>
            {newRanTime.deliveryTime ? (
              <Picker
                start={dateFormat(fnGetTomorrow(), "YYYY-MM-DD")}
                end={
                  fnGetMaxDate()
                    ? dateFormat(fnGetMaxDate() as Date, "YYYY-MM-DD")
                    : undefined
                }
                mode='date'
                onChange={e => setSelectData(e.detail.value)}
                value={selectData || dateFormat(fnGetTomorrow(), "YYYY-MM-DD")}
              >
                <View className={styles["content-time"]}>
                  <Text>{fnGetDataTips()}</Text>
                  <Icons name='ChevronRight' size={16} color='#CCCCCC' />
                </View>
              </Picker>
            ) : (
              <View key={shouldRande}>
                <DateTimePicker
                  // value={new Date(selectData)}
                  min={fnGetTomorrow()}
                  format='YYYY-MM-DD HH:mm'
                  onConfirm={value => handleSelectDatePicker(value)}
                >
                  <Text>{fnGetDataTips()}</Text>
                  <Icons name='ChevronRight' size={16} color='#CCCCCC' />
                </DateTimePicker>
              </View>
            )}
          </View>
          {newRanTime && newRanTime.deliveryTime && (
            <View className={styles["rand-time-title-main"]}>
              <View className={styles["rand-time-title-warp"]}>
                <Text style={styles["rand-time-title"]}>{intl.formatMessage({id: 'confirmOrder_components_deliveryTime_randTimeTitle'})}</Text>
              </View>
              {newRanTime.paramList.map((item: any, index: number) => (
                <View
                  className={styles["rand-time-warp"]}
                  key={`${item.startTime}_${index}`}
                  onClick={() => {
                    setNewSelectTime(index);
                  }}
                >
                  <View
                    className={
                      newSelectTime === index
                        ? styles["time-select-warping"]
                        : styles["time-select-warp"]
                    }
                  >
                    <Text
                      className={
                        newSelectTime === index
                          ? styles["time-tips-select"]
                          : styles["time-tips"]
                      }
                    >{`${item.startTime || "-"}-${item.endTime || "-"}`}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
      <View className={styles["footer-btn-warp"]} onClick={fnDetermine}>
        <Text className={styles["footer-btn-tips"]}>{intl.formatMessage({id: 'confirmOrder_components_deliveryTime_footerBtnTips'})}</Text>
      </View>
    </Popup>
  );
};

export default observer(DeliveryTime);
