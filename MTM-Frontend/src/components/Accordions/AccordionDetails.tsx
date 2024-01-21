import { styled } from "@mui/material/styles";
import MuiAccordionDetails, {
  AccordionDetailsProps,
} from "@mui/material/AccordionDetails";

interface AccordionDetailsStyledProps extends AccordionDetailsProps {
  customStyles?: React.CSSProperties;
}

export const AccordionDetails = styled(
  ({ customStyles, ...props }: AccordionDetailsStyledProps) => (
    <MuiAccordionDetails {...props} />
  ),
)(({ theme, customStyles }) => ({
  // Your default styles here
  ...customStyles,
}));
