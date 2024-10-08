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
import { notificationApi } from "../Query/Notification";
// import { modulesApi } from '../Query/ModulesApi'

// Masterlist
import { sedarUsersApi } from "../Query/SedarUserApi";
import { typeOfRequestApi } from "../Query/Masterlist/TypeOfRequest";
import { capexApi } from "../Query/Masterlist/Capex";
import { subCapexApi } from "../Query/Masterlist/SubCapex";
import { warehouseApi } from "../Query/Masterlist/Warehouse";
// import { majorCategoryApi } from "../Query/Masterlist/Category/MajorCategory";
import { minorCategoryApi } from "../Query/Masterlist/Category/MinorCategory";
// import { categoryListApi } from '../Query/Masterlist/Category/CategoryList'
// import { serviceProviderApi } from '../Query/Masterlist/ServiceProviderApi'

import { fistoCompanyApi } from "../Query/Masterlist/FistoCoa/FistoCompany";
import { fistoDepartmentApi } from "../Query/Masterlist/FistoCoa/FistoDepartment";
import { fistoLocationApi } from "../Query/Masterlist/FistoCoa/FistoLocation";
import { fistoAccountTitleApi } from "../Query/Masterlist/FistoCoa/FistoAccountTitle";
import { fistoSupplierApi } from "../Query/Masterlist/FistoCoa/FistoSupplier";

import { elixirApi } from "../Query/Systems/Elixir";

import { companyApi } from "../Query/Masterlist/YmirCoa/Company";
import { businessUnitApi } from "../Query/Masterlist/YmirCoa/BusinessUnit";
import { departmentApi } from "../Query/Masterlist/YmirCoa/Department";
import { unitApi } from "../Query/Masterlist/YmirCoa/Unit";
import { subUnitApi } from "../Query/Masterlist/YmirCoa/SubUnit";
import { locationApi } from "../Query/Masterlist/YmirCoa/Location";
import { accountTitleApi } from "../Query/Masterlist/YmirCoa/AccountTitle";
import { supplierApi } from "../Query/Masterlist/YmirCoa/Supplier";
import { divisionApi } from "../Query/Masterlist/Division";
import { unitOfMeasurementApi } from "../Query/Masterlist/YmirCoa/UnitOfMeasurement";
import { smallToolsApi } from "../Query/Masterlist/YmirCoa/SmallTools";

import { ymirApi } from "../Query/Masterlist/YmirCoa/YmirApi";
import { ymirPrApi } from "../Query/Masterlist/YmirCoa/YmirPr";

// User Management
import { userAccountsApi } from "../Query/UserManagement/UserAccountsApi";
import { roleManagementApi } from "../Query/UserManagement/RoleManagementApi";

// Fixed Asset
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
import { assetTransferApi } from "../Query/Settings/AssetTransfer";
import { assetPulloutApi } from "../Query/Settings/AssetPullout";
import { assetDisposalApi } from "../Query/Settings/AssetDisposal";

import { requisitionApi } from "../Query/Request/Requisition";
import { requestContainerApi } from "../Query/Request/RequestContainer";
import { purchaseRequestApi } from "../Query/Request/PurchaseRequest";

import { approvalApi } from "../Query/Approving/Approval";
import { transferApi } from "../Query/Movement/Transfer";
import { transferApprovalApi } from "../Query/Approving/TransferApproval";
import { pulloutApi } from "../Query/Movement/Pullout";
import { pulloutApprovalApi } from "../Query/Approving/PulloutApproval";

import { requisitionSmsApi } from "../Query/Request/RequisitionSms";

