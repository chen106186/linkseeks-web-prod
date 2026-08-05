import React from 'react'
import { Badge } from 'antd'
import {
  MEMBER_STATUS_NORMAL,
  MEMBER_STATUS_FROZEN,
  MEMBER_INNER_STATUS_TO_VERIFY_DEPOSITORY_DETAIL,
  MEMBER_INNER_STATUS_DEPOSITORY_DETAIL_NOT_PASSED,
  MEMBER_INNER_STATUS_TO_VERIFY_DEPOSITORY_QUALIFICATION,
  MEMBER_INNER_STATUS_DEPOSITORY_QUALIFICATION_NOT_PASSED,
  MEMBER_INNER_STATUS_TO_INSPECT_DEPOSITORY,
  MEMBER_INNER_STATUS_DEPOSITORY_INSPECTION_NOT_PASSED,
  MEMBER_INNER_STATUS_TO_CLASSFIY_DEPOSITORY,
  MEMBER_INNER_STATUS_DEPOSITORY_CLASSIFICATION_NOT_PASSED,
  MEMBER_INNER_STATUS_TO_DEPOSIT_GRADE_ONE,
  MEMBER_INNER_STATUS_DEPOSITORY_GRADE_ONE_NOT_PASSED,
  MEMBER_INNER_STATUS_TO_DEPOSIT_GRADE_TWO,
  MEMBER_INNER_STATUS_DEPOSITORY_GRADE_TWO_NOT_PASSED,
  MEMBER_INNER_STATUS_TO_COMFIRM_DEPOSITORY,
  MEMBER_INNER_STATUS_VERIFY_PASSED,
  MEMBER_INNER_STATUS_VERIFY_NOT_PASSED,
  MEMBER_INNER_STATUS_VERIFY_TO_MODIFY_GRADE_ONE,
  MEMBER_INNER_STATUS_MODIFY_GRADE_ONE_NOT_PASSED,
  MEMBER_INNER_STATUS_TO_MODIFY_GRADE_TWO,
  MEMBER_INNER_STATUS_MODIFY_GRADE_TWO_NOT_PASSED,
  MEMBER_INNER_STATUS_TO_COMFIRM_MODIFY,
  MEMBER_INNER_STATUS_MODIFY_PASSED,
  MEMBER_INNER_STATUS_MODIFY_NOT_PASSED,
  PLATFORM_MEMBER_INNER_STATUS_TO_BE_COMMIT,
  PLATFORM_MEMBER_INNER_STATUS_COMMIT_NOT_PASSED,
  PLATFORM_MEMBER_INNER_STATUS_TO_BE_VERIFY_STEP1,
  PLATFORM_MEMBER_INNER_STATUS_VERIFY_STEP1_NOT_PASSED,
  PLATFORM_MEMBER_INNER_STATUS_TO_BE_VERIFY_STEP2,
  PLATFORM_MEMBER_INNER_STATUS_VERIFY_STEP2_NOT_PASSED,
  PLATFORM_MEMBER_INNER_STATUS_TO_CONFIRM,
  PLATFORM_MEMBER_INNER_STATUS_VERIFY_NOT_PASSED,
  PLATFORM_MEMBER_INNER_STATUS_VERIFY_PASSED,
  MEMBER_OUTER_STATUS_TO_PLATFORM_VERIFY,
  MEMBER_OUTER_STATUS_PLATFORM_VERIFYING,
  MEMBER_OUTER_STATUS_PLATFORM_VERIFY_PASSED,
  MEMBER_OUTER_STATUS_PLATFORM_VERIFY_NOT_PASSED,
  MEMBER_OUTER_STATUS_DEPOSITING,
  MEMBER_OUTER_STATUS_DEPOSITORY_PASSED,
  MEMBER_OUTER_STATUS_DEPOSITORY_NOT_PASSED,
  MEMBER_OUTER_STATUS_MODIFYING,
  MEMBER_OUTER_STATUS_MODIFY_PASSED,
  MEMBER_OUTER_STATUS_MODIFY_NOT_PASSED,
} from '@/constants/member'
import { EditableColumns } from '@/components/PolymericTable/interface'
import StatusTag from '@/components/StatusTag'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()

