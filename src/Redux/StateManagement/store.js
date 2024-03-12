import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

// State Management
import sidebarReducer from "../StateManagement/sidebar";
import toastReducer from "./toastSlice";
import confirmReducer from "./confirmSlice";
import changePasswordReducer from "../StateManagement/changePasswordSlice";
import ipSetupReducer from "../StateManagement/ipSetupSlice";
import userLoginReducer from "../StateManagement/userLogin";
import collapseCapexReducer from "./collapseCapexSlice";
import booleanStateReducer from "./booleanStateSlice";

// import drawerReducer from './drawerSlice'
// import dialogReducer from './dialogSlice'
// import tableDialogReducer from './tableDialogSlice'
// import datePickerReducer from './datePickerSlice'
// import importFileReducer from './importFileSlice'
// import exportFileReducer from './exportFileSlice'
// import scanFileReducer from './scanFileSlice'

// Query
import { changePasswordApi } from "../Query/ChangePasswordApi";
// import { modulesApi } from '../Query/ModulesApi'

// Masterlist
import { sedarUsersApi } from "../Query/SedarUserApi";
import { typeOfRequestApi } from "../Query/Masterlist/TypeOfRequest";
import { capexApi } from "../Query/Masterlist/Capex";
import { subCapexApi } from "../Query/Masterlist/SubCapex";
import { majorCategoryApi } from "../Query/Masterlist/Category/MajorCategory";
import { minorCategoryApi } from "../Query/Masterlist/Category/MinorCategory";
// import { categoryListApi } from '../Query/Masterlist/Category/CategoryList'
// import { serviceProviderApi } from '../Query/Masterlist/ServiceProviderApi'

import { fistoCompanyApi } from "../Query/Masterlist/FistoCoa/FistoCompany";
import { fistoDepartmentApi } from "../Query/Masterlist/FistoCoa/FistoDepartment";
import { fistoLocationApi } from "../Query/Masterlist/FistoCoa/FistoLocation";
import { fistoAccountTitleApi } from "../Query/Masterlist/FistoCoa/FistoAccountTitle";
import { fistoSupplierApi } from "../Query/Masterlist/FistoCoa/FistoSupplier";

import { companyApi } from "../Query/Masterlist/FistoCoa/Company";
import { businessUnitApi } from "../Query/Masterlist/YmirCoa/BusinessUnit";
import { departmentApi } from "../Query/Masterlist/FistoCoa/Department";
import { unitApi } from "../Query/Masterlist/YmirCoa/Unit";
import { subUnitApi } from "../Query/Masterlist/SubUnit";
import { locationApi } from "../Query/Masterlist/FistoCoa/Location";
import { accountTitleApi } from "../Query/Masterlist/FistoCoa/AccountTitle";
import { supplierApi } from "../Query/Masterlist/FistoCoa/Supplier";
import { divisionApi } from "../Query/Masterlist/Division";

import { ymirApi } from "../Query/Masterlist/YmirCoa/YmirApi";

// User Management
import { userAccountsApi } from "../Query/UserManagement/UserAccountsApi";
import { roleManagementApi } from "../Query/UserManagement/RoleManagementApi";

// Fixed Assets
import { fixedAssetApi } from "../Query/FixedAsset/FixedAssets";
import { additionalCostApi } from "../Query/FixedAsset/AdditionalCost";
import { printOfflineFaApi } from "../Query/FixedAsset/OfflinePrintingFA";

import { ipAddressSetupApi } from "../Query/IpAddressSetup";
import { ipAddressPretestSetupApi } from "../Query/IpAddressSetup";

import { assetStatusApi } from "../Query/Masterlist/Status/AssetStatus";
import { cycleCountStatusApi } from "../Query/Masterlist/Status/CycleCountStatus";
import { assetMovementStatusApi } from "../Query/Masterlist/Status/AssetMovementStatus";
import { depreciationStatusApi } from "../Query/Masterlist/Status/DepreciationStatus";

import { approverSettingsApi } from "../Query/Settings/ApproverSettings";
import { unitApproversApi } from "../Query/Settings/UnitApprovers";

import { requisitionApi } from "../Query/Request/Requisition";
import { requestContainerApi } from "../Query/Request/RequestContainer";
import { purchaseRequestApi } from "../Query/Request/PurchaseRequest";

import { approvalApi } from "../Query/Approving/Approval";
import { requisitionSmsApi } from "../Query/Request/RequisitionSms";

import { assetReceivingApi } from "../Query/Request/AssetReceiving";
import { assetReleasingApi } from "../Query/Request/AssetReleasing";

import { notificationApi } from "../Query/Notification";

