/**
 * feed the database with test data for development
 */
import { db } from "../src/utils/db.server";

async function main() {
  // Clear data from the database
  // await clearData();

  // Seeding User
  const user = await db.user.create({
    data: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      hash: "hashed_password",
      salt: "random_salt",
      phone: "1234567890",
      address: "123 Main St",
      city: "Anytown",
      state: "Anystate",
      zip: 12345,
      role: "User",
      type: "UserType",
      household: "abc",
    },
  });

  // Seeding Item
  const item = await db.item.create({
    data: {
      name: "Sample Item",
      quantityUsed: 10,
      quantityNew: 5,
      valueUsed: 15.5,
      valueOld: 10.0,
    },
  });

  // Seeding Donation
  const donation = await db.donation.create({
    data: {
      userID: user.id,
    },
  });

  // Seeding DonationDetail
  const donationDetail = await db.donationDetail.create({
    data: {
      donationID: donation.id,
      itemID: item.id,
      quantityUsed: 3,
      quantityNew: 2,
    },
  });

  // Seeding OutgoingDonationStats
  const outgoingDonationStats = await db.outgoingDonationStats.create({
    data: {
      donationID: donation.id,
      numberServed: 100,
      whiteNum: 20,
      latinoNum: 25,
      blackNum: 15,
      nativeNum: 10,
      asianNum: 20,
      otherNum: 10,
    },
  });

  console.log(`Seeding finished.`);
}

// Function to clear data from the database
async function clearData() {
  await db.donationDetail.deleteMany();
  await db.outgoingDonationStats.deleteMany();
  await db.donation.deleteMany();
  await db.item.deleteMany();
  await db.user.deleteMany();
  console.log("Data cleared");
}

main();
