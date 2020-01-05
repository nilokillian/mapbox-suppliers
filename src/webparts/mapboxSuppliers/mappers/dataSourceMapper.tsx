import * as MapBoxGL from "mapbox-gl";
import { IDataSourceList } from "../interfaces/IDataSourceList";

export const dataMapper = (data: IDataSourceList[]) => {
  return data.map(d => ({
    contact: d.AccountManager,
    address: `${d.Address_1} ${d.Address_2}`,
    email: d.Email,
    mobile: d.Mobile,
    landline: d.LandlinePhone,
    location: { long: Number(d.Longitude), lat: Number(d.Latitude) },
    supplier: d.Supplier.Title,
    colourOnMap: d.ColourOnMap
  }));
};

export const getUniqueSuppiers = (data: IDataSourceList[]) => {
  const uniqueValues: IDataSourceList[] = [];
  const map = new Map();
  data.map(d => {
    if (!map.has(d.Supplier.Title)) {
      map.set(d.Supplier.Title, true);
      uniqueValues.push(d);
    }
  });

  return uniqueValues;
};

export const getUniqueRegions = (data: IDataSourceList[]) => {
  const uniqueValues: string[] = [];
  const map = new Map();
  data.map(d => {
    if (!map.has(d.Region.Title)) {
      map.set(d.Region.Title, true);
      uniqueValues.push(d.Region.Title);
    }
  });

  return uniqueValues;
};

export const getCircleColour = (data: IDataSourceList[]) => {
  const uniqueSuppiers = getUniqueSuppiers(data);

  const circleColor: MapBoxGL.Expression = ["match", ["get", "supplier"]];

  uniqueSuppiers.map(u => {
    circleColor.push(u.Supplier.Title, u.ColourOnMap);
  });
  circleColor.push("#ccc");
  return circleColor;
};
