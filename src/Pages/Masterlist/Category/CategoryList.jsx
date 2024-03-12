import React, { useState } from "react";
import Moment from "moment";
import MasterlistToolbar from "../../../Components/Reusable/MasterlistToolbar";
import ActionMenu from "../../../Components/Reusable/ActionMenu";
import AddCategoryList from "../AddEdit/AddCategoryList";
import CustomTableCollapse from "../../../Components/Reusable/CustomTableCollapse";

// RTK
import { useDispatch, useSelector } from "react-redux";
import { openToast } from "../../../Redux/StateManagement/toastSlice";
import { closeConfirm, openConfirm, onLoading } from "../../../Redux/StateManagement/confirmSlice";
import {
  useGetCategoryListApiQuery,
  usePutCategoryListStatusApiMutation,
} from "../../../Redux/Query/Masterlist/Category/CategoryList";

// MUI
import {
  Box,
  Dialog,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { ExpandCircleDownOutlined, Help, ReportProblem } from "@mui/icons-material";
import MasterlistSkeleton from "../../Skeleton/MasterlistSkeleton";
import ErrorFetching from "../../ErrorFetching";

const CategoryList = () => {
  const category = true;
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("active");
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [updateCategoryList, setUpdateCategoryList] = useState({
    status: false,
    action: "", // updateCategory || addMinor
    id: null,
    service_provider_id: null,
    major_category_id: null,
    minor_category_id: [],
  });

  const drawer = useSelector((state) => state.booleanState.drawer);

  const perPageHandler = (e) => {
    setPage(1);
    setPerPage(parseInt(e.target.value));
  };

  const pageHandler = (_, page) => {
    // console.log(page + 1);
    setPage(page + 1);
  };

  const {
    data: categoryListData,
    isLoading: categoryListLoading,
    isSuccess: categoryListSuccess,
    isError: categoryListError,
    error: errorData,
    refetch,
  } = useGetCategoryListApiQuery(
    {
      page: page,
      per_page: perPage,
      status: status,
      search: search,
    },
    { refetchOnMountOrArgChange: true }
  );

  const [putCategoryListStatusApi, { isLoading }] = usePutCategoryListStatusApiMutation();

  const dispatch = useDispatch();

  const onArchiveRestoreHandler = (id) => {
    dispatch(
      openConfirm({
        icon: status === "active" ? ReportProblem : Help,
        message: (
          <Box>
            <Typography> Are you sure you want to</Typography>
            <Typography
              sx={{
                display: "inline-block",
                color: "secondary.main",
                fontWeight: "bold",
                fontFamily: "Raleway",
              }}
            >
              {status === "active" ? "ARCHIVE" : "ACTIVATE"}
            </Typography>{" "}
            this data?
          </Box>
        ),

        onConfirm: async () => {
          try {
            dispatch(onLoading());
            const result = await putCategoryListStatusApi({
              id: id,
              status: status === "active" ? false : true,
            }).unwrap();

            dispatch(
              openToast({
                message: result.message,
                duration: 5000,
              })
            );
            dispatch(closeConfirm());
          } catch (err) {
            console.log(err.message);
          }
        },
      })
    );
  };

  const onUpdateHandler = (props) => {
    const { id, service_provider, major_category, category_list_tag } = props;
    setUpdateCategoryList({
      status: true,
      action: "updateCategory",

      id: id,
      service_provider_id: service_provider,
      major_category_id: major_category,
      minor_category_id: category_list_tag?.map((item) => {
        return item.minor_category;
      }),
    });
  };

  const onUpdateResetHandler = () => {
    setUpdateCategoryList({
      status: false,
      id: null,
      service_provider_id: null,
      major_category_id: null,
      minor_category_id: [],
    });
  };

  const onAddMinorCategoryHandler = (props) => {
    const { id, service_provider, major_category, category_list_tag } = props;
    setUpdateCategoryList({
      status: true,
      action: "addMinor",

      id: id,
      service_provider_id: service_provider,
      major_category_id: major_category,
      minor_category_id: category_list_tag?.map((item) => {
        return item.minor_category;
      }),
    });
  };

  const onSetPage = () => {
    setPage(1);
  };

  return (
    <>
      {categoryListLoading && <MasterlistSkeleton category={category} />}

      {categoryListError && <ErrorFetching refetch={refetch} error={errorData} />}

      {categoryListData && !categoryListError && (
        <Box className="mcontainer__wrapper">
          <MasterlistToolbar
            path="#"
            onStatusChange={setStatus}
            onSearchChange={setSearch}
            onSetPage={setPage}
            onAdd={() => {}}
          />

          <TableContainer className="mcontainer__th-body-category">
            <Table className="mcontainer__table" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell className="tbl-cell">
                    <ExpandCircleDownOutlined />
                  </TableCell>

                  <TableCell className="tbl-cell">Service Provider</TableCell>

                  <TableCell className="tbl-cell">Category</TableCell>

                  <TableCell className="tbl-cell">Status</TableCell>

                  <TableCell className="tbl-cell">Date Created</TableCell>

                  <TableCell className="tbl-cell">Action</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {categoryListData &&
                  categoryListData.data?.map((data) => (
                    <CustomTableCollapse
                      key={data.id}
                      data={data}
                      status={status}
                      onUpdateHandler={onUpdateHandler}
                      onArchiveRestoreHandler={onArchiveRestoreHandler}
                      onAddMinorCategoryHandler={onAddMinorCategoryHandler}
                    />
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box className="mcontainer__pagination">
            <TablePagination
              rowsPerPageOptions={[
                5,
                10,
                15,
                {
                  label: "All",
                  value: parseInt(categoryListData?.total),
                },
              ]}
              component="div"
              count={categoryListSuccess ? categoryListData.total : 0}
              page={categoryListSuccess ? categoryListData.current_page - 1 : 0}
              rowsPerPage={categoryListSuccess ? parseInt(categoryListData?.per_page) : 5}
              onPageChange={pageHandler}
              onRowsPerPageChange={perPageHandler}
            />
          </Box>

          <Dialog open={drawer} onClose={() => {}}>
            <AddCategoryList data={updateCategoryList} onUpdateResetHandler={onUpdateResetHandler} />
          </Dialog>
        </Box>
      )}
    </>
  );
};

export default CategoryList;
