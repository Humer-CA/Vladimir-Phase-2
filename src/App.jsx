import RoutingPage from "./Layout/RoutingPage";
import Dashboard from "./Pages";
import CssBaseline from "@mui/material/CssBaseline";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// ROUTER
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { LoginRoutes, PrivateRoutes } from "./Routes/PrivateRoutes";

// MUI
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Alert, AlertTitle, Dialog, Snackbar } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

// REDUX
import { useSelector, useDispatch } from "react-redux";
import { closeToast } from "./Redux/StateManagement/toastSlice";
import { closeConfirm } from "./Redux/StateManagement/confirmSlice";

// QUERIES
import Modules from "./Pages/Masterlist/Modules";

import Masterlist from "./Pages/Masterlist";
import Company from "./Pages/Masterlist/Company";
import BusinessUnit from "./Pages/Masterlist/BusinessUnit";
import Department from "./Pages/Masterlist/Department";
import Unit from "./Pages/Masterlist/Unit";
import Location from "./Pages/Masterlist/Location";
import AccountTitle from "./Pages/Masterlist/AccountTitle";
import Supplier from "./Pages/Masterlist/Supplier";
import SubUnit from "./Pages/Masterlist/SubUnit";
import Division from "./Pages/Masterlist/Division";
import TypeOfRequest from "./Pages/Masterlist/TypeOfRequest";
import Capex from "./Pages/Masterlist/Capex";

import Category from "./Pages/Masterlist/Category";
import ServiceProvider from "./Pages/Masterlist/ServiceProvider";

import UserManagement from "./Pages/UserManagement";
import UserAccounts from "./Pages/UserManagement/UserAccounts";
import RoleManagement from "./Pages/UserManagement/RoleManagement";

import FixedAsset from "./Pages/FixedAssets/FixedAsset";
import FixedAssetView from "./Pages/FixedAssets/FixedAssetView";
import FaStatusCategory from "./Pages/Masterlist/Status/StatusCategory";
import IpSetup from "./Components/IpSetup";

import Settings from "./Pages/Settings";
import ApproverSettings from "./Pages/Settings/ApproverSettings";
import FormSettings from "./Pages/Settings/FormSettings";

import Requisition from "./Pages/Asset Requisition/Requisition";
import AddRequisition from "./Pages/Asset Requisition/Add Requisition/AddRequest";
import PurchaseRequest from "./Pages/Asset Requisition/Purchase Request/PurchaseRequest";
import ViewRequest from "./Pages/Asset Requisition/ViewRequest";
import RequestMonitoring from "./Pages/Asset Requisition/RequestMonitoring";

import AssetRequisition from "./Pages/Asset Requisition";

import Approving from "./Pages/Approving/Approving";
import ReceivingOfAsset from "./Pages/Asset Requisition/Receiving of Asset/ReceivingOfAsset";
import ViewRequestReceiving from "./Pages/Asset Requisition/Receiving of Asset/ViewRequestReceiving";

import PageNotFound from "./Pages/PageNotFound";
import Confirmation from "./Components/Reusable/Confirmation";
import AssetMovement from "./Pages/Asset Movement";
import ViewRequestPr from "./Pages/Asset Requisition/Purchase Request/ViewRequestPr";
import ViewApproveRequest from "./Pages/Approving/ViewApproveRequest";
import ViewRequestReleasing from "./Pages/Asset Requisition/Releasing of Asset/ViewRequestReleasing";
import ReleasingOfAsset from "./Pages/Asset Requisition/Releasing of Asset/ReleasingOfAsset";
import AdditionalCostRequest from "./Pages/Asset Requisition/Add Requisition/AdditionalCostRequest";

