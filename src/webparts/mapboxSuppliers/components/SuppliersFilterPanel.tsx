import * as React from "react";
import { useState, useEffect } from "react";
import { Checkbox, ICheckboxProps, Stack } from "office-ui-fabric-react/";
import { getUniqueSuppiers } from "../mappers/dataSourceMapper";
import {
  circleStyle,
  suppliersFilterPanelContainerStyle
} from "../styles/styleObjects";
import { IDataSourceList } from "../interfaces/IDataSourceList";

export interface ISuppliersFilterPanelProps {
  data: IDataSourceList[];
  selectedSuppliers: string[];
  onSelectedChenged: (slected: string[]) => void;
}

export const SuppliersFilterPanel: React.FC<ISuppliersFilterPanelProps> = ({
  data,
  selectedSuppliers,
  onSelectedChenged
}) => {
  const [uniqueSuppiers, setUniqueSuppiers] = useState([]);

  useEffect(() => {
    console.log("props.data", data);
    if (data) setUniqueSuppiers(getUniqueSuppiers(data));
  }, [data]);

  const getCheckBoxValue = (value: string): boolean => {
    console.log("selectedSuppliers", selectedSuppliers);
    return selectedSuppliers.some(s => s === value);
  };

  const onCheckboxChange = (
    ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
    checked?: boolean
  ) => {
    console.log(ev.target["id"], checked);

    let changedSelectedSuppliers = [];

    if (checked) {
      const isIn = selectedSuppliers.some(s => s === ev.target["id"]);

      if (!isIn)
        changedSelectedSuppliers.push(...selectedSuppliers, ev.target["id"]);
    } else {
      const isIn = selectedSuppliers.some(s => s === ev.target["id"]);

      if (isIn)
        changedSelectedSuppliers = selectedSuppliers.filter(
          s => s !== ev.target["id"]
        );
    }

    onSelectedChenged(changedSelectedSuppliers);
  };

  return (
    <div
      className="suppliersFilterPanelContainer"
      style={suppliersFilterPanelContainerStyle}
    >
      {uniqueSuppiers.map(u => (
        <Stack
          horizontal
          horizontalAlign="start"
          tokens={{ childrenGap: 5 }}
          styles={{ root: { padding: 5 } }}
        >
          <Checkbox
            id={u.Supplier.Title}
            onChange={onCheckboxChange}
            checked={getCheckBoxValue(u.Supplier.Title)}
          />

          <div className="companyTitle">{u.Supplier.Title}</div>
          <span style={circleStyle(u.ColourOnMap)} />
        </Stack>
      ))}
    </div>
  );
};