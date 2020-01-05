import * as React from "react";
import {
  List,
  FocusZone,
  FocusZoneDirection,
  TextField,
  Icon
} from "office-ui-fabric-react";
import { IDataSourceList } from "../interfaces/IDataSourceList";
import { DataSourceContext } from "../contexts/DataSourceContext";
import { SuppliersRegionFilter } from "./SuppliersRegionFilter";
import { getUniqueRegions } from "../mappers/dataSourceMapper";
import { suppliersListClassNames } from "../styles/styleObjects";

export const SuppliersList = (): JSX.Element => {
  const { data } = React.useContext(DataSourceContext);
  const [suppliersList, setSuppliersList] = React.useState([]);
  const [selectedRegions, setSelectedRegions] = React.useState<string[]>([]);
  const [selectedSupplierIndex, setSelectedSupplierIndex] = React.useState<
    number
  >(null);

  const supliersListMapper = (items: IDataSourceList[]) => {
    return items.map((d, i: number) => ({
      key: i,
      supplierName: d.Supplier.Title,
      address: `${d.Address_1} ${d.Postcode} ${d.Address_2}`,
      sectors: d.Sectors.map(s => s.Title).join(" / "),
      contactName: d.AccountManager,
      email: d.Email,
      mobile: d.Mobile,
      region: d.Region.Title
    }));
  };

  const filterSuppliersByRegion = (items: any[]): any[] => {
    const suppliersfilteredByregion = [];

    if (selectedRegions.length < 1) {
      return items;
    }

    items.map(s => {
      const isIn = selectedRegions.some(r => r === s.region);

      if (isIn) suppliersfilteredByregion.push(s);
    });

    return suppliersfilteredByregion;
  };

  const onFilterChanged = (_: any, text: string): void => {
    if (!text) {
      setSuppliersList(supliersListMapper(data));
    } else {
      setSuppliersList(
        supliersListMapper(data).filter(
          item =>
            item.supplierName.toLowerCase().indexOf(text.toLowerCase()) >= 0
        )
      );
    }
  };

  const getSuppliersInfo = (item: any, index: number) => {
    return selectedSupplierIndex === index ? (
      <div className={suppliersListClassNames.itemContent}>
        <div className={suppliersListClassNames.itemDetails}>
          {item.contactName}
        </div>
        <div className={suppliersListClassNames.itemDetails}>{item.mobile}</div>
        <div className={suppliersListClassNames.itemDetails}>{item.email}</div>
      </div>
    ) : (
      <div className={suppliersListClassNames.itemContent}>
        <div className={suppliersListClassNames.itemName}>
          {item.supplierName}
        </div>
        <div className={suppliersListClassNames.itemIndex}>{item.sectors}</div>
        <div>{item.address}</div>
      </div>
    );
  };

  const onRenderCell = (item: any, index: number | undefined): JSX.Element => {
    return (
      <div
        className={suppliersListClassNames.itemCell}
        data-is-focusable={true}
      >
        {getSuppliersInfo(item, index)}
        <Icon
          className={suppliersListClassNames.chevron}
          iconName={
            selectedSupplierIndex === index ? "ChevronLeft" : "ChevronRight"
          }
          onClick={() => {
            setSelectedSupplierIndex(prevIndex =>
              prevIndex === index ? null : index
            );
          }}
        />
      </div>
    );
  };

  React.useEffect(() => {
    setSelectedRegions(getUniqueRegions(data));
  }, [data]);

  React.useEffect(() => {
    const mapped = supliersListMapper(data);

    setSuppliersList(filterSuppliersByRegion(mapped));
  }, [data, selectedSupplierIndex, selectedRegions]);

  return (
    <>
      <SuppliersRegionFilter
        data={data}
        selectedRegions={selectedRegions}
        onSelectedChenged={value => setSelectedRegions(value)}
      />
      <FocusZone
        direction={FocusZoneDirection.vertical}
        isCircularNavigation={true}
      >
        <TextField
          label="Filter by Supplier Name / Contact Name"
          onChange={onFilterChanged}
        />
        <List items={suppliersList} onRenderCell={onRenderCell} />
      </FocusZone>
    </>
  );
};
