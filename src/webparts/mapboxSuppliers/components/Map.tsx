import * as React from "react";
import * as MapBoxGL from "mapbox-gl";
import { useState, useEffect, useRef, useContext } from "react";
import { useSupplierDetails } from "../hooks/useSupplierDetails";
import { DataSourceContext } from "../contexts/DataSourceContext";
import { DefaultButton } from "office-ui-fabric-react";
import { SuppliersFilterPanel } from "./SuppliersFilterPanel";
import { SuppliersListPanel } from "./SuppliersListPanel";
import {
  dataMapper,
  getCircleColour,
  getUniqueSuppiers
} from "../mappers/dataSourceMapper";
import {
  mapContainerStyle,
  suppliersListPanelContainerStyle
} from "../styles/styleObjects";
import { IFetchedData, IMapState, IMapProps } from "../interfaces/IMap";
import { IDataSourceList } from "../interfaces/IDataSourceList";
import "../styles/MapboxSuppliers.module.scss";

export const Map: React.FC<IMapProps> = ({ token }): JSX.Element => {
  const mapContainer = useRef<HTMLInputElement>(null);
  const [isSuppliersListPanel, setIsSuppliersListPanel] = React.useState(false);
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);
  const { data } = useContext(DataSourceContext);
  const [mapSettings, setMapSettings] = useState<IMapState>({
    isMapInitialized: false,
    vieport: {
      zoom: 5,
      center: [172.77623, -41.286461] as [number, number],
      style: "mapbox://styles/mapbox/streets-v11"
    }
  });

  const setMapToken = (): void => {
    (MapBoxGL as typeof MapBoxGL).accessToken = token;
  };

  const createFeatureCollection = (
    items: IFetchedData[]
  ): GeoJSON.FeatureCollection => {
    return {
      type: "FeatureCollection",
      features: items.map(
        (point: IFetchedData) =>
          ({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [point.location.long, point.location.lat]
            } as GeoJSON.Geometry,
            properties: {
              supplier: point.supplier,
              contact: point.contact,
              email: point.email,
              mobile: point.mobile,
              landline: point.landline,
              address: point.address
            } as GeoJSON.GeoJsonProperties
          } as GeoJSON.Feature)
      )
    } as GeoJSON.FeatureCollection;

    // return {
    //   "type": "FeatureCollection",
    //   "features": data.map(
    //     (point: IFetchedData) =>
    //       ({
    //         "type": "Feature",
    //         "geometry": {
    //           "type": "Point",
    //           "coordinates": [point.location.long, point.location.lat]
    //         } as GeoJSON.Geometry,
    //         "properties": {
    //           "contact": point.contact,
    //           "email": point.email,
    //           "mobile": point.mobile,
    //           "landline": point.landline,
    //           "address": point.address
    //         } as GeoJSON.GeoJsonProperties
    //       } as GeoJSON.Feature)
    //   )
    // } as GeoJSON.FeatureCollection;
  };

  const onSuppliersFilter = () => {
    const filteredSuppliers: IDataSourceList[] = [];

    data.map(d => {
      const isIn = selectedSuppliers.some(s => s === d.Supplier.Title);

      if (isIn) filteredSuppliers.push(d);
    });

    return filteredSuppliers;
  };

  useEffect(() => {
    const currentSelectedSuppliers = getUniqueSuppiers(data);
    setSelectedSuppliers(currentSelectedSuppliers.map(s => s.Supplier.Title));
  }, [data]);

  useEffect(() => {
    const initializeMap = (): void => {
      const { vieport } = mapSettings;
      setMapToken();
      mapSettings.isMapInitialized = true;
      const map = new MapBoxGL.Map({
        container: mapContainer.current!,
        ...vieport
      });

      map.on("load", () => {
        map.addLayer({
          id: "points",
          type: "circle",
          source: {
            type: "geojson",
            data: createFeatureCollection(dataMapper(onSuppliersFilter()))
          },
          paint: {
            "circle-radius": {
              base: 6,
              stops: [
                [12, 6],
                [22, 180]
              ]
            },
            "circle-color": getCircleColour(onSuppliersFilter()),
            "circle-stroke-color": "#fff",
            "circle-stroke-width": 1
          }
        });
      });

      map.on("click", "points", (e: any) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        const properties = e.features[0].properties;

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        const htmlString = useSupplierDetails(properties);

        new MapBoxGL.Marker().getElement();
        new MapBoxGL.Popup()
          .setLngLat(coordinates)
          .setHTML(htmlString)
          .addTo(map);
      });
      setMapSettings(mapSettings);
    };
    if (
      data.length > 0 &&
      selectedSuppliers.length > 0 &&
      !mapSettings.isMapInitialized
    )
      initializeMap();
  }, [data, mapSettings, selectedSuppliers]);

  return (
    <div className="mapContainer" style={mapContainerStyle} ref={mapContainer}>
      <div className="ms-Grid" dir="ltr">
        <div className="ms-Grid-row">
          <div className="ms-Grid-col ms-sm4 ms-md4 ms-lg4 ms-hiddenMdDown">
            <SuppliersFilterPanel
              data={data}
              selectedSuppliers={selectedSuppliers}
              onSelectedChenged={selected => {
                setSelectedSuppliers(selected);

                mapSettings.isMapInitialized = false;

                setMapSettings(mapSettings);
              }}
            />
          </div>
          <div className="ms-Grid-col ms-sm8 ms-md8 ms-lg8 ">
            <DefaultButton
              text="List of preferred suppliers"
              onClick={() => setIsSuppliersListPanel(true)}
              style={suppliersListPanelContainerStyle}
            />
          </div>
        </div>
      </div>

      {isSuppliersListPanel && (
        <SuppliersListPanel
          onClose={() => setIsSuppliersListPanel(false)}
          isOpen={isSuppliersListPanel}
        />
      )}
    </div>
  );
};
