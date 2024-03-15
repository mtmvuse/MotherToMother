import { styled } from "@mui/material/styles";
import MuiAccordionSummary, {
  type AccordionSummaryProps,
} from "@mui/material/AccordionSummary";

interface AccordionSummaryStyledProps extends AccordionSummaryProps {
  customStyles?: React.CSSProperties;
}

export const AccordionSummary = styled(
  ({ customStyles, ...props }: AccordionSummaryStyledProps) => (
    <MuiAccordionSummary {...props} />
  ),
)(({ theme, customStyles }) => ({
  padding: 0,
  ...customStyles,
}));
