import { Controller } from "react-hook-form";
import { Autocomplete as MuiAutocomplete, TextField } from "@mui/material";

const CustomAutoComplete = ({ name, control, onChange: onValueChange, ...autocomplete }) => {
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
            sx={{
              ".MuiInputBase-root": {
                borderRadius: "12px",
                // backgroundColor: "white",
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
