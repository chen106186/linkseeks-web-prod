import {
  SelectedComponentInfoType,
  VirtualDOMType,
} from '@/types/ModelType';

export interface DesignStoreType {
  componentConfigs: VirtualDOMType[];
  selectedComponentInfo: SelectedComponentInfoType | {};
  hoverKey: null | string
}
