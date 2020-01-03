import * as React from "react";
import { IMapboxSuppliersProps } from "../interfaces/IMapboxSuppliersProps";
import { Map } from "./Map";
import { DataSourceContextProvider } from "../contexts/DataSourceContext";
import { DefaultButton } from "office-ui-fabric-react";
import styles from "../styles/MapboxSuppliers.module.scss";

export const MapboxSuppliers: React.FC<IMapboxSuppliersProps> = props => {
  const [showMap, setShowMap] = React.useState(false);

  const getJSX = (): JSX.Element => {
    return props.mapBoxToken ? (
      <div className={styles.container}>
        <DefaultButton text="Show map" onClick={() => setShowMap(!showMap)} />
        {showMap && <Map token={props.mapBoxToken} />}
      </div>
    ) : (
      <div>No token</div>
    );
  };

  return (
    <DataSourceContextProvider {...props}>{getJSX()}</DataSourceContextProvider>
  );
};
