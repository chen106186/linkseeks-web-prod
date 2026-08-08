/*
 * @Description set 入库资料state hook（业务hook）
 */
import { useState, useCallback } from 'react';
import { GetMemberAbilityMaintenanceRegisterDetailByAllowSelectResponse } from '@apps/apis';

const useRegisterFields = () => {
  const [registerFields, setRegisterFields] = useState<GetMemberAbilityMaintenanceRegisterDetailByAllowSelectResponse>([]);
  return { registerFields, setRegisterFields };
}

export default useRegisterFields;
