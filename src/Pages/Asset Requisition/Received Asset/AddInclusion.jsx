import React, { useEffect, useState } from "react";
import "../../../Style/Request/receiving.scss";
import moment from "moment";
import { TransitionGroup } from "react-transition-group";

// RTK
import { useDispatch, useSelector } from "react-redux";
import { openToast } from "../../../Redux/StateManagement/toastSlice";
import { openConfirm, closeConfirm, onLoading } from "../../../Redux/StateManagement/confirmSlice";

// MUI
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Dialog,
  Divider,
  IconButton,
  Slide,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  Zoom,
} from "@mui/material";
import Collapse from "@mui/material/Collapse";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Add,
  AddBoxRounded,
  Close,
  DragIndicator,
  Info,
  Remove,
  RemoveCircle,
  Update,
  Warning,
} from "@mui/icons-material";
import { closeDialog } from "../../../Redux/StateManagement/booleanStateSlice";
import { usePutInclusionApiMutation } from "../../../Redux/Query/Request/AssetReceiving";
import { fixedAssetApi } from "../../../Redux/Query/FixedAsset/FixedAssets";

const schema = yup.object().shape({
  id: yup.string(),
  vladimir_tag_number: yup.string().nullable(),
  reference_number: yup.string().required().label("Reference Number"),
  inclusion: yup.array().of(
    yup.object().shape({
      description: yup.string().required("Description is a Required Field"),
      // specification: yup.string().required("Specification is a Required Field"),
      quantity: yup.number().required("Quantity is a Required Field"),
    })
  ),
});

