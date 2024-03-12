import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  drawer: false,
  drawerMultiple: { drawer1: false, drawer2: false },
  dialog: false,
  dialogMultiple: { dialog1: false, dialog2: false },
  add: false,
  datePicker: false,
  importFile: false,
  exportFile: false,
  scanFile: false,
  print: false,
};

export const booleanStateSlice = createSlice({
  name: "booleanState",
  initialState,

  reducers: {
    // Drawers
    openDrawer: (state, action) => {
      state.drawer = true;
    },
    closeDrawer: (state, action) => {
      state.drawer = false;
    },
    toggleDrawer: (state, action) => {
      state.drawer = !state.drawer;
    },

    openDrawer1: (state, action) => {
      state.drawerMultiple.drawer1 = true;
    },
    closeDrawer1: (state, action) => {
      state.drawerMultiple.drawer1 = false;
    },

    // Dialogs
    openDialog: (state, action) => {
      state.dialog = true;
    },
    closeDialog: (state, action) => {
      state.dialog = false;
    },
    openDialog1: (state, action) => {
      state.dialogMultiple.dialog1 = true;
    },
    closeDialog1: (state, action) => {
      state.dialogMultiple.dialog1 = false;
    },

    // Add
    openAdd: (state, action) => {
      state.add = true;
    },
    closeAdd: (state, action) => {
      state.add = false;
    },

    // DatePicker
    openDatePicker: (state, action) => {
      state.datePicker = true;
    },
    closeDatePicker: (state, action) => {
      state.datePicker = false;
    },

    // Import
    openImport: (state, action) => {
      state.importFile = true;
    },
    closeImport: (state, action) => {
      state.importFile = false;
    },

    // Export
    openExport: (state, action) => {
      state.exportFile = true;
    },
    closeExport: (state, action) => {
      state.exportFile = false;
    },

    // Print
    openScan: (state, action) => {
      state.scanFile = true;
    },
    closeScan: (state, action) => {
      state.scanFile = false;
    },

    // Print
    openPrint: (state, action) => {
      state.print = true;
    },
    closePrint: (state, action) => {
      state.print = false;
    },
  },
});

export const {
  openDrawer,
  closeDrawer,
  openDrawer1,
  closeDrawer1,
  openDialog,
  closeDialog,
  openDialog1,
  closeDialog1,
  openAdd,
  closeAdd,
  openDatePicker,
  closeDatePicker,
  openImport,
  closeImport,
  openExport,
  closeExport,
  openScan,
  closeScan,
  openPrint,
  closePrint,
} = booleanStateSlice.actions;
export default booleanStateSlice.reducer;
