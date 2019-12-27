import * as React from "react";
import { IMapboxSuppliersProps } from "../interfaces/IMapboxSuppliersProps";
import { Map } from "./Map";
import { DataSourceContextProvider } from "../contexts/DataSourceContext";
import styles from "./MapboxSuppliers.module.scss";

export const MapboxSuppliers: React.FC<IMapboxSuppliersProps> = props => {
  const containerStyle = {
    //  position: "absolute",
    top: "0",
    right: "0",
    left: "0",
    bottom: "0",
    width: "100%",
    height: "800px",
    margin: "0 auto"
  };

  return (
    <div style={containerStyle}>
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
