import { getIntl } from '@linkseeks/i18n'

export const TableColumn = [
  {
    title: getIntl().formatMessage({
      id: 'customerAbility.songyang.person.title_1',
      defaultMessage: '序号',
    }),
    dataIndex: 'userId',
    key: 'userId',
  },
  {
    title: getIntl().formatMessage({
      id: 'customerAbility.songyang.person.title_2',
      defaultMessage: '姓名',
    }),
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: getIntl().formatMessage({
      id: 'customerAbility.songyang.person.title_3',
      defaultMessage: '手机号码',
    }),
    dataIndex: 'phone',
    key: 'phone',
  },
  {
    title: getIntl().formatMessage({
      id: 'customerAbility.songyang.person.title_4',
      defaultMessage: '所属机构',
    }),
    dataIndex: 'orgName',
    key: 'orgName',
  },
  {
    title: getIntl().formatMessage({
      id: 'customerAbility.songyang.person.title_5',
      defaultMessage: '职位',
    }),
    dataIndex: 'jobTitle',
    key: 'jobTitle',
  },
]
