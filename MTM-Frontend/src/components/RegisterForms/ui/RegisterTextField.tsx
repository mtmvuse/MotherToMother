import { TextField } from "@mui/material";
import { Controller } from "react-hook-form";

interface InputProps {
  name: string;
  placeHolder: string;
  control: any;
  errors: any;
}

export const RegisterTextField: React.FC<InputProps> = ({
  name,
  placeHolder,
  control,
  errors,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          label={placeHolder}
          type="text"
          fullWidth
          margin="normal"
          variant="outlined"
          InputProps={{
            style: {
              borderRadius: "100px",
            },
          }}
          {...field}
          error={!!errors}
          helperText={errors ? errors.message : ""}
        />
      )}
    />
  );
};
