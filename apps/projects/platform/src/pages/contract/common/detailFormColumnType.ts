/*
 * @Author: LeeJiancong
 * @Date: 2020-08-27 16:27:53
 * @LastEditors: LeeJiancong
 * @Copyright: 1549414730@qq.com
 * @LastEditTime: 2020-09-10 10:22:41
 */
import { ColumnType } from 'antd/lib/table/interface'
import moment from 'moment'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()
export const dockingColumn = (children, optionChild) => {
  let columns: ColumnType<any>[] = []
  columns = [
    {
      title: intl.formatMessage({ id: 'contract.xuhao' }),
      dataIndex: 'id',
      align: 'center',
      key: 'id',
    },
    {
      title: intl.formatMessage({ id: 'contract.huiyuanmingcheng' }),
      dataIndex: 'memberName',
      key: 'memberName',
      align: 'left',
    },

    {
      title: intl.formatMessage({ id: 'contract.huiyuanleixing' }),
      dataIndex: 'memberTypeName',
      key: 'memberTypeName',
      align: 'center',
    },
    {
      title: intl.formatMessage({ id: 'contract.huiyuanjuese' }),
      dataIndex: 'roleName',
      key: 'roleName',
      align: 'center',
    },
    {
      title: intl.formatMessage({ id: 'contract.huiyuandengji' }),
      dataIndex: 'levelTag',
      key: 'levelTag',
      align: 'center',
    },
    {
      title: intl.formatMessage({ id: 'contract.shifouguishuhuiyuan' }),
      dataIndex: 'membershipOrNot',
      key: 'membershipOrNot',
      align: 'center',
      render: (text: any) =>
        text == 0 ? intl.formatMessage({ id: 'contract.fou' }) : intl.formatMessage({ id: 'contract.shi' }),
    },

    {
      title: intl.formatMessage({ id: 'contract.xuqiufasongzhuangtai' }),
      dataIndex: 'state',
      key: 'state',
      align: 'center',
      render: (text: any, records, index) => (children ? children(text, records, index) : ''),
    },
    {
      title: intl.formatMessage({ id: 'contract.caozuo' }),
      dataIndex: 'option',
      key: 'option',
      align: 'center',
      render: (text: any, records, index) => (optionChild ? optionChild(text, records, index) : ''),
    },
  ]
  return columns
}

export const memberColumn = (children?) => {
  let columns: ColumnType<any>[] = []
  columns = [
    {
      title: intl.formatMessage({ id: 'contract.xuhao' }),
      dataIndex: 'memberId',
      align: 'center',
      key: 'memberId',
    },
    {
      title: intl.formatMessage({ id: 'contract.huiyuanmingcheng' }),
      dataIndex: 'name',
      key: 'name',
      align: 'left',
    },

    {
      title: intl.formatMessage({ id: 'contract.huiyuanleixing' }),
      dataIndex: 'memberTypeName',
      key: 'memberTypeName',
      align: 'center',
    },
    {
      title: intl.formatMessage({ id: 'contract.huiyuanjuese' }),
      dataIndex: 'roleName',
      key: 'roleName',
      align: 'center',
    },
    {
      title: intl.formatMessage({ id: 'contract.huiyuandengji' }),
      dataIndex: 'levelTag',
      key: 'levelTag',
      align: 'center',
    },
    {
      title: intl.formatMessage({ id: 'contract.shifouguishuhuiyuan' }),
      dataIndex: 'membershipOrNot',
      key: 'membershipOrNot',
      align: 'center',
      render: (text: any) =>
        text == 0 ? intl.formatMessage({ id: 'contract.fou' }) : intl.formatMessage({ id: 'contract.shi' }),
    },

    {
      title: intl.formatMessage({ id: 'contract.xuqiufasongzhuangtai' }),
      dataIndex: 'state',
      key: 'state',
      align: 'center',
      render: (text: any, records, index) => (children ? children(text, records, index) : ''),
    },
  ]
  return columns
}

/**
 * @description: 内部流转interiorRequisitionForms
 * 外部流转 externalRequisitionForms
 * @param {type}
 * @return {type}
 */

export const externalColumn = (childeren, stateList?) => {
  let culumn: ColumnType<any>[] = []

  return (culumn = [
    {
      title: intl.formatMessage({ id: 'contract.xuhao' }),
      dataIndex: 'id',
      align: 'center',
      key: 'id',
    },
    {
      title: intl.formatMessage({ id: 'contract.caozuojuese' }),
      dataIndex: 'roleName',
      align: 'center',
      key: 'roleName',
    },
    {
      title: intl.formatMessage({ id: 'contract.zhuangtai' }),
      dataIndex: 'state',
      align: 'center',
      key: 'state',
      render: (text: any, record: any) => stateList(text),
    },
    {
      title: intl.formatMessage({ id: 'contract.caozuo' }),
      dataIndex: 'operation',
      align: 'center',
      key: 'operation',
    },
    {
      title: intl.formatMessage({ id: 'contract.caozuoshijian' }),
      dataIndex: 'operationTime',
      align: 'center',
      key: 'operationTime',
      render: (text: any, record: any) => childeren(text),
    },
    {
      title: intl.formatMessage({ id: 'contract.shenheyijian' }),
      dataIndex: 'auditOpinion',
      align: 'left',
      key: 'auditOpinion',
    },
  ])
}

export const interiorColumn = (childeren, stateList?) => {
  let culumn: ColumnType<any>[] = []
  return (culumn = [
    {
      title: intl.formatMessage({ id: 'contract.xuhao' }),
      dataIndex: 'id',
      align: 'center',
      key: 'id',
    },
    {
      title: intl.formatMessage({ id: 'contract.caozuoren' }),
      dataIndex: 'roleName',
      align: 'center',
      key: 'roleName',
    },
    {
      title: intl.formatMessage({ id: 'contract.bumen' }),
      dataIndex: 'department',
      align: 'center',
      key: 'department',
    },
    {
      title: intl.formatMessage({ id: 'contract.zhiwei' }),
      dataIndex: 'position',
      align: 'center',
      key: 'position',
    },
    {
      title: intl.formatMessage({ id: 'contract.zhuangtai' }),
      dataIndex: 'state',
      align: 'center',
      key: 'state',
      render: (text: any, record: any) => stateList(text),
    },
    {
      title: intl.formatMessage({ id: 'contract.caozuo' }),
      dataIndex: 'operation',
      align: 'center',
      key: 'operation',
    },
    {
      title: intl.formatMessage({ id: 'contract.caozuoshijian' }),
      dataIndex: 'operationTime',
      align: 'center',
      key: 'operationTime',
      render: (text: any, record: any) => childeren(text),
    },
    {
      title: intl.formatMessage({ id: 'contract.shenheyijian' }),
      dataIndex: 'auditOpinion',
      align: 'left',
      key: 'auditOpinion',
    },
  ])
}