const AddInclusion = (props) => {
  const { data, fixedAsset } = props;
  const isSmallScreen = useMediaQuery("(max-width: 720px)");
  const [edit, setEdit] = useState(false);
  const [updateRequest, setUpdateRequest] = useState({
    reference_number: "",
    inclusion: [
      {
        id: null,
        description: "",
        //  specification: "",
        quantity: null,
      },
    ],
  });

  const [updateInclusion] = usePutInclusionApiMutation();

  const dispatch = useDispatch();

  const {
    handleSubmit,
    control,
    formState: { errors, isDirty, isValid },
    setError,
    reset,
    clearErrors,
    watch,
    setValue,
    register,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      vladimir_tag_number: fixedAsset ? data?.vladimir_tag_number : null,
      reference_number: fixedAsset ? fixedAsset?.reference_number : data?.reference_number,
      inclusion: [
        {
          id: null,
          description: "",
          //  specification: "",
          quantity: null,
        },
      ],
    },
  });

  //* Append Table ---------------------------------------------------------------
  const { fields, append, remove } = useFieldArray({
    control,
    name: "inclusion",
  });

  const handleAppendItem = () =>
    append({
      id: null,
      description: "",
      //  specification: "",
      quantity: null,
    });

  // * Success and Error Handler
  // useEffect(() => {
  //   if (isPostSuccess) {
  //     reset();
  //     handleCloseDrawer();
  //     dispatch(
  //       openToast({
  //         message: postData?.message,
  //         duration: 5000,
  //       })
  //     );
  //   }
  // }, [isPostSuccess]);

  // useEffect(() => {
  //   const errorData = isPostError && postError?.status === 422;
  //   if (errorData) {
  //     const errors = postError?.data?.errors || {};
  //     Object.entries(errors).forEach(([name, [message]]) => setError(name, { type: "validate", message }));
  //   }

  //   const showToast = () => {
  //     dispatch(
  //       openToast({
  //         message: "Something went wrong. Please try again.",
  //         duration: 5000,
  //         variant: "error",
  //       })
  //     );
  //   };

  //   errorData && showToast();
  // }, [isPostError]);
  const inclusionValue = fixedAsset ? data : data?.inclusion;

  useEffect(() => {
    if (data) {
      setValue(
        "inclusion",
        inclusionValue?.map((items) => ({
          id: items?.id,
          description: items?.description,
          // specification: items?.specification,
          quantity: items?.quantity,
        }))
      );
    }
  }, [data]);

  const disableBtn = watch(`inclusion`)?.some(
    (item) =>
      item?.description === "" ||
      // item?.specification === "" ||
      item?.quantity === null
  );

  const onSubmitHandler = (formData) => {
    const data = {
      reference_number: formData?.reference_number,
      inclusion: formData?.inclusion?.map((item) => ({
        description: item.description,
        // specification: item.specification,
        quantity: item.quantity,
      })),
    };

    console.log(formData);

    dispatch(
      openConfirm({
        icon: Info,
        iconColor: "info",
        message: (
          <Box>
            <Typography> Are you sure you want to</Typography>
            <Typography
              sx={{
                display: "inline-block",
                color: "secondary.main",
                fontWeight: "bold",
              }}
            >
              {!edit ? "ADD" : "UPDATE"}
            </Typography>{" "}
            this Data?
          </Box>
        ),
        onConfirm: async () => {
          try {
            dispatch(onLoading());
            const res = await updateInclusion(data).unwrap();
            console.log(res);
            dispatch(closeDialog());
            dispatch(fixedAssetApi.util.invalidateTags(["FixedAsset"]));
            dispatch(
              openToast({
                message: "Transfer Request Successfully Added",
                duration: 5000,
              })
            );
            reset();
          } catch (err) {
            console.log(err);
            if (err?.status === 422) {
              dispatch(
                openToast({
                  message: err?.data?.errors?.detail || err.data.message,
                  duration: 5000,
                  variant: "error",
                })
              );
            } else if (err?.status !== 422) {
              console.error(err);
              dispatch(
                openToast({
                  message: "Something went wrong. Please try again.",
                  duration: 5000,
                  variant: "error",
                })
              );
            }
          }
        },
      })
    );
  };

  const handleRemoveItem = (index) => {
    dispatch(
      openConfirm({
        icon: Warning,
        iconColor: "alert",
        message: (
          <Box>
            <Typography> Are you sure you want to</Typography>
            <Typography
              sx={{
                display: "inline-block",
                color: "secondary.main",
                fontWeight: "bold",
              }}
            >
              REMOVE
            </Typography>{" "}
            this item?
          </Box>
        ),
        onConfirm: async () => {
          dispatch(onLoading());
          remove(index);
          dispatch(
            openToast({
              message: "Successfully Removed",
              duration: 5000,
            })
          );
        },
      })
    );
  };

  const customTextSx = {
    ".MuiInputBase-root": {
      borderRadius: "10px",
      minWidth: "180px",
    },

    ".MuiInputLabel-root.Mui-disabled": {
      backgroundColor: "transparent",
    },

    ".Mui-disabled": {
      backgroundColor: "background.light",
      borderRadius: "10px",
    },
  };

  return (
    <>
      <Box component="form" onSubmit={handleSubmit(onSubmitHandler)} sx={{ display: "flex", flexDirection: "column" }}>
        <Stack flexDirection="row" justifyContent="space-between">
          <Typography fontSize="24px" fontFamily="Anton, Impact, Roboto" color="secondary.main">
            ADD INFORMATION
          </Typography>
          <IconButton onClick={() => dispatch(closeDialog())} sx={{ top: -15, right: -15 }}>
            <Close />
          </IconButton>
        </Stack>

        <Divider flexItem />

        <Stack mt={2} gap={2}>
          <Stack gap={1}>
            <Typography color="secondary.main" fontFamily="Roboto" fontSize="large" alignSelf="center">
              REFERENCE NUMBER: {data?.reference_number || fixedAsset?.reference_number}
            </Typography>

            <Stack className="request__table">
              <TableContainer className="request__wrapper" sx={{ maxHeight: "800px" }}>
                <Table className="request__table " stickyHeader>
                  <TableHead sx={{ mt: "2px" }}>
                    <TableRow
                      sx={{
                        "& > *": {
                          fontWeight: "bold",
                          whiteSpace: "nowrap",
                        },
                      }}
                    >
                      <TableCell className="tbl-cell">Index</TableCell>
                      <TableCell className="tbl-cell">Description</TableCell>
                      {/* <TableCell className="tbl-cell">Specification</TableCell> */}
                      <TableCell className="tbl-cell">Quantity</TableCell>
                      <TableCell className="tbl-cell" align="center">
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* <Slide direction="bottom" mountOnEnter unmountOnExit> */}
                    {fields?.map((item, index) => (
                      <TableRow key={item.id} id="appendedRow">
                        <TableCell sx={{ pl: "20px" }}>
                          <Avatar
                            sx={{
                              width: 24,
                              height: 24,
                              backgroundColor: "secondary.main",
                              fontSize: "14px",
                            }}
                          >
                            {index + 1}
                          </Avatar>
                        </TableCell>
                        <TableCell>
                          <TextField
                            {...register(`inclusion.${index}.description`)}
                            autoComplete="off"
                            name={`inclusion.${index}.description`}
                            type="text"
                            label="Description"
                            size="small"
                            color="secondary"
                            error={!!errors?.description}
                            helperText={errors?.description?.message}
                            fullWidth
                            sx={customTextSx}
                            inputProps={{ color: "red" }}
                          />
                          {/* <TextFieldInclusion
                            register={register(`inclusion.${index}.description`)}
                            name={`inclusion.${index}.description`}
                            error={!!errors?.description}
                            helperText={errors?.description?.message}
                            label="Description"
                          /> */}
                        </TableCell>

                        {/* <TableCell>
                          <TextField
                            {...register(`inclusion.${index}.specification`)}
                            autoComplete="off"
                            name={`inclusion.${index}.specification`}
                            type="text"
                            label="Specification"
                            size="small"
                            color="secondary"
                            error={!!errors?.specification}
                            helperText={errors?.specification?.message}
                            fullWidth
                            sx={customTextSx}
                            inputProps={{ color: "red" }}
                          />
                        </TableCell> */}

                        <TableCell width="120px">
                          <TextField
                            {...register(`inclusion.${index}.quantity`)}
                            name={`inclusion.${index}.quantity`}
                            variant="outlined"
                            size="small"
                            color="secondary"
                            type="number"
                            label="Quantity"
                            inputProps={{ min: 1 }}
                            error={!!errors?.quantity}
                            helperText={errors?.quantity?.message}
                            sx={{
                              ".MuiInputBase-root": {
                                borderRadius: "10px",
                                minWidth: "120px",
                              },
                              "& .MuiInputBase-input": {
                                backgroundColor: "transparent",
                              },
                              "& .Mui-disabled": {
                                color: "red",
                              },
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "e" || e.key === "E" || e.key === ".") {
                                e.preventDefault();
                              }
                            }}
                          />
                        </TableCell>

                        <TableCell align="center">
                          <IconButton
                            onClick={() => handleRemoveItem(index)}
                            disabled={edit ? false : fields?.length === 1 || data?.view}
                          >
                            <Tooltip title="Delete Row" placement="top" arrow>
                              <RemoveCircle
                                color={fields.length === 1 || data?.view ? (edit ? "warning" : "gray") : "warning"}
                              />
                            </Tooltip>
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    {/* </Slide> */}

                    <TableRow>
                      <TableCell colSpan={99}>
                        <Stack flexDirection="row" gap={2}>
                          <Button
                            variant="contained"
                            size="small"
                            color="secondary"
                            onClick={() => handleAppendItem()}
                            disabled={disableBtn}
                            startIcon={<Add color={disableBtn ? "gray" : "primary"} />}
                          >
                            Add Row
                          </Button>
                          {/* <Button
                            variant="contained"
                            size="small"
                            color="warning"
                            startIcon={<Delete />}
                            onClick={() => reset()}
                          >
                            Remove All
                          </Button> */}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Stack>
            <Stack flexDirection="row" justifyContent="flex-end" gap={2}>
              <Button
                variant="contained"
                size="small"
                type="submit"
                startIcon={data?.inclusion ? <Update /> : <AddBoxRounded />}
                disabled={!isValid}
              >
                {data?.inclusion || fixedAsset ? "Update" : "Add"}
              </Button>
              <Button variant="outlined" size="small" color="secondary" onClick={() => dispatch(closeDialog())}>
                Close
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Box>
    </>
  );
};

export default AddInclusion;
