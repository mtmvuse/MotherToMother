import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SpecificItem from "../components/Form/SpecificItem/SpecificItem";
import categoryToProductNames from "./categoris";

const SpecificItemPage: React.FC = () => {
  const location = useLocation();
  const [category, setCategory] = useState<string>("");
  const [items, setItems] = useState<string[]>();

  useEffect(() => {
    updateCategoryInfo(location.search);
  }, [location.search]);

  const updateCategoryInfo = (search: string) => {
    // Parse the query parameter from the URL
    const searchParams = new URLSearchParams(search);
    const categoryParam = searchParams.get("category");
    setCategory(categoryParam ?? "");
    // Use category information to dynamically define productNames
    const items = getItemsForCategory(categoryParam);
    setItems(items);
  };

  const getItemsForCategory = (category: string | null): string[] => {
    // Use the imported categoryToProductNames
    return category ? categoryToProductNames[category] ?? [] : [];
  };

  return (
    <div>
      {category && items && <SpecificItem category={category} items={items} />}
    </div>
  );
};

export default SpecificItemPage;
