import { CheckBox as MuiCheckBox } from "@mui/icons-material";
import { Controller } from "react-hook-form";

const CustomCheckbox = (props) => {
  const { name, control, label, getValues, setValue, onChange } = props;

  return (
    <Controller
      name={name}
      render={({ field }) => {
        const { onChange, value, ...rest } = field;

        return (
          <>
            <FormControlLabel
              control={
                <MuiCheckBox
                  value={value}
                  label={label}
                  checked
                  onChange={(e) => {
                    if (e.target.checked) {
                      const permissions = getValues("access_permission");
                      permissions.push(e.target.value);
                      onChange(permissions);
                    } else {
                      const permissions = getValues("access_permission");

                      setValue(
                        "access_permission",
                        permissions.filter((perm) => perm != e.target.value)
                      );
                    }
                  }}
                />
              }
            />
          </>
        );
      }}
    />
  );
};

export default CustomCheckbox;
