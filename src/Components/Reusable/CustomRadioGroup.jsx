import { RadioGroup } from "@mui/material";
import { Controller } from "react-hook-form";

const CustomRadioGroup = ({
  name,
  control,
  onChange: onValueChange,
  children,
  ...radiobutton
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const { value, onChange: setValue } = field;

        return (
          <RadioGroup {...radiobutton} value={value} onChange={setValue}>
            {children}
          </RadioGroup>
        );
      }}
    />
  );
};

export default CustomRadioGroup;
