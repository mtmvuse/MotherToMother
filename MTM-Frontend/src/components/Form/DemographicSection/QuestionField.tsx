import { Grid, Typography } from "@mui/material";

interface InputProps {
  question: string;
  value: number;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const preventMinus = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === "-" || e.key === "e" || e.key === "E" || e.key === "+") {
    e.preventDefault();
  }
};

export const QuestionField: React.FC<InputProps> = ({
  question,
  value,
  onInputChange,
}) => {
  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography
          color={"var(--mtmGray)"}
          fontSize={12}
          style={{ width: "200px" }}
        >
          {question}
        </Typography>
      </Grid>
      <Grid item>
        <input
          key={question}
          type="number"
          placeholder={String(value)}
          onChange={onInputChange}
          onKeyDown={preventMinus}
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
