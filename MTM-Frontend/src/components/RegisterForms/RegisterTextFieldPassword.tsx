import { useState } from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Controller } from "react-hook-form";

interface InputProps {
  name: string;
  placeHolder: string;
  control: any;
  errors: any;
}

export const RegisterTextFieldPassword: React.FC<InputProps> = ({
  name,
  placeHolder,
  control,
  errors,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          placeholder={placeHolder}
          fullWidth
          type={showPassword ? "text" : "password"}
          variant="standard"
          size="small"
          margin="none"
          InputProps={{
            inputProps: {
              style: {
                padding: "0px",
                margin: "1rem 0rem 0rem 0rem",
              },
            },
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          {...field}
          error={!!errors}
          helperText={errors ? errors.message : ""}
        />
      )}
    />
  );
};
