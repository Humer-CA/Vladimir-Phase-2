import React from "react";
import { Box, Skeleton } from "@mui/material";

const MasterlistSkeleton = (props) => {
  const { onImport, onAdd, onPrint, onSync, category } = props;
  // console.log(category);

  return (
    <>
      <Box
        className="mcontainer__wrapper"
        sx={{ position: "relative", flexWrap: "wrap" }}
      >
        <Box sx={{ display: "flex", position: "relative" }}>
          {Boolean(onAdd) && (
            <Skeleton
              variant={"rounded"}
              width="70px"
              height="33px"
              sx={{
                position: "absolute",
                top: "-45px",
                right: "5px",
                gap: "10px",
              }}
            />
          )}

          {Boolean(onPrint) && (
            <Skeleton
              variant={"rounded"}
              width="90px"
              height="33px"
              sx={{
                position: "absolute",
                top: "-45px",
                right: "195px",
                gap: "10px",
              }}
            />
          )}

          {Boolean(onSync) && (
            <Skeleton
              variant={"rounded"}
              width="120px"
              height="33px"
              sx={{
                position: "absolute",
                top: "-45px",
                right: "5px",
                gap: "10px",
              }}
            />
          )}

          {Boolean(onImport) && (
            <Skeleton
              variant={"rounded"}
              width="100px"
              height="33px"
              sx={{
                position: "absolute",
                top: "-45px",
                right: "86px",
                gap: "10px",
              }}
            />
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 20px",
            gap: "20px",
          }}
        >
          <Skeleton variant={"rounded"} width="120px" height="40px" />
          <Skeleton variant={"rounded"} width="220px" height="40px" />
        </Box>

        <Box sx={{ padding: "5px 20px" }}>
          <Skeleton
            variant={"rounded"}
            height="40px"
            sx={{ marginBottom: "10px" }}
          />
          <Skeleton variant={"rounded"} height={category ? "41vh" : "48vh"} />
        </Box>

        <Box sx={{ padding: "5px 20px 10px" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Skeleton variant={"rounded"} width="100px" height="35px" />

            <Skeleton variant={"rounded"} width="300px" height="35px" />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default MasterlistSkeleton;
