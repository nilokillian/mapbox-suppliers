import { IDataSourceList } from "../interfaces/IDataSourceList";

export const dataMapper = (data: IDataSourceList[]) => {
  console.log("data", data);
  return data.map(d => ({
    contact: d.AccountManager,
    address: `${d.Address_1} ${d.Address_2}`,
    email: d.Email,
    mobile: d.Mobile,
    landline: d.LandlinePhone,
    location: { long: Number(d.Longitude), lat: Number(d.Latitude) },
    supplier: d.Supplier.Title
  }));
};
