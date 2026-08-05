## 商城品类楼层

### 基础用法

```tsx
import React from 'react'
import { FloorLine, LocaleProvide } from '@apps/design-ui'

const data: any = [
  {
    id: 1,
    name: '机械设备',
    categoryAdvertPicUrl:
      'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/118ec6a47bac41099d684a1dfcd7be7d1601349758127.jpg',
    shopNum: 3,
    goodsNum: 14,
    name: '机械设备',
    thirdAdvertList: [
      {
        id: 57,
        templateId: 1,
        categoryId: 1,
        type: 3,
        name: '1',
        picUrl:
          'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/db6f6490cff944bd8da6fcccd365ba221601366976444.jpg',
        link: '',
        sort: 1,
        memberId: null,
        roleId: null,
        createTime: 1601366977966,
      },
    ],
    categoryBOList: [
      {
        categoryId: 2,
        categoryName: '工程机械',
        selectStatus: 1,
      },
      {
        categoryId: 3,
        categoryName: '包装设备',
        selectStatus: 1,
      },
      {
        categoryId: 4,
        categoryName: '环保设备',
        selectStatus: 1,
      },
    ],
    goodsBOList: [
      {
        goodsId: 3,
        goodsName: '厂家定做 2吨单梁龙门吊3吨简易龙门吊 5吨花架门式起重机',
        goodsPicUrl:
          'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/0ffb296ea27e4244bc2cc197956850cf1601368009998.jpg',
        goodsPrice: '20000.0',
        cashPriceType: 2,
        minSidePrice: 10,
        categoryName: '起重机',
        brandName: '安盛',
        memberId: 2,
        shopId: 2,
        priceType: 1,
      },
      {
        goodsId: 19,
        goodsName: '厂家直销挖掘装载机多功能两头忙挖掘装载机小型挖掘装载机',
        goodsPicUrl:
          'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/a0561fc936364f969d9216027138737b1601278766489.jpg',
        goodsPrice: '10000.0',
        cashPriceType: 3,
        minSidePrice: 10,
        categoryName: '挖掘机',
        brandName: '数商云',
        memberId: 9,
        shopId: 3,
        priceType: 1,
      },
      {
        goodsId: 51,
        goodsName: '环保除尘设备水泥袋式脉冲单机除尘器布袋集尘器定制',
        goodsPicUrl:
          'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/3d437578a28c473e9f8dc951f63773c31601374008303.JPG',
        goodsPrice: '5600.0',
        categoryName: '除尘器',
        brandName: 'OBASF',
        memberId: 15,
        shopId: 6,
        priceType: 1,
      },
      {
        goodsId: 31,
        goodsName:
          '新款30型小挖掘机配驾驶室带空调市政工程水利建设小型液压挖掘机',
        goodsPicUrl:
          'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/9c535ba9c3374307ae6afbbf535a311e1601364018708.jpeg',
        goodsPrice: '20000.0',
        categoryName: '立式包装机',
        brandName: '合能为',
        memberId: 9,
        shopId: 3,
        priceType: 1,
      },
      {
        goodsId: 14,
        goodsName:
          '定做湖北武汉市双梁桥式起重机电动单梁起重机简易龙门吊行吊行车',
        goodsPicUrl:
          'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/0d258d7f33e14664b6669b164eb5338e1601368183686.jpeg',
        goodsPrice: '50000.0',
        categoryName: '起重机',
        brandName: '安盛',
        memberId: 2,
        shopId: 2,
        priceType: 1,
      },
      {
        goodsId: 27,
        goodsName: '轮式抓木机 挖掘装载机 小型挖掘机 抓钢机',
        goodsPicUrl:
          'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/e6ebe8b212684198af139aebca71ed971601364079259.jpg',
        goodsPrice: '30000.0',
        categoryName: '挖掘机',
        brandName: '施耐德',
        memberId: 9,
        shopId: 3,
        priceType: 1,
      },
      {
        goodsId: 30,
        goodsName: '犀牛XN18挖掘机洋马发动机 农用果园',
        goodsPicUrl:
          'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/a748f76ebffc4912a104ad5a1e2727851601364061691.jpeg',
        goodsPrice: '30000.0',
        categoryName: '挖掘机',
        brandName: '友飞翔',
        memberId: 9,
        shopId: 3,
        priceType: 1,
      },
      {
        goodsId: 12,
        goodsName: '厂家现货 1吨-5吨简易电动龙门架 移动式电动葫芦龙门吊',
        goodsPicUrl:
          'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/42e1018690eb4ad09da9233599772f0f1601367922365.jpeg',
        goodsPrice: '10000.0',
        categoryName: '起重机',
        brandName: '安盛',
        memberId: 2,
        shopId: 2,
        priceType: 1,
      },
      {
        goodsId: 26,
        goodsName: '全新微型挖掘机 犀牛XN18挖掘机洋马发动机 农用果园',
        goodsPicUrl:
          'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/03f5168b495b428baea67c7ad87f82361601364173457.jpeg',
        goodsPrice: '20000.0',
        categoryName: '挖掘机',
        brandName: '鹏飞宏',
        memberId: 9,
        shopId: 3,
        priceType: 1,
      },
    ],
    shopBOList: [
      {
        shopId: 2,
        shopLogo:
          'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/1500665330554047984cdba734d051241601367152122.jpg',
        shopName: '无锡市川江机械设备有限公司',
        memberId: 2,
      },
      {
        shopId: 3,
        shopLogo:
          'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/8225da43b0bb4d6199a028a63d9f8da91603161481060.jpg',
        shopName: '广州市数商云网络科技有限公司',
        memberId: 9,
      },
      {
        shopId: 6,
        shopLogo:
          'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/e88976e9dd644a9eb9f06a862d10ad291601374111328.jpg',
        shopName: '常州市康庄包装设备有限公司',
        memberId: 15,
      },
    ],
    brandBOList: [
      {
        brandId: 2,
        brandLogo:
          'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/3235e45329484d02a83a9c7ac3ae4d331601194405502.png',
        brandName: '安盛',
      },
      {
        brandId: 10,
        brandLogo:
          'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/f6c24930399b4c1db235c63495e2a4711601278444248.jpg',
        brandName: '友飞翔',
      },
      {
        brandId: 11,
        brandLogo:
          'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/fe07c0bb9464449387b11e9913f684811601278515132.jpg',
        brandName: '友昌振兴',
      },
      {
        brandId: 12,
        brandLogo:
          'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/f3b781b25e564a3dacb4e0a2915878431601284131813.jpg',
        brandName: '施耐德',
      },
      {
        brandId: 13,
        brandLogo:
          'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/13dee5dcbd904ce2b31c561e2b6b1b071601284190749.jpg',
        brandName: '鹏飞宏',
      },
      {
        brandId: 14,
        brandLogo:
          'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/baee5d86e18d4d4c8b034630337f9de31601285684602.jpg',
        brandName: '合能为',
      },
    ],
  },
  {
    id: 5,
    name: '五金工具',
    categoryAdvertPicUrl:
      'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/e0191f8ef43b43e9a149e4bda2ccb0fe1601374531074.jpg',
    shopNum: 2,
    goodsNum: 15,
    name: '五金工具',
    thirdAdvertList: [
      {
        id: 58,
        templateId: 1,
        categoryId: 5,
        type: 3,
        name: '1',
        picUrl:
          'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/4aed165716a842a181f9a31ad5e695c91601366992809.jpg',
        link: '',
        sort: 1,
        memberId: null,
        roleId: null,
        createTime: 1601366994276,
      },
    ],
    categoryBOList: [
      {
        categoryId: 6,
        categoryName: '手动工具',
        selectStatus: 1,
      },
      {
        categoryId: 7,
        categoryName: '电动工具',
        selectStatus: 1,
      },
      {
        categoryId: 8,
        categoryName: '喷涂气动',
        selectStatus: 1,
      },
    ],
    goodsBOList: [
      {
        goodsId: 49,
        goodsName: '出口电动工具木工电圆锯工业切割机',
        goodsPicUrl:
          'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/921a3521f5dd45629218c72d2c77c1981601370041300.JPG',
        goodsPrice: '680.0',
        categoryName: '切割机',
        brandName: 'BOSCH',
        memberId: 14,
        shopId: 5,
        priceType: 1,
      },
      {
        goodsId: 11,
        goodsName: '批发工具箱包厂家批发高强度牛津布帆布大中小五金工具包',
        goodsPicUrl:
          'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/0c88a7b819f6451188b1d4e1ce4a0eb91601274982570.jpg',
        goodsPrice: '16.5',
        categoryName: '工具箱包',
        brandName: 'DOW',
        memberId: 5,
        shopId: 1,
        priceType: 1,
      },
      {
        goodsId: 5,
        goodsName:
          '长捷 小型手动弯管机 SWG-25 弯90度钢管外径10-25 液压弯管工具',
        goodsPicUrl:
          'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/62d2d8b97a7f423a97cfbfcd2db1a8b51601261008693.jpg',
        goodsPrice: '380.0',
        categoryName: '液压工具',
        brandName: 'EVONIK',
        memberId: 5,
        shopId: 1,
        priceType: 1,
      },
      {
        goodsId: 46,
        goodsName: '扬子暖风机家用小型摇头取暖大功率工业大鹏养殖厂专用热风机',
        goodsPicUrl:
          'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/3ab774ef89d34595a9d37a01e96b069e1601361084491.JPG',
        goodsPrice: '299.0',
        categoryName: '热风枪',
        brandName: 'STARLEY',
        memberId: 14,
        shopId: 5,
        priceType: 1,
      },
      {
        goodsId: 43,
        goodsName: '高温烘干热风机高温燃油暖风机畜牧养殖设备恒温工业暖风机',
        goodsPicUrl:
          'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/f69b982e23094006852c91e7ecadb3ab1601360509196.JPG',
        goodsPrice: '799.0',
        categoryName: '热风枪',
        brandName: 'STARLEY',
        memberId: 14,
        shopId: 5,
        priceType: 1,
      },
      {
        goodsId: 48,
        goodsName: '440K打码枪 不卡 钉蚊打码钉枪 工业级耐用气动打钉机',
        goodsPicUrl:
          'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/affa3c02c27147f389c8742b540a9c391601369411144.JPG',
        goodsPrice: '300.0',
        categoryName: '喷枪',
        brandName: '3M',
        memberId: 14,
        shopId: 5,
        priceType: 1,
      },
      {
        goodsId: 44,
        goodsName:
          '数显调温热风枪小型汽车贴膜拷枪烘枪吹热风机工业热缩膜塑料焊枪',
        goodsPicUrl:
          'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/2f894834707740c6bec50e79ce4fbd101601360721070.JPG',
        goodsPrice: '168.0',
        categoryName: '热风枪',
        brandName: 'BOSCH',
        memberId: 14,
        shopId: 5,
        priceType: 1,
      },
      {
        goodsId: 10,
        goodsName: '安全箱防护箱 塑料工具箱摄影设备器材箱拉杆安全箱',
        goodsPicUrl:
          'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/ed09215565fe49b29c6f1d2365a483c31601347052192.jpg',
        goodsPrice: '628.0',
        categoryName: '工具箱包',
        brandName: 'SKF',
        memberId: 5,
        shopId: 1,
        priceType: 1,
      },
      {
        goodsId: 7,
        goodsName: '长捷 电动角钢冲孔机 液压打孔机CH-70-1冲3号角铁 ',
        goodsPicUrl:
          'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/f5d89b29a6864aaaaf5d92edee9bb2e31601267329744.jpg',
        goodsPrice: '9.5',
        categoryName: '液压工具',
        brandName: 'SIEMENS',
        memberId: 5,
        shopId: 1,
        priceType: 1,
      },
      {
        goodsId: 6,
        goodsName:
          '世达 Sata 五金工具 sata30吨重型立式手动液压千斤顶2-50吨 97801A',
        goodsPicUrl:
          'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/e8a52be68c954fafb8e296a37b0fabeb1601275246511.jpg',
        goodsPrice: '88.8',
        categoryName: '液压工具',
        brandName: 'EVONIK',
        memberId: 5,
        shopId: 1,
        priceType: 1,
      },
    ],
    shopBOList: [
      {
        shopId: 5,
        shopLogo:
          'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/87d114c01a794e5dab32fd688a500f181601368913101.jpg',
        shopName: '上海市碧海智造净化科技有限公司',
        memberId: 14,
      },
      {
        shopId: 1,
        shopLogo:
          'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/2c29cd54ff2c49a2b4a87f166b5960991601368692513.jpg',
        shopName: '北京市佳庆工业设备有限公司',
        memberId: 5,
      },
    ],
    brandBOList: [
      {
        brandId: 20,
        brandLogo:
          'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/82dfee9480fb44c39f6c3c2db5fd1a201601360256137.jpg',
        brandName: 'STARLEY',
      },
      {
        brandId: 1,
        brandLogo:
          'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/3519fd57aaf04a7b9d6fb798d786a3301601193746862.png',
        brandName: 'SIEMENS',
      },
      {
        brandId: 3,
        brandLogo:
          'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/6dd704f67c5f4f99b0c239ad61e2562a1601257436754.png',
        brandName: 'EVONIK',
      },
      {
        brandId: 18,
        brandLogo:
          'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/d5d715f7ced0493cb3ec54593778dd701601360192368.jpg',
        brandName: '3M',
      },
      {
        brandId: 5,
        brandLogo:
          'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/4c2d508497c2402f978b22c1f7fa90e81601268350014.png',
        brandName: '施耐德',
      },
      {
        brandId: 7,
        brandLogo:
          'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/28bcd6ce930a457db9310b405df9473b1601270990456.png',
        brandName: 'DOW',
      },
    ],
  },
  {
    id: 9,
    name: '电子电器',
    categoryAdvertPicUrl:
      'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/f46d4affcd254aa48e35c9ddeda466151601349777642.jpg',
    shopNum: 3,
    goodsNum: 10,
    name: '电子电器',
    thirdAdvertList: [
      {
        id: 59,
        templateId: 1,
        categoryId: 9,
        type: 3,
        name: '1',
        picUrl:
          'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/e54ba82a99254626b220f63628c466db1601367007367.jpg',
        link: '',
        sort: 1,
        memberId: null,
        roleId: null,
        createTime: 1601367008792,
      },
    ],
    categoryBOList: [
      {
        categoryId: 10,
        categoryName: '工业自动化',
        selectStatus: 1,
      },
      {
        categoryId: 11,
        categoryName: '电气辅料',
        selectStatus: 1,
      },
      {
        categoryId: 12,
        categoryName: '输配电产品',
        selectStatus: 1,
      },
    ],
    goodsBOList: [
      {
        goodsId: 53,
        goodsName: '雾炮机高效除尘工地环保设备降温车载洒水喷雾炮雾机厂家直销',
        goodsPicUrl:
          'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/037baf5a49d54cb0b9175ca4eaac4f801601376920061.JPG',
        goodsPrice: '3600.0',
        categoryName: '配电箱',
        brandName: 'OBASF',
        memberId: 15,
        shopId: 6,
        priceType: 1,
      },
      {
        goodsId: 33,
        goodsName: '福禄克电工仪表F15B数字万用表 F101 手持万用表',
        goodsPicUrl:
          'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/629cace1218c4b4a84ee6d3b0d1906231601289363984.png',
        goodsPrice: '298.0',
        categoryName: '电工仪表',
        brandName: 'BYGD',
        memberId: 11,
        shopId: 4,
        priceType: 1,
      },
      {
        goodsId: 32,
        goodsName: '电工仪器仪表F15B数字万用表F101 F17B+手持万用表',
        goodsPicUrl:
          'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/e42d19f19b3548d89ac67ae766d750881601288943362.png',
        goodsPrice: '299.0',
        categoryName: '电工仪表',
        brandName: '西悦德',
        memberId: 11,
        shopId: 4,
        priceType: 1,
      },
      {
        goodsId: 29,
        goodsName: '供应成套电气开关柜电容补偿柜控制开关柜GCS低压抽出式开关柜',
        goodsPicUrl:
          'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/31c837f71ff84996bd914cd11a907bb21601285363275.jpg',
        goodsPrice: '2500.0',
        categoryName: '低压电气',
        brandName: '鹏飞宏',
        memberId: 9,
        shopId: 3,
        priceType: 1,
      },
      {
        goodsId: 24,
        goodsName: '15/19/22/27/32寸嵌入式十指电容触摸工业触摸显示器',
        goodsPicUrl:
          'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/53caa906bde04a8c8d042de721a6f8e71601283425278.jpg',
        goodsPrice: '1000.0',
        categoryName: '工控设备',
        brandName: '友飞翔',
        memberId: 9,
        shopId: 3,
        priceType: 1,
      },
      {
        goodsId: 21,
        goodsName: '10/15/19寸工控一体机触摸屏嵌入式全封闭防尘PLC平板电脑',
        goodsPicUrl:
          'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/2aa8143601ef4b0fbe736db6339e552a1601379088893.png',
        goodsPrice: '1300.0',
        categoryName: '工控设备',
        brandName: '火狐热控',
        memberId: 9,
        shopId: 3,
        priceType: 1,
      },
      {
        goodsId: 52,
        goodsName: 'PZ30暗装 18回路位 家用室内强电源开盒空气开关盒子 配电箱',
        goodsPicUrl:
          'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/8768e5c250984a1f936e7502c926382c1601376292171.JPG',
        goodsPrice: '100.0',
        categoryName: '配电箱',
        brandName: '世达',
        memberId: 15,
        shopId: 6,
        priceType: 1,
      },
      {
        goodsId: 22,
        goodsName: '15/17/19寸新零售触摸显示器电容触摸工业触控显示器嵌入式',
        goodsPicUrl:
          'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/57dd9e8027b04e24a40a26af4f5a97f01601282964802.jpg',
        goodsPrice: '987.0',
        categoryName: '工控设备',
        brandName: '友飞翔',
        memberId: 9,
        shopId: 3,
        priceType: 1,
      },
      {
        goodsId: 34,
        goodsName: '金锚电子金具厂家 铜鼻资 DTM堵油铜接线端子',
        goodsPicUrl:
          'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/cbf621ac60b94b25a9eef07eb1aedbb91601290212250.png',
        goodsPrice: '1.9',
        categoryName: '电热产品',
        brandName: 'BYGD',
        memberId: 11,
        shopId: 4,
        priceType: 1,
      },
      {
        goodsId: 28,
        goodsName:
          '穿孔式交流电流变送器霍尔直流0-5A隔离转电压4-20mA 电流变送器',
        goodsPicUrl:
          'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/80a5abfdae394da5ab1dc62893e1f1821601284763925.jpg',
        goodsPrice: '4.6',
        categoryName: '变送器',
        brandName: '友昌振兴',
        memberId: 9,
        shopId: 3,
        priceType: 1,
      },
    ],
    shopBOList: [
      {
        shopId: 3,
        shopLogo:
          'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/8225da43b0bb4d6199a028a63d9f8da91603161481060.jpg',
        shopName: '广州市数商云网络科技有限公司',
        memberId: 9,
      },
      {
        shopId: 4,
        shopLogo:
          'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/bf022450cf9e43299d14b829cd0759001601368844325.jpg',
        shopName: '湖南长沙言承工业品有限公司',
        memberId: 11,
      },
      {
        shopId: 6,
        shopLogo:
          'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/e88976e9dd644a9eb9f06a862d10ad291601374111328.jpg',
        shopName: '常州市康庄包装设备有限公司',
        memberId: 15,
      },
    ],
    brandBOList: [
      {
        brandId: 10,
        brandLogo:
          'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/f6c24930399b4c1db235c63495e2a4711601278444248.jpg',
        brandName: '友飞翔',
      },
      {
        brandId: 16,
        brandLogo:
          'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/5018d3d8045d46058cffcbfad3789e5c1601288065710.jpg',
        brandName: 'BYGD',
      },
      {
        brandId: 9,
        brandLogo:
          'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/f6c334d11ed04e8c9d826e394af7dd461601278409622.jpg',
        brandName: '火狐热控',
      },
      {
        brandId: 11,
        brandLogo:
          'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/fe07c0bb9464449387b11e9913f684811601278515132.jpg',
        brandName: '友昌振兴',
      },
      {
        brandId: 13,
        brandLogo:
          'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/13dee5dcbd904ce2b31c561e2b6b1b071601284190749.jpg',
        brandName: '鹏飞宏',
      },
      {
        brandId: 15,
        brandLogo:
          'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/638cc2a470f249708eb447e2e87b36f01601287983922.jpg',
        brandName: '西悦德',
      },
    ],
  },
]

export default () => (
  <div className="theme-shop-science">
    <LocaleProvide locale="zh-CN">
      {data.map((item) => (
        <FloorLine title={item.name}>
          <FloorLine.Horizontal>
            <FloorLine.Category
              categoryAdvertPicUrl={item.categoryAdvertPicUrl}
              secondCategoryList={item.categoryBOList}
            />
            <FloorLine.Vertical>
              <FloorLine.FloorHeader
                shopNum={item.shopNum}
                goodsNum={item.goodsNum}
              >
                <FloorLine.Banner advertList={item.thirdAdvertList} />
              </FloorLine.FloorHeader>
              <FloorLine.Horizontal>
                <FloorLine.Goods linkdisable goodsList={item.goodsBOList} />
                <FloorLine.Shops shopsList={item.shopBOList} />
              </FloorLine.Horizontal>
            </FloorLine.Vertical>
          </FloorLine.Horizontal>
          <FloorLine.Brand brandList={item.brandBOList} />
        </FloorLine>
      ))}
    </LocaleProvide>
  </div>
)
```
