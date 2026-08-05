import React, { useEffect, useState } from 'react';
import { Toast } from '@apps/mobile-ui';
import { useIntl } from '@linkseeks/i18n';
import { getMemberMobileLrcRightPointGet } from '@apps/apis';

/** 这里给的是供应商id， 因为这是登录会员对某个供应商的积分 */
type OptionType = {
  memberId: number,
  memberRoleId: number
}

type PointType = {
  /** 平台分数 */
  platformScore: number,
  /** 会员分数 */
  memberScore: number,
}

function useGetPoint(options: OptionType) {
  const [point, setPoint] = useState<PointType>({
    platformScore: 0,
    memberScore: 0,
  });
  const intl = useIntl()
  useEffect(() => {
    if (!options.memberId || !options.memberRoleId) {
      return;
    }
    async function getPoint() {
      const { code, data, message } = await getMemberMobileLrcRightPointGet({
        memberId: options.memberId.toString(),
        roleId: options.memberRoleId.toString(),
      });
      if (code !== 1000) {
        Toast.show({
          title:  intl.formatMessage({id: `${code}`, defaultMessage: message}),
          icon: 'none'
        })
        return;
      }
      setPoint(data)
    }
    getPoint();
  }, [options.memberId, options.memberRoleId])

  return { point };
}

export default useGetPoint;
