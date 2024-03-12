import React, { useEffect, useRef, useState } from "react";
import "../Style/sidebar.scss";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { openSidebar } from "../Redux/StateManagement/sidebar";
import { toggleSidebar } from "../Redux/StateManagement/sidebar";
import { notificationApi } from "../Redux/Query/Notification";

//Img
import VladimirLogoSmally from "../Img/VladimirSmally.png";
import MisLogo from "../Img/MIS LOGO.png";

// Components
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SvgIcon,
  Collapse,
  Divider,
  IconButton,
  Typography,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import Zoom from "@mui/material/Zoom";
import Badge from "@mui/material/Badge";

// Icons
import {
  Dashboard,
  ListAlt,
  AccountBox,
  LocalOffer,
  RecentActors,
  ManageAccountsSharp,
  Category,
  Inventory2Rounded,
  FormatListBulletedRounded,
  AssignmentIndRounded,
  ClassRounded,
  PlaylistRemoveRounded,
  SummarizeRounded,
  KeyboardDoubleArrowLeftRounded,
  SupervisorAccountRounded,
  FactCheckRounded,
  Apartment,
  LocationOn,
  Schema,
  Construction,
  Badge as badgeIcon,
  InventoryRounded,
  Groups2Rounded,
  StoreRounded,
  MonetizationOn,
  CategoryOutlined,
  BackupTableRounded,
  FactCheck,
  SettingsAccessibility,
  ManageAccounts,
  PermDataSetting,
  SettingsApplications,
  HowToReg,
  AssignmentTurnedIn,
  ExpandLessRounded,
  ExpandMoreRounded,
  Segment,
  DomainVerification,
  PostAdd,
  ShoppingBasket,
  CallReceived,
  MoveUpRounded,
  TransferWithinAStation,
  RemoveFromQueue,
  RuleFolder,
  OpenInBrowserOutlined,
  Output,
  BusinessCenter,
  Ballot,
} from "@mui/icons-material";
import { useGetNotificationApiQuery } from "../Redux/Query/Notification";

