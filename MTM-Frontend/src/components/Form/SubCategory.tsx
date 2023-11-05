import { Stack, Typography } from "@mui/material";

const getSubCategories = (subCategory: string, subCategoryValues: [number, number]) => {
    if (isSubCategoryNotEmpty(subCategoryValues)) {
        return <Stack key={subCategory} direction="row" justifyContent="space-between" marginY="10px" width="90%"  >
            <Typography className="subcategory-status"> {subCategory} </Typography>
            <Typography className="subcategory-status"> Used: {subCategoryValues[0]} </Typography>
            <Typography className="subcategory-status"> New: {subCategoryValues[1]}</Typography>
        </Stack>
    }
}

const isSubCategoryNotEmpty = (subCategory: [number, number]) => {
    return subCategory[0] !== 0 || subCategory[1] !== 0;
}

type SubCategoryProps = {
    subCategoryName: string;
    subCategoryValues: [number, number];
}

const SubCategory = (props: SubCategoryProps) => {
    return (
        getSubCategories(props.subCategoryName, props.subCategoryValues)
    )
}

export { SubCategory, isSubCategoryNotEmpty }