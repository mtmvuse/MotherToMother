import React, { useState, useEffect } from "react";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ItemField from "./ItemField";
import {
  IconButton,
  TextField,
  Typography,
  Grid,
  Autocomplete,
} from "@mui/material";
import {
  createOutgoingDonation,
  getOrganizations,
  getModalUsers,
  createIncomingDonation,
} from "../../lib/services";
import { Organization } from "~/types/organization";
import { ResponseUser } from "~/types/user";
import {
  AddIncomingDonationType,
  AddOutgoingDonationType,
} from "~/types/DonationTypes";
import "./styles/AddDonation.css";
import addItemIcon from "../../assets/add-item-icon.png";
import { useAuth } from "../../lib/contexts";

interface DonationItem {
  itemId: number;
  type: string;
  quantity: number;
  totalValue: number;
}

interface MergedDonationItem {
  itemId: number;
  quantityUsed: number;
  quantityNew: number;
  totalValue: number;
}

const options = ["Incoming", "Outgoing"];

interface AddDonationsModalProps {
  handleCloseModal: () => void;
  handleSubmissionSuccess: () => void;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const AddDonationsModal: React.FC<AddDonationsModalProps> = ({
  handleCloseModal,
  handleSubmissionSuccess,
  setError,
}) => {
  const [organizationList, setOrganizationList] = useState<Organization[]>([]);
  const [userList, setUserList] = useState<ResponseUser[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [selectedUser, setSelectedUser] = useState<ResponseUser | null>(null);
  const [showDonor, setShowDonor] = useState(false);
  const [showUser, setShowUser] = useState<boolean>(false);
  const [donationType, setDonationType] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [items, setItems] = useState<DonationItem[]>([]);
  const [totalQuantity, setTotalQuantity] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [demographicData, setDemographicData] = useState({
    numberServed: 0,
    whiteNum: 0,
    latinoNum: 0,
    blackNum: 0,
    nativeNum: 0,
    asianNum: 0,
    otherNum: 0,
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (selectedDate && selectedDate > new Date()) {
      setErrorMessage("Cannot select date in the future.");
    } else {
      setErrorMessage(null);
    }
  }, [selectedDate]);

  const handleUserChange = (
    _event: React.SyntheticEvent<Element, Event>,
    newValue: ResponseUser | null
  ) => {
    setSelectedUser(newValue);
    setShowCalendar(!!newValue);
  };

  const handleOrgChange = (
    _event: React.SyntheticEvent<Element, Event>,
    newValue: Organization | null
  ) => {
    if (newValue) {
      setSelectedOrg(newValue);
      setSelectedUser(null);
      setShowUser(!!newValue);
      updateUsers(newValue);
    }
  };

  const handleTypeChange = (
    _event: React.SyntheticEvent<Element, Event>,
    newValue: string | null
  ) => {
    setDonationType(newValue || "");
    setShowDonor(!!newValue);
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const handleChangeDemographicData =
    (field: keyof typeof demographicData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(event.target.value) || 0;
      setDemographicData((prevData) => ({
        ...prevData,
        [field]: value,
        numberServed: calculateNumberServed({ ...prevData, [field]: value }),
      }));
    };

  const calculateNumberServed = (data: typeof demographicData) => {
    const { whiteNum, latinoNum, blackNum, nativeNum, asianNum, otherNum } =
      data;
    return whiteNum + latinoNum + blackNum + nativeNum + asianNum + otherNum;
  };

  const addItemField = () => {
    if (!selectedDate) {
      setError("Fill in all fields");
      return;
    }

    if (items.some((item) => item.totalValue <= 0)) {
      setError("Fill in all items");
      return;
    }

    const newItem: DonationItem = {
      itemId: 0,
      type: "",
      quantity: 0,
      totalValue: 0,
    };
    setItems([...items, newItem]);
    setIsSubmitted(false);
  };

  const removeItemField = (index: number) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  useEffect(() => {
    let newTotalQuantity = 0;
    let newTotalCost = 0;

    items.forEach((item) => {
      newTotalQuantity += item.quantity;
      newTotalCost += item.totalValue;
    });

    setTotalQuantity(newTotalQuantity);
    setTotalCost(newTotalCost);
  }, [items]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getOrganizations();
        if (!response.ok) {
          setError("Failed to fetch organizations");
          return;
        }
        const orgList = await response.json();

        const filteredOrgList = orgList.filter((org: Organization) => {
          if (donationType === "Incoming") {
            return org.type === "Public" || org.type == "Corporate";
          } else if (donationType === "Outgoing") {
            return org.type === "Agency";
          }
          return true;
        });

        setOrganizationList(filteredOrgList);
      } catch (error) {
        setError("Error fetching organizations");
      }
    };

    fetchData();
  }, [donationType]);

