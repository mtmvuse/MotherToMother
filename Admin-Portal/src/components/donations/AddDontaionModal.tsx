import React, { useState, useEffect } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ItemField from "./ItemField";
import { Alert, IconButton, TextField, Typography } from "@mui/material";
import {
  createOutgoingDonation,
  getOrganizations,
  getModalUsers,
  createIncomingDonation,
} from "../../lib/services";
import { Organization } from "~/types/organization";
import { ResponseUser } from "~/types/user";
import { ErrorMessage } from "../ErrorMessage";
import { SuccessMessage } from "../SuccessMessage";
import {
  AddIncomingDonationType,
  AddOutgoingDonationType,
} from "~/types/DonationTypes";
import "./styles/AddDonation.css";
import addItemIcon from "../../assets/add-item-icon.png";

// TODO Add figma styling
// TODO Cleanup/ Add global errors
// TODO Add Put (edit) donation API integration
// TODO Integrate Edit Icon button

interface DonationItem {
  itemId: number;
  quantityNew: number;
  quantityUsed: number;
  totalValue: number;
}

interface AddDonationsModalProps {
  handleCloseModal: () => void;
  handleSubmissionSuccess: () => void;
}

const AddDonationsModal: React.FC<AddDonationsModalProps> = ({
  handleCloseModal,
  handleSubmissionSuccess,
}) => {
  const [organizationList, setOrganizationList] = useState<Organization[]>([]);
  const [userList, setUserList] = useState<ResponseUser[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<Organization | undefined>(
    undefined
  );
  const [selectedUser, setSelectedUser] = useState<ResponseUser | undefined>(
    undefined
  );
  const [showDonor, setShowDonor] = useState<boolean>(false);
  const [showUser, setShowUser] = useState<boolean>(false);
  const [donationType, setDonationType] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [showAddButton, setShowAddButton] = useState<boolean>(false);
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
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  const handleUserChange = (event: SelectChangeEvent<string>) => {
    const selectedUserId = event.target.value;
    const selectedUser = userList.find(
      (user) => user.id === parseInt(selectedUserId)
    );
    setSelectedUser(selectedUser);
    setShowCalendar(true);
  };

  const handleOrgChange = (event: SelectChangeEvent<string>) => {
    const selectedOrgId = event.target.value;
    const selectedOrg = organizationList.find(
      (org) => org.id === parseInt(selectedOrgId)
    );
    setSelectedOrg(selectedOrg);
    setShowUser(true);
    updateUsers(selectedOrg);
  };

  const handleTypeChange = (event: SelectChangeEvent<string>) => {
    setDonationType(event.target.value);
    setShowDonor(true);
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    setShowAddButton(!!date);
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
    if (items.every((item) => item.totalValue > 0)) {
      const newItem: DonationItem = {
        itemId: 0,
        quantityNew: 0,
        quantityUsed: 0,
        totalValue: 0,
      };
      setItems([...items, newItem]);
    }
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
      newTotalQuantity += item.quantityUsed + item.quantityNew;
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
        setError("Error fetching organizations:");
      }
    };

    fetchData();
  }, [donationType]);

  const updateUsers = async (selectedOrg: Organization | undefined) => {
    try {
      const response = await getModalUsers();
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
      setError("Error fetching users:");
    }
  };

  const handleQuantityChange = (
    index: number,
    quantityNew: number,
    quantityUsed: number,
    totalValue: number
  ) => {
    const updatedItems = [...items];
    const currentItem = updatedItems[index] as DonationItem;
    const { itemId = 0 } = currentItem;
    updatedItems[index] = {
      ...currentItem,
      itemId,
      quantityNew,
      quantityUsed,
      totalValue,
    };
    setItems(updatedItems);
  };

  const handleItemChange = (index: number, itemId: number) => {
    setItems((prevItems) =>
      prevItems.map((item, i) => (i === index ? { ...item, itemId } : item))
    );
  };

  const setAlert = () => {
    if (items.some((item) => item.totalValue === 0)) {
      setError("Please fill in all item fields.");
      return;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitted(true);
    setAlert();
    try {
      if (!selectedUser) {
        setError("User not selected.");
        return;
      }
      const isItemsEmpty = items.some((item) => item.totalValue === 0);

      if (isItemsEmpty) {
        setError("Please fill all item fields.");
        return;
      }

      if (donationType === "Outgoing") {
        const isDemographicEmpty =
          demographicData.numberServed === 0 &&
          demographicData.whiteNum === 0 &&
          demographicData.latinoNum === 0 &&
          demographicData.blackNum === 0 &&
          demographicData.nativeNum === 0 &&
          demographicData.asianNum === 0 &&
          demographicData.otherNum === 0;

        if (isDemographicEmpty) {
          setError("Please fill in at least one demographic field.");
          return;
        }
      }

      if (donationType == "Outgoing") {
        const outgoingDonationData: AddOutgoingDonationType = {
          userId: selectedUser.id,
          donationDetails: items.map((item) => ({
            itemId: item.itemId,
            usedQuantity: item.quantityUsed,
            newQuantity: item.quantityNew,
          })),
          numberServed: demographicData.numberServed,
          whiteNum: demographicData.whiteNum,
          latinoNum: demographicData.latinoNum,
          blackNum: demographicData.blackNum,
          nativeNum: demographicData.nativeNum,
          asianNum: demographicData.asianNum,
          otherNum: demographicData.otherNum,
        };
        const response = await createOutgoingDonation(outgoingDonationData);
        console.log(outgoingDonationData);

        if (response.status === 200) {
          handleCloseModal();
          handleSubmissionSuccess();
        }
      }

      if (donationType == "Incoming") {
        const incomingDonationData: AddIncomingDonationType = {
          userId: selectedUser.id,
          donationDetails: items.map((item) => ({
            itemId: item.itemId,
            usedQuantity: item.quantityUsed,
            newQuantity: item.quantityNew,
          })),
        };
        const response = await createIncomingDonation(incomingDonationData);
        console.log(incomingDonationData);

        if (response.status === 200) {
          handleCloseModal();
          handleSubmissionSuccess();
        }
      }
    } catch (error) {
      setError("Error submitting donation:");
    }
  };

  return (
    <div className="add-modal">
      <Box p={2} sx={{ overflowY: "auto" }}>
        {error && <ErrorMessage error={error} setError={setError} />}
        {success && (
          <SuccessMessage success={success} setSuccess={setSuccess} />
        )}
        <Typography variant="h5" textAlign="left">
          Add Donation
        </Typography>
        <div
          style={{
            backgroundColor: "lightgrey",
            borderRadius: "10px",
            padding: "25px",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", marginTop: "20px" }}
          >
            <Typography fontSize={20}>Donor</Typography>

            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <FormControl
                variant="standard"
                sx={{ width: 400, marginRight: "50px" }}
              >
                <Select id="donor-select" onChange={handleTypeChange}>
                  <MenuItem value={"Incoming"}>Incoming</MenuItem>
                  <MenuItem value={"Outgoing"}>Outgoing</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>

          <div
            style={{ display: "flex", alignItems: "center", marginTop: "20px" }}
          >
            <Typography fontSize={20}>Organization</Typography>

            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <FormControl
                fullWidth
                variant="standard"
                sx={{ width: 400, marginRight: "50px" }}
                disabled={!showDonor}
              >
                <Select id="org-select" onChange={handleOrgChange}>
                  {organizationList.map((org) => (
                    <MenuItem key={org.id} value={org.id}>
                      {org.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>

          <div
            style={{ display: "flex", alignItems: "center", marginTop: "20px" }}
          >
            <Typography fontSize={20}>User</Typography>

            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <FormControl
                disabled={!showUser || userList.length === 0}
                fullWidth
                variant="standard"
                sx={{ width: 400, marginRight: "50px" }}
              >
                {/* {selectedOrg && userList.length > 0 ? (
          <InputLabel id="user-select-label">User</InputLabel>
        ) : (
          <InputLabel id="user-select-label">
            No users available for the selected organization.
          </InputLabel>
        )} */}
                <Select
                  labelId="user-select-label"
                  id="user-select"
                  onChange={handleUserChange}
                  label="Donor"
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 200,
                        overflowY: "auto",
                      },
                    },
                  }}
                >
                  {userList.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.firstName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>

          <div
            style={{ display: "flex", alignItems: "center", marginTop: "20px" }}
          >
            <Typography fontSize={20}>Date</Typography>

            <div
              className="date-picker"
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer
                  components={["DatePicker"]}
                  sx={{ width: 400, marginRight: "50px" }}
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

        {showAddButton && (
          <IconButton onClick={addItemField} sx={{ mt: 2, mb: 1 }}>
            <img
              className="add-item-icon"
              src={addItemIcon}
              alt="Add Item Icon"
            />
          </IconButton>
        )}
        {items.map((item, index) => (
          <ItemField
            key={index}
            isSubmitted={isSubmitted}
            onDelete={() => removeItemField(index)}
            onQuantityChange={(quantityNew, quantityUsed, totalValue) =>
              handleQuantityChange(index, quantityNew, quantityUsed, totalValue)
            }
            onItemChange={(itemId) => handleItemChange(index, itemId)}
          />
        ))}
        {items.length > 0 && (
          <div>
            <Typography>Total Items: {totalQuantity}</Typography>
            <Typography>Total Cost: ${totalCost}</Typography>
            {donationType == "Outgoing" && (
              <div>
                <Typography align={"center"} m={2}>
                  Demographic Data
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
                <Typography>
                  Number Served: {calculateNumberServed(demographicData)}
                </Typography>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <button className="submit-button" onClick={handleSubmit}>
                Submit
              </button>
            </div>
          </div>
        )}
      </Box>
    </div>
  );
};

export default AddDonationsModal;
