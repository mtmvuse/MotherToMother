import { Box, Typography } from "@mui/material";

type NumberInCircleProps = {
  num: number;
  backgroundColor?: string;
  color?: string;
  width?: string;
  height?: string;
  borderWidth?: string;
  borderRaduis?: string;
};

function NumberInCircle(props: NumberInCircleProps) {
  const backgroundColor = props.backgroundColor
    ? props.backgroundColor
    : "white";
  const color = props.color ? props.color : "black";
  const width = props.width ? props.width : "34px";
  const borderWidth = props.borderWidth ? props.borderWidth : "1px";
  const height = props.height ? props.height : "34px";

  return (
    <Box
      border={borderWidth + " solid black"}
      borderRadius={props.borderRaduis}
      width={width}
      height={height}
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor={backgroundColor}
      color={color}
    >
      <Typography variant="h6">{props.num}</Typography>
    </Box>
  );
}

export default NumberInCircle;
