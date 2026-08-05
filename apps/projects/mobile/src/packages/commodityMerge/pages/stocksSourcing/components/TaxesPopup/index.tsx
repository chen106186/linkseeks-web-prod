/*
 * @Description: 税费 Popup
 */
import React from 'react';
import { View, Text } from '@apps/mobile-ui';
import { useIntl } from '@linkseeks/i18n';
import Popup from '@/components/Popup';
import Bookshelf from '../../../../components/Bookshelf';
import './index.scss';

interface IProps {
  /**
   * 是否显示
   */
  visible: boolean,
  /**
   * 关闭触发事件
   */
  onClose: () => void,
  /**
   * 是否是跨境商品
   */
  crossBorder: boolean,
  /**
   * 税率
   */
  taxes: number,
  /**
   * 商品单价
   */
  price: number,
  /**
   * 是否免税
   */
  dutyFree: boolean,
}

type DutyFresType = {
  label: string,
  title: string,
  fees?: string,
  description?: string,
}

const TaxesPopup: React.FC<IProps> = (props: IProps) => {
  const {
    visible,
    onClose,
    crossBorder,
    taxes,
    price,
  } = props;

  const intl = useIntl()

  const handleClose = () => {
    onClose?.();
  };

  if (!crossBorder) {
    return null;
  }

  const dutyFree = taxes === 0;

  const common: DutyFresType[] = [
    {
      label: intl.formatMessage({id: 'commodityMerge.stocksSourcing.components.taxesPopup.description.common.1.label',  defaultMessage: '进口税计算' }),
      title: intl.formatMessage({id: 'commodityMerge.stocksSourcing.components.taxesPopup.description.common.1.title',  defaultMessage: '进口税=商品完税价格(含运费、保险费)* 税率' }),
      description: intl.formatMessage({id: 'commodityMerge.stocksSourcing.components.taxesPopup.description.common.1.description',  defaultMessage: '完税价格由海关最终认定' }),
    },
    {
      label: intl.formatMessage({id: 'commodityMerge.stocksSourcing.components.taxesPopup.description.common.2.label',  defaultMessage: '进口税规定' }),
      title: intl.formatMessage({id: 'commodityMerge.stocksSourcing.components.taxesPopup.description.common.2.title',  defaultMessage: '交易限额' }),
      description: intl.formatMessage({id: 'commodityMerge.stocksSourcing.components.taxesPopup.description.common.2.description',  defaultMessage: '个人单笔交易限制人民币5000元，个人年度交易限值人民币26000元。在限值以内进口的跨境电子商务零售进口商品，关税税率暂设为0%；进口环节增值税、消费税取消免征税额，暂按法定应纳税额的70%征收。' }),
    },
  ];

  const notDutyFresArr: DutyFresType[] = [
    {
      label: intl.formatMessage({id: 'commodityMerge.stocksSourcing.components.taxesPopup.description.notDutyFres.1.label',  defaultMessage: '商品进口税' }),
      title: intl.formatMessage({id: 'commodityMerge.stocksSourcing.components.taxesPopup.description.notDutyFres.1.title',  defaultMessage: '预计' }),
      fees: `${intl.formatMessage({id: 'currency',  defaultMessage: '￥' })}${(taxes / 100 * price * 10000 / 10000).toFixed(2)}`,
      description: intl.formatMessage({id: 'commodityMerge.stocksSourcing.components.taxesPopup.description.notDutyFres.1.description',  defaultMessage: '实际结算税费以提交订单时的应付总金额明细为准' })
    },
    {
      label: intl.formatMessage({id: 'commodityMerge.stocksSourcing.components.taxesPopup.description.notDutyFres.2.label',  defaultMessage: '进口税税率' }),
      title: `${taxes}%`,
      description: intl.formatMessage({id: 'commodityMerge.stocksSourcing.components.taxesPopup.description.notDutyFres.2.description',  defaultMessage: '中国海关规定，不同类目商品征收税率不同' }),
    },
    ...common,
  ];

  const dutyFreeArr: DutyFresType[] = [
    {
      label: intl.formatMessage({id: 'commodityMerge.stocksSourcing.components.taxesPopup.description.dutyFree.1.label',  defaultMessage: '商品进口税' }),
      title: intl.formatMessage({id: 'commodityMerge.stocksSourcing.components.taxesPopup.description.dutyFree.1.title',  defaultMessage: '您所购买的商品已包含跨境电商进口税，个别商品税费由商家承担，您无需再行支付。' }),
    },
    ...common
  ];

  const bookshelfArr = dutyFree ? dutyFreeArr : notDutyFresArr;

  return (
    <Popup
      visible={visible}
      title={intl.formatMessage({id: 'commodityMerge.stocksSourcing.components.taxesPopup.title',  defaultMessage: '税费说明' })}
      onClose={handleClose}
      customTitleStyle={{
        backgroundColor: '#FFFFFF',
        borderBottom: 'none',
      }}
    >
      <View
        className='taxes-popup'
        style={{
          height: `calc(100vh * (3 / 5))`,
        }}
      >
        <View
          className='taxes-popup-scrollView'
        >
          <Bookshelf
            labelWidth={72}
          >
            {bookshelfArr.map((item) => (
              <Bookshelf.Item
                key={item.title}
                label={item.label}
                content={(
                  <View className='taxes-popup-content'>
                    <View className='taxes-popup-titleWrap'>
                      <Text className='taxes-popup-title'>{item.title}</Text>
                      {item.fees ? (
                        <Text className='taxes-popup-fees'>{item.fees}</Text>
                      ) : null}
                    </View>
                    {item.description ? (
                      <Text className='taxes-popup-description'>{item.description}</Text>
                    ) : null}
                  </View>
                )}
                labelClassName='taxes-popup-label'
                customStyle={{
                  alignItems: 'flex-start',
                }}
              />
            ))}
          </Bookshelf>
        </View>
      </View>
    </Popup>
  );
};

export default TaxesPopup;
