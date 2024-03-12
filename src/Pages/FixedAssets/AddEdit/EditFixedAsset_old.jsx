// import React, { useEffect, useState } from "react";
// import "../../../../Style/editFixedAsset.scss";
// import CustomTextField from "../../../../Components/Reusable/CustomTextField";
// import CustomAutoComplete from "../../../../Components/Reusable/CustomAutoComplete";

// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";

// import { openToast } from "../../../../Redux/StateManagement/toastSlice";

// import {
//   Box,
//   Button,
//   Divider,
//   FormControl,
//   FormControlLabel,
//   FormLabel,
//   IconButton,
//   Paper,
//   Radio,
//   RadioGroup,
//   TextField,
//   Typography,
// } from "@mui/material";

// import { useDispatch } from "react-redux";
// import { closeDrawer } from "../../../../Redux/StateManagement/drawerSlice";
// import { useGetMinorCategoryAllApiQuery } from "../../../../Redux/Query/Masterlist/Category/MinorCategory";
// import { useGetMajorCategoryAllApiQuery } from "../../../../Redux/Query/Masterlist/Category/MajorCategory";
// import { useGetDivisionAllApiQuery } from "../../../../Redux/Query/Masterlist/Division";
// import { useGetCompanyAllApiQuery } from "../../../../Redux/Query/Masterlist/FistoCoa/Company";
// import { useGetDepartmentAllApiQuery } from "../../../../Redux/Query/Masterlist/FistoCoa/Department";
// import { useGetLocationAllApiQuery } from "../../../../Redux/Query/Masterlist/FistoCoa/Location";
// import { useGetAccountTitleAllApiQuery } from "../../../../Redux/Query/Masterlist/FistoCoa/AccountTitle";
// import {
//   usePostFixedAssetApiMutation,
//   useUpdateFixedAssetApiMutation,
// } from "../../../../Redux/Query/FixedAsset/FixedAssets";

// import { LoadingButton } from "@mui/lab";
// import { ArrowForwardIosRounded } from "@mui/icons-material";
// import CustomPatternfield from "../../../../Components/Reusable/CustomPatternfield";
// import CustomNumberField from "../../../../Components/Reusable/CustomNumberField";
// import CustomDatePicker from "../../../../Components/Reusable/CustomDatePicker";
// import moment from "moment";
// import CustomRadioGroup from "../../../../Components/Reusable/CustomRadioGroup";

// const schema = yup.object().shape({
//   id: yup.string(),
//   type_of_request_id: yup.string().required().label("Type of Request"),
//   is_old_asset: yup.boolean(),
//   tag_number: yup.string().when("is_old_asset", {
//     is: (value) => value == 1,
//     then: (yup) => yup.required().label("Tag Number"),
//   }),
//   tag_number_old: yup.string().when("is_old_asset", {
//     is: (value) => value == 1,
//     then: (yup) => yup.required().label("Old Tag Number"),
//   }),

//   division_id: yup
//     .string()
//     .transform((value) => {
//       return value?.id.toString();
//     })
//     .required()
//     .label("Division"),
//   major_category_id: yup
//     .string()
//     .transform((value) => {
//       return value?.id.toString();
//     })
//     .required()
//     .label("Major Category"),
//   minor_category_id: yup
//     .string()
//     .transform((value) => {
//       return value?.id.toString();
//     })
//     .required()
//     .label("Minor Category"),

//   company_id: yup
//     .string()
//     .transform((value) => {
//       return value?.id.toString();
//     })
//     .required()
//     .label("Company"),
//   department_id: yup
//     .string()
//     .transform((value) => {
//       return value?.id.toString();
//     })
//     .required()
//     .label("Department"),
//   location_id: yup
//     .string()
//     .transform((value) => {
//       return value?.id.toString();
//     })
//     .required()
//     .label("Location"),
//   account_title_id: yup
//     .string()
//     .transform((value) => {
//       return value?.id.toString();
//     })
//     .required()
//     .label("Account Title"),

//   asset_description: yup.string().required().label("Asset Description"),
//   asset_specification: yup.string().required().label("Asset Specification"),
//   accountability: yup
//     .string()
//     .typeError("Accountability is a required field")
//     .required()
//     .label("Accountability"),
//   accountable: yup.string().required().label("Accountable"),
//   cellphone_number: yup.number().nullable(),
//   brand: yup.string(),
//   care_of: yup.string().label("Care Of"),
//   voucher: yup.string(),
//   receipt: yup.string(),
//   quantity: yup.number().required(),
//   faStatus: yup
//     .string()
//     .typeError("Status is a required field")
//     .required()
//     .label("Status"),

//   depreciation_method: yup
//     .string()
//     .typeError("Depreciation Method is a required field")
//     .required()
//     .label("Depreciation Method"),
//   est_useful_life: yup.string().required(),
//   acquisition_date: yup.string().required(),
//   acquisition_cost: yup.number().required(),
//   age: yup.number().required(),
//   scrap_value: yup.number().required(),
//   original_cost: yup.number().required(),
//   // accumulated_cost: yup.number().required(),
//   start_depreciation: yup.string().required(),
//   end_depreciation: yup.string().required(),
//   // depreciation_per_year: yup.number().required(),
//   // depreciation_per_month: yup.number().required(),
//   // remaining_book_value: yup.number().required(),
// });

