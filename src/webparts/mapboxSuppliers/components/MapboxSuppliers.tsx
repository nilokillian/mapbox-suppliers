import * as React from "react";
import { IMapboxSuppliersProps } from "../interfaces/IMapboxSuppliersProps";
import { Map } from "./Map";
import { DataSourceContextProvider } from "../contexts/DataSourceContext";
import { appContainerStyle } from "../styles/styleObjects";

export const MapboxSuppliers: React.FC<IMapboxSuppliersProps> = props => {
  return (
    <div style={appContainerStyle}>
      <DataSourceContextProvider {...props}>
        {props.mapBoxToken ? (
          <Map token={props.mapBoxToken} />
        ) : (
          <div>No token</div>
        )}
      </DataSourceContextProvider>
    </div>
  );
};
