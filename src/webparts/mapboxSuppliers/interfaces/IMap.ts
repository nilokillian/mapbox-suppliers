export interface IViewport {
  zoom: number;
  center: [number, number] | undefined;
  style: string;
}

export interface IMapState {
  isMapInitialized: boolean;
  vieport: IViewport;
}

export interface IMapProps {
  token: string;
}

export interface IGeoData {
  type: string;
  features: {};
}

export interface IFetchedData {
  contact: string;
  email: string;
  mobile: string;
  landline: string;
  address: string;
  location: { lat: number; long: number };
  supplier: string;
}
