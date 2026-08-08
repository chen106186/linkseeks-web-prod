/*
 * @Author: XieZhiXiong
 * @Date: 2021-01-06 11:36:35
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-05-20 13:46:58
 * @Description: 
 */
import { action, observable}  from 'mobx'
import { IMemberModule } from '@/module/memberModule';

/**
 * 会员管理
 */

class MemberStore implements IMemberModule {
  @observable public memberInfo: any = {};

  @action.bound
  public setMemberInfo(data: any) {
    this.memberInfo = data;
  }
}

export default MemberStore;
