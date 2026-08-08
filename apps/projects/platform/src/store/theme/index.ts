import { observable } from 'mobx'
import { IThemeModule } from '@/types/ThemeStoreType'

class ThemeStore implements IThemeModule {
  @observable public themeName: string = 'science'; // fresh:清新类模板；science：科技类模板

}

export default ThemeStore
