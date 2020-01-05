import * as React from "react";
import { createContext, useState, useEffect } from "react";
import SharePointService from "../../services/SharePointService";
import { IMapboxSuppliersProps } from "../interfaces/IMapboxSuppliersProps";
import { IDataSourceContext } from "../interfaces/IDataSourceContext";
import { IDataSourceList } from "../interfaces/IDataSourceList";

export const DataSourceContext = createContext<IDataSourceContext>(
  {} as IDataSourceContext
);

export const DataSourceContextProvider: React.FC<IMapboxSuppliersProps> = props => {
  const [data, setData] = useState<IDataSourceList[]>();
  const { dataListTitle } = props;

  const getData = async () => {
    const listItems: IDataSourceList[] = await SharePointService.pnp_getListItemsAdvanced(
      dataListTitle,
      ["*", "Supplier/Title", "Sectors/Title", "Region/Title"],
      ["Supplier", "Sectors", "Region"]
    );
    setData(listItems);
  };

  useEffect(() => {
    if (dataListTitle) getData();
  }, [dataListTitle]);

  return (
    <DataSourceContext.Provider value={{ data }}>
      {data && data.length > 0 && props.children}
    </DataSourceContext.Provider>
  );
};
