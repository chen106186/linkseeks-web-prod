import React, { useEffect, useState } from 'react';
import { postMarketingMobileActivityOrderGroupPurchaseDetail } from '@apps/apis';

type Options = {
  id: number
}

type InfoType = {
  /** 状态（1：拼团中，2：拼团成功，3：拼团失败） */
  status: 1 | 2 | 3 | number & {},
  /** 成团人数 */
  assembleNum: number,
  isJoin: boolean,
  /** 参团人数 */
  num: number,
  /** 结束时间（秒），如果为-1则无时效限制 */
  itemList: {
    isMaster: 0 | 1 | number & {},
    logo: string,
    memberName: string
  }[],
  endTime: number,
}

// const mock = {
//   status: 1,
//   assembleNum: 4,
//   num: 3,
//   itemList: [
//     {
//       isMaster: 1 as 1,
//       logo: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.mp.itc.cn%2Fupload%2F20160728%2F2cd44f0f9fde48d482bfe80d4b853938_th.jpg&refer=http%3A%2F%2Fimg.mp.itc.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1641450036&t=405f42307e8f48736a2e57cdbf222a0e",
//     },
//     {
//       isMaster: 0 as 0,
//       logo: "https://ss3.baidu.com/-fo3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/96dda144ad34598244fbbdcd07f431adcbef8478.jpg",
//     },
//     {
//       isMaster: 0 as 0,
//       logo: "https://img2.baidu.com/it/u=3609501244,1303337382&fm=26&fmt=auto",
//     }
//   ]
// }

function useGetData(options: Options) {
  const [info, setInfo] = useState<null | InfoType>(null);

  useEffect(() => {
    async function getData() {
      const { data, code } = await postMarketingMobileActivityOrderGroupPurchaseDetail({ id: options.id })
      if (code === 1000) {
        setInfo(data as InfoType);
      }
    }
    if (options.id) {
      getData();
    }
  }, [])

  return { info };
}

export default useGetData;
