import React from "react";
import { Box, TableCell, TableRow, Typography } from "@mui/material";
import ImgNoRecordsFound from "../Img/SVG/ImgNoRecordsFound.svg";

const NoRecordsFound = (props) => {
  const { heightData } = props;

  let heightVh = heightData;
  switch (heightVh) {
    case "xs":
      heightVh = "calc(100vh - 860px)";
      break;
    case "small":
      heightVh = "calc(100vh - 450px)";
      break;
    case "medium":
      heightVh = "calc(100vh - 400px)";
      break;
    default:
      heightVh = "100%";
  }

  return (
    <>
      <TableRow>
        <TableCell
          className="centeredTableCell"
          colSpan={999}
          rowSpan={999}
          sx={{
            borderBottom: "none",
            height: heightVh,
          }}
        >
          <Box
            className="noRecordsFoundImg"
            sx={{
              position: "sticky",
              left: "calc(50% - (250px / 2))",
              minHeight: "150px",
              height: "200px",
              width: "250px",
              background: `url(${ImgNoRecordsFound}) center / contain no-repeat`,
            }}
          />
        </TableCell>
      </TableRow>
    </>
  );
};

export default NoRecordsFound;
