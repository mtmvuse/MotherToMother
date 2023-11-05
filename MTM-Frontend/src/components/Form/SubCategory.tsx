import { Stack, Typography, Box } from "@mui/material";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

const getSubCategories = (subCategory: string, subCategoryValues: [number, number], editMode: boolean) => {

    if (isSubCategoryNotEmpty(subCategoryValues)) {
        return <Stack key={subCategory} direction="row" justifyContent="space-between" marginY="7px" width="95%"  >
            <Typography className="subcategory-status"> {subCategory} </Typography>
            <Typography className="subcategory-status"> Used: {subCategoryValues[0]} </Typography>
            <Stack direction="row">
                <Typography className="subcategory-status" marginRight="15px"> New: {subCategoryValues[1]}</Typography>
                {editMode && (<><EditOutlinedIcon sx={{ fontSize: 20 }} color="primary" /> <DeleteOutlinedIcon sx={{ fontSize: 20 }} color="primary" /></>)}
            </Stack>


        </Stack>
    }
}

const isSubCategoryNotEmpty = (subCategory: [number, number]) => {
    return subCategory[0] !== 0 || subCategory[1] !== 0;
}

type SubCategoryProps = {
    subCategoryName: string;
    subCategoryValues: [number, number];
    editMode: boolean;
}

const SubCategory = (props: SubCategoryProps) => {
    return (
        getSubCategories(props.subCategoryName, props.subCategoryValues, props.editMode)
    )
}

export { SubCategory, isSubCategoryNotEmpty }