const router = createBrowserRouter([
  {
    path: "*",
    element: <PageNotFound />,
  },
  {
    path: "login",
    element: <LoginRoutes />,
  },
  {
    element: <PrivateRoutes />,
    children: [
      {
        element: <RoutingPage />,
        children: [
          {
            path: "/",
            element: <Dashboard />,
          },

          {
            path: "/printer-ip-configuration",
            element: <IpSetup />,
          },

          {
            path: "masterlist",
            element: <Masterlist />,
            children: [
              {
                index: true,
                element: <></>,
                // element: <Navigate to="/masterlist/company" />,
              },

              // {
              //   path: "modules",
              //   element: <Modules />,
              // },

              {
                path: "company",
                element: <Company />,
              },

              {
                path: "business-unit",
                element: <BusinessUnit />,
              },

              {
                path: "department",
                element: <Department />,
              },

              {
                path: "unit",
                element: <Unit />,
              },

              {
                path: "location",
                element: <Location />,
              },

              {
                path: "account-title",
                element: <AccountTitle />,
              },

              {
                path: "supplier",
                element: <Supplier />,
              },

              {
                path: "sub-unit",
                element: <SubUnit />,
              },

              {
                path: "type-of-request",
                element: <TypeOfRequest />,
              },

              {
                path: "capex",
                element: <Capex />,
              },

              {
                path: "division",
                element: <Division />,
              },

              {
                path: "service-provider",
                element: <ServiceProvider />,
              },

              {
                path: "category",
                element: <Category />,
              },

              {
                path: "status-category",
                element: <FaStatusCategory />,
              },

              // {
              //   path: "create-asset-registration",
              //   element: <CreateAssetRegistration />,
              // },
            ],
          },

          {
            path: "user-management",
            element: <UserManagement />,
            children: [
              {
                index: true,
                element: <></>,
                // element: <Navigate to="/user-management/role-management" />,
              },
              {
                path: "user-accounts",
                element: <UserAccounts />,
              },
              {
                path: "role-management",
                element: <RoleManagement />,
              },
            ],
          },

          {
            path: "fixed-assets",
            index: false,
            element: <FixedAsset />,
            children: [],
          },

          {
            path: "fixed-assets/:tag_number",
            element: <FixedAssetView />,
          },

          {
            path: "settings",
            element: <Settings />,
            children: [
              {
                index: true,
                element: <></>,
                // element: <Navigate to="/masterlist/company" />,
              },
              {
                path: "approver-settings",
                element: <ApproverSettings />,
              },
              {
                path: "form-settings",
                element: <FormSettings />,
              },
            ],
          },

          {
            path: "asset-requisition",
            element: <AssetRequisition />,
            children: [
              {
                path: "requisition",
                element: <Requisition />,
              },

              // Request
              {
                path: "requisition/add-requisition",
                element: <AddRequisition />,
              },
              {
                path: "requisition/add-requisition/:transaction_number",
                element: <AddRequisition />,
              },

              // Additional Cost
              {
                path: "requisition/additional-cost",
                element: <AdditionalCostRequest />,
              },
              {
                path: "requisition/additional-cost/:transaction_number",
                element: <AdditionalCostRequest />,
              },

              {
                path: "purchase-request",
                element: <PurchaseRequest />,
              },
              {
                path: "purchase-request/:transaction_number",
                element: <ViewRequestPr />,
              },
              {
                path: "requisition-receiving",
                element: <ReceivingOfAsset />,
              },
              {
                path: "requisition-receiving/:transaction_number",
                element: <ViewRequestReceiving />,
              },
              {
                path: "requisition-releasing",
                element: <ReleasingOfAsset />,
              },
              {
                path: "requisition-releasing/:warehouse_number",
                element: <ViewRequestReleasing />,
              },
            ],
          },

          // {
          //   path: "asset-requisition/requisition/add-requisition",
          //   element: <AddRequisition />,
          // },

          // {
          //   path: "asset-requisition/requisition/add-requisition/:transaction_number",
          //   element: <AddRequisition />,
          // },

          {
            path: "asset-movement",
            element: <AssetMovement />,
            children: [
              {
                path: "transfer",
                // element: <UserAccounts />,
              },
              {
                path: "pull-out",
                // element: <ServiceProvider />,
              },
              {
                path: "evaluation",
                // element: <Category />,
              },
              {
                path: "disposal",
                // element: <Category />,
              },
            ],
          },

          {
            path: "approving",
            element: <Approving />,
          },

          {
            path: "approving/:transaction_number",
            element: <ViewApproveRequest />,
          },

          {
            path: "request-monitoring",
            element: <RequestMonitoring />,
          },

          {
            path: "request-monitoring/:transaction_number",
            element: <ViewRequest />,
          },

          {
            path: "asset-for-tagging",
            // element: <AssetForTagging />,
          },

          {
            path: "asset-list",
            // element: <AssetList />,
          },

          {
            path: "on-hand-in-process",
            // element: <OnHandInProcess />,
          },

          {
            path: "reports",
            // element: <Reports />,
            children: [
              {
                path: "report1",
                // element: <UserAccounts />,
              },
              {
                path: "report2",
                // element: <ServiceProvider />,
              },
              {
                path: "report3",
                // element: <Category />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

const theme = createTheme({
  palette: {
    primary: {
      light: "#fabb5b",
      main: "#f9aa33",
      dark: "#ae7623",
      // contrastText: "#222831",
    },

    secondary: {
      light: "#5c6d77",
      main: "#344955",
      dark: "#24333b",
      // contrastText: "#EEEEEE",
    },

    text: {
      light: "#565e60",
      main: "#2C3639",
      dark: "#1e2527",
      // contrastText: "#EEEEEE",
    },

    background: {
      light: "#f1f1f1",
      main: "#EEEEEE",
      dark: "#a6a6a6",
      // contrastText: "#222831",
    },

    black: {
      light: "#565e60",
      main: "#2c3639",
      dark: "#1e2527",
      // contrastText: "#222831",
    },

    link: {
      light: "#35baf6",
      main: "#03a9f4",
      dark: "#0276aa",
      // contrastText: "#222831",
    },

    active: {
      light: "#51f796",
      main: "#26f57c",
      dark: "#1aab56",
    },

    error: {
      light: "#ee5c5c",
      main: "#EA3434",
      dark: "#a32424",
    },

    success: {
      light: "#6cc893",
      main: "#48bb78",
      dark: "#328254",
      // contrastText: "#222831",
    },

    // status colors
    info: {
      main: "#0288d1",
    },

    alert: {
      main: "#ed6c02",
    },
    warning: {
      main: "#d32f2f",
    },
    good: {
      main: "#2e7d32",
    },
  },
});

function App() {
  const {
    open: toastOpen,
    variant: toastVariant,
    message: toastMessage,
    duration: toastDuration,
  } = useSelector((state) => state.toast);

  const {
    open: confirmOpen,
    icon: confirmIcon,
    iconColor: confirmIconColor,
    iconProps: confirmIconProps,
    message: confirmMessage,
    loading: confirmLoading,
    onConfirm: confirmFunction,
    autoClose: confirmAutoClose,
    remarks: confirmRemarks,
  } = useSelector((state) => state.confirm);

  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(closeToast());
  };

  const handleCloseConfirm = () => {
    dispatch(closeConfirm());
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <RouterProvider router={router} />

        <Snackbar
          open={toastOpen}
          autoHideDuration={toastDuration}
          onClose={handleClose}
          // message={toastMessage}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
        >
          <Alert onClose={handleClose} severity={toastVariant}>
            <AlertTitle sx={{ textTransform: "capitalize", fontWeight: "bold" }}>{toastVariant}!</AlertTitle>

            {toastMessage}
          </Alert>
        </Snackbar>

        <Dialog
          open={confirmOpen}
          onClose={handleCloseConfirm}
          sx={{
            ".MuiPaper-root": {
              alignItems: "center",
              padding: "20px",
              margin: 0,
              gap: "5px",
              minWidth: "250px",
              maxWidth: "350px",
              width: "50%",
              textAlign: "center",
              borderRadius: "10px",
            },
          }}
        >
          <Confirmation
            message={confirmMessage}
            icon={confirmIcon}
            iconColor={confirmIconColor}
            iconProps={confirmIconProps}
            onConfirm={confirmFunction}
            loading={confirmLoading}
            autoClose={confirmAutoClose}
            remarks={confirmRemarks}
          />
        </Dialog>
      </ThemeProvider>
    </LocalizationProvider>
  );
}

export default App;
