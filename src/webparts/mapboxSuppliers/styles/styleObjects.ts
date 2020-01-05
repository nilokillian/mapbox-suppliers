import {
  ITheme,
  getTheme,
  mergeStyleSets,
  getFocusStyle
} from "office-ui-fabric-react";

export const circleStyle = (colour: string) => {
  return {
    height: "15px",
    width: "15px",
    backgroundColor: colour,
    borderRadius: "50%",
    display: "inline-block",
    border: "1px solid white"
  };
};

export const suppliersFilterPanelContainerStyle = {
  position: "absolute" as "absolute",
  top: "0",
  left: "0",
  margin: "12px",
  backgroundColor: "#ffffff6e",
  color: "#404040",
  zIndex: 1,
  padding: "6px"
};

export const mapContainerStyle = {
  //  position: "absolute",
  top: "0",
  right: "0",
  left: "0",
  bottom: "0",
  width: "100%",
  height: "800px",
  margin: "0 auto"
};

export const suppliersListPanelContainerStyle = {
  position: "absolute" as "absolute",
  top: "0",
  right: "0",
  margin: "12px",
  backgroundColor: "#ffffff6e",
  color: "#404040",
  zIndex: 1,
  padding: "6px",
  fontSize: 12,
  textShadow: "-1px 0 white, 0 1px white, 1px 0 white, 0 -1px white"
};

export const appContainerStyle = {
  //  position: "absolute",
  top: "0",
  right: "0",
  left: "0",
  bottom: "0",
  width: "100%",
  height: "800px",
  margin: "0 auto"
};

export const showMapButtonStyle = {
  display: "block",
  width: "100%",
  border: "none",
  backgroundColor: "#fff",
  padding: "14px 28px",
  fontSize: "18px",
  cursor: "pointer",
  textAlign: "center" as "center",
  marginBottom: 1,
  color: "#000",
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: "rgb(234, 234, 234)",
  fontFamily: "Areal"
};
export const companyTitleStyle = {
  textShadow: "-1px 0 white, 0 1px white, 1px 0 white, 0 -1px white"
};

const theme: ITheme = getTheme();
const { palette, semanticColors, fonts } = theme;

export const suppliersListClassNames = mergeStyleSets({
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