  const updateUsers = async (selectedOrg: Organization | undefined) => {
    try {
      const token = await currentUser?.getIdToken();
      if (!token) {
        throw new Error("Failed to get token");
      }
      const response = await getModalUsers(token);
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const fullUserList = await response.json();
      if (selectedOrg) {
        const filteredUserList = fullUserList.filter(
          (user: ResponseUser) => user.Organization.name === selectedOrg.name
        );
        setUserList(filteredUserList);
      }
    } catch (error) {
      setError("Error fetching users");
    }
  };

  const handleQuantityChange = (
    index: number,
    type: string,
    quantity: number,
    totalValue: number
  ) => {
    const updatedItems = [...items];
    const currentItem = updatedItems[index] as DonationItem;
    const { itemId = 0 } = currentItem;
    updatedItems[index] = {
      ...currentItem,
      itemId,
      type,
      quantity,
      totalValue,
    };
    setItems(updatedItems);
  };

  const handleItemChange = (index: number, itemId: number) => {
    setItems((prevItems) =>
      prevItems.map((item, i) => (i === index ? { ...item, itemId } : item))
    );
  };

  const handleSubmit = async () => {
    setIsSubmitted(true);
    if (!selectedUser) {
      setError("User not selected.");
      return;
    }

    if (!selectedOrg) {
      setError("Organization not selected.");
      return;
    }

    if (!selectedDate) {
      setError("Date not selected.");
      return;
    }

    if (items.some((item) => item.totalValue === 0)) {
      setError("Please fill all item fields.");
      return;
    }

    if (donationType === "Outgoing") {
      if (calculateNumberServed(demographicData) === 0) {
        setError("Please fill in at least one demographic field.");
        return;
      }
    }

    const mergeItems = (items: DonationItem[]): MergedDonationItem[] => {
      const aggregation: { [key: number]: MergedDonationItem } = {};

      for (const item of items) {
        if (!aggregation[item.itemId]) {
          aggregation[item.itemId] = {
            itemId: item.itemId,
            quantityNew: 0,
            quantityUsed: 0,
            totalValue: 0,
          };
        }

        if (item.type === "New") {
          aggregation[item.itemId]!.quantityNew += item.quantity;
        } else if (item.type === "Used") {
          aggregation[item.itemId]!.quantityUsed += item.quantity;
        }
        aggregation[item.itemId]!.totalValue += item.totalValue;
      }

      return Object.values(aggregation);
    };
    const mergedItems = mergeItems(items);

    if (donationType == "Outgoing") {
      const outgoingDonationData: AddOutgoingDonationType = {
        userId: selectedUser.id,
        donationDetails: mergedItems.map((item) => ({
          itemId: item.itemId,
          usedQuantity: item.quantityUsed,
          newQuantity: item.quantityNew,
        })),
        date: selectedDate,
        numberServed: demographicData.numberServed,
        whiteNum: demographicData.whiteNum,
        latinoNum: demographicData.latinoNum,
        blackNum: demographicData.blackNum,
        nativeNum: demographicData.nativeNum,
        asianNum: demographicData.asianNum,
        otherNum: demographicData.otherNum,
      };

      const token = await currentUser?.getIdToken();
      if (!token) {
        throw new Error("Failed to get token");
      }
      const response = await createOutgoingDonation(
        token,
        outgoingDonationData
      );

      if (response.ok) {
        handleCloseModal();
        handleSubmissionSuccess();
      } else if (response.status === 500) {
        const message = await response.json();
        setError(message.message);
      } else {
        setError("Error Creating Donation");
      }
    } else if (donationType == "Incoming") {
      const incomingDonationData: AddIncomingDonationType = {
        userId: selectedUser.id,
        date: selectedDate,
        donationDetails: mergedItems.map((item) => ({
          itemId: item.itemId,
          usedQuantity: item.quantityUsed,
          newQuantity: item.quantityNew,
        })),
      };

      const token = await currentUser?.getIdToken();
      if (!token) {
        throw new Error("Failed to get token");
      }

      const response = await createIncomingDonation(
        token,
        incomingDonationData
      );

      if (response.status === 200) {
        handleCloseModal();
        handleSubmissionSuccess();
      } else if (response.status === 500) {
        const messages = await response.json();
        setError(messages.error);
      } else {
        setError("Error Creating Donation");
      }
    } else {
      setError("Invalid donation type");
    }
  };

