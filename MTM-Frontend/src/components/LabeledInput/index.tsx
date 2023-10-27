import styles from "./index.module.css";
import React from "react";
import TextField from "@mui/material/TextField";

// Define the type for the AuthInputBlock props
interface LabeledInputProps {
  label?: string;
  value: string;
  type: string;
  onChange: (value: string) => void;
  hide?: boolean;
}
export const LabeledInput = React.forwardRef(
  (props: LabeledInputProps, ref) => {
    const { label, value, type, onChange, hide = false } = props;

    return (
      <div className={styles.inputBlock}>
        <p className={styles.label}>{label ?? ""}</p>
        <TextField
          required
          id="outlined-required"
          label="Required"
          value={value}
          type={type}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    );
  },
);
