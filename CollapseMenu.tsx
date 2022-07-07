import React from "react";
import {
  Box,
  makeStyles,
  Tooltip,
  useTheme,
  lighten,
  getContrastRatio,
  List,
  ListItemIcon,
  ListItem,
  Divider,
  darken,
} from "@material-ui/core";
import TenantConfigContext from "../tenant/TenantConfigContext";
import { ChevronLeftOutlined, Menu } from "@material-ui/icons";

interface iCollapseMenuProps {
  /** This props sets the height of the collapse button. First menu is 0. */
  menuNumber?: number;
  /** If undefined, we default to grey. */
  level?: 1 | 2;
  width?: number;
  height?: number;
  /** Will add a margin to allow for collapsed buttons not overlapping content. */
  addRightMargin?: boolean;
}

interface iActiveStylesResult {
  [k: string]: any;
}

const CollapseMenu: React.FC<iCollapseMenuProps> = (props) => {
  const theme = useTheme();
  const [isOpen, setOpen] = React.useState(true);
  const config = React.useContext(TenantConfigContext);

  const level1Color = config?.dashboardMenu?.level1?.backgroundColor || theme.palette.grey[600]; //"#DA6F11"; // secondary/lighter colour "#F4D5BA"
  const level2Color = config?.dashboardMenu?.level2?.backgroundColor || theme.palette.grey[400]; //"#0170C0"; // secondary/lighter colour "#C4DCE4"
  const activeStyles = Object.entries(config?.dashboardMenu?.active || {})
    .filter(([k, v]) => v)
    .reduce<iActiveStylesResult>((acc, [k, v]) => {
      acc[k] = v;
      return acc;
    }, {});
  //  as );

  const menuWidth = props.width || 230;

  const primaryColour = props.level === 1 ? level1Color : props.level === 2 ? level2Color : theme.palette.grey[600];
  const secondaryColour =
    props.level === 1
      ? lighten(level1Color, 0.7)
      : props.level === 2
      ? lighten(level2Color, 0.7)
      : theme.palette.grey[300];
  const classes = makeStyles({
    menu: {
      position: "relative",
      display: "flex",
      flexFlow: "column",
      minHeight: props.height || "100%",
      backgroundColor: secondaryColour,
      marginRight: props.addRightMargin === true ? theme.spacing(1.5) : theme.spacing(0),
      width: menuWidth,
      transition: theme.transitions.create(["width", "background-color"]),

      "& > .content-collapse": {
        transition: theme.transitions.create(["width", "opacity"]),
        width: menuWidth,
        overflow: "hidden",
        opacity: 1,

        "& > .content": {
          paddingTop: theme.spacing(0),
          width: menuWidth,
          height: props.height || "100%",
          overflow: "auto",
          "&::-webkit-scrollbar": {
            width: 0,
          },
          "&::-webkit-scrollbar-track": {
            display: "none",
          },
          "&::-webkit-scrollbar-thumb": {
            display: "none",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            display: "none",
          },
          "& *": {
            "&::-webkit-scrollbar": {
              width: 6,
              height: 6,
            },
            "&::-webkit-scrollbar-track": {
              background: "none",
              borderRadius: 3,
            },
            "&::-webkit-scrollbar-thumb": {
              background: primaryColour,
              borderRadius: 3,
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: darken(primaryColour, 0.2),
            },
          },
        },
      },

      "&.hide": {
        minWidth: theme.spacing(7),
        width: theme.spacing(7),
        backgroundColor: "transparent",
        overflow: "hidden",
        "& > .content-collapse": {
          width: 0,
          opacity: 0,
        },
        "& > .menuToggleBtn": {
          transform: "rotate(180deg)",
          right: -18 + (props.menuNumber ? props.menuNumber * 2 : 0),
          backgroundColor: secondaryColour,
        },
      },
    },
    menuCollapseBtn: {
      minWidth: menuWidth,
      paddingRight: theme.spacing(0.2),
      display: "flex",
      justifyContent: "space-between",
      paddingTop: theme.spacing(1.5),
      paddingBottom: theme.spacing(1.5),
      "& > .lastIcon": {
        justifyContent: "center",
      },
    },
    navMenu: {
      "& div .active .menuLink": {
        backgroundColor: primaryColour,
        color:
          getContrastRatio(theme.palette.text.primary, primaryColour) < 3
            ? theme.palette.text.primary
            : theme.palette.getContrastText(primaryColour),
        ...activeStyles,
      },
      "& > .MuiDivider-root": {
        backgroundColor: lighten(primaryColour, 0.55),
      },
    },
  })();

  return (
    <Box className={`${classes.menu} menu ${isOpen ? "" : "hide"}`}>
      <List>
        <ListItem button onClick={(e) => setOpen(!isOpen)} className={classes.menuCollapseBtn}>
          <ListItemIcon>
            <Tooltip title="Toggle Menu">
              <Menu />
            </Tooltip>
          </ListItemIcon>
          <ListItemIcon className="lastIcon">
            <ChevronLeftOutlined />
          </ListItemIcon>
        </ListItem>
      </List>
      <Box className="content-collapse">
        <Box className="content">
          <Box className={classes?.navMenu}>{props.children}</Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CollapseMenu;
