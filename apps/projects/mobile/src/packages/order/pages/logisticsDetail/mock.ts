export interface LogisticsMapPoint {
  latitude: number
  longitude: number
}

export interface LogisticsTrackEvent {
  id: number
  status: string
  time: string
  description: string
  active?: boolean
}

export const MOCK_LOGISTICS_DETAIL = {
  status: '运输中',
  statusDescription: '快件正在发往合肥市集散中心',
  pickupCode: '5-2-018',
  company: '顺丰速运',
  logisticsNo: 'SF1234567890123',
  courier: '王师傅',
  courierPhone: '138****5678',
  orderNo: 'SO2026080509109569',
  address: '安徽省合肥市瑶海区测试详细地址123号',
  origin: {
    name: '石家庄市',
    latitude: 38.0428,
    longitude: 114.5149,
  },
  current: {
    name: '安徽省蚌埠市',
    latitude: 32.9163,
    longitude: 117.3897,
  },
  destination: {
    name: '合肥市',
    latitude: 31.8206,
    longitude: 117.2272,
  },
  route: [
    { latitude: 38.0428, longitude: 114.5149 },
    { latitude: 37.4653, longitude: 114.4989 },
    { latitude: 36.6171, longitude: 114.5391 },
    { latitude: 35.303, longitude: 113.9268 },
    { latitude: 34.7466, longitude: 113.6254 },
    { latitude: 34.2044, longitude: 116.1294 },
    { latitude: 33.9548, longitude: 116.7983 },
    { latitude: 32.9163, longitude: 117.3897 },
    { latitude: 32.6292, longitude: 116.9841 },
    { latitude: 31.8206, longitude: 117.2272 },
  ] as LogisticsMapPoint[],
  events: [
    {
      id: 1,
      status: '运输中',
      time: '2026-08-06 10:26:16',
      description: '快件已到达安徽省蚌埠市集散中心，正在发往合肥市。',
      active: true,
    },
    {
      id: 2,
      status: '运输中',
      time: '2026-08-06 07:48:32',
      description: '快件已离开徐州市集散中心，下一站安徽省蚌埠市。',
    },
    {
      id: 3,
      status: '已揽收',
      time: '2026-08-05 20:16:05',
      description: '顺丰速运已收取快件，准备发往石家庄市集散中心。',
    },
    {
      id: 4,
      status: '已下单',
      time: '2026-08-05 18:35:10',
      description: '商家已通知快递公司揽件。',
    },
  ] as LogisticsTrackEvent[],
}