// const EditFixedAsset = (props) => {
//   const { data, onUpdateResetHandler } = props;

//   const [filteredMajorCategoryData, setFilteredMajorCategoryData] = useState(
//     []
//   );
//   const [filteredMinorCategoryData, setFilteredMinorCategoryData] = useState(
//     []
//   );
//   const dispatch = useDispatch();

//   const [
//     postFixedAsset,
//     {
//       data: postData,
//       isLoading: isPostLoading,
//       isSuccess: isPostSuccess,
//       isError: isPostError,
//       error: postError,
//     },
//   ] = usePostFixedAssetApiMutation();

//   const [
//     updateFixedAsset,
//     {
//       isLoading: isUpdateLoading,
//       isSuccess: isUpdateSuccess,
//       data: updateData,
//       isError: isUpdateError,
//       error: updateError,
//     },
//   ] = useUpdateFixedAssetApiMutation();

//   const {
//     data: divisionData = [],
//     isLoading: isDivisionLoading,
//     isSuccess: isDivisionSuccess,
//     isError: isDivisionError,
//     refetch: isDivisionRefetch,
//   } = useGetDivisionAllApiQuery();

//   const {
//     data: majorCategoryData = [],
//     isLoading: isMajorCategoryLoading,
//     isSuccess: isMajorCategorySuccess,
//     isError: isMajorCategoryError,
//     refetch: isMajorCategoryRefetch,
//   } = useGetMajorCategoryAllApiQuery();

//   const {
//     data: minorCategoryData = [],
//     isLoading: isMinorCategoryLoading,
//     isSuccess: isMinorCategorySuccess,
//     isError: isMinorCategoryError,
//   } = useGetMinorCategoryAllApiQuery();

//   const {
//     data: companyData = [],
//     isLoading: isCompanyLoading,
//     isSuccess: isCompanySuccess,
//     isError: isCompanyError,
//     refetch: isCompanyRefetch,
//   } = useGetCompanyAllApiQuery();

//   const {
//     data: departmentData = [],
//     isLoading: isDepartmentLoading,
//     isSuccess: isDepartmentSuccess,
//     isError: isDepartmentError,
//     refetch: isDepartmentRefetch,
//   } = useGetDepartmentAllApiQuery();

//   const {
//     data: locationData = [],
//     isLoading: isLocationLoading,
//     isSuccess: isLocationSuccess,
//     isError: isLocationError,
//     refetch: isLocationRefetch,
//   } = useGetLocationAllApiQuery();

//   const {
//     data: accountTitleData = [],
//     isLoading: isAccountTitleLoading,
//     isSuccess: isAccountTitleSuccess,
//     isError: isAccountTitleError,
//     refetch: isAccountTitleRefetch,
//   } = useGetAccountTitleAllApiQuery();

//   const {
//     handleSubmit,
//     control,
//     register,
//     formState: { errors },
//     setError,
//     reset,
//     watch,
//     setValue,
//   } = useForm({
//     resolver: yupResolver(schema),
//     defaultValues: {
//       id: "",
//       is_old_asset: "0",
//       tag_number: "",
//       tag_number_old: "",

//       division_id: null,
//       major_category_id: null,
//       minor_category_id: null,
//       company_id: null,
//       department_id: null,
//       location_id: null,
//       account_title_id: null,

//       type_of_request_id: null,
//       asset_description: "",
//       asset_specification: "",
//       accountability: null,
//       accountable: "",
//       cellphone_number: null,
//       brand: "",
//       care_of: "",
//       voucher: "",
//       receipt: "",
//       quantity: "",
//       faStatus: null,

//       depreciation_method: null,
//       est_useful_life: "",
//       acquisition_date: null,
//       acquisition_cost: "",
//       age: "",
//       scrap_value: "",
//       original_cost: "",
//       // accumulated_cost: "",
//       start_depreciation: null,
//       end_depreciation: null,
//       // depreciation_per_year: "",
//       // depreciation_per_month: "",
//       // remaining_book_value: "",
//     },
//   });

//   // console.log("Number:", watch("cellphone_number"));
//   // console.log(data);
//   // console.log(errors);

//   useEffect(() => {
//     if (
//       (isPostError || isUpdateError) &&
//       (postError?.status === 422 || updateError?.status === 422)
//     ) {
//       setError("tag_number", {
//         type: "validate",
//         message:
//           postError?.data?.errors.tag_number ||
//           updateError?.data?.errors.tag_number,
//       }),
//         setError("tag_number_old", {
//           type: "validate",
//           message:
//             postError?.data?.errors.tag_number_old ||
//             updateError?.data?.errors.tag_number_old,
//         });

//       setError("division_id", {
//         type: "validate",
//         message:
//           postError?.data?.errors.division_id ||
//           updateError?.data?.errors.division_id,
//       });
//       setError("major_category_id", {
//         type: "validate",
//         message:
//           postError?.data?.errors.major_category_id ||
//           updateError?.data?.errors.major_category_id,
//       });
//       setError("company_id", {
//         type: "validate",
//         message:
//           postError?.data?.errors.company_id ||
//           updateError?.data?.errors.company_id,
//       });
//       setError("department_id", {
//         type: "validate",
//         message:
//           postError?.data?.errors.department_id ||
//           updateError?.data?.errors.department_id,
//       });
//       setError("location_id", {
//         type: "validate",
//         message:
//           postError?.data?.errors.location_id ||
//           updateError?.data?.errors.location_id,
//       });
//       setError("account_title_id", {
//         type: "validate",
//         message:
//           postError?.data?.errors.account_title_id ||
//           updateError?.data?.errors.account_title_id,
//       });

