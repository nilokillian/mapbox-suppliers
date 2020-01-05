import { IDataSourceList } from "./IDataSourceList";

export interface ISuppliersRegionFilterProps {
  data: IDataSourceList[];
  selectedRegions: string[];
  onSelectedChenged: (slected: string[]) => void;
}
