import { styled } from "@mui/material/styles";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";

interface AccordionStyledProps extends AccordionProps {
  customStyles?: React.CSSProperties;
}

export const Accordion = styled(
  ({ customStyles, ...props }: AccordionStyledProps) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
  ),
)(({ theme }) => ({}));
