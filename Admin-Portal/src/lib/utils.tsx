import type { GridFilterModel, GridSortModel } from "@mui/x-data-grid";

/**
 * Convert MUI DataGrid filter model to query string
 * @param filterModel MUI DataGrid filter model
 * @returns Query string for filtering
 */
export const filterModelToApiQuery = (filterModel: GridFilterModel) => {
  let queryParam: string[] = [];

  filterModel.items.forEach((filter) => {
    const { field, operator, value } = filter;

    switch (operator) {
      case "contains":
        queryParam.push(`${field}_contains=${encodeURIComponent(value)}`);
        break;
      case "startsWith":
        queryParam.push(`${field}_startsWith=${encodeURIComponent(value)}`);
        break;
      case "endsWith":
        queryParam.push(`${field}_endsWith=${encodeURIComponent(value)}`);
        break;
      case "isEmpty":
        queryParam.push(`${field}=_isEmpty`);
        break;
      case "isNotEmpty":
        queryParam.push(`${field}=_isNotEmpty`);
        break;
      case "=":
      case "equals":
      case "is":
      case "isAnyOf":
        queryParam.push(`${field}=${encodeURIComponent(value)}`);
        break;
      case "!=":
      case "isNot":
        queryParam.push(`${field}_not=${encodeURIComponent(value)}`);
        break;
      case ">":
      case "after":
        queryParam.push(`${field}_gt=${encodeURIComponent(value)}`);
        break;
      case ">=":
      case "onOrAfter":
        queryParam.push(`${field}_gte=${encodeURIComponent(value)}`);
        break;
      case "<":
      case "before":
        queryParam.push(`${field}_lt=${encodeURIComponent(value)}`);
        break;
      case "<=":
      case "onOrBefore":
        queryParam.push(`${field}_lte=${encodeURIComponent(value)}`);
        break;
    }
  });

  return queryParam.join("&");
};

/**
 *  Convert MUI DataGrid sort model to query string
 * @param sortModel  MUI DataGrid sort model
 * @returns  Query string for sorting
 */
export const sortModelToApiQuery = (sortModel: GridSortModel) => {
  return sortModel
    .map((sort) => {
      return `sort=${sort.field}&order=${sort.sort}`;
    })
    .join("&");
};
