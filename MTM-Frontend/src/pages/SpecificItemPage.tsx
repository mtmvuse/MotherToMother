import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SpecificItem from "../components/Form/SpecificItem/SpecificItem";
import categoryToProductNames from "./categoris";

const SpecificItemPage: React.FC = () => {
  const location = useLocation();
  const [categoryInfo, setCategoryInfo] = useState<{
    categoryName: string;
    productNames: string[];
  } | null>(null);

  useEffect(() => {
    updateCategoryInfo(location.search);
  }, [location.search]);

  const updateCategoryInfo = (search: string) => {
    // Parse the query parameter from the URL
    const searchParams = new URLSearchParams(search);
    const categoryParam = searchParams.get("category");

    // Use category information to dynamically define productNames
    const productNames = getProductNamesForCategory(categoryParam);
    setCategoryInfo({ categoryName: categoryParam || "", productNames });
  };

  const getProductNamesForCategory = (category: string | null): string[] => {
    // Use the imported categoryToProductNames
    return category ? categoryToProductNames[category] || [] : [];
  };

  return (
    <div>
      {categoryInfo && (
        <SpecificItem
          categoryName={categoryInfo.categoryName}
          productNames={categoryInfo.productNames}
        />
      )}
    </div>
  );
};

export default SpecificItemPage;