//       setError("type_of_request_id", {
//         type: "validate",
//         message:
//           postError?.data?.errors.type_of_request_id ||
//           updateError?.data?.errors.type_of_request_id,
//       });

//       setError("asset_description", {
//         type: "validate",
//         message:
//           postError?.data?.errors.asset_description ||
//           updateError?.data?.errors.asset_description,
//       });

//       setError("accountability", {
//         type: "validate",
//         message:
//           postError?.data?.errors.accountability ||
//           updateError?.data?.errors.accountability,
//       });

//       setError("accountable", {
//         type: "validate",
//         message:
//           postError?.data?.errors.accountable ||
//           updateError?.data?.errors.accountable,
//       });

//       setError("quantity", {
//         type: "validate",
//         message:
//           postError?.data?.errors.quantity ||
//           updateError?.data?.errors.quantity,
//       });

//       setError("faStatus", {
//         type: "validate",
//         message:
//           postError?.data?.errors.faStatus ||
//           updateError?.data?.errors.faStatus,
//       });

//       setError("depreciation_method", {
//         type: "validate",
//         message:
//           postError?.data?.errors.depreciation_method ||
//           updateError?.data?.errors.depreciation_method,
//       });
//       setError("est_useful_life", {
//         type: "validate",
//         message:
//           postError?.data?.errors.est_useful_life ||
//           updateError?.data?.errors.est_useful_life,
//       });
//       setError("acquisition_date", {
//         type: "validate",
//         message:
//           postError?.data?.errors.acquisition_date ||
//           updateError?.data?.errors.acquisition_date,
//       });
//       setError("acquisition_cost", {
//         type: "validate",
//         message:
//           postError?.data?.errors.acquisition_cost ||
//           updateError?.data?.errors.acquisition_cost,
//       });
//       setError("age", {
//         type: "validate",
//         message: postError?.data?.errors.age || updateError?.data?.errors.age,
//       });
//       setError("scrap_value", {
//         type: "validate",
//         message:
//           postError?.data?.errors.scrap_value ||
//           updateError?.data?.errors.scrap_value,
//       });
//       setError("original_cost", {
//         type: "validate",
//         message:
//           postError?.data?.errors.original_cost ||
//           updateError?.data?.errors.original_cost,
//       });
//       // setError("accumulated_cost", {
//       //   type: "validate",
//       //   message:
//       //     postError?.data?.errors.accumulated_cost ||
//       //     updateError?.data?.errors.accumulated_cost,
//       // });
//       setError("start_depreciation", {
//         type: "validate",
//         message:
//           postError?.data?.errors.start_depreciation ||
//           updateError?.data?.errors.start_depreciation,
//       });
//       setError("end_depreciation", {
//         type: "validate",
//         message:
//           postError?.data?.errors.end_depreciation ||
//           updateError?.data?.errors.end_depreciation,
//       });
//       // setError("depreciation_per_year", {
//       //   type: "validate",
//       //   message:
//       //     postError?.data?.errors.depreciation_per_year ||
//       //     updateError?.data?.errors.depreciation_per_year,
//       // });
//       // setError("depreciation_per_month", {
//       //   type: "validate",
//       //   message:
//       //     postError?.data?.errors.depreciation_per_month ||
//       //     updateError?.data?.errors.depreciation_per_month,
//       // });
//       // setError("remaining_book_value", {
//       //   type: "validate",
//       //   message:
//       //     postError?.data?.errors.remaining_book_value ||
//       //     updateError?.data?.errors.remaining_book_value,
//       // });
//     } else if (
//       (isPostError && postError?.faStatus !== 422) ||
//       (isUpdateError && updateError?.faStatus !== 422)
//     ) {
//       dispatch(
//         openToast({
//           message: "Something went wrong. Please try again.",
//           duration: 5000,
//           variant: "error",
//         })
//       );
//     }
//   }, [isPostError, isUpdateError]);

//   useEffect(() => {
//     if (isPostSuccess || isUpdateSuccess) {
//       reset();
//       handleCloseDrawer();
//       dispatch(
//         openToast({
//           message: postData?.message || updateData?.message,
//           duration: 5000,
//         })
//       );

//       setTimeout(() => {
//         onUpdateResetHandler();
//       }, 500);
//     }
//   }, [isPostSuccess, isUpdateSuccess]);

//   useEffect(() => {
//     const acquisitionDateFormat = new Date(data.acquisition_date);
//     const startDepreciationFormat = new Date(data.start_depreciation);
//     const endDepreciationFormat = new Date(data.end_depreciation);

//     if (data.faStatus) {
//       setValue("id", data.id);
//       setValue("type_of_request_id", data.type_of_request.type_of_request_name);
//       setValue("is_old_asset", data.is_old_asset?.toString());
//       setValue("tag_number", data.tag_number);
//       setValue("tag_number_old", data.tag_number_old);

//       setValue("division_id", data.division);
//       setValue("major_category_id", data.major_category);
//       setValue("minor_category_id", data.minor_category);

