import { getMemberList, getMemberRoleMemberRoleList } from '@@/apis/src'

class MemberService {
  async getList(query) {
    return await getMemberRoleMemberRoleList(query)
  }
}
