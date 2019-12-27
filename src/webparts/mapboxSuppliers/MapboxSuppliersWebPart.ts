import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  IPropertyPaneDropdownOption,
  PropertyPaneDropdown
} from "@microsoft/sp-webpart-base";
import SharePointService from "../services/SharePointService";
import { MapboxSuppliers } from "./components/MapboxSuppliers";
import { IMapboxSuppliersProps } from "./interfaces/IMapboxSuppliersProps";

export interface IMapboxSuppliersWebPartProps {
  mapBoxToken: string;
  dataListTitle: string;
}

//REACT_APP_MAPBOX_TOKEN = pk.eyJ1Ijoibmlsb2tpbGxpYW4iLCJhIjoiY2szaDFya2piMDgxZjNobXN4azY4dmM5aSJ9.EaWxRQjsn5We1NiHATIHQA;

export default class MapboxSuppliersWebPart extends BaseClientSideWebPart<
  IMapboxSuppliersWebPartProps
> {
  private _listOptionsLoading = false;
  private _listOptions: IPropertyPaneDropdownOption[];

  public render(): void {
    const element: React.ReactElement<IMapboxSuppliersProps> = React.createElement(
      MapboxSuppliers,
      {
        dataListTitle: this.properties.dataListTitle,
        mapBoxToken: this.properties.mapBoxToken
      }
    );

    ReactDom.render(element, this.domElement);
  }

  public getLists = async (): Promise<void> => {
    this._listOptionsLoading = true;
    const filterString = `Hidden eq false and (BaseTemplate eq 100 )`;
    try {
      const results = await SharePointService.pnp_getListsAdvanced(
        filterString
      );
      this._listOptions = results.map(list => ({
        key: list.Title,
        text: list.Title,
        id: list.Id
      }));
      this._listOptionsLoading = false;
    } catch (error) {
      this._listOptionsLoading = false;
      throw error;
    }
  };

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected async onInit(): Promise<void> {
    await super.onInit();
    SharePointService.setup(this.context);
    SharePointService.pnp_setup(this.context);
  }

  protected async onPropertyPaneConfigurationStart(): Promise<void> {
    await this.getLists();
    this.context.propertyPane.refresh();
  }

  protected onPropertyPaneFieldChanged(
    propertyPath: string,
    oldValue: any,
    newValue: any
  ): void {
    super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);

    if (propertyPath === "dataListTitle" && newValue) {
      console.log("newValue", newValue);
      this.context.propertyPane.refresh();
    }
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          groups: [
            {
              groupName: "Map Settings",

              groupFields: [
                PropertyPaneDropdown("dataListTitle", {
                  label: "Select data source",
                  options: this._listOptions,
                  selectedKey: this.properties.dataListTitle,
                  disabled: this._listOptionsLoading
                }),

                PropertyPaneTextField("mapBoxToken", {
                  label: "MapBox Token"
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
