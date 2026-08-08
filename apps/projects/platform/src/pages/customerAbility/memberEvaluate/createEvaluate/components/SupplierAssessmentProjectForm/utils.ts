import { normalizeFiledata } from '@/utils';
import { AssessmentProjectItemType, SubmitCallItemsValueType } from './index';

export type IndicatorGroup = {
  /**
   * 组名
   */
  groupName: string,
  /**
   * 明细数据
   */
  details: AssessmentProjectItemType[],
}

export function convertDataToGroups(dataSource: SubmitCallItemsValueType[]): IndicatorGroup[] {
  const ret: IndicatorGroup[] = [];

  if (!dataSource) {
    return ret;
  }

  for (let i = 0; i < dataSource.length; i++) {
    const item = dataSource[i];
    let provideItem = ret.find((indicator) => indicator.groupName === item.indicatorGrouping);
    if (!provideItem) {
      provideItem = {
        groupName: item.indicatorGrouping,
        details: [],
      };
      ret.push(provideItem);
    }
    const {
      userId,
      userName,
      sendAppraisal,
      grade,
      score,
      appraisalAttachment,
      ...rest
    } = item;
    provideItem.details.push({
      ...rest,
      scoreRange: `${item.scoreMin}~${item.scoreMax}`,
      evaluator: [{
        userId,
        userName,
      }],
      sendAppraisal: Boolean(sendAppraisal),
      grade: grade !== undefined ? `${grade}` : undefined,
      score: score !== undefined ? `${score}` : undefined,
      files: appraisalAttachment?.map((attachment) => normalizeFiledata(attachment.url)),
    });
  }

  return ret;
}
