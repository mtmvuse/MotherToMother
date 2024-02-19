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
import { Alert, TextField, Typography } from "@mui/material";
import {
  createOutgoingDonation,
  getOrganizations,
  getModalUsers,
} from "../../lib/services";
import { Organization } from "~/types/organization";
import { ResponseUser } from "~/types/user";

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
  const [showError, setShowError] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

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
          throw new Error("Failed to fetch organizations");
        }
        const orgList = await response.json();
        setOrganizationList(orgList);
      } catch (error) {
        console.error("Error fetching organizations:", error);
      }
    };

    fetchData();
  }, []);

  const updateUsers = async (selectedOrg: Organization | undefined) => {
    try {
      const response = await getModalUsers();
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const fullUserList = await response.json();
      console.log(selectedOrg?.name);
      if (selectedOrg) {
        const filteredUserList = fullUserList.filter(
          (user: ResponseUser) => user.Organization.name === selectedOrg.name
        );
        setUserList(filteredUserList);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
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
      setShowError(true);
      return;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitted(true);
    setAlert();
    try {
      if (!selectedUser) {
        console.error("User not selected.");
        return;
      }
      const isItemsEmpty = items.some((item) => item.totalValue === 0);

      if (isItemsEmpty) {
        console.error("Please fill all item fields.");
        return;
      }

      if (donationType == "Outgoing") {
        const outgoingDonationData = {
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

        if (response.status === 200) {
          handleCloseModal();
          handleSubmissionSuccess();
        }
      }
    } catch (error) {
      console.error("Error submitting donation:", error);
    }
  };

  return (
    <Box p={2} sx={{ overflowY: "auto" }}>
      <Typography variant="h5" textAlign="center">
        Add Donation
      </Typography>

      <FormControl fullWidth variant="standard" sx={{ mb: 2 }}>
        <InputLabel id="donationType-select-label">Donation Type</InputLabel>
        <Select
          labelId="donationType-select-label"
          id="donor-select"
          value={donationType}
          onChange={handleTypeChange}
          label="Donation Type"
        >
          <MenuItem value={"Incoming"}>Incoming</MenuItem>
          <MenuItem value={"Outgoing"}>Outgoing</MenuItem>
        </Select>
      </FormControl>
      {showDonor && (
        <FormControl fullWidth variant="standard" sx={{ mb: 2 }}>
          <InputLabel id="org-select-label">Organization</InputLabel>
          <Select
            labelId="org-select-label"
            id="org-select"
            value={selectedOrg?.name}
            onChange={handleOrgChange}
            label="Organization"
          >
            {organizationList.map((org) => (
              <MenuItem key={org.id} value={org.id}>
                {org.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      {showUser && (
        <>
          {userList.length > 0 ? (
            <FormControl fullWidth variant="standard" sx={{ mb: 2 }}>
              <InputLabel id="user-select-label">User</InputLabel>
              <Select
                labelId="user-select-label"
                id="user-select"
                value={selectedUser?.firstName}
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
          ) : (
            <Typography>
              No users available for the selected organization.
            </Typography>
          )}
        </>
      )}

      {showCalendar && (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker"]}>
            <DatePicker
              onChange={handleDateChange}
              value={selectedDate}
              label="Basic date picker"
            />
          </DemoContainer>
        </LocalizationProvider>
      )}
      {showAddButton && (
        <Button
          variant="contained"
          onClick={addItemField}
          sx={{ mt: 2, mb: 1 }}
        >
          Add Item
        </Button>
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
              <div>
                <TextField
                  label="White"
                  type="standard"
                  value={demographicData.whiteNum}
                  onChange={handleChangeDemographicData("whiteNum")}
                />
                <TextField
                  label="Latino"
                  type="standard"
                  value={demographicData.latinoNum}
                  onChange={handleChangeDemographicData("latinoNum")}
                />
                <TextField
                  label="Black"
                  type="standard"
                  value={demographicData.blackNum}
                  onChange={handleChangeDemographicData("blackNum")}
                />
                <TextField
                  label="Native"
                  type="standard"
                  value={demographicData.nativeNum}
                  onChange={handleChangeDemographicData("nativeNum")}
                />
                <TextField
                  label="Asian"
                  type="standard"
                  value={demographicData.asianNum}
                  onChange={handleChangeDemographicData("asianNum")}
                />
                <TextField
                  label="Other"
                  type="standard"
                  value={demographicData.otherNum}
                  onChange={handleChangeDemographicData("otherNum")}
                />
              </div>
              <Typography>
                Number Served: {calculateNumberServed(demographicData)}
              </Typography>
            </div>
          )}
          {showError && <Alert severity="error">{error}</Alert>}
          <Button variant="contained" sx={{ mt: 2 }} onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      )}
    </Box>
  );
};

export default AddDonationsModal;