//       setValue("company_id", data.company);
//       setValue("department_id", data.department);
//       setValue("location_id", data.location);
//       setValue("account_title_id", data.account_title);

//       setValue("asset_description", data.asset_description);
//       setValue("asset_specification", data.asset_specification);
//       setValue("accountability", data.accountability);
//       setValue("accountable", data.accountable);
//       setValue(
//         "cellphone_number",
//         data.cellphone_number === "-" ? null : data.cellphone_number
//       );
//       setValue("brand", data.brand);
//       setValue("care_of", data.care_of);
//       setValue("voucher", data.voucher);
//       setValue("receipt", data.receipt);
//       setValue("quantity", data.quantity);
//       setValue("faStatus", data.faStatus);

//       setValue("depreciation_method", data.depreciation_method);
//       setValue("est_useful_life", data.est_useful_life);
//       setValue("acquisition_date", acquisitionDateFormat);
//       setValue("acquisition_cost", data.acquisition_cost);
//       setValue("age", data.age);
//       setValue("scrap_value", data.scrap_value);
//       setValue("original_cost", data.original_cost);
//       // setValue("accumulated_cost", data.accumulated_cost);
//       setValue("start_depreciation", startDepreciationFormat);
//       setValue("end_depreciation", endDepreciationFormat);
//       // setValue("depreciation_per_year", data.depreciation_per_year);
//       // setValue("depreciation_per_month", data.depreciation_per_month);
//       // setValue("remaining_book_value", data.remaining_book_value);
//     }
//     // console.log(data);
//     // console.log(watch("acquisition_date"));
//     // console.log(watch("end_depreciation"));
//   }, [data]);

//   // SUBMIT HANDLER
//   const onSubmitHandler = (formData) => {
//     const newObj = {
//       ...formData,
//       cellphone_number: formData.cellphone_number
//         ? "09" + formData.cellphone_number
//         : null,
//       acquisition_date: moment(new Date(formData.acquisition_date)).format(
//         "YYYY-MM-DD"
//       ),
//       start_depreciation: moment(new Date(formData.start_depreciation)).format(
//         "YYYY-MM"
//       ),
//       end_depreciation: moment(new Date(formData.end_depreciation)).format(
//         "YYYY-MM"
//       ),
//     };

//     if (data.faStatus) {
//       updateFixedAsset(newObj);
//       return;
//     }

//     postFixedAsset(newObj);
//   };

//   const handleCloseDrawer = () => {
//     setTimeout(() => {
//       onUpdateResetHandler();
//     }, 500);

//     dispatch(closeDrawer());
//   };

//   const disabledItems = () => {
//     return (
//       watch("type_of_request_id") === "" ||
//       watch("division_id") === "" ||
//       watch("major_category_id") === "" ||
//       watch("minor_category_id") === "" ||
//       watch("company_id") === "" ||
//       watch("department_id") === "" ||
//       watch("location_id") === "" ||
//       watch("account_title_id") === "" ||
//       watch("asset_description") === "" ||
//       watch("asset_specification") === "" ||
//       watch("accountability") === "" ||
//       watch("accountable") === "" ||
//       watch("quantity") === "" ||
//       watch("faStatus") === "" ||
//       watch("depreciation_method") === "" ||
//       watch("est_useful_life") === "" ||
//       watch("acquisition_date") === null ||
//       watch("acquisition_cost") === "" ||
//       watch("scrap_value") === "" ||
//       watch("original_cost") === "" ||
//       // watch("accumulated_cost") === "" ||
//       watch("start_depreciation") === null ||
//       watch("end_depreciation") === null
//       // watch("depreciation_per_year") === "" ||
//       // watch("depreciation_per_month") === "" ||
//       // watch("remaining_book_value") === ""
//     );
//   };

//   return (
//     <Box
//       component="form"
//       onSubmit={handleSubmit(onSubmitHandler)}
//       className="editFixedAsset"
//     >
//       <Box className="editFixedAsset__title">
//         <IconButton
//           className="editFixedAsset__back_button"
//           onClick={handleCloseDrawer}
//         >
//           <ArrowForwardIosRounded color="secondary" />
//         </IconButton>
//         <Typography
//           color="secondary.main"
//           sx={{ fontFamily: "Anton", fontSize: "1.5rem" }}
//         >
//           {data.faStatus ? "Edit Fixed Asset" : "Add Fixed Asset"}
//         </Typography>
//       </Box>

//       <Box className="editFixedAsset__container">
//         <Box className="editFixedAsset__columns">
//           <Box
//             sx={{ gap: "5px!important" }}
//             className="editFixedAsset__firstColumn"
//           >
//             <Box className="editFixedAsset__textFieldSpacing">
//               <FormLabel
//                 sx={{
//                   fontWeight: "bold",
//                   color: "secondary.main",
//                   fontFamily: "Anton",
//                   fontSize: "16px",
//                 }}
//               >
//                 Type of Request
//               </FormLabel>

//               <CustomAutoComplete
//                 name="type_of_request_id"
//                 control={control}
//                 options={[
//                   "Asset",
//                   "CAPEX",
//                   "Cellular Phone",
//                   "Major Repair",
//                   "For Fabrication",
//                 ]}
//                 size="small"
//                 isOptionEqualToValue={(option, value) => option === value}
//                 renderInput={(params) => (
//                   <TextField
//                     color="secondary"
//                     {...params}
//                     label="Type of Request  "
//                     error={!!errors?.type_of_request_id?.message}
//                     helperText={errors?.type_of_request_id?.message}
//                   />
//                 )}
//               />

