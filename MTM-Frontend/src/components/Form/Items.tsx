type itemType = {
    [key: string]: {
        [key: string]: [number, number];
    };
};

// TODO: Replace this with API call
// [0, 0] = [New, Used]
const items: itemType = {
    Sleep: {
        Bassinet: [5, 5],
        Blanket: [3, 2],
        "Bed Rail": [10, 5],
        Crib: [0, 0],
        "Crib Bedding": [0, 0],
        "Crib Mattress": [0, 0],
        "Pack n Play": [0, 0],
        "Swaddle/Sleep Sack": [0, 0],
    },
    Feeding: {
        "Baby Bottle": [0, 0],
        "Baby Bottle Nipples": [0, 0],
        "Baby Bottle Warmer": [0, 0],
        "Baby Food": [0, 0],
        "Bibs/Burp Cloths": [0, 0],
        "Booster Seat": [0, 0],
        "Breast Pump": [0, 0],
        "Cleaning Supplies": [0, 0],
        "Dishes/Sippy": [0, 0],
        "Feeding - Other": [0, 0],
        Formula: [0, 0],
        "High Chair": [0, 0],
        "Nursing Accessories": [0, 0],
        "Nursing Supplies": [0, 0],
    },
    Travel: {
        "Baby Carrier": [0, 0],
        "Car Seat - Accessories": [0, 0],
        "Car Seat - Booster": [0, 0],
        "Car Seat - Infant": [0, 0],
        "Car Seat - Toddler": [0, 0],
        "Stroller - Double": [0, 0],
        "Stroller - Single": [0, 0],
        "Stroller - Umbrella": [0, 0],
        "Stroller-Accessories": [0, 0],
    },
    Safety: {
        "Grocery Cart Covers": [0, 0],
        "Safety Gate": [0, 0],
        "Safety-Monitor": [0, 0],
        "Saftey Accessories": [0, 0],
    },
    "Bath and Changing": {
        "Baby Bath": [5, 5],
        "Baby Bath Seat": [0, 0],
        "Baby Bath Towels": [0, 0],
        "Baby Bath Wash Cloths": [0, 0],
        "Changing Table": [0, 0],
        "Changing Table Pad": [0, 0],
        "Changing Table Pad Cover/Sheet": [0, 0],
        "Diaper Bag": [3, 2],
        "Diaper Genie": [0, 0],
        "Diaper Genie Refills": [0, 0],
        Diapers: [0, 0],
        "Hygiene - Baby (Large)": [0, 0],
        "Hygiene - Baby (Small)": [0, 0],
        "Hygiene - Mother (Small)": [0, 0],
        "Hygine - Mother (Large)": [0, 0],
        Potty: [0, 0],
        "Wipe Warmer": [0, 0],
        Wipes: [0, 0],
    },
    "Play and Entertainment": {
        "Board Games": [0, 0],
        Books: [0, 0],
        "Bouncer Seat": [0, 0],
        "Bumbo Seat": [0, 0],
        Exersaucer: [0, 0],
        "Jolly Jumper": [0, 0],
        Lovee: [0, 0],
        Mobiles: [0, 0],
        Pacifiers: [0, 0],
        Puzzles: [0, 0],
        "Stuffed Animals": [0, 0],
        Swing: [0, 0],
        "Teethers/Rattles": [0, 0],
        "Toys - Large": [0, 0],
        "Toys - Medium": [0, 0],
        "Toys - Small": [0, 0],
        "Tummy Time": [0, 0],
        Walker: [0, 0],
    },
    Clothing: {
        Clothing: [0, 0],
        "Clothing - Accessories": [0, 0],
        Coats: [0, 0],
        Costumes: [0, 0],
        Hats: [0, 0],
        "Mitten/Gloves": [0, 0],
        Shoes: [0, 0],
        "Socks/Tights": [0, 0],
        Underwear: [0, 0],
    },
    Other: {
        Backpack: [0, 0],
        "Beauty Products": [0, 0],
        "Boppy Pillow": [0, 0],
        "Boppy Pillow Cover": [0, 0],
        Décor: [0, 0],
        "School Supplies": [0, 0],
    },
};

export { items, type itemType };