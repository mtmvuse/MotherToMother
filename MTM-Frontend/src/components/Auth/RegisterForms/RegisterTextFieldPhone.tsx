import { TextField } from "@mui/material";
import { Controller } from "react-hook-form";
import { useState } from "react";
import { type FeedbackType, feedback } from "./RegisterFeedback";

interface InputProps {
  name: string;
  placeHolder: string;
  control: any;
  errors: any;
}

export const RegisterTextFieldPhone: React.FC<InputProps> = ({
  name,
  placeHolder,
  control,
  errors,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [currPhone, setCurrPhone] = useState("");

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handlePhoneFormat = (value: string) => {
    const numericValue = value.replace(/[^0-9\.]+/g, "");
    const length = numericValue.length;
    const areaCode = () => `(${numericValue.slice(0, 3)})`;
    const firstSix = () => `${areaCode()} ${numericValue.slice(3, 6)}`;
    const trailer = (start: number) => `${numericValue.slice(start, length)}`;

    let formattedNumber = "";
    if (length <= 3) {
      formattedNumber = numericValue;
    } else if (length >= 4 && length <= 6) {
      formattedNumber = `${areaCode()} ${trailer(3)}`;
    } else if (length >= 7) {
      formattedNumber = `${firstSix()}-${trailer(6)}`;
    }

    setCurrPhone(formattedNumber);
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onBlur, value, onChange, ...restField } }) => (
        <TextField
          placeholder={placeHolder}
          value={currPhone}
          onChange={(e) => {
            onChange(e);
            handlePhoneFormat(e.target.value);
          }}
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
