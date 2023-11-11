import { useState } from "react";
import Grid from "@mui/material/Grid";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

// TODO: replace this with an API Call
const items = {
  Sleep: {
    Bassinet: 0,
    Blanket: 0,
    "Bed Rail": 0,
    Crib: 0,
    "Crib Bedding": 0,
    "Crib Mattress": 0,
    "Pack n Play": 0,
    "Swaddle/Sleep Sack": 0,
  },
  Feeding: {
    "Baby Bottle": 0,
    "Baby Bottle Nipples": 0,
    "Baby Bottle Warmer": 0,
    "Baby Food": 0,
    "Bibs/Burp Cloths": 0,
    "Booster Seat": 0,
    "Breast Pump": 0,
    "Cleaning Supplies": 0,
    "Dishes/Sippy": 0,
    "Feeding - Other": 0,
    Formula: 0,
    "High Chair": 0,
    "Nursing Accessories": 0,
    "Nursing Supplies": 0,
  },
  Travel: {
    "Baby Carrier": 0,
    "Car Seat - Accessories": 0,
    "Car Seat - Booster": 0,
    "Car Seat - Infant": 0,
    "Car Seat - Toddler": 0,
    "Stroller - Double": 0,
    "Stroller - Single": 0,
    "Stroller - Umbrella": 0,
    "Stroller-Accessories": 0,
  },
  Safety: {
    "Grocery Cart Covers": 0,
    "Safety Gate": 0,
    "Safety-Monitor": 0,
    "Saftey Accessories": 0,
  },
  "Bath and Changing": {
    "Baby Bath": 0,
    "Baby Bath Seat": 0,
    "Baby Bath Towels": 0,
    "Baby Bath Wash Cloths": 0,
    "Changing Table": 0,
    "Changing Table Pad": 0,
    "Changing Table Pad Cover/Sheet": 0,
    "Diaper Bag": 0,
    "Diaper Genie": 0,
    "Diaper Genie Refills": 0,
    Diapers: 0,
    "Hygiene - Baby (Large)": 0,
    "Hygiene - Baby (Small)": 0,
    "Hygiene - Mother (Small)": 0,
    "Hygine - Mother (Large)": 0,
    Potty: 0,
    "Wipe Warmer": 0,
    Wipes: 0,
  },
  "Play and Entertainment": {
    "Board Games": 0,
    Books: 0,
    "Bouncer Seat": 0,
    "Bumbo Seat": 0,
    Exersaucer: 0,
    "Jolly Jumper": 0,
    Lovee: 0,
    Mobiles: 0,
    Pacifiers: 0,
    Puzzles: 0,
    "Stuffed Animals": 0,
    Swing: 0,
    "Teethers/Rattles": 0,
    "Toys - Large": 0,
    "Toys - Medium": 0,
    "Toys - Small": 0,
    "Tummy Time": 0,
    Walker: 0,
  },
  Clothing: {
    Clothing: 0,
    "Clothing - Accessories": 0,
    Coats: 0,
    Costumes: 0,
    Hats: 0,
    "Mitten/Gloves": 0,
    Shoes: 0,
    "Socks/Tights": 0,
    Underwear: 0,
  },
  Other: {
    Backpack: 0,
    "Beauty Products": 0,
    "Boppy Pillow": 0,
    "Boppy Pillow Cover": 0,
    Décor: 0,
    "School Supplies": 0,
  },
};

const Categories = () => {
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleClickOpen = (item) => {
    console.log(item);
    setSelectedItem(item);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  // () => handleClickOpen({ category, values })

  return (
    <div>
      <Grid container spacing={3}>
        {Object.entries(items).map(([category, values]) => (
          <Grid item key={category} xs={12} sm={6} md={4}>
            <Button
              variant="outlined"
              onClick={() => {
                console.log("clicked");
              }}
            >
              {category}
            </Button>
          </Grid>
        ))}
      </Grid>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{selectedItem?.category}</DialogTitle>
        <DialogContent>
          <List>
            {selectedItem &&
              Object.entries(selectedItem.values).map(([item, value]) => (
                <ListItem key={item}>
                  <Typography variant="body1">
                    {item}: {value}
                  </Typography>
                </ListItem>
              ))}
          </List>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Categories;