import { assetReceivingApi } from "../Query/Request/AssetReceiving";
import { receivedReceiptApi } from "../Query/Request/ReceivedReceipt";
import { assetReleasingApi } from "../Query/Request/AssetReleasing";
import { masterlistApi } from "../Query/Masterlist/Masterlist";

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

    [masterlistApi.reducerPath]: masterlistApi.reducer,
    [changePasswordApi.reducerPath]: changePasswordApi.reducer,
    // [modulesApi.reducerPath]: modulesApi.reducer,

    // Masterlist
    [typeOfRequestApi.reducerPath]: typeOfRequestApi.reducer,
    [capexApi.reducerPath]: capexApi.reducer,
    [subCapexApi.reducerPath]: subCapexApi.reducer,
    [warehouseApi.reducerPath]: warehouseApi.reducer,
    // [serviceProviderApi.reducerPath]: serviceProviderApi.reducer,

    // [majorCategoryApi.reducerPath]: majorCategoryApi.reducer,
    [minorCategoryApi.reducerPath]: minorCategoryApi.reducer,
    // [categoryListApi.reducerPath]: categoryListApi.reducer,

    [fistoCompanyApi.reducerPath]: fistoCompanyApi.reducer,
    [fistoDepartmentApi.reducerPath]: fistoDepartmentApi.reducer,
    [fistoLocationApi.reducerPath]: fistoLocationApi.reducer,
    [fistoAccountTitleApi.reducerPath]: fistoAccountTitleApi.reducer,
    [fistoSupplierApi.reducerPath]: fistoSupplierApi.reducer,

    [elixirApi.reducerPath]: elixirApi.reducer,

    [ymirApi.reducerPath]: ymirApi.reducer,
    [ymirPrApi.reducerPath]: ymirPrApi.reducer,

    [companyApi.reducerPath]: companyApi.reducer,
    [businessUnitApi.reducerPath]: businessUnitApi.reducer,
    [departmentApi.reducerPath]: departmentApi.reducer,
    [unitApi.reducerPath]: unitApi.reducer,
    [subUnitApi.reducerPath]: subUnitApi.reducer,
    [locationApi.reducerPath]: locationApi.reducer,
    [accountTitleApi.reducerPath]: accountTitleApi.reducer,
    [supplierApi.reducerPath]: supplierApi.reducer,
    [unitOfMeasurementApi.reducerPath]: unitOfMeasurementApi.reducer,
    [smallToolsApi.reducerPath]: smallToolsApi.reducer,

    [divisionApi.reducerPath]: divisionApi.reducer,
    [ipAddressSetupApi.reducerPath]: ipAddressSetupApi.reducer,
    [ipAddressPretestSetupApi.reducerPath]: ipAddressPretestSetupApi.reducer,

    // User Management
    [userAccountsApi.reducerPath]: userAccountsApi.reducer,
    [sedarUsersApi.reducerPath]: sedarUsersApi.reducer,
    [roleManagementApi.reducerPath]: roleManagementApi.reducer,

    // Fixed Asset
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
    [assetTransferApi.reducerPath]: assetTransferApi.reducer,
    [assetPulloutApi.reducerPath]: assetPulloutApi.reducer,
    [assetDisposalApi.reducerPath]: assetDisposalApi.reducer,

    // Request
    [requisitionApi.reducerPath]: requisitionApi.reducer,
    [requisitionSmsApi.reducerPath]: requisitionSmsApi.reducer,
    [requestContainerApi.reducerPath]: requestContainerApi.reducer,
    [purchaseRequestApi.reducerPath]: purchaseRequestApi.reducer,

    [transferApi.reducerPath]: transferApi.reducer,
    [pulloutApi.reducerPath]: pulloutApi.reducer,

    // Approval
    [approvalApi.reducerPath]: approvalApi.reducer,
    [transferApprovalApi.reducerPath]: transferApprovalApi.reducer,
    [pulloutApprovalApi.reducerPath]: pulloutApprovalApi.reducer,

    [assetReceivingApi.reducerPath]: assetReceivingApi.reducer,
    [receivedReceiptApi.reducerPath]: receivedReceiptApi.reducer,
    [assetReleasingApi.reducerPath]: assetReleasingApi.reducer,

    [notificationApi.reducerPath]: notificationApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat([
      masterlistApi.middleware,
      changePasswordApi.middleware,
      // modulesApi.middleware,

      // Masterlist
      typeOfRequestApi.middleware,
      capexApi.middleware,
      subCapexApi.middleware,
      warehouseApi.middleware,

      // serviceProviderApi.middleware,
      // majorCategoryApi.middleware,
      minorCategoryApi.middleware,
      // categoryListApi.middleware,
      fistoCompanyApi.middleware,
      // ymirBusinessUnitApi.middleware,
      fistoDepartmentApi.middleware,
      // ymirUnitApi.middleware,
      fistoLocationApi.middleware,
      fistoAccountTitleApi.middleware,
      fistoSupplierApi.middleware,

      elixirApi.middleware,

      ymirApi.middleware,
      ymirPrApi.middleware,

      companyApi.middleware,
      businessUnitApi.middleware,
      departmentApi.middleware,
      unitApi.middleware,
      subUnitApi.middleware,
      locationApi.middleware,
      accountTitleApi.middleware,
      supplierApi.middleware,
      unitOfMeasurementApi.middleware,
      smallToolsApi.middleware,

      divisionApi.middleware,
      printOfflineFaApi.middleware,
      ipAddressSetupApi.middleware,
      ipAddressPretestSetupApi.middleware,

      // User Management
      userAccountsApi.middleware,
      sedarUsersApi.middleware,
      roleManagementApi.middleware,

      // Fixed Asset
      fixedAssetApi.middleware,
      additionalCostApi.middleware,
      assetStatusApi.middleware,
      cycleCountStatusApi.middleware,
      assetMovementStatusApi.middleware,
      depreciationStatusApi.middleware,

      // Settings
      approverSettingsApi.middleware,
      unitApproversApi.middleware,
      assetTransferApi.middleware,
      assetPulloutApi.middleware,
      assetDisposalApi.middleware,

      // Request
      requisitionApi.middleware,
      requisitionSmsApi.middleware,
      requestContainerApi.middleware,
      purchaseRequestApi.middleware,

      // Transfer
      transferApi.middleware,
      pulloutApi.middleware,

      // Approval
      approvalApi.middleware,
      transferApprovalApi.middleware,

      assetReceivingApi.middleware,
      receivedReceiptApi.middleware,
      assetReleasingApi.middleware,

      notificationApi.middleware,
    ]),
});

setupListeners(store.dispatch);
