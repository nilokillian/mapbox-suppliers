import * as React from "react";
import {
  List,
  FocusZone,
  FocusZoneDirection,
  TextField,
  mergeStyleSets,
  getFocusStyle,
  getTheme,
  ITheme,
  Icon
} from "office-ui-fabric-react";
import { IDataSourceList } from "../interfaces/IDataSourceList";
import { DataSourceContext } from "../contexts/DataSourceContext";

const theme: ITheme = getTheme();
const { palette, semanticColors, fonts } = theme;

const classNames = mergeStyleSets({
  itemCell: [
    getFocusStyle(theme, { inset: -1 }),
    {
      minHeight: 54,
      padding: 10,
      boxSizing: "border-box",
      borderBottom: `1px solid ${semanticColors.bodyDivider}`,
      display: "flex",
      lineHeight: "1.6",
      selectors: {
        "&:hover": { background: palette.neutralLight }
      }
    }
  ],
  itemImage: {
    flexShrink: 0
  },
  itemContent: {
    marginLeft: 10,
    overflow: "hidden",
    flexGrow: 1
  },
  itemName: [
    fonts.medium,
    {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  ],
  itemDetails: [
    fonts.medium,
    {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      marginBottom: 10
    }
  ],
  itemIndex: {
    fontSize: fonts.xSmall.fontSize,
    color: palette.neutralTertiary,
    marginBottom: 10
  },
  // itemAdress: {
  //   lineHeight: 1.6,
  //   marginBottom: 10
  // },
  chevron: {
    alignSelf: "center",
    marginLeft: 10,
    color: palette.neutralTertiary,
    fontSize: fonts.large.fontSize,
    flexShrink: 0,
    cursor: "pointer"
  }
});

export const SuppliersList = (): JSX.Element => {
  const { data } = React.useContext(DataSourceContext);
  const [suppliersList, setSuppliersList] = React.useState([]);
  //const [filterText, setFilterText] = React.useState<string>("");
  const [selectedSupplierIndex, setSelectedSupplierIndex] = React.useState<
    number
  >(null);

  const supliersListMapper = data => {
    return data.map((d, i) => ({
      key: i,
      supplierName: d.Supplier.Title,
      address: `${d.Address_1} ${d.Postcode} ${d.Address_2}`,
      sectors: d.Sectors.map(s => s.Title).join(" / "),
      contactName: d.AccountManager,
      email: d.Email,
      mobile: d.Mobile
    }));
  };

  React.useEffect(() => {
    setSuppliersList(supliersListMapper(data));
  }, [data, selectedSupplierIndex]);

  const onFilterChanged = (_: any, text: string): void => {
    if (!text) {
      //setFilterText(text);
      setSuppliersList(supliersListMapper(data));
    } else {
      setSuppliersList(
        supliersListMapper(data).filter(
          item =>
            item.supplierName.toLowerCase().indexOf(text.toLowerCase()) >= 0
        )
      );

      //setFilterText(text);
    }
  };

  const getSuppliersInfo = (item: any, index: number) => {
    return selectedSupplierIndex === index ? (
      <div className={classNames.itemContent}>
        <div className={classNames.itemDetails}>{item.contactName}</div>
        <div className={classNames.itemDetails}>{item.mobile}</div>
        <div className={classNames.itemDetails}>{item.email}</div>
      </div>
    ) : (
      <div className={classNames.itemContent}>
        <div className={classNames.itemName}>{item.supplierName}</div>
        <div className={classNames.itemIndex}>{item.sectors}</div>
        <div>{item.address}</div>
      </div>
    );
  };

  const onRenderCell = (item: any, index: number | undefined): JSX.Element => {
    return (
      <div className={classNames.itemCell} data-is-focusable={true}>
        {getSuppliersInfo(item, index)}
        <Icon
          className={classNames.chevron}
          iconName={
            selectedSupplierIndex === index ? "ChevronLeft" : "ChevronRight"
          }
          onClick={() => {
            setSelectedSupplierIndex(prevIndex =>
              prevIndex === index ? null : index
            );
          }}
        />
      </div>
    );
  };

  return (
    <FocusZone
      direction={FocusZoneDirection.vertical}
      isCircularNavigation={true}
    >
      <TextField label={"Filter by name"} onChange={onFilterChanged} />
      <List items={suppliersList} onRenderCell={onRenderCell} />
    </FocusZone>
  );
};
