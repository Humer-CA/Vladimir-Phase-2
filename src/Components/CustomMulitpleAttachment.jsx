import { InputAdornment, TextField as MuiTextField, Typography } from "@mui/material";
import { Controller } from "react-hook-form";
import AttachmentIcon from "../Img/SVG/SVG/Attachment.svg";
import AttachmentActive from "../Img/SVG/SVG/AttachmentActive.svg";
import AttachmentError from "../Img/SVG/SVG/AttachmentError.svg";
import { useRef, useState } from "react";

const CustomMultipleAttachment = (props) => {
  const { name, control, errors, inputRef, multiple, ...textfield } = props;
  const [fileUpload, setFileUpload] = useState(0);
  const fileInputRef = useRef(null);

  const handleSelectedFile = (e) => {
    const files = Array.from(e.target.files);
    // console.log("Selected Files:", files);
    const statusStep = 100 / files.length;
    const fileList = files.map((file) => file);
    return fileList;
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const { value, onChange: setValue } = field;

        console.log("Value before:", value);

        return (
          <>
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                const fileList = handleSelectedFile(e);
                setValue(fileList);
                // console.log("Value after:", fileList);
              }}
              style={{ display: "none" }}
              multiple
            />

            <MuiTextField
              {...textfield}
              readOnly
              type="text"
              size="small"
              autoComplete="off"
              color="secondary"
              value={value ? `${value.length} file(s) selected` : "No file chosen"}
              onClick={() => {
                fileInputRef.current.click();
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <img
                      src={
                        textfield.error
                          ? AttachmentError
                          : value && value.length > 0
                          ? AttachmentActive
                          : AttachmentIcon
                      }
                      width="20px"
                    />
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                ".MuiInputBase-root": {
                  borderRadius: "12px",
                  color: textfield.error ? "red" : "#636363",
                },
                ".MuiInputLabel-root.Mui-disabled": {
                  backgroundColor: "transparent",
                },

                ".Mui-disabled": {
                  backgroundColor: "background.light",
                  borderRadius: "12px",
                },
              }}
            />
            {errors && <Typography sx={{ color: "blue" }}>{errors}</Typography>}
          </>
        );
      }}
    />
  );
};

export default CustomMultipleAttachment;
