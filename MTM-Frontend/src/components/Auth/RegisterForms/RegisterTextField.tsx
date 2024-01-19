import { TextField } from "@mui/material";
import { Controller, set } from "react-hook-form";
import { useState } from "react";
import { FeedbackType, feedback } from "./RegisterFeedback";

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
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onBlur, ...restField } }) => (
        <TextField
          placeholder={placeHolder}
          type="text"
          fullWidth
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
                whiteSpace: "pre-wrap",
              },
            },
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
  );
};
