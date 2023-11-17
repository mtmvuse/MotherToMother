/**
 * feed the database with test data for development
 */
import type { UserInput } from "../src/types/user";
import type {
  OutgoingDonationType,
  ItemType,
  DonationDetailsType,
} from "../src/types/donation";
import { hashPassword } from "../src/routes/v1/user/user.service";
import { db } from "../src/utils/db.server";

const getUsers = (): Array<UserInput> => {
  return [
    {
      id: 5,
      uid: "123456789",
      firstName: "Sam",
      lastName: "Pope",
      email: "sap@gmail.com",
      password: "123owidc!jJ5",
      userType: "donor",
      phone: "123456",
      address: 'westend',
      city: 'Nashville',
      state: 'TN',
      zip: 37235,
    },
    {
      id: 6,
      uid: "987654321",
      firstName: "John",
      lastName: "Doe",
      email: "jod@gmail.com",
      password: "123owidc!jJ8",
      userType: "requester",
      phone: "78901",
      address: '21st',
      city: 'Atlanta',
      state: 'GA',
      zip: 30313,
    },
  ];
};

const getOutgoingDonations = (): Array<OutgoingDonationType> => {
  return [
    {
      id: 1,
      requesterID: 5,
      date: new Date("2023-01-01"),
      numberServed: 100,
      whiteNum: 25,
      latinoNum: 25,
      blackNum: 25,
      nativeNum: 10,
      asianNum: 10,
      otherNum: 5,
    },
    {
      id: 2,
      requesterID: 6,
      date: new Date("2023-02-01"),
      numberServed: 150,
      whiteNum: 30,
      latinoNum: 30,
      blackNum: 30,
      nativeNum: 20,
      asianNum: 20,
      otherNum: 20,
    },
  ];
};

const getItem = (): Array<ItemType> => {
  return [
    {
      id: 1,
      name: "Apples",
    },
    {
      id: 2,
      name: "Oranges",
    },
  ];
};

const getDonationDetails = (): Array<DonationDetailsType> => {
  return [
    {
      itemID: 1,
      quantityUsed: 100,
      quantityNew: 150,
      outgoingDonationId: 1,
    },
    {
      itemID: 2,
      quantityUsed: 150,
      quantityNew: 200,
      outgoingDonationId: 2,
    },
  ];
};

async function clearData() {
  await db.user.deleteMany({});
  await db.OutgoingDonationStats.deleteMany({});
  await db.item.deleteMany({});
  await db.DonationDetail.deleteMany({});
}

const seed = async () => {
  const users = getUsers();
  console.log("Seeding users...");

  await clearData();

  console.log("Cleared data...");

  for (const user of users) {
    const { password, uid, ...userInfo } = user;
    const { hash, salt } = await hashPassword(password);
    await db.user.create({ data: { ...userInfo, hash: hash, salt: salt } });
  }

  const outgoingDonations = getOutgoingDonations();
  console.log("Seeding outgoingDonations...");

  for (const outgoingDonation of outgoingDonations) {
    await db.outgoingDonation.create({ data: outgoingDonation });
  }

  const items = getItem();
  console.log("Seeding items...");

  for (const item of items) {
    await db.item.create({ data: item });
  }

  const donationDetails = getDonationDetails();
  console.log("Seeding donationDetails...");

  for (const donationDetail of donationDetails) {
    await db.donationDetails.create({ data: donationDetail });
  }

  console.log("Seeding complete!");
};

seed();
