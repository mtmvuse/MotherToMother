import { useState } from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Controller } from "react-hook-form";
import { FormHelperText } from "@mui/material";
import {
  type PasswordRequirementsType,
  passwordRequirements,
  type FeedbackType,
  feedback,
} from "./RegisterFeedback";

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
  const [currValue, setCurrValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, onBlur, value, ...restField } }) => (
          <TextField
            value={currValue}
            onChange={(e) => {
              onChange(e);
              setCurrValue(e.target.value);
            }}
            placeholder={placeHolder}
            fullWidth
            type={showPassword ? "text" : "password"}
            variant="standard"
            size="small"
            margin="none"
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...restField}
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
            error={!!errors}
            helperText={
              errors
                ? errors.message
                : isFocused
                ? feedback[name as keyof FeedbackType]
                : ""
            }
          />
        )}
      />

      {isFocused && name === "password" && (
        <FormHelperText
          sx={{
            fontWeight: "bold",
            marginTop: "-0.05rem",
            color: "grey",

            fontSize: "0.6rem",
          }}
        >
          {Object.keys(passwordRequirements).map((regex) => {
            const regexObject = new RegExp(regex);

            return `${regexObject.test(currValue) ? "✅" : "❌"} ${
              passwordRequirements[regex as keyof PasswordRequirementsType]
            }\n`;
          })}
        </FormHelperText>
      )}
    </>
  );
};
