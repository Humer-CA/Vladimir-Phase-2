const onArchiveRestoreHandler = async (id) => {
  dispatch(
    openConfirm({
      icon: status === "active" ? ReportProblem : Help,
      iconColor: status === "active" ? "alert" : "info",
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
          const result = await postTypeOfRequestStatusApi({
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
          if (err?.status === 422) {
            dispatch(
              openToast({
                message: err.data.errors?.detail,
                duration: 5000,
                variant: "error",
              })
            );
          } else if (err?.status !== 422) {
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