  return (
    <Box p={2} sx={{ overflowY: "auto" }}>
      <div className="add-modal">
        <Typography
          fontFamily="Raleway, sans-serif"
          fontSize={14}
          color="navy"
          mb={1}
          mt={2}
          style={{ letterSpacing: "2px" }}
          textAlign="left"
        >
          ADD DONATION
        </Typography>
        <div
          style={{
            backgroundColor: "#F3F3F3",
            borderRadius: "10px",
            padding: "25px",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography
                fontFamily="Raleway, sans-serif"
                fontSize={20}
                color="navy"
              >
                Donor
              </Typography>
              <FormControl variant="standard" sx={{ width: "75%" }}>
                <Autocomplete
                  disablePortal
                  id="donor-select"
                  value={donationType}
                  onChange={handleTypeChange}
                  options={options}
                  isOptionEqualToValue={(option, value) => option === value}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      margin="dense"
                      name="Donor"
                      variant="standard"
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography
                fontFamily="Raleway, sans-serif"
                fontSize={20}
                color="navy"
              >
                Organization
              </Typography>
              <FormControl
                variant="standard"
                sx={{ width: "75%" }}
                disabled={!showDonor}
              >
                <Autocomplete
                  disablePortal
                  id="organization-select"
                  value={selectedOrg}
                  onChange={handleOrgChange}
                  options={organizationList}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  getOptionLabel={(org) => org.name}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      margin="dense"
                      name="organization"
                      variant="standard"
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography
                fontFamily="Raleway, sans-serif"
                fontSize={20}
                color="navy"
              >
                User
              </Typography>
              <FormControl
                disabled={!showUser || userList.length === 0}
                fullWidth
                variant="standard"
                sx={{ width: "75%" }}
              >
                {selectedOrg && userList.length === 0 && (
                  <Typography fontSize={13} color="red">
                    No users available for the selected organization.
                  </Typography>
                )}
                <Autocomplete
                  disablePortal
                  id="user-select"
                  value={selectedUser}
                  onChange={handleUserChange}
                  options={userList}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  getOptionLabel={(user) => user.firstName}
                  renderInput={(params: any) => (
                    <TextField
                      {...params}
                      margin="dense"
                      name="user"
                      variant="standard"
                    />
                  )}
                  renderOption={(props, user) => (
                    <li {...props}>{user.firstName}</li>
                  )}
                />
              </FormControl>
            </Grid>
          </Grid>

          <div style={{ alignItems: "center", marginTop: "20px" }}>
            <Typography
              fontFamily="Raleway, sans-serif"
              fontSize={20}
              color="navy"
            >
              Date
            </Typography>

            <div
              className="date-picker"
              style={{
                width: "100%",
              }}
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer
                  components={["DatePicker"]}
                  sx={{ width: 300, marginRight: "180px" }}
                >
                  <DatePicker
                    disabled={!showCalendar}
                    onChange={handleDateChange}
                    value={selectedDate}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </div>
          </div>
        </div>
        <IconButton onClick={addItemField} sx={{ mt: 2, mb: 1 }}>
          <img
            className="add-item-icon"
            src={addItemIcon}
            alt="Add Item Icon"
          />
        </IconButton>

        {items.map((_item, index) => (
          <ItemField
            key={index}
            isSubmitted={isSubmitted}
            onDelete={() => removeItemField(index)}
            onQuantityChange={(type, quantity, totalValue) =>
              handleQuantityChange(index, type, quantity, totalValue)
            }
            onItemChange={(itemId) => handleItemChange(index, itemId)}
          />
        ))}
        {items.length > 0 && (
          <div>
            <div
              style={{
                backgroundColor: "#f3f3f3",
                marginTop: "15px",
                borderRadius: "10px",
                padding: "13px",
                fontFamily: "Raleway, sans-serif",
                fontSize: "18px",
                color: "navy",
              }}
            >
              <div style={{ textAlign: "left", marginBottom: "8px" }}>
                Total Items
                <span style={{ color: "black", float: "right" }}>
                  {totalQuantity}
                </span>
              </div>
              <div style={{ textAlign: "left" }}>
                Total Price
                <span style={{ color: "black", float: "right" }}>
                  {totalCost.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </span>
              </div>
            </div>
            {donationType == "Outgoing" && (
              <div>
                <Typography
                  fontFamily="Raleway, sans-serif"
                  fontSize={14}
                  color="navy"
                  mb={1}
                  mt={2}
                  style={{ letterSpacing: "2px" }}
                  textAlign={"left"}
                >
                  DEMOGRAPHIC DATA
                </Typography>
                <div
                  style={{
                    backgroundColor: "lightgray",
                    padding: "25px",
                    borderRadius: "10px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <TextField
                      label="White"
                      variant="standard"
                      value={demographicData.whiteNum}
                      onChange={handleChangeDemographicData("whiteNum")}
                      sx={{ marginRight: "30px" }}
                    />
                    <TextField
                      label="Latino"
                      variant="standard"
                      value={demographicData.latinoNum}
                      onChange={handleChangeDemographicData("latinoNum")}
                      sx={{ marginRight: "30px" }}
                    />
                    <TextField
                      label="Black"
                      variant="standard"
                      value={demographicData.blackNum}
                      onChange={handleChangeDemographicData("blackNum")}
                      sx={{ marginRight: "30px" }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "10px",
                    }}
                  >
                    <TextField
                      label="Native"
                      variant="standard"
                      value={demographicData.nativeNum}
                      onChange={handleChangeDemographicData("nativeNum")}
                      sx={{ marginRight: "30px" }}
                    />
                    <TextField
                      label="Asian"
                      variant="standard"
                      value={demographicData.asianNum}
                      onChange={handleChangeDemographicData("asianNum")}
                      sx={{ marginRight: "30px" }}
                    />
                    <TextField
                      label="Other"
                      variant="standard"
                      value={demographicData.otherNum}
                      onChange={handleChangeDemographicData("otherNum")}
                      sx={{ marginRight: "30px" }}
                    />
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    paddingRight: 20,
                    fontFamily: "Raleway, sans-serif",
                    fontSize: 20,
                    backgroundColor: "#f3f3f3",
                    marginTop: "15px",
                    borderRadius: "10px",
                    padding: "13px",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ color: "navy" }}>Total Kids</span>
                  <span style={{ color: "black", textAlign: "right" }}>
                    {calculateNumberServed(demographicData)}
                  </span>
                </div>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <button className="submit-button" onClick={handleSubmit}>
                Submit
              </button>
            </div>
          </div>
        )}
        {errorMessage && (
          <Typography variant="body2" color="error">
            {errorMessage}
          </Typography>
        )}
      </div>
    </Box>
  );
};

export default AddDonationsModal;