//               <FormLabel
//                 sx={{
//                   fontWeight: "bold",
//                   color: "secondary.main",
//                   fontFamily: "Anton",
//                   fontSize: "16px",
//                 }}
//               >
//                 CAPEX
//               </FormLabel>

//               <CustomTextField
//                 control={control}
//                 disabled={data.type_of_request_id !== "CAPEX"}
//                 name="project_name"
//                 label="Project Name"
//                 type="text"
//                 color="secondary"
//                 size="small"
//                 error={!!errors?.project_name?.message}
//                 helperText={errors?.project_name?.message}
//                 fullWidth
//               />

//               <FormLabel
//                 sx={{
//                   fontWeight: "bold",
//                   color: "secondary.main",
//                   fontFamily: "Anton",
//                   fontSize: "16px",
//                 }}
//               >
//                 Choose from the Selection
//               </FormLabel>

//               <CustomRadioGroup
//                 control={control}
//                 name="is_old_asset"
//                 sx={{ mt: "-10px" }}
//               >
//                 <FormControlLabel
//                   value={0}
//                   label="New Asset"
//                   disabled={!watch("is_old_asset")}
//                   control={<Radio size="small" />}
//                 />

//                 <FormControlLabel
//                   value={1}
//                   label="Old Asset"
//                   disabled={!watch("is_old_asset")}
//                   control={<Radio size="small" />}
//                 />
//               </CustomRadioGroup>

//               <CustomTextField
//                 disabled={!parseInt(watch("is_old_asset"))}
//                 // required
//                 control={control}
//                 name="tag_number"
//                 label="Tag Number"
//                 type="text"
//                 color="secondary"
//                 size="small"
//                 error={!!errors?.tag_number?.message}
//                 helperText={errors?.tag_number?.message}
//                 fullWidth
//               />

//               <CustomTextField
//                 disabled={!parseInt(watch("is_old_asset"))}
//                 // required
//                 control={control}
//                 name="tag_number_old"
//                 type="text"
//                 label="Old Tag Number"
//                 color="secondary"
//                 size="small"
//                 error={!!errors?.tag_number_old?.message}
//                 helperText={errors?.tag_number_old?.message}
//                 fullWidth
//               />
//             </Box>

//             <Divider sx={{ margin: "15px 0" }} />

//             <Box className="editFixedAsset__textFieldSpacing">
//               <FormLabel
//                 sx={{
//                   fontWeight: "bold",
//                   color: "secondary.main",
//                   fontFamily: "Anton",
//                   fontSize: "16px",
//                 }}
//               >
//                 Set the Category
//               </FormLabel>

//               <CustomAutoComplete
//                 required
//                 disableClearable
//                 name="division_id"
//                 // disabled={data.faStatus}
//                 control={control}
//                 options={divisionData}
//                 loading={isDivisionLoading}
//                 size="small"
//                 getOptionLabel={(option) => option.division_name}
//                 isOptionEqualToValue={(option, value) =>
//                   option.division_name === value.division_name
//                 }
//                 renderInput={(params) => (
//                   <TextField
//                     color="secondary"
//                     {...params}
//                     label="Division"
//                     error={!!errors?.division_id?.message}
//                     helperText={errors?.division_id?.message}
//                   />
//                 )}
//                 onChange={(e, value) => {
//                   const filteredDivisionData = divisionData?.filter((obj) => {
//                     return obj.division_name === value.division_name;
//                   });

//                   const isIncluded =
//                     filteredDivisionData[0]?.major_category.some((category) => {
//                       return (
//                         category.id === data.major_category?.major_category_id
//                       );
//                     });

//                   if (!isIncluded) {
//                     setValue("major_category_id", null);
//                     setValue("minor_category_id", null);
//                   }
//                   return value;
//                 }}
//               />

//               <CustomAutoComplete
//                 autoComplete
//                 required
//                 disableClearable
//                 name="major_category_id"
//                 control={control}
//                 options={
//                   divisionData?.filter((obj) => {
//                     return (
//                       obj.division_name === watch("division_id")?.division_name
//                     );
//                   })[0]?.major_category || []
//                 }
//                 loading={isMajorCategoryLoading}
//                 size="small"
//                 getOptionLabel={(option) => option.major_category_name}
//                 isOptionEqualToValue={(option, value) =>
//                   option.major_category_name === value.major_category_name
//                 }
//                 renderInput={(params) => (
//                   <TextField
//                     color="secondary"
//                     {...params}
//                     label="Major Category  "
//                     error={!!errors?.major_category_id?.message}
//                     helperText={errors?.major_category_id?.message}
//                   />
//                 )}
//                 onChange={(e, value) => {
//                   const filteredMajorCatData = majorCategoryData?.filter(
//                     (obj) => {
//                       return (
//                         obj.major_category_name === value.major_category_name
//                       );
//                     }
//                   );

//                   setFilteredMinorCategoryData(
//                     filteredMajorCatData[0]?.minor_category
//                   );

//                   const isIncluded =
//                     filteredMajorCatData[0]?.minor_category.some((category) => {
//                       return (
//                         category.id === data.minor_category?.minor_category_id
//                       );
//                     });