export const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
    userLogin: userLoginReducer,
    toast: toastReducer,
    confirm: confirmReducer,
    changePassword: changePasswordReducer,
    ipSetup: ipSetupReducer,
    collapseCapex: collapseCapexReducer,
    booleanState: booleanStateReducer,

    // drawer: drawerReducer,
    // dialog: dialogReducer,
    // tableDialog: tableDialogReducer,
    // datePicker: datePickerReducer,
    // importFile: importFileReducer,
    // exportFile: exportFileReducer,
    // scanFile: scanFileReducer,

    [changePasswordApi.reducerPath]: changePasswordApi.reducer,
    // [modulesApi.reducerPath]: modulesApi.reducer,

    // Masterlist
    [typeOfRequestApi.reducerPath]: typeOfRequestApi.reducer,
    [capexApi.reducerPath]: capexApi.reducer,
    [subCapexApi.reducerPath]: subCapexApi.reducer,
    // [serviceProviderApi.reducerPath]: serviceProviderApi.reducer,

    [majorCategoryApi.reducerPath]: majorCategoryApi.reducer,
    [minorCategoryApi.reducerPath]: minorCategoryApi.reducer,
    // [categoryListApi.reducerPath]: categoryListApi.reducer,

    [fistoCompanyApi.reducerPath]: fistoCompanyApi.reducer,
    // [ymirBusinessUnitApi.reducerPath]: ymirApi.reducer,
    [fistoDepartmentApi.reducerPath]: fistoDepartmentApi.reducer,
    // [ymirUnitApi.reducerPath]: ymirApi.reducer,
    [fistoLocationApi.reducerPath]: fistoLocationApi.reducer,
    [fistoAccountTitleApi.reducerPath]: fistoAccountTitleApi.reducer,
    [fistoSupplierApi.reducerPath]: fistoSupplierApi.reducer,

    [ymirApi.reducerPath]: ymirApi.reducer,

    [companyApi.reducerPath]: companyApi.reducer,
    [businessUnitApi.reducerPath]: businessUnitApi.reducer,
    [departmentApi.reducerPath]: departmentApi.reducer,
    [unitApi.reducerPath]: unitApi.reducer,
    [locationApi.reducerPath]: locationApi.reducer,
    [accountTitleApi.reducerPath]: accountTitleApi.reducer,
    [supplierApi.reducerPath]: supplierApi.reducer,

    [subUnitApi.reducerPath]: subUnitApi.reducer,
    [divisionApi.reducerPath]: divisionApi.reducer,
    [ipAddressSetupApi.reducerPath]: ipAddressSetupApi.reducer,
    [ipAddressPretestSetupApi.reducerPath]: ipAddressPretestSetupApi.reducer,

    // User Mangement
    [userAccountsApi.reducerPath]: userAccountsApi.reducer,
    [sedarUsersApi.reducerPath]: sedarUsersApi.reducer,
    [roleManagementApi.reducerPath]: roleManagementApi.reducer,

    // Fixed Assets
    [fixedAssetApi.reducerPath]: fixedAssetApi.reducer,
    [additionalCostApi.reducerPath]: additionalCostApi.reducer,
    [printOfflineFaApi.reducerPath]: printOfflineFaApi.reducer,
    [assetStatusApi.reducerPath]: assetStatusApi.reducer,
    [cycleCountStatusApi.reducerPath]: cycleCountStatusApi.reducer,
    [assetMovementStatusApi.reducerPath]: assetMovementStatusApi.reducer,
    [depreciationStatusApi.reducerPath]: depreciationStatusApi.reducer,

    // Settings
    [approverSettingsApi.reducerPath]: approverSettingsApi.reducer,
    [unitApproversApi.reducerPath]: unitApproversApi.reducer,

    // Request
    [requisitionApi.reducerPath]: requisitionApi.reducer,
    [requisitionSmsApi.reducerPath]: requisitionSmsApi.reducer,
    [requestContainerApi.reducerPath]: requestContainerApi.reducer,
    [purchaseRequestApi.reducerPath]: purchaseRequestApi.reducer,

    // Approval
    [approvalApi.reducerPath]: approvalApi.reducer,

    [assetReceivingApi.reducerPath]: assetReceivingApi.reducer,
    [assetReleasingApi.reducerPath]: assetReleasingApi.reducer,

    [notificationApi.reducerPath]: notificationApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat([
      changePasswordApi.middleware,
      // modulesApi.middleware,

      // Masterlist
      typeOfRequestApi.middleware,
      capexApi.middleware,
      subCapexApi.middleware,

      // serviceProviderApi.middleware,
      majorCategoryApi.middleware,
      minorCategoryApi.middleware,
      // categoryListApi.middleware,
      fistoCompanyApi.middleware,
      // ymirBusinessUnitApi.middleware,
      fistoDepartmentApi.middleware,
      // ymirUnitApi.middleware,
      fistoLocationApi.middleware,
      fistoAccountTitleApi.middleware,
      fistoSupplierApi.middleware,

      ymirApi.middleware,

      companyApi.middleware,
      businessUnitApi.middleware,
      departmentApi.middleware,
      unitApi.middleware,
      locationApi.middleware,
      accountTitleApi.middleware,
      supplierApi.middleware,
      subUnitApi.middleware,

      divisionApi.middleware,
      printOfflineFaApi.middleware,
      ipAddressSetupApi.middleware,
      ipAddressPretestSetupApi.middleware,

      // User Management
      userAccountsApi.middleware,
      sedarUsersApi.middleware,
      roleManagementApi.middleware,

      // Fixed Assets
      fixedAssetApi.middleware,
      additionalCostApi.middleware,
      assetStatusApi.middleware,
      cycleCountStatusApi.middleware,
      assetMovementStatusApi.middleware,
      depreciationStatusApi.middleware,

      // Settings
      approverSettingsApi.middleware,
      unitApproversApi.middleware,

      // Request
      requisitionApi.middleware,
      requisitionSmsApi.middleware,
      requestContainerApi.middleware,
      purchaseRequestApi.middleware,

      // Approval
      approvalApi.middleware,

      assetReceivingApi.middleware,
      assetReleasingApi.middleware,

      notificationApi.middleware,
    ]),
});

setupListeners(store.dispatch);