const Sidebar = () => {
  const [state, setState] = useState(true);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [masterListCollapse, setMasterListCollapse] = useState(false);
  const [userManagementCollapse, setUserManagementCollapse] = useState(false);
  const [settingsCollapse, setSettingsCollapse] = useState(false);
  const [assetRequisitionCollapse, setAssetRequisitionCollapse] = useState(false);
  const [assetMovementCollapse, setAssetMovementCollapse] = useState(false);
  const [reportCollapse, setReportCollapse] = useState(false);
  // const collapseArray = [
  //   masterListCollapse,
  //   userManagementCollapse,
  //   settingsCollapse,
  //   assetRequestCollapse,
  //   assetMovementCollapse,
  //   reportCollapse,
  // ];
  const isSmallScreen = useMediaQuery("(width: 800)");
  const sidebarRef = useRef(null);

  const dispatch = useDispatch();
  const collapse = useSelector((state) => state.sidebar.open);
  const permissions = useSelector((state) => state.userLogin?.user.role.access_permission);

  const drawer = useSelector((state) => state.booleanState.drawer);

  const handleMenuCollapse = () => {
    dispatch(toggleSidebar());
  };

  const closeCollapse = () => {
    setMasterListCollapse(false);
    setUserManagementCollapse(false);
    setSettingsCollapse(false);
    setAssetRequisitionCollapse(false);
    setAssetMovementCollapse(false);
    setReportCollapse(false);
  };

  const { data: notifData, refetch } = useGetNotificationApiQuery(null, { refetchOnMountOrArgChange: true });
  // console.log("notif", notifData);

  useEffect(() => {
    refetch();
  }, [notifData]);

  const MENU_LIST = [
    {
      label: "Dashboard",
      icon: Dashboard,
      path: "/",
      permission: "dashboard",
      setter: closeCollapse,
    },

    {
      label: "Masterlist",
      icon: ListAlt,
      path: "/masterlist",
      permission: "masterlist",
      children: [
        // {
        //   label: "Modules",
        //   icon: DatasetRounded,
        //   path: "/masterlist/modules",
        //   permission: [],
        // },

        {
          label: "Company",
          icon: Apartment,
          path: "/masterlist/company",
          permission: "company",
        },

        {
          label: "Business Unit",
          icon: BusinessCenter,
          path: "/masterlist/business-unit",
          permission: "business-unit",
        },

        {
          label: "Department",
          icon: Schema,
          path: "/masterlist/department",
          permission: "department",
        },

        {
          label: "Unit",
          icon: Ballot,
          path: "/masterlist/unit",
          permission: "unit",
        },
        {
          label: "Location",
          icon: LocationOn,
          path: "/masterlist/location",
          permission: "location",
        },

        {
          label: "Account Title",
          icon: badgeIcon,
          path: "/masterlist/account-title",
          permission: "account-title",
        },

        {
          label: "Supplier",
          icon: StoreRounded,
          path: "/masterlist/supplier",
          permission: "supplier",
        },

        {
          label: "Sub Unit",
          icon: Segment,
          path: "/masterlist/sub-unit",
          permission: "sub-unit",
        },

        {
          label: "Division",
          icon: Groups2Rounded,
          path: "/masterlist/division",
          permission: "division",
        },

        {
          label: "Type of Request",
          icon: BackupTableRounded,
          path: "/masterlist/type-of-request",
          permission: "type-of-request",
        },

        {
          label: "Capex",
          icon: MonetizationOn,
          path: "/masterlist/capex",
          permission: "capex",
        },

        // {
        //   label: "Service Provider",
        //   icon: Construction,
        //   path: "/masterlist/service-provider",
        //   permission: [],
        // },

        {
          label: "Category",
          icon: Category,
          path: "/masterlist/category",
          permission: "category",
        },

        {
          label: "Status Category",
          icon: FactCheck,
          path: "/masterlist/status-category",
          permission: "status-category",
        },

        // {
        //   label: "Asset Registration",
        //   icon: NoteAddRounded,
        //   path: "masterlist/create-asset-registration",
        //   permission: [],
        // },
      ],
      open: masterListCollapse,
      setter: (e) => {
        // e.preventDefault();
        setMasterListCollapse(!masterListCollapse);
        setUserManagementCollapse(false);
        setSettingsCollapse(false);
        setAssetRequisitionCollapse(false);
        setAssetMovementCollapse(false);
        setReportCollapse(false);
        closeCollapse;
        dispatch(openSidebar());
      },
    },

    {
      label: "User Management",
      icon: SupervisorAccountRounded,
      path: "/user-management",
      permission: "user-management",
      children: [
        {
          label: "User Accounts",
          icon: AccountBox,
          path: "/user-management/user-accounts",
          permission: "user-accounts",
        },
        {
          label: "Role Management",
          icon: ManageAccountsSharp,
          path: "/user-management/role-management",
          permission: "role-management",
        },
      ],
      open: userManagementCollapse,
      setter: (e) => {
        // e.preventDefault();
        setUserManagementCollapse(!userManagementCollapse);
        setMasterListCollapse(false);
        setSettingsCollapse(false);
        setAssetRequisitionCollapse(false);
        setAssetMovementCollapse(false);
        setReportCollapse(false);
        closeCollapse;
        dispatch(openSidebar());
      },
    },

    {
      label: "Fixed Assets",
      icon: InventoryRounded,
      path: "/fixed-assets",
      permission: "fixed-assets",
      notification: notifData?.toTagCount,
      setter: closeCollapse,
    },

    {
      label: "Settings",
      icon: PermDataSetting,
      path: "/settings",
      permission: "settings",
      children: [
        {
          label: "Approver Settings",
          icon: HowToReg,
          path: "/settings/approver-settings",
          permission: "approver-settings",
        },
        {
          label: "Form Settings",
          icon: SettingsApplications,
          path: "/settings/form-settings",
          permission: "form-settings",
        },
      ],
      open: settingsCollapse,
      setter: (e) => {
        // e.preventDefault();
        setSettingsCollapse(!settingsCollapse);
        setUserManagementCollapse(false);
        setMasterListCollapse(false);
        setAssetRequisitionCollapse(false);
        setAssetMovementCollapse(false);
        setReportCollapse(false);
        closeCollapse;
        dispatch(openSidebar());
      },
    },

    {
      label: "Asset Requisition",
      icon: FactCheckRounded,
      path: "/asset-requisition",
      permission: "asset-requisition",
      notification: notifData?.toPR || notifData?.toReceive || notifData?.toRelease,
      children: [
        {
          label: "Requisition",
          icon: AssignmentTurnedIn,
          path: "/asset-requisition/requisition",
          permission: "requisition",
          setter: closeCollapse,
        },
        {
          label: "Purchase Request",
          icon: ShoppingBasket,
          path: "/asset-requisition/purchase-request",
          permission: "purchase-request",
          notification: notifData?.toPR,
          setter: closeCollapse,
        },
        {
          label: "Receiving of Asset",
          icon: OpenInBrowserOutlined,
          path: "/asset-requisition/requisition-receiving",
          permission: "requisition-receiving",
          notification: notifData?.toReceive,
          setter: closeCollapse,
        },
        {
          label: "Releasing of Asset",
          icon: Output,
          path: "/asset-requisition/requisition-releasing",
          permission: "requisition-releasing",
          notification: notifData?.toRelease,
          setter: closeCollapse,
        },
      ],
      open: assetRequisitionCollapse,
      setter: () => {
        setAssetRequisitionCollapse(!assetRequisitionCollapse);
        setMasterListCollapse(false);
        setUserManagementCollapse(false);
        setSettingsCollapse(false);
        setAssetMovementCollapse(false);
        setReportCollapse(false);
        closeCollapse;
        dispatch(openSidebar());
      },
    },

    {
      label: "Asset Movement",
      icon: MoveUpRounded,
      path: "/asset-movement",
      permission: "asset-movement",
      children: [
        {
          label: "Transfer",
          icon: TransferWithinAStation,
          path: "/asset-movement/transfer",
          permission: "transfer",
          setter: closeCollapse,
        },
        {
          label: "Pull Out",
          icon: RemoveFromQueue,
          path: "/asset-movement/pull-out",
          permission: "pull-out",
          setter: closeCollapse,
        },
        {
          label: "Evaluation",
          icon: RuleFolder,
          path: "/asset-movement/evaluation",
          permission: "evaluation",
          setter: closeCollapse,
        },
        {
          label: "Disposal",
          icon: PlaylistRemoveRounded,
          path: "/asset-movement/disposal",
          permission: "disposal",
          setter: closeCollapse,
        },
      ],
      open: assetMovementCollapse,
      setter: () => {
        setAssetMovementCollapse(!assetMovementCollapse);
        setMasterListCollapse(false);
        setUserManagementCollapse(false);
        setSettingsCollapse(false);
        setAssetRequisitionCollapse(false);
        setReportCollapse(false);
        closeCollapse;
        dispatch(openSidebar());
      },
    },

    {
      label: "Approving",
      icon: DomainVerification,
      path: "/approving",
      permission: "approving",
      notification: notifData?.toApproveCount,
      setter: closeCollapse,
    },

    {
      label: "Request Monitoring",
      icon: PostAdd,
      path: "/request-monitoring",
      permission: "request-monitoring",
      setter: closeCollapse,
    },

    {
      label: "Asset for Tagging",
      icon: LocalOffer,
      path: "/asset-for-tagging",
      permission: "asset-for-tagging",
      setter: closeCollapse,
    },

    // {
    //   label: "Asset List",
    //   icon: FormatListBulletedRounded,
    //   path: "/asset-list",
    //   permission: "asset-list",
    //   setter: closeCollapse,
    // },

    // {
    //   label: "On Hand in Process",
    //   icon: ClassRounded,
    //   path: "/on-hand-in-process",
    //   permission: "on-hand-in-process",
    //   setter: closeCollapse,
    // },

    // {
    //   label: "Reports",
    //   icon: SummarizeRounded,
    //   path: "/reports/report1",
    //   permission: "reports",
    //   children: [
    //     {
    //       label: "Report 1",
    //       icon: SummarizeRounded,
    //       path: "/reports/report1",
    //       permission: [],
    //     },
    //     {
    //       label: "Report 2",
    //       icon: SummarizeRounded,
    //       path: "/reports/report2",
    //       permission: [],
    //     },
    //     {
    //       label: "Report 3",
    //       icon: SummarizeRounded,
    //       path: "/reports/report3",
    //       permission: [],
    //     },
    //   ],
    //   open: reportCollapse,
    //   setter: () => {
    //     setReportCollapse(!reportCollapse);
    //     setMasterListCollapse(false);
    //     setUserManagementCollapse(false);
    //     setAssetRequestCollapse(false);
    //     closeCollapse;
    //     dispatch(openSidebar());
    //   },
    // },
  ];

  const { pathname } = useLocation();
  const location = useLocation();

  useEffect(() => {
    if (!collapse || pathname === "/") {
      closeCollapse();
      return;
    }

    const routeStateMap = {
      masterlist: setMasterListCollapse,
      "user-management": setUserManagementCollapse,
      settings: setSettingsCollapse,
      "asset-requisition": setAssetRequisitionCollapse,
      "asset-movement": setAssetMovementCollapse,
      reports: setReportCollapse,
    };

    const match = Object.keys(routeStateMap).find((route) => pathname.includes(route));
    if (match) {
      routeStateMap[match](true);
    }
  }, [collapse, pathname]);

  useEffect(() => {
    const checkOverflow = () => {
      const content = sidebarRef.current;
      if (content) {
        const overflowing = content.scrollHeight > content.clientHeight;
        setIsOverflowing(overflowing);
      }
    };

    setTimeout(() => {
      checkOverflow();
    }, 200);

    window.addEventListener("resize", checkOverflow);
    return () => {
      window.removeEventListener("resize", checkOverflow);
    };
  }, [isSmallScreen]);

  return (
    <Box className={`sidebar ${collapse ? "" : isOverflowing === true ? "collapsed85" : "collapsed"}`}>
      <Box>
        {collapse ? (
          <IconButton
            className="sidebar__closeBtn"
            sx={{ position: "absolute", right: 10, top: 39, zIndex: 2 }}
            onClick={handleMenuCollapse}
            size="small"
          >
            <KeyboardDoubleArrowLeftRounded />
          </IconButton>
        ) : null}
        <Box className="sidebar__logo-container">
          <img
            src={VladimirLogoSmally}
            alt="Vladimir Logo"
            style={{
              width: "40px",
            }}
          />

          {collapse && (
            <Typography
              color="secondary"
              sx={{
                zIndex: 0,
                fontFamily: "Josefin Sans",
                fontSize: "22px",
                letterSpacing: "2px",
                pl: 2.3,
                userSelect: "none",
              }}
            >
              VLADIMIR
            </Typography>
          )}
        </Box>
      </Box>

      <Box className="sidebar__menus" ref={sidebarRef}>
        <List>
          {MENU_LIST?.map((item) => {
            return (
              permissions.split(", ").includes(item.permission) && (
                <ListItem
                  key={item.path}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    padding: 0,
                    px: "10px",
                  }}
                  disablePadding
                  dense
                >
                  <Tooltip title={!collapse && item.label} TransitionComponent={Zoom} placement="right" arrow>
                    <ListItemButton
                      className="sidebar__menu-btn"
                      component={NavLink}
                      to={item.path}
                      sx={{
                        width: collapse ? "222px" : "98%",
                        borderRadius: "12px",
                        transition: "0.2s ease-in-out",
                      }}
                      onClick={item?.setter}
                    >
                      <ListItemIcon sx={{ py: 1, minWidth: "35px" }}>
                        {item?.notification ? (
                          <Badge color="error" badgeContent={item?.notification} variant="dot">
                            <SvgIcon component={item.icon} />
                          </Badge>
                        ) : (
                          <SvgIcon component={item.icon} />
                        )}
                      </ListItemIcon>
                      {collapse && <ListItemText primary={item.label} />}
                      {collapse && Boolean(item.children?.length) && (
                        <ExpandLessRounded
                          sx={{
                            transform: item.open ? "rotate(0deg)" : "rotate(180deg)",
                            transition: "0.2s ease-in-out",
                          }}
                        />
                      )}
                    </ListItemButton>
                  </Tooltip>

                  {Boolean(item.children?.length) && (
                    <Collapse in={item.open} timeout="auto" unmountOnExit sx={{ width: "100%" }}>
                      <List component="div" className="sidebar__menu-list" sx={{ pt: 0.5 }}>
                        {item.children.map((childItem) => {
                          return (
                            permissions.split(", ").includes(childItem.permission) && (
                              <ListItemButton
                                className="sidebar__menu-btn-list"
                                key={childItem.path}
                                component={NavLink}
                                to={childItem.path}
                                sx={{
                                  width: "208px",
                                  ml: 2,
                                  borderRadius: "12px",
                                  px: 0,
                                }}
                                dense
                              >
                                <ListItemIcon sx={{ pl: 2, py: 0.5 }}>
                                  <Badge badgeContent={childItem.notification} color="error">
                                    <SvgIcon component={childItem.icon} />
                                  </Badge>
                                </ListItemIcon>
                                <ListItemText primary={childItem.label} />
                              </ListItemButton>
                            )
                          );
                        })}
                      </List>
                      <Divider sx={{ mb: "10px", mx: "15px" }} />
                    </Collapse>
                  )}
                </ListItem>
              )
            );
          })}
        </List>
      </Box>

      <Box className="sidebar__copyright">
        <img
          src={MisLogo}
          alt="MIS-Logo"
          style={{
            width: "50px",
          }}
        />
        {collapse && (
          <p>
            Powered By MIS All rights reserved <br />
            Copyrights © 2021
          </p>
        )}
      </Box>
    </Box>
  );
};

export default Sidebar;
