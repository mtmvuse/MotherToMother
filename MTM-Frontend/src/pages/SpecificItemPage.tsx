
import React from "react";
import SpecificItem from "../components/Form/SpecificItem/SpecificItem";

const SpecificItemPage: React.FC = () => {
  const categoryName = 'Sleep';
  const productNames = ['Bassinet', 'Blankets', 'Bed Rail', 'Crib', 'Crib Bedding'];

  return (
    <div>
      <SpecificItem categoryName={categoryName} productNames={productNames} />
    </div>
  );
};

export default SpecificItemPage;
