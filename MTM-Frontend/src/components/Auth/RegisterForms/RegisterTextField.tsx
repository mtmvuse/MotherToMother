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
          placeholder={placeHolder}
          type="text"
          fullWidth
          variant="standard"
          size="small"
          margin="none"
          InputProps={{
            inputProps: {
              style: {
                padding: "0px",
                margin: "1rem 0rem 0rem 0rem",
                fontFamily: "Raleway, sans-serif",
                fontStyle: "italic",
                color: "var(--mtmLightgray)",
              },
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
