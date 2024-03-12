import { TextField as MuiTextField, Typography } from "@mui/material";
import { Controller } from "react-hook-form";

const CustomTextField = (props) => {
  const { name, control, onChange: onValueChange, errors, validateText = true, ...textfield } = props;

  const validateInput = (value) => {
    const regex = /^[a-zA-Z0-9-\s+&,]*$/g;
    return regex.test(value);
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const { ref, value, onChange: setValue } = field;

        return (
          <>
            <MuiTextField
              {...textfield}
              autoComplete="off"
              inputRef={ref}
              value={value}
              size="small"
              color="secondary"
              onChange={(e) => {
                const inputValue = e.target.value;

                if (validateText) {
                  if (!validateInput(inputValue)) return;
                }
                if (onValueChange) return setValue(onValueChange(inputValue.replace(/\s+/g, " ")));
                setValue(inputValue.replace(/\s+/g, " "));
              }}
              sx={{
                ".MuiInputBase-root": {
                  borderRadius: "12px",
                  minWidth: "180px",
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

export default CustomTextField;
