import * as React from "react";
import { useState, useEffect, useRef, useContext } from "react";
import * as MapBoxGL from "mapbox-gl";
import "./MapboxSuppliers.module.scss";
import { DataSourceContext } from "../contexts/DataSourceContext";
import { IFetchedData, IMapState, IMapProps } from "../interfaces/IMap";
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
import { DefaultButton } from "office-ui-fabric-react";
import { IDataSourceList } from "../interfaces/IDataSourceList";

export const Map: React.FC<IMapProps> = ({ token }): JSX.Element => {
  const mapContainer = useRef<HTMLInputElement>(null);
  const [isSuppliersListPanel, setIsSuppliersListPanel] = React.useState(false);
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);
  const { data } = useContext(DataSourceContext);
  const [mapSettings, setMapSettings] = useState<IMapState>({
    isMapInitialized: false,
    vieport: {
      zoom: 5,
      center: [174.77623, -41.286461] as [number, number],
      style: "mapbox://styles/mapbox/light-v10"
    }
  });

  const setMapToken = (): void => {
    (MapBoxGL as typeof MapBoxGL).accessToken = token;
  };

  const createFeatureCollection = (
    data: IFetchedData[]
  ): GeoJSON.FeatureCollection => {
    return {
      type: "FeatureCollection",
      features: data.map(
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
            "circle-color":
              selectedSuppliers.length > 0
                ? getCircleColour(onSuppliersFilter())
                : "red",
            "circle-stroke-color": "#fff",
            "circle-stroke-width": 1
          }
        });
      });

      map.on("click", "points", (e: any) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        const {
          contact,
          email,
          mobile,
          landline,
          address
        } = e.features[0].properties;

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new MapBoxGL.Marker().getElement();

        new MapBoxGL.Popup()
          .setLngLat(coordinates)
          .setHTML(
            `<div className='popUp'> 
            <strong>${contact}</strong></br>
            <em>${email}</em></br>
            <em>${mobile}</em></br>
            <em>${landline}</em></br>
            <em>${address}</em>
            </div> 
            `
          )
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
    <div>
      <SuppliersFilterPanel
        data={data}
        selectedSuppliers={selectedSuppliers}
        onSelectedChenged={selected => {
          setSelectedSuppliers(selected);

          mapSettings.isMapInitialized = false;

          setMapSettings(mapSettings);
        }}
      />

      <DefaultButton
        text="List of suppliers"
        onClick={() => setIsSuppliersListPanel(true)}
        style={suppliersListPanelContainerStyle}
      />

      <div
        className="mapContainer"
        style={mapContainerStyle}
        ref={mapContainer}
      >
        {isSuppliersListPanel && (
          <SuppliersListPanel
            onClose={() => setIsSuppliersListPanel(false)}
            isOpen={isSuppliersListPanel}
          />
        )}
      </div>
    </div>
  );
};
