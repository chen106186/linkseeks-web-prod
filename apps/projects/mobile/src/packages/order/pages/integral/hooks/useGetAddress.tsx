import React, { useEffect, useMemo, useState } from 'react';
import { Toast } from '@apps/mobile-ui';
import { GetLogisticsMobileReceiverAddressListDefaultResponse, getLogisticsMobileReceiverAddressPage, GetLogisticsMobileReceiverAddressPageResponseDetail } from '@apps/apis';
import { useIntl } from '@linkseeks/i18n';

type AddressType = GetLogisticsMobileReceiverAddressPageResponseDetail & {
  /** 省区编码 */
  provinceCode: string,
  /** 区编码 */
  cityCode: string,
  /** 市编码 */
  districtCode: string,
};

function useGetAddress(options: { shouldGetAddress: boolean }) {
  const [defaultAddress, setDefaultAddress] = useState<null | AddressType>(null);
  const [loadingAddress, setLoadingAddress] = useState<boolean>(false);
  const intl = useIntl()
  useEffect(() => {
    if (!options.shouldGetAddress) {
      return;
    }
    let isValid = true
    setLoadingAddress(true)
    async function getAddress() {
      try {
        const { code, data, message } = await getLogisticsMobileReceiverAddressPage({
          current: '1',
          pageSize: '10',
        });
        if (code !== 1000) {
          Toast.show({
            title:  intl.formatMessage({id: `${code}`, defaultMessage: message}),
            icon: 'none'
          });
          return;
        }
        if (data.totalCount === 0) {
          return;
        }
        if (isValid) {
          setDefaultAddress(data.data[0]!)
        }
      } finally {
        if (isValid) {
          setLoadingAddress(false);
        }
      }
    }
    getAddress()
    // eslint-disable-next-line consistent-return
    return () => {
      isValid = false;
    }
  }, [options.shouldGetAddress]);

  const handleChangeAddress = (addressValue: GetLogisticsMobileReceiverAddressListDefaultResponse[0]) => {
    setDefaultAddress(addressValue);
  }

  const cacheAddress = useMemo(() => defaultAddress, [defaultAddress]);
  return { address: cacheAddress, loadingAddress, handleChangeAddress};
}

export default useGetAddress;
