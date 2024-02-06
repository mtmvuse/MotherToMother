/**
 * feed the database with test data for development
 * USED FOR TESTING PURPOSES ONLY
 * PRISMA STUDIO - DIRECTLY, SQL WORKBENCH - DIRECTLY
 */
import { db } from "../src/utils/db.server";

async function main() {
  // Clear data from the database
  await clearData();
  const org1 = await db.organization.create({
    data: { name: "Helping Hands", type: "NGO" },
  });
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
      userType: "UserType",
      household: "abc",
      organizationId: org1.id,
    },
  });

  // Seeding Item
  const item = await db.item.create({
    data: {
      category: "Sample Category",
      name: "Sample Item",
      quantityUsed: 10,
      quantityNew: 5,
      valueUsed: 15.5,
      valueNew: 10.0,
    },
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
  const mockData = {
    users: [
      {
        firstName: "NEW",
        lastName: "USER1",
        email: "john.doe3@example.com",
        userType: "Individual",
        organizationId: 1,
        hash: "hashed_password",
        salt: "random_salt",
        phone: "1234567890",
        address: "123 Main St",
        city: "Anytown",
        state: "Anystate",
        zip: 12345,
        role: "User",
        household: "abc",
      },
      {
        firstName: "NEW",
        lastName: "USER2",
        email: "john.doe2@example.com",
        userType: "Individual",
        organizationId: 1,
        hash: "hashed_password",
        salt: "random_salt",
        phone: "1234567890",
        address: "123 Main St",
        city: "Anytown",
        state: "Anystate",
        zip: 12345,
        role: "User",
        household: "abc",
      },
    ],
    items: [
      {
        category: "Books",
        name: "Educational Book",
        quantityUsed: 10,
        quantityNew: 5,
        valueUsed: 2.5,
        valueNew: 5.0,
      },
      {
        category: "Clothes",
        name: "T-Shirt",
        quantityUsed: 20,
        quantityNew: 10,
        valueUsed: 1.5,
        valueNew: 3.0,
      },
    ],
    donations: [
      { userId: 1, date: new Date() },
      { userId: 2, date: new Date() },
    ],
    donationDetails: [
      { donationId: 1, itemId: 1, usedQuantity: 5, newQuantity: 3 },
      { donationId: 2, itemId: 2, usedQuantity: 10, newQuantity: 2 },
    ],
  };

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
