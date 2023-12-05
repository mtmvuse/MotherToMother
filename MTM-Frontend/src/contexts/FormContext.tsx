import React, { createContext, useContext, useState } from "react";
import type { DemographicDetailType } from "../types/FormTypes";
import type { DonationDetailType } from "../types/FormTypes";

interface FormStateData {
  demographicDetails: DemographicDetailType;
  setDemographicDetails: React.Dispatch<
    React.SetStateAction<DemographicDetailType>
  >;
  donationDetails: DonationDetailType[];
  setDonationDetails: React.Dispatch<
    React.SetStateAction<DonationDetailType[]>
  >;
}

const FormContext = createContext<FormStateData | undefined>(undefined);

export const useForm = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
};

export const FormProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [donationDetails, setDonationDetails] = useState<DonationDetailType[]>(
    [],
  );
  const [demographicDetails, setDemographicDetails] =
    useState<DemographicDetailType>({
      numberServed: 0,
      whiteNum: 0,
      latinoNum: 0,
      blackNum: 0,
      nativeNum: 0,
      asianNum: 0,
      otherNum: 0,
    });

  const value = {
    donationDetails,
    setDonationDetails,
    demographicDetails,
    setDemographicDetails,
  };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};
