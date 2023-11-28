import { Grid, Typography } from "@mui/material";

interface InputProps {
  question: string;
  value: number;
  onInputChange: any;
}

export const QuestionField: React.FC<InputProps> = ({
  question,
  value,
  onInputChange,
}) => {
  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography>{question}</Typography>
      </Grid>
      <Grid item>
        <input
          key={question}
          type="number"
          placeholder={String(value)}
          onChange={onInputChange}
          style={{
            width: "4.5rem",
            height: "2rem",
            borderRadius: "7px",
            padding: "5px 8px 5px 20px",
            border: "1px solid #ccc",
            textAlign: "center",
          }}
        />
      </Grid>
    </Grid>
  );
};
