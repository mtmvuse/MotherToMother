/**
 * feed the database with test data for development
 * USED FOR TESTING PURPOSES ONLY
 * PRISMA STUDIO - DIRECTLY, SQL WORKBENCH - DIRECTLY
 */
import { db } from "../src/utils/db.server";
import { userData, itemData, mockData } from "./mockData";

async function main() {
  // Clear data from the database
  await clearData();
  const org1 = await db.organization.create({
    data: { name: "Helping Hands", type: "NGO" },
  });
  // Seeding User
  const user = await db.user.create({ data: userData });

  // Seeding Item
  const item = await db.item.create({
    data: itemData,
  });

  // Seeding Donation
  const donation = await db.donation.create({
    data: {
      userId: user.id,
    },
  });

  // Seeding DonationDetail
  const donationDetail = await db.donationDetail.create({
    data: {
      donationId: donation.id,
      itemId: item.id,
      usedQuantity: 3,
      newQuantity: 2,
    },
  });

  // Seeding OutgoingDonationStats
  const outgoingDonationStats = await db.outgoingDonationStats.create({
    data: {
      donationId: donation.id,
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

  // async function seedDatabase() {
  //   for (const user of mockData.users) {
  //     await db.user.create({ data: user });
  //   }
  //   for (const item of mockData.items) {
  //     await db.item.create({ data: item });
  //   }
  //   for (const donation of mockData.donations) {
  //     await db.donation.create({ data: donation });
  //   }
  //   for (const detail of mockData.donationDetails) {
  //     await db.donationDetail.create({ data: detail });
  //   }
  //   mockData.donations.forEach(async (donation, index) => {
  //     await db.donation.create({
  //       data: {
  //         ...donation,
  //         userId: user.id, // Use the actual user IDs
  //       },
  //     });
  //   });
  // }
  // await seedDatabase();

  for (const userData of mockData.users) {
    // Create user and remember the ID
    const user = await db.user.create({
      data: {
        ...userData,
        organizationId: org1.id, // Use the ID from the created organization
      },
    });

    // Create an item for the donation
    const newItem = await db.item.create({
      data: mockData.items[0],
    });

    // Create a donation for the user
    const newDonation = await db.donation.create({
      data: {
        userId: user.id,
        date: new Date(),
      },
    });

    // Create donation details for the donation
    await db.donationDetail.create({
      data: {
        donationId: newDonation.id,
        itemId: newItem.id,
        usedQuantity: 3,
        newQuantity: 2,
      },
    });
  }
}

// Function to clear data from the database
async function clearData() {
  await db.donationDetail.deleteMany();
  await db.outgoingDonationStats.deleteMany();
  await db.donation.deleteMany();
  await db.item.deleteMany();
  await db.user.deleteMany();
  await db.organization.deleteMany();
  console.log("Data cleared");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await db.$disconnect();
  });
