import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SpecificItem from "../components/Form/SpecificItem/SpecificItem";
import { getItemByCategory } from "../lib/services";
import { useAuth } from "../contexts/AuthContext";
import { type ItemResponse } from "../types/FormTypes";
import { ErrorMessage } from "../components/Error";
import { CircularProgress } from "@mui/material";

const SpecificItemPage: React.FC = () => {
  const location = useLocation();
  const { logout, currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<string>("");
  const [items, setItems] = useState<string[]>();

  useEffect(() => {
    const fetchSpecificCategories = async () => {
      try {
        if (!currentUser) {
          throw new Error("Current user not found");
        }
        const token = await currentUser.getIdToken();

        updateCategoryInfo(location.search, token);
      } catch (error) {
        const err = error as Error;
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpecificCategories();
  }, [location.search]);

  const updateCategoryInfo = async (search: string, token: string) => {
    // Parse the query parameter from the URL
    const searchParams = new URLSearchParams(search);
    const categoryParam = searchParams.get("category");
    setCategory(categoryParam ?? "");

    const response = await getItemByCategory(categoryParam ?? "", token);
    const itemsData = (await response.json()) as ItemResponse[];

    setItems(itemsData.map((item: ItemResponse) => item.name));
  };

  return (
    <div>
      <ErrorMessage error={error} setError={setError} />
      {isLoading ? (
        <CircularProgress />
      ) : (
        category && items && <SpecificItem category={category} items={items} />
      )}
    </div>
  );
};

export default SpecificItemPage;
