import React, { useState } from 'react'
import { ScrollView as TaroScrollView, View } from '@tarojs/components'
import { GodScrollViewProps } from '../../../../packages/types/scroll-view'
import ScrollView from '../../../../packages/components/scroll-view'

const PageView: React.FC = () => {
  const data = [
    {
      id: 20,
      memberId: 236,
      roleId: 3,
      name: '一路发吧',
      memberName: '168一路发',
      logo: 'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/TIM截图20180814111438695015b30b534c39ae99e3ac03453123.png',
      createTime: 1619163503829,
      areas: '广东省/广州市，湖南省/株洲市',
      levelTag: '青铜会员',
      registerYears: 0,
      creditPoint: 163,
      avgTradeCommentStar: 5,
      registeredCapital: '',
      establishmentDate: '',
      businessLicence: '',
      status: 1,
      productList: [
        {
          id: 761,
          mainPic:
            'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/4d6469bc5d30edf0b1b2b9bce993b752a9b0c725b11407ebf89f7169aff83e8.jpg',
          name: '斯凯奇老爹鞋',
          slogan: null,
          sellingPoint: null,
          customerCategory: { id: 802, name: '老爹鞋', category: null },
          brand: {
            id: 91,
            name: '斯凯奇1',
            logoUrl:
              'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/(A]Q@]G}9A8QQ3)3~1C4DRK47aaa405c98147e7a9163fa337c57772.png',
          },
          unitName: '件',
          priceType: 1,
          min: 200,
          max: 200,
          memberId: 236,
          memberRoleId: 3,
          memberName: '168一路发',
          storeId: 20,
        },
        {
          id: 749,
          mainPic:
            'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/2ff6759555ebc52a98a72701367e87b1f6ce33742a541a7a1271a7f16874307.jpg',
          name: '询价商品-老爹鞋',
          slogan: null,
          sellingPoint: null,
          customerCategory: { id: 300, name: '板鞋', category: { id: 45, name: '板鞋', category: null } },
          brand: {
            id: 91,
            name: '斯凯奇1',
            logoUrl:
              'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/(A]Q@]G}9A8QQ3)3~1C4DRK47aaa405c98147e7a9163fa337c57772.png',
          },
          unitName: '件',
          priceType: 2,
          min: 0,
          max: 0,
          memberId: 236,
          memberRoleId: 3,
          memberName: '168一路发',
          storeId: 20,
        },
        {
          id: 748,
          mainPic: 'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/板鞋75caf0d12ad246d09c3b8320f5a7a6af.png',
          name: '黑色板鞋',
          slogan: '斯凯奇黑色',
          sellingPoint: ['黑色', '斯凯奇'],
          customerCategory: { id: 300, name: '板鞋', category: { id: 45, name: '板鞋', category: null } },
          brand: {
            id: 91,
            name: '斯凯奇1',
            logoUrl:
              'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/(A]Q@]G}9A8QQ3)3~1C4DRK47aaa405c98147e7a9163fa337c57772.png',
          },
          unitName: '件',
          priceType: 1,
          min: 100,
          max: 200,
          memberId: 236,
          memberRoleId: 3,
          memberName: '168一路发',
          storeId: 20,
        },
      ],
    },
    {
      id: 4,
      memberId: 8,
      roleId: 4,
      name: '昊嘉网络有限公司',
      memberName: '昊嘉网络有限公司',
      logo: 'https://shushangyun-lingxi.oss-cn-shenzhen.aliyuncs.com/ceb245329a394082a642292e32753a331610099309898.jpg',
      createTime: 1610099390967,
      areas: '天津市/所有',
      levelTag: '青铜会员',
      registerYears: 0,
      creditPoint: 121,
      avgTradeCommentStar: 5,
      registeredCapital: '',
      establishmentDate: '',
      businessLicence: '',
      status: 1,
      productList: [],
    },
    {
      id: 2,
      memberId: 2,
      roleId: 3,
      name: '囧囧商城',
      memberName: '阿里巴巴88',
      logo: 'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/微信截图_20210927102614732ca5f25ca24553b47848c5db1d5482.png',
      createTime: 1610089117899,
      areas: '广东省/广州市',
      levelTag: '青铜会员',
      registerYears: 0,
      creditPoint: 88,
      avgTradeCommentStar: 5,
      registeredCapital: '1000万',
      establishmentDate: '2021年1月8日11:31:55',
      businessLicence:
        'https://shushangyun-lingxi.oss-cn-shenzhen.aliyuncs.com/16d351df6c5d4d87b1a732082b85f9b81610076704199.jpg',
      status: 1,
      productList: [
        {
          id: 767,
          mainPic:
            'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/src=http___img3.redocn.com_tupian_20180418_yinsechaobaodiannaoxianshiqizuocexiangzhanshiyangji_9327893.jpg&refer=http___img3.redocn59d0bed92c9940329bf1d71bdd44131c.jpg',
          name: '华硕电脑外星人26789',
          slogan: '1234567',
          sellingPoint: ['123456'],
          customerCategory: { id: 193, name: '台式电脑', category: { id: 5, name: '台式电脑', category: null } },
          brand: {
            id: 48,
            name: '你的泪光',
            logoUrl:
              'https://shushangyun-lingxi.oss-cn-shenzhen.aliyuncs.com/0817119541e34a45a1a02391d65d71de1611715808854.jpg',
          },
          unitName: '台',
          priceType: 1,
          min: 6888,
          max: 6888,
          memberId: 2,
          memberRoleId: 3,
          memberName: '阿里巴巴88',
          storeId: 2,
        },
        {
          id: 808,
          mainPic:
            'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/u=372771111,714167751&fm=26&fmt=auto63be417e52d642c58b21c0c304cc8194.jpg',
          name: '蓝月亮',
          slogan: '洗衣',
          sellingPoint: ['洗的干净'],
          customerCategory: { id: 128, name: '三级', category: { id: 24, name: '三级', category: null } },
          brand: null,
          unitName: '件',
          priceType: 1,
          min: 55,
          max: 898,
          memberId: 2,
          memberRoleId: 3,
          memberName: '阿里巴巴88',
          storeId: 2,
        },
        {
          id: 809,
          mainPic:
            'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/u=138550346,2687684616&fm=26&fmt=auto751971b4cf864fedb8a242143d2836d1.jpg',
          name: '洁厕剂',
          slogan: '洗厕所',
          sellingPoint: ['洗的干净'],
          customerCategory: { id: 128, name: '三级', category: { id: 24, name: '三级', category: null } },
          brand: null,
          unitName: '件',
          priceType: 1,
          min: 55,
          max: 898,
          memberId: 2,
          memberRoleId: 3,
          memberName: '阿里巴巴88',
          storeId: 2,
        },
      ],
    },
    {
      id: 3,
      memberId: 18,
      roleId: 4,
      name: '燃烧军团',
      memberName: '燃烧军团',
      logo: 'https://shushangyun-lingxi.oss-cn-shenzhen.aliyuncs.com/2fde85d21c134f6bbc4f71fe407b844a1610093115241.jpg',
      createTime: 1610093156907,
      areas: '天津市/所有',
      levelTag: '青铜会员',
      registerYears: 0,
      creditPoint: 80,
      avgTradeCommentStar: 5,
      registeredCapital: '',
      establishmentDate: '',
      businessLicence: '',
      status: 1,
      productList: [],
    },
    {
      id: 19,
      memberId: 231,
      roleId: 3,
      name: '1231',
      memberName: '1231',
      logo: 'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/src=http___pic25905b080c0234e44afb80b181f178855.58cdn',
      createTime: 1618390546997,
      areas: '天津市/所有',
      levelTag: '青铜会员',
      registerYears: 0,
      creditPoint: 79,
      avgTradeCommentStar: 5,
      registeredCapital: '18800000123',
      establishmentDate: '18800000123',
      businessLicence:
        'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/73fb12eeb0c34786a3416c918a949d1e1618388242073.png',
      status: 1,
      productList: [
        {
          id: 185,
          mainPic:
            'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/TIM截图2018081513370577b87ab876d049af8ac1444d362e2cd3.png',
          name: '小米12 属性商品',
          slogan: '商品标语',
          sellingPoint: ['买点', '2'],
          customerCategory: { id: 257, name: '小米手机', category: { id: 35, name: '小米手机', category: null } },
          brand: {
            id: 68,
            name: '小米',
            logoUrl:
              'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/248c2b1828834d48b299a909522f51c61618911386357.jpg',
          },
          unitName: '件',
          priceType: 1,
          min: 100,
          max: 200,
          memberId: 231,
          memberRoleId: 3,
          memberName: '18800000123',
          storeId: 19,
        },
        {
          id: 572,
          mainPic:
            'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/src=http___img01.jituwang.com_161223_257189-1612230S254100.jpg&refer=http___img01.jituwangd05acf4366ea48ee82e61daa271fd6f2.jpg',
          name: '2021笔记本电脑小潮新系列',
          slogan: '笔记本电脑',
          sellingPoint: ['11'],
          customerCategory: { id: 673, name: '平台品类1', category: { id: 62, name: '平台品类1', category: null } },
          brand: {
            id: 162,
            name: '测试品牌1',
            logoUrl:
              'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/src=http___bpic.588ku.com_element_origin_min_pic_16_09_02_2357c99578ed389.jpg&refer=http___bpic.588ku24d961443ed24e1292f1b1dfa8c3a4dc.jpg',
          },
          unitName: '件',
          priceType: 1,
          min: 3900,
          max: 3900,
          memberId: 231,
          memberRoleId: 3,
          memberName: '1231',
          storeId: 19,
        },
        {
          id: 200,
          mainPic:
            'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/src=http___img1cdab3c0c23d47e4b3b4332e455d0a14.315che',
          name: '保时捷跑车',
          slogan: null,
          sellingPoint: null,
          customerCategory: { id: 264, name: '保时捷', category: { id: 39, name: '保时捷', category: null } },
          brand: null,
          unitName: '件',
          priceType: 1,
          min: 100000,
          max: 100000,
          memberId: 231,
          memberRoleId: 3,
          memberName: '18800000123',
          storeId: 19,
        },
      ],
    },
    {
      id: 31,
      memberId: 408,
      roleId: 84,
      name: 'SRM供应商002',
      memberName: 'SRM供应商002',
      logo: 'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/u=3350801426,3390511877&fm=26&gp=0e86daad8410649d991c62b4492548fa4.jpg',
      createTime: 1628045248263,
      areas: '河北省/所有',
      levelTag: '',
      registerYears: 0,
      creditPoint: 75,
      avgTradeCommentStar: 5,
      registeredCapital: '200000',
      establishmentDate: '2021-01-02',
      businessLicence:
        'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/src=http___5b0988e595225a242c868d9dd470496a771fa389f3e77.cdn',
      status: 1,
      productList: [],
    },
    {
      id: 5,
      memberId: 3,
      roleId: 4,
      name: '13600000001',
      memberName: '13600000001',
      logo: 'https://shushangyun-lingxi.oss-cn-shenzhen.aliyuncs.com/f60693caed3f47868e5897bd1ccf40ea1610331248766.png',
      createTime: 1610331306220,
      areas: '天津市/所有',
      levelTag: '青铜会员',
      registerYears: 0,
      creditPoint: 45,
      avgTradeCommentStar: 5,
      registeredCapital: '',
      establishmentDate: '',
      businessLicence: '',
      status: 1,
      productList: [],
    },
    {
      id: 12,
      memberId: 70,
      roleId: 3,
      name: '18800000035',
      memberName: '18800000035',
      logo: 'https://shushangyun-lingxi.oss-cn-shenzhen.aliyuncs.com/8f3628dc2a554ffe87bf048fe91623791611729382032.jpg',
      createTime: 1611729394346,
      areas: '天津市/所有',
      levelTag: '青铜会员',
      registerYears: 0,
      creditPoint: 41,
      avgTradeCommentStar: 5,
      registeredCapital: '18800000035',
      establishmentDate: '18800000035',
      businessLicence: '',
      status: 1,
      productList: [
        {
          id: 627,
          mainPic:
            'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/TIM截图201808141114489d42a6c3115b4cbbbc538c38703e3857.png',
          name: '35的商品嘎嘎嘎_一次支付',
          slogan: null,
          sellingPoint: [],
          customerCategory: { id: 222, name: '二级', category: null },
          brand: {
            id: 62,
            name: '35的品牌',
            logoUrl:
              'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/0aa18fcbe16c4208b3c0995589b593621617788514145.jpg',
          },
          unitName: '千克',
          priceType: 1,
          min: 100,
          max: 100,
          memberId: 70,
          memberRoleId: 3,
          memberName: '18800000035',
          storeId: 12,
        },
        {
          id: 148,
          mainPic:
            'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/ef6dd411e1fc4610b45438bf018b42bc1617949947770.png',
          name: '报价专用2',
          slogan: null,
          sellingPoint: null,
          customerCategory: { id: 221, name: '一级', category: { id: 22, name: '一级', category: null } },
          brand: {
            id: 62,
            name: '35的品牌',
            logoUrl:
              'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/0aa18fcbe16c4208b3c0995589b593621617788514145.jpg',
          },
          unitName: '瓶',
          priceType: 1,
          min: 100,
          max: 100,
          memberId: 70,
          memberRoleId: 3,
          memberName: '18800000035',
          storeId: 12,
        },
        {
          id: 146,
          mainPic:
            'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/bd11f49207c040beb52f1f9f20a2bda71617796684238.png',
          name: '报价专用',
          slogan: null,
          sellingPoint: null,
          customerCategory: { id: 221, name: '一级', category: { id: 22, name: '一级', category: null } },
          brand: {
            id: 62,
            name: '35的品牌',
            logoUrl:
              'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/0aa18fcbe16c4208b3c0995589b593621617788514145.jpg',
          },
          unitName: '瓶',
          priceType: 1,
          min: 200,
          max: 200,
          memberId: 70,
          memberRoleId: 3,
          memberName: '18800000035',
          storeId: 12,
        },
      ],
    },
    {
      id: 31,
      memberId: 408,
      roleId: 84,
      name: 'SRM供应商003',
      memberName: 'SRM供应商003',
      logo: 'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/u=3350801426,3390511877&fm=26&gp=0e86daad8410649d991c62b4492548fa4.jpg',
      createTime: 1628045248263,
      areas: '河北省/所有',
      levelTag: '',
      registerYears: 0,
      creditPoint: 75,
      avgTradeCommentStar: 5,
      registeredCapital: '200000',
      establishmentDate: '2021-01-02',
      businessLicence:
        'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/src=http___5b0988e595225a242c868d9dd470496a771fa389f3e77.cdn',
      status: 1,
      productList: [],
    },
  ]

  const [refreshing, setRefreshing] = useState(false)

  const _onRefresh = () => {
    console.log('ok')
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 3000)
  }
  return (
    <ScrollView
      horizontal
      data={data}
      listEmptyComponent={<View>我是空的</View>}
      onRefresh={_onRefresh}
      refreshing={refreshing}
      listHeaderComponent={<View>我是头部</View>}
      listFooterComponent={<View>我是尾部</View>}
      itemSeparatorComponent={<View style={{ height: 1, backgroundColor: 'red' }}></View>}
      contentContainerStyle={{ padding: 8 }}
      scrollIntoView="renderItem_3"
      renderItem={({ item, index }) =>
        item.status !== 0 ? (
          <View id={`renderItem_${item.id}`} style={{ width: 100 }} key={index}>
            {item.name}
          </View>
        ) : null
      }
    >
      <View style={{ backgroundColor: 'red' }}>我是children</View>
      <View>我是children2</View>
    </ScrollView>
  )
}

export default PageView
