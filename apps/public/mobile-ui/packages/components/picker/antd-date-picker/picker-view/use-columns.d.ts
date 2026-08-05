import { PickerColumn, PickerValue } from './picker-view';
export declare function useColumns(rawColumns: PickerColumn[] | ((value: PickerValue[]) => PickerColumn[]), value: PickerValue[]): import("./picker-view").PickerColumnItem[][];
