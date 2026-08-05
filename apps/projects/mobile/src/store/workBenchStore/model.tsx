export type menuType = {
  icon: any,
  text: string,
  url?: null | string,
  checked?: boolean,
  dataIndex?: string,
}

export type MenuDataSourceType = menuType

export type IMenudatas = {
  title: string,
  dataSource: MenuDataSourceType[]
}

type ModuleDataSource = menuType

export interface IModuleData extends IMenudatas {
  dataSource: ModuleDataSource[]
}

export interface WorkBenchStoreModel {
  alwaysUserMenu: menuType[],
  otherMenu: IMenudatas[]
  allModules: IModuleData[]
  changeModulesVisible: (params: any) => void,
  changeOtherMenu: () => void,
  balanceMenu: string[],
}
