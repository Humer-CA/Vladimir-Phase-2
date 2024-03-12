import moment from "moment";

import { Controller } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const CustomDatePicker = ({ name, control, onChange: onValueChange, error, helperText, fullWidth, ...datepicker }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const { value, onChange: setValue } = field;

        return (
          <DatePicker
            {...datepicker}
            value={value}
            onChange={(value) => {
              // if (!moment(value).isValid()) return;

              if (onValueChange) return setValue(onValueChange(value));

              setValue(value);
            }}
            slotProps={{
              textField: {
                size: "small",
                error: error,
                helperText: helperText,
                sx: {
                  minWidth: "180px",
                  "& .Mui-focused.MuiFormLabel-root": {
                    color: "secondary.main",
                  },

                  "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#344955!important",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderRadius: "10px",
                  },
                  ".Mui-disabled": {
                    backgroundColor: "background.light",
                    borderRadius: "12px",
                  },
                },
                fullWidth,
              },
            }}
          />
        );
      }}
    />
  );
};

export default CustomDatePicker;
