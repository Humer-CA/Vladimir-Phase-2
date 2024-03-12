import React from "react";

import { Controller } from "react-hook-form";
import { TextField } from "@mui/material";
import { PatternFormat } from "react-number-format";

const CustomPatternField = ({ name, control, keepPrefix = false, ...patternfield }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const { value = null, onChange } = field;

        return (
          <PatternFormat
            {...patternfield}
            autoComplete="off"
            customInput={TextField}
            value={value}
            onValueChange={(data) => {
              if (!data.value) return onChange(null);

              if (keepPrefix) return onChange(data.formattedValue);

              onChange(data.value);
            }}
            size="small"
            color="secondary"
            sx={{
              ".MuiInputBase-root": { borderRadius: "12px" },
              ".MuiInputLabel-root.Mui-disabled": {
                backgroundColor: "transparent",
              },

              ".Mui-disabled": {
                backgroundColor: "background.light",
                borderRadius: "12px",
              },
            }}
          />
        );
      }}
    />
  );
};

export default CustomPatternField;
