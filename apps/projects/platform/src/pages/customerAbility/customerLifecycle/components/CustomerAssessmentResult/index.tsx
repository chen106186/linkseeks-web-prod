/*
 * @Description: 考评结果
 */
import React, { useMemo } from 'react'
import { normalizeFiledata } from '@/utils'
import CustomizeColumn from '@/components/CustomizeColumn'
import UploadFiles from '@/components/UploadFiles/UploadFiles'
import { useWebIntl } from '@apps/locales'

interface CustomerAssessmentResultProps {
  /**
   * 数据
   */
  data: {
    /**
     * 最终得分
     */
    totalScore: number
    /**
     * 通知会员考评结果0-否1-是
     */
    notifyMember: number
    /**
     * 考评结果
     */
    scoringResultContent: string
    /**
     * 附件
     */
    resultAttachments: {
      name: string
      url: string
    }[]
  }
}

const CustomerAssessmentResult: React.FC<CustomerAssessmentResultProps> = (props) => {
  const { data } = props
  const translate = useWebIntl()
  const result = useMemo(
    () => [
      {
        title: '考评最终分数',
        value: data?.totalScore,
      },
      {
        title: '通知客户变更结果',
        value:
          data?.notifyMember !== undefined
            ? data?.notifyMember
              ? translate('web.common.shi')
              : translate('web.common.fou')
            : '',
        columnProps: {
          labelStyle: {
            width: 136,
          },
        },
      },
      {
        title: '考评结果',
        value: data?.scoringResultContent,
      },
      {
        title: '附件',
        value: (
          <UploadFiles fileList={data?.resultAttachments?.map((item) => normalizeFiledata(item.url)) || []} disable />
        ),
        columnProps: {
          contentStyle: {
            display: 'block',
            overflow: 'hidden',
          },
        },
      },
    ],
    [data],
  )

  return <CustomizeColumn title="考评结果" column={2} data={result} />
}

export default CustomerAssessmentResult