//                   if (!isIncluded) setValue("minor_category_id", null);
//                   return value;
//                 }}
//               />

//               <CustomAutoComplete
//                 autoComplete
//                 required
//                 name="minor_category_id"
//                 control={control}
//                 options={
//                   majorCategoryData?.filter((obj) => {
//                     return (
//                       obj.major_category_name ===
//                       watch("major_category_id")?.major_category_name
//                     );
//                   })[0]?.minor_category || []
//                 }
//                 loading={isMinorCategoryLoading}
//                 size="small"
//                 getOptionLabel={(option) => option.minor_category_name}
//                 isOptionEqualToValue={(option, value) =>
//                   option.minor_category === value.minor_category
//                 }
//                 renderInput={(params) => (
//                   <TextField
//                     color="secondary"
//                     {...params}
//                     label="Minor Category  "
//                     error={!!errors?.minor_category_id?.message}
//                     helperText={errors?.minor_category_id?.message}
//                   />
//                 )}
//               />
//             </Box>

//             <Divider sx={{ margin: "15px 0" }} />

//             <Box className="editFixedAsset__textFieldSpacing">
//               <FormLabel
//                 sx={{
//                   fontWeight: "bold",
//                   color: "secondary.main",
//                   fontFamily: "Anton",
//                   fontSize: "16px",
//                 }}
//               >
//                 Chart of Accounts (COA)
//               </FormLabel>

//               <CustomAutoComplete
//                 autoComplete
//                 name="company_id"
//                 // disabled={data.faStatus}
//                 control={control}
//                 options={companyData}
//                 loading={isCompanyLoading}
//                 size="small"
//                 getOptionLabel={(option) => option.company_name}
//                 isOptionEqualToValue={(option, value) =>
//                   option.company_name === value.company_name
//                 }
//                 renderInput={(params) => (
//                   <TextField
//                     color="secondary"
//                     {...params}
//                     label="Company  "
//                     error={!!errors?.company_id?.message}
//                     helperText={errors?.company_id?.message}
//                   />
//                 )}
//               />

//               <CustomAutoComplete
//                 autoComplete
//                 name="department_id"
//                 // disabled={data.faStatus}
//                 control={control}
//                 options={departmentData}
//                 loading={isDepartmentLoading}
//                 size="small"
//                 getOptionLabel={(option) => option.department_name}
//                 isOptionEqualToValue={(option, value) =>
//                   option.department_name === value.department_name
//                 }
//                 renderInput={(params) => (
//                   <TextField
//                     color="secondary"
//                     {...params}
//                     label="Department  "
//                     error={!!errors?.department_id?.message}
//                     helperText={errors?.department_id?.message}
//                   />
//                 )}
//               />

//               <CustomAutoComplete
//                 autoComplete
//                 name="location_id"
//                 // disabled={data.faStatus}
//                 control={control}
//                 options={locationData}
//                 loading={isLocationLoading}
//                 size="small"
//                 getOptionLabel={(option) => option.location_name}
//                 isOptionEqualToValue={(option, value) =>
//                   option.location_name === value.location_name
//                 }
//                 renderInput={(params) => (
//                   <TextField
//                     color="secondary"
//                     {...params}
//                     label="Location  "
//                     error={!!errors?.location_id?.message}
//                     helperText={errors?.location_id?.message}
//                   />
//                 )}
//               />

//               <CustomAutoComplete
//                 autoComplete
//                 name="account_title_id"
//                 // disabled={data.faStatus}
//                 control={control}
//                 options={accountTitleData}
//                 loading={isAccountTitleLoading}
//                 size="small"
//                 getOptionLabel={(option) =>
//                   option.account_title_code + " - " + option.account_title_name
//                 }
//                 isOptionEqualToValue={(option, value) =>
//                   option.account_title_code === value.account_title_code
//                 }
//                 renderInput={(params) => (
//                   <TextField
//                     color="secondary"
//                     {...params}
//                     label="Account Title  "
//                     error={!!errors?.account_title_id?.message}
//                     helperText={errors?.account_title_id?.message}
//                   />
//                 )}
//               />
//             </Box>

//             <Divider sx={{ margin: "15px 0" }} />
//           </Box>

//           <div className="editFixedAsset__vr" />

//           <Box className="editFixedAsset__secondColumn">
//             <Box className="editFixedAsset__textFieldSpacing">
//               <FormLabel
//                 sx={{
//                   fontWeight: "bold",
//                   color: "secondary.main",
//                   fontFamily: "Anton",
//                   fontSize: "16px",
//                 }}
//               >
//                 Asset Information
//               </FormLabel>

//               <CustomTextField
//                 control={control}
//                 name="asset_description"
//                 label="Asset Description"
//                 type="text"
//                 color="secondary"
//                 size="small"
//                 error={!!errors?.asset_description?.message}
//                 helperText={errors?.asset_description?.message}
//                 fullWidth
//                 multiline
//               />

//               <CustomTextField
//                 control={control}
//                 name="asset_specification"
//                 label="Asset Specification"
//                 type="text"
//                 color="secondary"
//                 size="small"
//                 error={!!errors?.asset_specification?.message}
//                 helperText={errors?.asset_specification?.message}
//                 fullWidth
//                 multiline
//               />

