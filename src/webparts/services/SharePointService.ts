import { WebPartContext } from "@microsoft/sp-webpart-base";
import {
  sp,
  SearchQuery,
  SearchResults,
  ItemAddResult,
  Web,
  AttachmentFileInfo,
  PermissionKind,
  ClientSideText,
  ClientSidePage,
  SPConfiguration,
  SearchSuggestQuery,
  SearchSuggestResult
} from "@pnp/sp";
import {
  SPHttpClient,
  HttpClient,
  IHttpClientOptions
} from "@microsoft/sp-http";

export class SharePointServiceManager {
  public context: WebPartContext;

  public setup(context: WebPartContext): void {
    this.context = context;
  }

  public pnp_setup(content: WebPartContext): void {
    sp.setup({ spfxContext: content });
  }

  public pnp_search = async (qText?: string): Promise<any> => {
    sp.searchSuggest({
      querytext: "BusinessUnits",
      count: 5
    } as SearchSuggestQuery).then((r: SearchSuggestResult) => {
      console.log(r);
    });
  };

  public pnp_getUsersProfiles_AD = async (
    queryString: string,
    maximumEntity?: number
  ) => {
    const q = {
      MaximumEntitySuggestions: maximumEntity ? maximumEntity : 5,
      PrincipalSource: 15,
      PrincipalType: 15,
      QueryString: queryString
    };

    return await sp.profiles.clientPeoplePickerSearchUser(q);
  };

  public pnp_getUsersProfiles_SP = async (queryString?: string) => {
    return await sp.web.siteUsers.filter(queryString ? queryString : "").get();
  };

  public pnp_getProperties = async (loginName: string) => {
    return await sp.profiles.getPropertiesFor(loginName);
  };

  public pnp_getViews = async (listTitle: string, fields: string[]) => {
    return await sp.web.lists
      .getByTitle(listTitle)
      .views.select(...fields)
      .get();
  };

  public pnp_getUserProfileProperty = async (
    loginName: string,
    propName: string
  ) => {
    return await sp.profiles.getUserProfilePropertyFor(loginName, propName);
  };

  public pnp_getUserById = async (userId: number) => {
    return await sp.web.getUserById(userId).get();
  };

  public pnp_SearchItems = async (queryString?: string) => {
    // return await sp.web.getList("ddd").items.
  };

  public pnp_getSPUserID = async (userEmail: string) => {
    return await sp.web.siteUsers.getByEmail(userEmail).get();
  };

  public pnp_addItem = async (listTitle: string, itemObject: {}) => {
    const result: ItemAddResult = await sp.web.lists
      .getByTitle(listTitle)
      .items.add(itemObject);
    return result;
  };

  public pnp_updateItem = async (
    listTitle: string,
    itemId: number,
    itemObject: {}
  ) => {
    const result = await sp.web.lists
      .getByTitle(listTitle)
      .items.getById(itemId)
      .update(itemObject);
    return result;
  };

  public pnp_getLists = async (): Promise<any> => {
    try {
      return await sp.web.lists.get();
    } catch (error) {
      throw error;
    }
  };

  public pnp_getListsAdvanced = async (filter: string): Promise<any> => {
    try {
      return await sp.web.lists.filter(filter).get();
    } catch (error) {
      throw error;
    }
  };

  public pnp_getListFields = async (
    listTitle: string,
    filter: string
  ): Promise<any> => {
    try {
      return await sp.web.lists
        .getByTitle(listTitle)
        .fields.filter(filter)
        .get();
    } catch (error) {
      throw error;
    }
  };

  public pnp_getListItems = async (listTitle: string): Promise<any> => {
    try {
      return await sp.web.lists.getByTitle(listTitle).items.get();
    } catch (error) {
      throw error;
    }
  };

  public pnp_getLibraryFiles = async (libTitle: string): Promise<any> => {
    console.log("libTitle", libTitle);
    try {
      return await sp.web
        .getFolderByServerRelativeUrl(`/${libTitle}`)
        .files.get();
    } catch (error) {
      throw error;
    }
  };

  public pnp_getListItemsAdvanced = async (
    listTitle: string,
    selectedFiled: string[],
    expend: string[],
    filterString?: string
  ): Promise<any> => {
    //console.log("filterString", filterString);
    try {
      return await sp.web.lists
        .getByTitle(listTitle)
        .items.select(...selectedFiled)
        .expand(...expend)
        .filter(filterString ? filterString : "")
        .top(300)
        .get();
    } catch (error) {
      throw `pnp_getListItemsAdvanced: ${error}`;
    }
  };

  public pnp_getListItemsAdvancedPaged = async (
    listTitle: string,
    selectedFiled: string[],
    expend: string[],
    filterString?: string
  ): Promise<any> => {
    //console.log("filterString", filterString);
    try {
      const pagedItems = await sp.web.lists
        .getByTitle(listTitle)
        .items.select(...selectedFiled)
        .expand(...expend)
        .filter(filterString ? filterString : "")
        .top(99)
        .getPaged();

      // console.log(pagedItems.results, null, 4);

      if (pagedItems.hasNext) {
        const p2 = await pagedItems.getNext();

        console.log(p2.results, null, 4);
      }
    } catch (error) {
      throw `pnp_getListItemsAdvanced: ${error}`;
    }
  };

  public pnp_getChoiseOptions = async (
    listTitle: string,
    fieldName: string
  ) => {
    try {
      const result = await sp.web.lists
        .getByTitle(listTitle)
        .fields.getByTitle(fieldName)
        .get();
      return result;
    } catch (error) {
      throw error;
    }
  };

  public createExpendedFields = (fieldOptions: any[]): string[] => {
    const expendedFields = [];
    for (let field in fieldOptions) {
      if (
        fieldOptions[field].fieldType === "User" ||
        fieldOptions[field].fieldType === "UserMulti" ||
        fieldOptions[field].fieldType === "Lookup" ||
        fieldOptions[field].fieldType === "LookupMulti" ||
        fieldOptions[field].fieldType === "Attachments"
      ) {
        expendedFields.push(fieldOptions[field].key);
      }
    }

    return expendedFields;
  };

  public createQueriedFields = (fieldOptions: any[]): string[] => {
    const queriedFields = [];

    for (let field in fieldOptions) {
      switch (fieldOptions[field].fieldType) {
        case "User": {
          queriedFields.push(
            fieldOptions[field].key + "/Title",
            fieldOptions[field].key + "/EMail",
            fieldOptions[field].key + "/ID"
          );
          break;
        }
        case "Lookup": {
          queriedFields.push(
            fieldOptions[field].key + "/" + fieldOptions[field]["lookupField"]
          );
          break;
        }
        case "LookupMulti": {
          queriedFields.push(
            fieldOptions[field].key + "/" + fieldOptions[field]["lookupField"]
          );
          break;
        }

        case "Attachments": {
          queriedFields.push("AttachmentFiles");
          break;
        }

        case "UserMulti": {
          queriedFields.push(
            fieldOptions[field].key + "/Title",
            fieldOptions[field].key + "/EMail",
            fieldOptions[field].key + "/ID"
          );

          break;
        }

        default: {
          queriedFields.push(fieldOptions[field].key);

          break;
        }
      }
    }

    return queriedFields;
  };
}

const SharePointService = new SharePointServiceManager();

export default SharePointService;