export const STATUS_COLOR_MAP = {
  0: '#669EDE',
  1: '#41CC9E',
  2: '#EF6260',
}

export const STATUS_COLOR_TXT = {
  0: intl.formatMessage({ id: 'member.daishenhe' }),
  1: intl.formatMessage({ id: 'member.shenhetongguo' }),
  2: intl.formatMessage({ id: 'member.dongjie' }),
}

// 会员状态 StatusTag map
export const MEMBER_STATUS_TAG_MAP = {
  [MEMBER_STATUS_NORMAL]: 'success',
  [MEMBER_STATUS_FROZEN]: 'default',
}

// 会员外部状态 StatusTag map
export const MEMBER_OUTER_STATUS_TYPE = {
  [MEMBER_OUTER_STATUS_TO_PLATFORM_VERIFY]: 'default',
  [MEMBER_OUTER_STATUS_PLATFORM_VERIFYING]: 'warning',
  [MEMBER_OUTER_STATUS_PLATFORM_VERIFY_PASSED]: 'success',
  [MEMBER_OUTER_STATUS_PLATFORM_VERIFY_NOT_PASSED]: 'danger',
  [MEMBER_OUTER_STATUS_DEPOSITING]: 'warning',
  [MEMBER_OUTER_STATUS_DEPOSITORY_PASSED]: 'success',
  [MEMBER_OUTER_STATUS_DEPOSITORY_NOT_PASSED]: 'danger',
  [MEMBER_OUTER_STATUS_MODIFYING]: 'warning',
  [MEMBER_OUTER_STATUS_MODIFY_PASSED]: 'success',
  [MEMBER_OUTER_STATUS_MODIFY_NOT_PASSED]: 'danger',
}

// 会员内部状态 Tag badge map
export const MEMBER_INNER_STATUS_BADGE_COLOR = {
  [MEMBER_INNER_STATUS_TO_VERIFY_DEPOSITORY_DETAIL]: 'orange',
  [MEMBER_INNER_STATUS_DEPOSITORY_DETAIL_NOT_PASSED]: 'red',
  [MEMBER_INNER_STATUS_TO_VERIFY_DEPOSITORY_QUALIFICATION]: 'orange',
  [MEMBER_INNER_STATUS_DEPOSITORY_QUALIFICATION_NOT_PASSED]: 'red',
  [MEMBER_INNER_STATUS_TO_INSPECT_DEPOSITORY]: 'orange',
  [MEMBER_INNER_STATUS_DEPOSITORY_INSPECTION_NOT_PASSED]: 'red',
  [MEMBER_INNER_STATUS_TO_CLASSFIY_DEPOSITORY]: 'orange',
  [MEMBER_INNER_STATUS_DEPOSITORY_CLASSIFICATION_NOT_PASSED]: 'red',
  [MEMBER_INNER_STATUS_TO_DEPOSIT_GRADE_ONE]: 'orange',
  [MEMBER_INNER_STATUS_DEPOSITORY_GRADE_ONE_NOT_PASSED]: 'red',
  [MEMBER_INNER_STATUS_TO_DEPOSIT_GRADE_TWO]: 'orange',
  [MEMBER_INNER_STATUS_DEPOSITORY_GRADE_TWO_NOT_PASSED]: 'red',
  [MEMBER_INNER_STATUS_TO_COMFIRM_DEPOSITORY]: 'blue',
  [MEMBER_INNER_STATUS_VERIFY_PASSED]: 'green',
  [MEMBER_INNER_STATUS_VERIFY_NOT_PASSED]: 'red',
  [MEMBER_INNER_STATUS_VERIFY_TO_MODIFY_GRADE_ONE]: 'orange',
  [MEMBER_INNER_STATUS_MODIFY_GRADE_ONE_NOT_PASSED]: 'red',
  [MEMBER_INNER_STATUS_TO_MODIFY_GRADE_TWO]: 'orange',
  [MEMBER_INNER_STATUS_MODIFY_GRADE_TWO_NOT_PASSED]: 'red',
  [MEMBER_INNER_STATUS_TO_COMFIRM_MODIFY]: 'blue',
  [MEMBER_INNER_STATUS_MODIFY_PASSED]: 'green',
  [MEMBER_INNER_STATUS_MODIFY_NOT_PASSED]: 'red',

  [PLATFORM_MEMBER_INNER_STATUS_TO_BE_COMMIT]: 'grey',
  [PLATFORM_MEMBER_INNER_STATUS_COMMIT_NOT_PASSED]: 'red',
  [PLATFORM_MEMBER_INNER_STATUS_TO_BE_VERIFY_STEP1]: 'orange',
  [PLATFORM_MEMBER_INNER_STATUS_VERIFY_STEP1_NOT_PASSED]: 'red',
  [PLATFORM_MEMBER_INNER_STATUS_TO_BE_VERIFY_STEP2]: 'orange',
  [PLATFORM_MEMBER_INNER_STATUS_VERIFY_STEP2_NOT_PASSED]: 'red',
  [PLATFORM_MEMBER_INNER_STATUS_TO_CONFIRM]: 'blue',
  [PLATFORM_MEMBER_INNER_STATUS_VERIFY_NOT_PASSED]: 'red',
  [PLATFORM_MEMBER_INNER_STATUS_VERIFY_PASSED]: 'green',
}