//               <CustomAutoComplete
//                 autoComplete
//                 name="accountability"
//                 control={control}
//                 options={["Personal Issued", "Common"]}
//                 size="small"
//                 isOptionEqualToValue={(option, value) => option === value}
//                 renderInput={(params) => (
//                   <TextField
//                     color="secondary"
//                     {...params}
//                     label="Accountability  "
//                     error={!!errors?.accountability?.message}
//                     helperText={errors?.accountability?.message}
//                   />
//                 )}
//               />

//               <CustomTextField
//                 autoComplete="off"
//                 control={control}
//                 name="accountable"
//                 label="Accountable"
//                 type="text"
//                 color="secondary"
//                 size="small"
//                 error={!!errors?.accountable?.message}
//                 helperText={errors?.accountable?.message}
//                 fullWidth
//               />

//               <CustomPatternfield
//                 control={control}
//                 color="secondary"
//                 name="cellphone_number"
//                 label="Cellphone # (optional)"
//                 type="text"
//                 size="small"
//                 error={!!errors?.contact_no?.message}
//                 helperText={errors?.contact_no?.message}
//                 format="(09##) - ### - ####"
//                 valueIsNumericString
//                 fullWidth
//               />

//               <CustomTextField
//                 autoComplete="off"
//                 control={control}
//                 name="brand"
//                 label="Brand (Optional)"
//                 type="text"
//                 color="secondary"
//                 size="small"
//                 error={!!errors?.brand?.message}
//                 helperText={errors?.brand?.message}
//                 fullWidth
//               />

//               <CustomTextField
//                 autoComplete="off"
//                 control={control}
//                 name="care_of"
//                 label="Care of (optional)"
//                 type="text"
//                 color="secondary"
//                 size="small"
//                 error={!!errors?.care_of?.message}
//                 helperText={errors?.care_of?.message}
//                 fullWidth
//               />

//               <CustomTextField
//                 autoComplete="off"
//                 control={control}
//                 name="voucher"
//                 label="Voucher (optional)"
//                 type="text"
//                 color="secondary"
//                 size="small"
//                 error={!!errors?.voucher?.message}
//                 helperText={errors?.voucher?.message}
//                 fullWidth
//               />

//               <CustomTextField
//                 autoComplete="off"
//                 control={control}
//                 name="receipt"
//                 label="Reciept (optional)"
//                 type="text"
//                 color="secondary"
//                 size="small"
//                 error={!!errors?.receipt?.message}
//                 helperText={errors?.receipt?.message}
//                 fullWidth
//               />

//               <CustomNumberField
//                 autoComplete="off"
//                 control={control}
//                 name="quantity"
//                 label="Quantity"
//                 type="number"
//                 color="secondary"
//                 size="small"
//                 isAllowed={(values) => {
//                   const { floatValue } = values;
//                   return floatValue >= 1;
//                 }}
//                 error={!!errors?.quantity?.message}
//                 helperText={errors?.quantity?.message}
//                 fullWidth
//               />

//               <CustomAutoComplete
//                 autoComplete
//                 name="faStatus"
//                 control={control}
//                 options={[
//                   "Good",
//                   "For Disposal",
//                   "Disposed",
//                   "For Repair",
//                   "Spare",
//                   "Sold",
//                   "Write Off",
//                 ]}
//                 size="small"
//                 isOptionEqualToValue={(option, value) => option === value}
//                 renderInput={(params) => (
//                   <TextField
//                     color="secondary"
//                     {...params}
//                     label="Status"
//                     error={!!errors?.faStatus?.message}
//                     helperText={errors?.faStatus?.message}
//                   />
//                 )}
//               />
//             </Box>

//             <Divider sx={{ margin: "15px 0" }} />
//           </Box>

//           <div className="editFixedAsset__vr" />

//           <Box className="editFixedAsset__thirdColumn">
//             <Box className="editFixedAsset__textFieldSpacing">
//               <FormLabel
//                 sx={{
//                   fontWeight: "bold",
//                   color: "secondary.main",
//                   fontFamily: "Anton",
//                   fontSize: "16px",
//                 }}
//               >
//                 Depreciation
//               </FormLabel>

//               <CustomAutoComplete
//                 autoComplete
//                 name="depreciation_method"
//                 control={control}
//                 options={["STL", "One Time"]}
//                 size="small"
//                 renderInput={(params) => (
//                   <TextField
//                     color="secondary"
//                     {...params}
//                     label="Depreciation Method  "
//                     error={!!errors?.depreciation_method?.message}
//                     helperText={errors?.depreciation_method?.message}
//                   />
//                 )}
//               />

//               <CustomNumberField
//                 control={control}
//                 color="secondary"
//                 name="est_useful_life"
//                 label="Estimated Useful Life"
//                 type="text"
//                 size="small"
//                 error={!!errors?.est_useful_life?.message}
//                 helperText={errors?.est_useful_life?.message}
//                 isAllowed={(values) => {
//                   const { floatValue } = values;
//                   return floatValue >= 1 && floatValue <= 100;
//                 }}
//                 fullWidth
//               />

//               <CustomDatePicker
//                 control={control}
//                 name="acquisition_date"
//                 label="Acquisition Date"
//                 size="small"
//                 error={!!errors?.acquisition_date?.message}
//                 helperText={errors?.acquisition_date?.message}
//               />

