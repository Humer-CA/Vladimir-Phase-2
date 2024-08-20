import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router";

import { useDispatch } from "react-redux";
import { openDialog, openDrawer } from "../../Redux/StateManagement/booleanStateSlice";

import { Box, IconButton, MenuItem, Menu, Fade, ListItemIcon, ListItemText } from "@mui/material";
import {
  MoreVert,
  BorderColor,
  MoveToInbox,
  RestartAlt,
  Reply,
  Delete,
  DoneOutline,
  Cancel,
  Undo,
  CancelRounded,
} from "@mui/icons-material";

const ActionMenu = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const [remarks, setRemarks] = useState("");
  // const { state: dataFA } = useLocation();

  const {
    data,
    index,
    onArchiveRestoreHandler,
    onApprovalApproveHandler,
    onSubCapexArchiveRestoreHandler,
    onApprovalReturnHandler,
    onDisposedRestoreHandler,
    onResetHandler,
    onUpdateHandler,
    onDeleteHandler,
    onVoidHandler,
    status,
    faStatus,
    setSubCapexDialog,
    openCollapse,
    hideEdit,
    hideArchive,
    showEditNav,
    showDelete,
    showVoid,
    showApprover,
    editRequestData,
    editTransferData,
    onDeleteReferenceHandler,
    // setShowEdit
    setUpdateToggle,
    setDisable,
    disableVoid,
    disableDelete,
    updateRequest,
    addRequestAllApi,
    editRequest,
    setEditRequest,
    transactionData,

    // Transfer Request
    onArchiveHandler,
    setSelectedId,

    // RR
    showCancelRr,
    handleCancelRR,
  } = props;

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleArchiveRestore = () => {
    onArchiveRestoreHandler(data?.id, status);
    handleClose();
  };

  const handleArchiveTransfer = () => {
    onArchiveRestoreHandler(data);
    handleClose();
  };

  const handleApprovalStatus = () => {
    if (data?.transaction_number) {
      onApprovalApproveHandler(data?.transaction_number, status);
    }
    if (data?.transfer_number) {
      onApprovalApproveHandler(data?.transfer_number, status);
    }
    handleClose();
  };

  const handleReturnStatus = () => {
    if (data?.transaction_number) {
      onApprovalReturnHandler(data?.transaction_number, status);
    }
    if (data?.transfer_number) {
      onApprovalReturnHandler(data?.transfer_number, status);
    }
    handleClose();
  };

  const handleDelete = () => {
    onDeleteHandler(data?.id || data?.subunit?.id || data);
    handleClose();
  };

  const handleVoid = () => {
    onVoidHandler(data?.transaction_number);
    handleClose();
  };

  const handleDeleteReference = () => {
    onDeleteReferenceHandler({
      transaction_number: data?.transaction_number,
      reference_number: data?.reference_number,
    });
    handleClose();
  };

  // const handleDisposedRestore = () => {
  //   onDisposedRestoreHandler(data?.id);
  //   handleClose();
  // };

  const handleRestoreFA = () => {
    onDisposedRestoreHandler(data?.id);
    handleClose();
  };

  const handleReset = () => {
    onResetHandler(data?.id);
    handleClose();
  };

  const handleEdit = () => {
    // console.log(data);
    onUpdateHandler(data);
    dispatch(openDrawer() || openDialog());
    handleClose();
  };

  const handleEditRequest = () => {
    // console.log(data);
    addRequestAllApi ? setEditRequest(true) : setEditRequest(false);
    onUpdateHandler(data);
    setUpdateToggle(false);
    handleClose();
    setDisable(false);
    setSelectedId(index);
  };

  const handleEditTransfer = () => {
    // console.log(data);
    onUpdateHandler(data);
    dispatch(openDrawer() || openDialog());
    handleClose();
  };

  const handleEditNav = () => {
    navigate(`add-requisition`);
    onUpdateHandler(data);
  };

  const handleSubCapexEdit = () => {
    onUpdateHandler(data);
    setSubCapexDialog(true);
    handleClose();
  };

  const renderMenuItem = (text, icon, onClick) => (
    <MenuItem onClick={onClick} dense>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText disableTypography align="left">
        {text}
      </ListItemText>
    </MenuItem>
  );

  const handleCancelRr = () => {
    handleCancelRR(data);
  };

  return (
    <Box>
      <IconButton onClick={handleOpen}>
        <MoreVert sx={openCollapse ? { color: "white" } : null} />
      </IconButton>
      {status ? (
        <Menu
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          TransitionComponent={Fade}
          disablePortal
        >
          {status === "active" && !hideEdit && (
            <MenuItem onClick={!showEditNav ? handleEdit : handleEditNav} dense>
              <ListItemIcon>
                <BorderColor />
              </ListItemIcon>
              <ListItemText disableTypography align="left">
                Edit
              </ListItemText>
            </MenuItem>
          )}

          {editRequestData && (
            <MenuItem onClick={handleEditRequest} dense>
              <ListItemIcon>
                <BorderColor />
              </ListItemIcon>
              <ListItemText disableTypography align="left">
                Edit
              </ListItemText>
            </MenuItem>
          )}

          {editTransferData && (
            <MenuItem onClick={handleEditTransfer} dense>
              <ListItemIcon>
                <BorderColor />
              </ListItemIcon>
              <ListItemText disableTypography align="left">
                Edit
              </ListItemText>
            </MenuItem>
          )}

          {setSubCapexDialog && status === "active" && (
            <MenuItem onClick={handleSubCapexEdit} dense>
              <ListItemIcon>
                <BorderColor />
              </ListItemIcon>
              <ListItemText disableTypography align="left">
                Edit
              </ListItemText>
            </MenuItem>
          )}

          {!hideArchive && (
            <MenuItem onClick={handleArchiveRestore} dense>
              <ListItemIcon>{status === "active" ? <MoveToInbox /> : <Reply />}</ListItemIcon>
              <ListItemText disableTypography align="left">
                {status === "active" ? "Archive" : "Restore"}
              </ListItemText>
            </MenuItem>
          )}

          {data?.transfer_number && (
            <MenuItem onClick={handleArchiveTransfer} dense>
              <ListItemIcon>{status !== "Cancelled" ? <MoveToInbox /> : <Reply />}</ListItemIcon>
              <ListItemText disableTypography align="left">
                {status !== "Cancelled" ? "Archive" : "Restore"}
              </ListItemText>
            </MenuItem>
          )}

          {showVoid && (
            <MenuItem onClick={handleVoid} dense disabled={disableVoid}>
              <ListItemIcon>
                <Cancel />
              </ListItemIcon>
              <ListItemText disableTypography align="left">
                Void
              </ListItemText>
            </MenuItem>
          )}

          {(showDelete || onDeleteHandler) && (
            <MenuItem onClick={handleDelete} dense>
              <ListItemIcon>
                <Delete />
              </ListItemIcon>
              <ListItemText disableTypography align="left">
                Delete
              </ListItemText>
            </MenuItem>
          )}

          {onDeleteReferenceHandler && (
            <MenuItem onClick={handleDeleteReference} dense disabled={disableDelete}>
              <ListItemIcon>
                <Delete />
              </ListItemIcon>
              <ListItemText disableTypography align="left">
                Delete
              </ListItemText>
            </MenuItem>
          )}

          {status === "active" && onResetHandler !== undefined && (
            <MenuItem onClick={handleReset} dense>
              <ListItemIcon>
                <RestartAlt />
              </ListItemIcon>
              <ListItemText disableTypography align="left">
                Reset
              </ListItemText>
            </MenuItem>
          )}
        </Menu>
      ) : (
        // Fixed Asset
        <Menu
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          TransitionComponent={Fade}
          disablePortal
        >
          {faStatus !== "Disposed" && !hideEdit && (
            <MenuItem onClick={handleEdit} dense>
              <ListItemIcon>
                <BorderColor />
              </ListItemIcon>
              <ListItemText disableTypography align="left">
                Edit
              </ListItemText>
            </MenuItem>
          )}

          {/* {handleDisposedRestore && (
            <MenuItem onClick={handleDisposedRestore} dense>
              <ListItemIcon>
                {faStatus === "Disposed" ? <Reply /> : <RemoveCircleOutline />}
              </ListItemIcon>
              <ListItemText
                disableTypography
                align="left"
                onClick={handleRestoreFA}
              >
                {faStatus === "Disposed" ? "Restore" : "Dispose"}
              </ListItemText>
            </MenuItem>
          )} */}

          {onArchiveHandler && (
            <MenuItem onClick={handleDelete} dense>
              <ListItemIcon>
                <Delete />
              </ListItemIcon>
              <ListItemText disableTypography align="left">
                Delete
              </ListItemText>
            </MenuItem>
          )}
        </Menu>
      )}

      {showApprover && (
        <Menu
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          TransitionComponent={Fade}
          disablePortal
        >
          <MenuItem onClick={handleApprovalStatus} dense>
            <ListItemIcon>
              <DoneOutline />
            </ListItemIcon>
            <ListItemText disableTypography align="left">
              Approve
            </ListItemText>
          </MenuItem>

          <MenuItem onClick={handleReturnStatus} dense>
            <ListItemIcon>
              <Undo />
            </ListItemIcon>
            <ListItemText disableTypography align="left">
              Return
            </ListItemText>
          </MenuItem>
        </Menu>
      )}

      {showCancelRr && (
        <Menu
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          TransitionComponent={Fade}
          disablePortal
        >
          <MenuItem onClick={handleCancelRr} dense>
            <ListItemIcon>
              <CancelRounded />
            </ListItemIcon>
            <ListItemText disableTypography align="left">
              Cancel
            </ListItemText>
          </MenuItem>
        </Menu>
      )}
    </Box>
  );
};

export default ActionMenu;
