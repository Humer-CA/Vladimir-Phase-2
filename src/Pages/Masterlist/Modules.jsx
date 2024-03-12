import React, { useState } from "react";
import Moment from "moment";
import MasterlistToolbar from "../../Components/Reusable/MasterlistToolbar";
import ActionMenu from "../../Components/Reusable/ActionMenu";
import ErrorFetching from "../ErrorFetching";
import AddModules from "./AddEdit/AddModules";

// RTK
import { useDispatch, useSelector } from "react-redux";
import { openToast } from "../../Redux/StateManagement/toastSlice";
import { openConfirm, closeConfirm, onLoading } from "../../Redux/StateManagement/confirmSlice";
import { usePostModuleStatusApiMutation, useGetModulesApiQuery } from "../../Redux/Query/ModulesApi";

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
import { Help, ReportProblem } from "@mui/icons-material";
import MasterlistSkeleton from "../Skeleton/MasterlistSkeleton";

const Modules = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("active");
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [updateModule, setUpdateModule] = useState({
    status: false,
    id: null,
    module_name: "",
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
    data: modules,
    isLoading: modulesLoading,
    isSuccess: modulesSuccess,
    isError: modulesError,
    error: errorData,
    refetch,
  } = useGetModulesApiQuery(
    {
      page: page,
      per_page: perPage,
      status: status,
      search: search,
    },
    { refetchOnMountOrArgChange: true }
  );

  const [postModuleStatusApi, { isLoading }] = usePostModuleStatusApiMutation();

  const dispatch = useDispatch();

  const onArchiveRestoreHandler = async (id) => {
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
            const result = await postModuleStatusApi({
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
    const { id, module_name } = props;
    setUpdateModule({
      status: true,
      id: id,
      module_name: module_name,
    });
  };

  const onUpdateResetHandler = () => {
    setUpdateModule({
      status: false,
      id: null,
      module_name: "",
    });
  };

  const onSetPage = () => {
    setPage(1);
  };

  return (
    <Box className="mcontainer">
      <Typography className="mcontainer__title" sx={{ fontFamily: "Anton", fontSize: "2rem" }}>
        Modules
      </Typography>

      {modulesLoading && <MasterlistSkeleton onAdd={true} />}

      {modulesError && <ErrorFetching refetch={refetch} error={errorData} />}

      {modules && !modulesError && (
        <>
          <Box className="mcontainer__wrapper">
            <MasterlistToolbar path="#" onStatusChange={setStatus} onSearchChange={setSearch} onSetPage={setPage} />

            <Box>
              <TableContainer className="mcontainer__th-body">
                <Table className="mcontainer__table" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell className="tbl-cell">Id</TableCell>

                      <TableCell className="tbl-cell">Module</TableCell>

                      <TableCell className="tbl-cell">Status</TableCell>

                      <TableCell className="tbl-cell">Date Created</TableCell>

                      <TableCell className="tbl-cell">Action</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {modulesSuccess &&
                      modules.data?.map((modules) => (
                        <TableRow
                          key={modules.id}
                          sx={{
                            "&:last-child td, &:last-child th": {
                              borderBottom: 0,
                            },
                          }}
                        >
                          <TableCell className="tbl-cell">{modules.id}</TableCell>

                          <TableCell className="tbl-cell text-weight">{modules.module_name}</TableCell>

                          <TableCell className="tbl-cell">
                            {modules.is_active ? (
                              <Typography
                                color="success.main"
                                sx={{
                                  px: 1,
                                  maxWidth: "10ch",
                                  margin: "0 auto",
                                  fontSize: "13px",
                                  background: "#26f57c2a",
                                  borderRadius: "8px",
                                }}
                              >
                                ACTIVE
                              </Typography>
                            ) : (
                              <Typography
                                align="center"
                                color="errorColor.main"
                                sx={{
                                  px: 1,
                                  maxWidth: "10ch",
                                  margin: "0 auto",
                                  fontSize: "13px",
                                  background: "#fc3e3e34",
                                  borderRadius: "8px",
                                }}
                              >
                                INACTIVE
                              </Typography>
                            )}
                          </TableCell>

                          <TableCell className="tbl-cell">
                            {Moment(modules.created_at).format("MMM DD, YYYY")}
                          </TableCell>

                          <TableCell className="tbl-cell ">
                            <ActionMenu
                              status={status}
                              data={modules}
                              onUpdateHandler={onUpdateHandler}
                              onArchiveRestoreHandler={onArchiveRestoreHandler}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            <Box className="mcontainer__pagination">
              <TablePagination
                rowsPerPageOptions={[5, 10, 15, { label: "All", value: parseInt(modules?.total) }]}
                component="div"
                count={modulesSuccess ? modules.total : 0}
                page={modulesSuccess ? modules.current_page - 1 : 0}
                rowsPerPage={modulesSuccess ? parseInt(modules?.per_page) : 5}
                onPageChange={pageHandler}
                onRowsPerPageChange={perPageHandler}
              />
            </Box>
          </Box>
        </>
      )}

      <Dialog open={drawer} PaperProps={{ sx: { borderRadius: "10px" } }}>
        <AddModules data={updateModule} onUpdateResetHandler={onUpdateResetHandler} />
      </Dialog>
    </Box>
  );
};

export default Modules;
