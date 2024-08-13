import { Controller } from "react-hook-form";
import { InputAdornment, Autocomplete as MuiAutocomplete, Stack, TextField } from "@mui/material";

const CustomAutoComplete = ({ name, control, optional, onChange: onValueChange, onOpen, ...autocomplete }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const { value, onChange: setValue } = field;

        return (
          <MuiAutocomplete
            {...autocomplete}
            value={value}
            onChange={(e, value) => {
              if (onValueChange) return setValue(onValueChange(e, value));
              setValue(value);
            }}
            size="small"
            color="secondary"
            onOpen={onOpen}
            sx={{
              ".MuiInputBase-root": {
                borderRadius: "10px",
                // backgroundColor: "white",
              },

              ".MuiOutlinedInput-notchedOutline": {
                // bgcolor: optional ? null : "#ff9d4c0c",
                border: optional ? "1px dashed #c7c7c742" : null,
              },

              ".MuiInputLabel-root.Mui-disabled": {
                backgroundColor: "transparent",
              },

              ".Mui-disabled": {
                backgroundColor: "background.light",
              },
            }}
          />
        );
      }}
    />
  );
};

export default CustomAutoComplete;
