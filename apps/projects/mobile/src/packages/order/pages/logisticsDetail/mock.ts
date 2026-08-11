export const MOCK_LOGISTICS_DATA = {
  status: '运输中',
  company: '顺丰速运',
  trackingNo: 'SF20260805183510',
  currentLocation: '安徽省蚌埠市',
  latestDescription: '快件已到达安徽省蚌埠市集散中心，正在发往合肥市。',
  center: {
    latitude: 32.35,
    longitude: 117.28,
  },
  route: [
    { latitude: 32.94, longitude: 117.36 },
    { latitude: 32.58, longitude: 117.31 },
    { latitude: 32.16, longitude: 117.27 },
    { latitude: 31.82, longitude: 117.23 },
  ],
  traces: [
    {
      status: '运输中',
      time: '2026-08-06 10:26:16',
      description: '快件已到达安徽省蚌埠市集散中心，正在发往合肥市。',
    },
    {
      status: '运输中',
      time: '2026-08-06 07:48:32',
      description: '快件已离开蚌埠市集散中心，下一站安徽省合肥市。',
    },
    {
      status: '已揽收',
      time: '2026-08-05 20:16:05',
      description: '顺丰速运已收取快件，准备发往石家庄市集散中心。',
    },
    {
      status: '已下单',
      time: '2026-08-05 18:35:10',
      description: '商家已通知快递公司揽件。',
    },
  ],
}
