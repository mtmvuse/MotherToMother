import { Button } from "@mui/material";

interface InputProps {
  userType: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  value: string;
}

export const AccountTypeButton: React.FC<InputProps> = ({
  userType,
  onClick,
  value,
}) => (
  <Button
    type="button"
    variant="outlined"
    onClick={onClick}
    sx={{
      borderColor: "gray",
      borderRadius: "10px",
      width: "100%",
      color: userType == value ? "white" : "gray",
      backgroundColor: userType == value ? "gray" : "white",
      textTransform: "capitalize",

      "&:hover": {
        backgroundColor: "gray",
        borderColor: "gray",
        color: "white",
      },
    }}
  >
    {value}
  </Button>
);
