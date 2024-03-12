import React, { useState, useEffect } from "react";
import { saveAs } from "file-saver";
import { usePostImportApiMutation } from "../../../Redux/Query/Masterlist/Capex";

import { useDispatch } from "react-redux";

import { BrowserUpdated, SystemUpdateAltRounded } from "@mui/icons-material";

import {
  Box,
  IconButton,
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";

import { Close } from "@mui/icons-material";

import { FileUploader } from "react-drag-drop-files";
import { LoadingButton } from "@mui/lab";
import { useForm } from "react-hook-form";
import { openToast } from "../../../Redux/StateManagement/toastSlice";
import { ImportingData } from "../../../Components/LottieFiles/LottieComponents";
import { closeImport } from "../../../Redux/StateManagement/booleanStateSlice";
import ErrorsFoundImport from "../../ErrorsFoundImport";
import { useDownloadExcel } from "../../../Hooks/useDownloadExcel";

const fileTypes = ["CSV", "XLSX"];

const ImportCapex = (props) => {
  const [importError, setImportError] = useState([]);

  // const {
  //   handleSubmit,
  //   control,
  //   formState: { errors },
  //   setError,
  //   reset,
  //   watch,
  //   setValue,
  // } = useForm();

  // Table Sorting --------------------------------

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("row");

  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  };

  const comparator = (order, orderBy) => {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  const onSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const [
    postImport,
    { data: postData, isLoading: isPostLoading, isSuccess: isPostSuccess, isError: isPostError, error: postError },
  ] = usePostImportApiMutation();

  useEffect(() => {
    if (isPostError && postError?.status === 422) {
      const errorArray = Object.entries(postError.data.errors)?.map(([key, value]) => {
        const [row, column] = key.split(".");
        const [message] = value;

        return {
          row,
          column,
          message,
        };
      });
      setImportError(errorArray);
      // console.log(importError);

      dispatch(
        openToast({
          message: postError?.data?.message,
          duration: 5000,
          variant: "error",
        })
      );
    } else if (isPostError && postError?.status !== 422) {
      dispatch(
        openToast({
          message: "Something went wrong. Please try again.",
          duration: 5000,
          variant: "error",
        })
      );
    }
  }, [isPostError]);

  useEffect(() => {
    if (isPostSuccess) {
      dispatch(
        openToast({
          message: postData?.message,
          duration: 5000,
        })
      );
      handleCloseImport();
    }
  }, [isPostSuccess]);

  const dispatch = useDispatch();

  const handleCloseImport = () => {
    dispatch(closeImport());
  };

  const handleChange = (file) => {
    const formData = new FormData();
    formData.append("file", file);
    // console.log(file.name);
    // console.log(formData);

    // for (const pair of formData.entries()) {
    //   console.log(pair[0], pair[1]);
    // }

    // axios.post("http://127.0.0.1:8000/api/import-masterlist", formData);

    postImport(formData);
  };

  const saveExcel = () => {
    useDownloadExcel("capex-sample-file");
  };

  return (
    <>
      <Stack gap={2} padding="10px" component="form">
        <IconButton
          sx={{
            alignSelf: "flex-end",
            right: 10,
            top: 10,
            position: "absolute",
          }}
          size="small"
          color="secondary"
          disabled={isPostLoading}
          onClick={handleCloseImport}
        >
          <Close size="small" />
        </IconButton>

        <Box>
          <Typography color="secondary.main" sx={{ fontFamily: "Anton", fontSize: "1.4rem" }}>
            IMPORT CAPEX
          </Typography>

          {isPostError ? null : (
            <Typography
              color="secondary.main"
              sx={{
                fontFamily: "Raleway, Poppins, Helvetica",
                fontSize: "14px",
              }}
            >
              Download sample document {""}
              <Link sx={{ cursor: "pointer" }} onClick={saveExcel}>
                Here
              </Link>
            </Typography>
          )}
        </Box>

        {isPostError ? (
          <ErrorsFoundImport importError={importError} isPostError={isPostError} />
        ) : (
          <Box sx={{ pb: "20px" }}>
            <FileUploader handleChange={handleChange} name="file" types={fileTypes}>
              <Box className="importBoxContainer">
                {isPostLoading ? (
                  <ImportingData />
                ) : (
                  <>
                    <BrowserUpdated
                      sx={{
                        fontSize: "75px",
                        color: "gray",
                      }}
                    />
                    <Typography
                      className="importDrop"
                      sx={{
                        fontFamily: "Raleway, Poppins, Roboto",
                      }}
                    >
                      Drop a CSV/XLSX file or
                    </Typography>
                  </>
                )}

                <LoadingButton
                  sx={{
                    width: "110px",
                    maxWidth: "150px",
                    borderRadius: "20px",
                    padding: "8px",
                    marginTop: isPostLoading ? "120px" : "5px",
                    zIndex: "2",
                  }}
                  variant="contained"
                  size="small"
                  loading={isPostLoading}
                  loadingPosition="start"
                  startIcon={<SystemUpdateAltRounded color="text" />}
                  htmlFor="importInputFile"
                >
                  <Typography fontFamily={"Raleway"} fontSize={12} fontWeight={"bold"}>
                    Import
                  </Typography>
                </LoadingButton>
              </Box>
            </FileUploader>
          </Box>
        )}
      </Stack>
    </>
  );
};

export default ImportCapex;
