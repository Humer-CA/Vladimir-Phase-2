import React from "react";

import { Controller } from "react-hook-form";
import { TextField } from "@mui/material";
import { NumericFormat } from "react-number-format";

const CustomNumberField = ({ name, control, optional, keepPrefix = false, ...numberfield }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const { value = null, onChange } = field;

        return (
          <NumericFormat
            {...numberfield}
            autoComplete="off"
            customInput={TextField}
            value={value}
            size="small"
            color="secondary"
            onValueChange={(data) => {
              if (!data.value) return onChange(null);

              if (keepPrefix) return onChange(data.formattedValue);

              onChange(Number(data.value));
            }}
            sx={{
              overscrollBehavior: "contain",
              ".MuiInputBase-root": {
                borderRadius: "10px",
              },

              ".MuiOutlinedInput-notchedOutline": {
                bgcolor: optional ? null : "#f5c9861c",
                border: optional ? "1px dashed lightgray" : null,
              },

              ".MuiInputLabel-root.Mui-disabled": {
                backgroundColor: "transparent",
              },

              ".Mui-disabled": {
                backgroundColor: "background.light",
                borderRadius: "10px",
              },
            }}
          />
        );
      }}
    />
  );
};

export default CustomNumberField;
