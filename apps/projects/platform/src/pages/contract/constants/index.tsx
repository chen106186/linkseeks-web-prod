import React from 'react'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { formatTimeString } from '@/utils'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import { PlayCircleOutlined, PoweroffOutlined } from '@ant-design/icons'
import CustomTag from '@/pages/procurement/components/customTag'
import CustomBadge from '@/pages/procurement/components/customBadge'
import { CALLFORBID_TYPE, PURCHASE_TYPE } from '@/constants'
import { useLocation } from '@linkseeks/router-core'
const intl = getIntl()
// 招投标内部状态
export const insideStatusText = [
  intl.formatMessage({ id: 'contract.daitijiaoshenhe' }),
  intl.formatMessage({ id: 'contract.shenhetongguo' }),
  intl.formatMessage({ id: 'contract.baomingshenhetongguo' }),
  intl.formatMessage({ id: 'contract.zigeyushenshenhetongguo' }),
  intl.formatMessage({ id: 'contract.daikaibiao' }),
  intl.formatMessage({ id: 'contract.daipingbiao' }),
  intl.formatMessage({ id: 'contract.daitijiaoshenhedingbiao' }),
  intl.formatMessage({ id: 'contract.dingbiaoshenhetongguoer' }),
  intl.formatMessage({ id: 'contract.wanchengzhaobiao' }),
  intl.formatMessage({ id: 'contract.yifeibiao' }),
]

// 招投标外部状态
export const outStatusText = [
  intl.formatMessage({ id: 'contract.daitijiaozhaobiao' }),
  intl.formatMessage({ id: 'contract.daipingtaishenhezhaobiao' }),
  intl.formatMessage({ id: 'contract.daizhaobiaobaoming' }),
  intl.formatMessage({ id: 'contract.daizigeyushen' }),
  intl.formatMessage({ id: 'contract.daikaibiao' }),
  intl.formatMessage({ id: 'contract.daipingbiao' }),
  intl.formatMessage({ id: 'contract.daidingbiao' }),
  intl.formatMessage({ id: 'contract.daizhongbiaogongshi' }),
  intl.formatMessage({ id: 'contract.wanchengzhaobiao' }),
  intl.formatMessage({ id: 'contract.yifeibiao' }),
]

// 评标中的环节状态
export const remarkProcessStatus = [
  intl.formatMessage({ id: 'contract.weibaoming' }),
  intl.formatMessage({ id: 'contract.yipingbiao' }),
  intl.formatMessage({ id: 'contract.weipingbiao' }),
  intl.formatMessage({ id: 'contract.weibaoming' }),
  intl.formatMessage({ id: 'contract.weibaojia' }),
  intl.formatMessage({ id: 'contract.baomingshenheweitongguo' }),
  intl.formatMessage({ id: 'contract.zigeshenheweitongguo' }),
]

// 招标表格基本列
export const baseBidListColumns: any[] = [
  {
    title: intl.formatMessage({ id: 'contract.zhaobiaobianhaoxiangmu' }),
    align: 'left',
    dataIndex: 'code',
    key: 'code',
    render: (text, record) => {
      const { pathname } = useLocation()
      return (
        <>
          <EyeAuthButton url={`${pathname}/detail?id=${record.id}`}>{text}</EyeAuthButton>
          <div>{record['projectName']}</div>
        </>
      )
    },
  },
  {
    title: intl.formatMessage({ id: 'contract.caigouleixing' }),
    align: 'left',
    dataIndex: 'purchaseType',
    key: 'purchaseType',
    render: (t) => PURCHASE_TYPE[t],
  },
  {
    title: intl.formatMessage({ id: 'contract.zhaobiaofangshi' }),
    align: 'left',
    dataIndex: 'inviteTenderType',
    key: 'inviteTenderType',
    render: (t) => CALLFORBID_TYPE[t],
  },
  {
    title: intl.formatMessage({ id: 'contract.fabushijian' }),
    align: 'left',
    dataIndex: 'createTime',
    key: 'createTime',
    render: (text, record) => formatTimeString(record.createTime),
    width: 200,
  },
  {
    title: intl.formatMessage({ id: 'contract.toubiaokaishijiezhishi' }),
    align: 'left',
    dataIndex: 'createTime',
    key: 'createTime',
    render: (text, record) => (
      <>
        <div>
          <PlayCircleOutlined />
          &nbsp;{formatTimeString(record.inviteTenderStartTime)}
        </div>
        <div>
          <PoweroffOutlined />
          &nbsp;{formatTimeString(record.inviteTenderEndTime)}
        </div>
      </>
    ),
    width: 200,
  },
  {
    title: intl.formatMessage({ id: 'contract.waibuzhuangtai' }),
    align: 'left',
    dataIndex: 'tenderOutStatus',
    key: 'tenderOutStatus',
    render: (text) => <CustomTag status={text} type="out" />,
  },
  {
    title: intl.formatMessage({ id: 'contract.neibuzhuangtai' }),
    align: 'left',
    dataIndex: 'inviteTenderInStatus',
    key: 'inviteTenderInStatus',
    render: (text) => <CustomBadge status={text} type="inside" />,
  },
]

// 投标表格基本列
export const baseTenderListColumns: any[] = [
  {
    title: intl.formatMessage({ id: 'contract.toubiaobianhaoxiangmu' }),
    align: 'left',
    dataIndex: 'id',
    key: 'id',
    render: (text, record) => (
      <>
        {record.code ? (
          <EyeAuthButton url={`/procurementAbility/tender/tenderSearch/detail?id=${record.id}`}>
            {record.code}
          </EyeAuthButton>
        ) : null}
        <div>{record.inviteTender.projectName}</div>
      </>
    ),
  },
  {
    title: intl.formatMessage({ id: 'contract.zhaobiaobianhaohuiyuan' }),
    align: 'left',
    dataIndex: 'memberId',
    key: 'memberId',
    render: (text, record) => (
      <>
        <EyeAuthButton url={`/procurementAbility/tender/callForBidsSearch/detail?id=${record.inviteTender.id}`}>
          {record.inviteTender.code}
        </EyeAuthButton>
        <div>{record.inviteTender.memberName}</div>
      </>
    ),
  },
  {
    title: intl.formatMessage({ id: 'contract.toubiaokaishijiezhishi' }),
    align: 'left',
    dataIndex: 'inviteTender',
    key: 'inviteTender',
    render: (text, record) => (
      <>
        <div>
          <PlayCircleOutlined />
          &nbsp;{formatTimeString(record.inviteTender.inviteTenderStartTime)}
        </div>
        <div>
          <PoweroffOutlined />
          &nbsp;{formatTimeString(record.inviteTender.inviteTenderEndTime)}
        </div>
      </>
    ),
    width: 200,
  },
  {
    title: intl.formatMessage({ id: 'contract.waibuzhuangtai' }),
    align: 'left',
    dataIndex: 'tenderOutStatus',
    key: 'tenderOutStatus',
    render: (text) => <CustomTag status={text} type="out" />,
  },
  {
    title: intl.formatMessage({ id: 'contract.neibuzhuangtai' }),
    align: 'left',
    dataIndex: 'submitTenderInStatus',
    key: 'submitTenderInStatus',
    render: (text) => <CustomBadge status={text} type="tenderInside" />,
  },
]