export const MEMBER_OUTER_COLUMNS: EditableColumns[] = [
  {
    title: intl.formatMessage({ id: 'member.xuhao' }),
    dataIndex: 'index',
    render: (text, record, index) => index + 1,
  },
  {
    title: intl.formatMessage({ id: 'member.caozuojuese' }),
    dataIndex: 'operatorRoleName',
  },
  {
    title: intl.formatMessage({ id: 'member.zhuangtai' }),
    dataIndex: 'outerStatusName',
    render: (text, record) => <StatusTag type={MEMBER_OUTER_STATUS_TYPE[record.outerStatus]} title={text} />,
  },
  {
    title: intl.formatMessage({ id: 'member.caozuo' }),
    dataIndex: 'operation',
  },
  {
    title: intl.formatMessage({ id: 'member.caozuoshijian' }),
    dataIndex: 'createTime',
    ellipsis: true,
  },
  {
    title: intl.formatMessage({ id: 'member.shenheyijian' }),
    dataIndex: 'remark',
    ellipsis: true,
  },
]

export const MEMBER_INNER_COLUMNS: EditableColumns[] = [
  {
    title: intl.formatMessage({ id: 'member.xuhao' }),
    dataIndex: 'index',
    render: (text, record, index) => index + 1,
  },
  {
    title: intl.formatMessage({ id: 'member.caozuoren' }),
    dataIndex: 'operatorName',
  },
  {
    title: intl.formatMessage({ id: 'member.bumen' }),
    dataIndex: 'operatorOrgName',
  },
  {
    title: intl.formatMessage({ id: 'member.zhiwei' }),
    dataIndex: 'operatorJobTitle',
  },
  {
    title: intl.formatMessage({ id: 'member.zhuangtai' }),
    dataIndex: 'innerStatusName',
    render: (text, record) => <Badge color={MEMBER_INNER_STATUS_BADGE_COLOR[record.innerStatus]} text={text} />,
  },
  {
    title: intl.formatMessage({ id: 'member.caozuo' }),
    dataIndex: 'operation',
  },
  {
    title: intl.formatMessage({ id: 'member.caozuoshijian' }),
    dataIndex: 'createTime',
    ellipsis: true,
  },
  {
    title: intl.formatMessage({ id: 'member.shenheyijian' }),
    dataIndex: 'remark',
    ellipsis: true,
  },
]
