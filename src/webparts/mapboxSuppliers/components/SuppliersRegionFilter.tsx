import * as React from "react";
import { useState, useEffect } from "react";
import { Dropdown, IDropdownOption } from "office-ui-fabric-react/";
import { getUniqueRegions } from "../mappers/dataSourceMapper";
import { ISuppliersRegionFilterProps } from "../interfaces/ISuppliersRegionFilter";

export const SuppliersRegionFilter: React.FC<ISuppliersRegionFilterProps> = ({
  data,
  selectedRegions,
  onSelectedChenged
}) => {
  const [regionOptions, setRegionOptions] = useState([]);

  const onChange = (
    _event: React.FormEvent<HTMLDivElement>,
    item: IDropdownOption
  ): void => {
    const newSelectedItems = [...selectedRegions];
    if (item.selected) {
      newSelectedItems.push(item.key as string);
    } else {
      const currIndex = newSelectedItems.indexOf(item.key as string);
      if (currIndex > -1) {
        newSelectedItems.splice(currIndex, 1);
      }
    }
    onSelectedChenged(newSelectedItems);
  };

  useEffect(() => {
    if (data)
      setRegionOptions(getUniqueRegions(data).map(r => ({ key: r, text: r })));
  }, [data]);

  return (
    <Dropdown
      label="Filter by Regions"
      options={regionOptions}
      selectedKeys={selectedRegions}
      multiSelect
      title="Regions"
      onChange={onChange}
    />
  );
};
