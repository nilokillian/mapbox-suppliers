import * as React from "react";
import { renderToString } from "react-dom/server";
import { useState, useEffect, useRef, useContext } from "react";
import * as MapBoxGL from "mapbox-gl";
import styles from "./MapboxSuppliers.module.scss";
import { DataSourceContext } from "../contexts/DataSourceContext";
import { IFetchedData, IMapState, IMapProps } from "../interfaces/IMap";
import { dataMapper } from "../mappers/dataSourceMapper";
import { SupplierDetails } from "./SupplierDetails";

export const Map: React.FC<IMapProps> = ({ token }): JSX.Element => {
  const mapContainer = useRef<HTMLInputElement>(null);
  //const [rawData, setRawData] = useState<any[]>();
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

  // useEffect(() => {
  //   setRawData([
  //     {
  //       contact: "Alex Andreev",
  //       address: "3b/44 Liverpool st Auckland",
  //       email: "alex@downer.com",
  //       mobile: "4532323",
  //       landline: "32088673",
  //       location: { long: 174.7631803, lat: -36.852095 }
  //     }
  //   ]);
  // }, []);

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
            data: createFeatureCollection(dataMapper(data))
          },
          paint: {
            "circle-radius": 6,
            "circle-color": "#8dc63f"
          },
          layout: {
            "text-field": "supplier"
            // "text-field": ["get", "supplier"],
            // "text-offset": [0.5],
            // "text-justify": "center"
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

        const html = renderToString(<SupplierDetails />);

        new MapBoxGL.Popup()
          .setLngLat(coordinates)

          .setHTML(
            html
            // //   `
            // // <strong>${contact}</strong>
            // // <strong>${email}</strong>
            // // <strong>${mobile}</strong>
            // // <strong>${landline}</strong>
            // // `
          )
          .addTo(map);
      });
      setMapSettings(mapSettings);
    };
    if (data && !mapSettings.isMapInitialized) initializeMap();
  }, [data, mapSettings]);

  return (
    <div
      style={{
        //  position: "absolute",
        top: "0",
        right: "0",
        left: "0",
        bottom: "0",
        width: "100%",
        height: "800px",
        margin: "0 auto"
      }}
      ref={mapContainer}
    />
  );
};

// className={styles.mapContainer}
