import React from "react";
import { GridFilterModel, GridFilterItem } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CancelIcon from "@mui/icons-material/Cancel";

interface FiltersOptionsProps {
  filterModel: GridFilterModel | undefined;
  setFilterModel: React.Dispatch<
    React.SetStateAction<GridFilterModel | undefined>
  >;
  filter: GridFilterItem;
}

const FiltersOptions: React.FC<FiltersOptionsProps> = ({
  filter,
  filterModel,
  setFilterModel,
}) => {
  const handleFilterDelete = () => {
    let currFilterArray = filterModel?.items;
    let newFilterArray: GridFilterItem[] = [];

    if (currFilterArray) {
      newFilterArray = currFilterArray.filter(
        (item) => item?.field !== filter.field
      );
    }

    if (newFilterArray.length === 0) {
      setFilterModel(undefined);
    } else {
      setFilterModel({ items: newFilterArray });
    }
  };

  return (
    <Box className="filterOption-container">
      <Typography className="filterOption-text">
        {filter.field}
        <IconButton
          onClick={handleFilterDelete}
          aria-label="clear-date-filter"
          style={{ color: "lightgray" }}
        >
          <CancelIcon />
        </IconButton>
      </Typography>
    </Box>
  );
};

export default FiltersOptions;
