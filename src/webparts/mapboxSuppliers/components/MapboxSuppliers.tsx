import * as React from "react";
import { Map } from "./Map";
import { DataSourceContextProvider } from "../contexts/DataSourceContext";
import { IMapboxSuppliersProps } from "../interfaces/IMapboxSuppliersProps";
import styles from "../styles/MapboxSuppliers.module.scss";
import { showMapButtonStyle } from "../styles/styleObjects";

export const MapboxSuppliers: React.FC<IMapboxSuppliersProps> = (
  props
): JSX.Element => {
  const [showMap, setShowMap] = React.useState(false);

  const getJSX = (): JSX.Element => {
    return props.mapBoxToken ? (
      <div>
        <button
          type="button"
          style={showMapButtonStyle}
          onClick={() => setShowMap(!showMap)}
        >
          <i
            className="ms-Icon ms-Icon--Nav2DMapView"
            aria-hidden="true"
            style={{ verticalAlign: "bottom", marginRight: 10, fontSize: 20 }}
          />
          {!showMap ? "Show" : "Hide"} Preferred Suppliers on Map
        </button>
        {showMap && <Map token={props.mapBoxToken} />}
      </div>
    ) : (
      <div className={styles.mapboxSuppliers}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>
              <span className={styles.title}>Welcome to SharePoint!</span>
              <p className={styles.subTitle}>
                Customize SharePoint experiences using web parts.
              </p>
              <p className={styles.description}>Test</p>
              <a href="https://aka.ms/spfx" className={styles.button}>
                <span className={styles.label}>Learn more</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <DataSourceContextProvider {...props}>{getJSX()}</DataSourceContextProvider>
  );
};