//               <CustomNumberField
//                 autoComplete="off"
//                 control={control}
//                 name="acquisition_cost"
//                 label="Acquisition Cost"
//                 color="secondary"
//                 size="small"
//                 error={!!errors?.acquisition_cost?.message}
//                 helperText={errors?.acquisition_cost?.message}
//                 prefix="₱"
//                 isAllowed={(values) => {
//                   const { floatValue } = values;
//                   return floatValue >= 1;
//                 }}
//                 thousandSeparator
//                 fullWidth
//               />

//               <CustomNumberField
//                 autoComplete="off"
//                 control={control}
//                 name="age"
//                 label="Age"
//                 color="secondary"
//                 size="small"
//                 error={!!errors?.age?.message}
//                 helperText={errors?.age?.message}
//                 isAllowed={(values) => {
//                   const { floatValue } = values;
//                   return floatValue >= 1;
//                 }}
//                 thousandSeparator
//                 fullWidth
//               />

//               <CustomNumberField
//                 autoComplete="off"
//                 control={control}
//                 color="secondary"
//                 name="scrap_value"
//                 label="Scrap Value"
//                 size="small"
//                 error={!!errors?.scrap_value?.message}
//                 helperText={errors?.scrap_value?.message}
//                 prefix="₱"
//                 isAllowed={(values) => {
//                   const { floatValue } = values;
//                   return floatValue >= 1;
//                 }}
//                 thousandSeparator
//                 fullWidth
//               />

//               <CustomNumberField
//                 autoComplete="off"
//                 control={control}
//                 name="original_cost"
//                 label="Original Cost"
//                 color="secondary"
//                 size="small"
//                 error={!!errors?.original_cost?.message}
//                 helperText={errors?.original_cost?.message}
//                 prefix="₱"
//                 isAllowed={(values) => {
//                   const { floatValue } = values;
//                   return floatValue >= 1;
//                 }}
//                 thousandSeparator
//                 fullWidth
//               />

//               {/* <CustomNumberField
//                 autoComplete="off"
//                 control={control}
//                 name="accumulated_cost"
//                 label="Accumulated Cost"
//                 color="secondary"
//                 size="small"
//                 error={!!errors?.accumulated_cost?.message}
//                 helperText={errors?.accumulated_cost?.message}
//                 prefix="₱"
//                 isAllowed={(values) => {
//                   const { floatValue } = values;
//                   return floatValue >= 1;
//                 }}
//                 thousandSeparator
//                 fullWidth
//               /> */}

//               <CustomDatePicker
//                 control={control}
//                 name="start_depreciation"
//                 label="Start Depreciation"
//                 size="small"
//                 views={["month", "year"]}
//                 error={!!errors?.est_useful_life?.message}
//                 helperText={errors?.est_useful_life?.message}
//               />

//               <CustomDatePicker
//                 control={control}
//                 name="end_depreciation"
//                 label="End Depreciation"
//                 views={["month", "year"]}
//                 error={!!errors?.end_depreciation?.message}
//                 helperText={errors?.end_depreciation?.message}
//               />

//               {/* <CustomNumberField
//                 control={control}
//                 name="depreciation_per_year"
//                 label="Depreciation per Year"
//                 color="secondary"
//                 size="small"
//                 error={!!errors?.depreciation_per_year?.message}
//                 helperText={errors?.depreciation_per_year?.message}
//                 prefix="₱"
//                 isAllowed={(values) => {
//                   const { floatValue } = values;
//                   return floatValue >= 1;
//                 }}
//                 thousandSeparator
//                 fullWidth
//               />

//               <CustomNumberField
//                 control={control}
//                 name="depreciation_per_month"
//                 label="Depreciation per Month"
//                 color="secondary"
//                 size="small"
//                 error={!!errors?.depreciation_per_month?.message}
//                 helperText={errors?.depreciation_per_month?.message}
//                 prefix="₱"
//                 isAllowed={(values) => {
//                   const { floatValue } = values;
//                   return floatValue >= 1;
//                 }}
//                 thousandSeparator
//                 fullWidth
//               />

//               <CustomNumberField
//                 autoComplete="off"
//                 control={control}
//                 name="remaining_book_value"
//                 label="Remaining Book Value"
//                 color="secondary"
//                 size="small"
//                 error={!!errors?.remaining_book_value?.message}
//                 helperText={errors?.remaining_book_value?.message}
//                 prefix="₱"
//                 isAllowed={(values) => {
//                   const { floatValue } = values;
//                   return floatValue >= 1;
//                 }}
//                 thousandSeparator
//                 fullWidth
//               /> */}
//             </Box>
//           </Box>
//         </Box>
//       </Box>

//       <Box className="editFixedAsset__buttons">
//         <LoadingButton
//           type="submit"
//           variant="contained"
//           size="small"
//           loading={isUpdateLoading || isPostLoading}
//           disabled={
//             // watch("tag_number") === ("" || null) ||
//             // watch("tag_number_old") === ("" || null) ||
//             disabledItems()
//           }
//         >
//           {data.faStatus ? "Update" : "Create"}
//         </LoadingButton>

//         <Button
//           variant="outlined"
//           color="secondary"
//           size="small"
//           onClick={handleCloseDrawer}
//         >
//           Cancel
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default EditFixedAsset;
