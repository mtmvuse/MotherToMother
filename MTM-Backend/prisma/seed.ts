/**
 * feed the database with test data for development
 * USED FOR TESTING PURPOSES ONLY
 * PRISMA STUDIO - DIRECTLY, SQL WORKBENCH - DIRECTLY
 */
import { db } from "../src/utils/db.server";
import {
  organizationData,
  userDataMock,
  itemDataMock,
  adminDataMock,
} from "./mockData";

async function main() {
  // Clear data from the database
  await clearData();

  // seed organiztion data
  const orgs = [];
  for (const orgData of organizationData) {
    const org = await db.organization.create({
      data: orgData,
    });
    orgs.push(org);
  }

  // seed item data
  const items = [];
  for (const itemData of itemDataMock) {
    const newItem = await db.item.create({
      data: itemData,
    });
    items.push(newItem);
  }

  // seed user and donation data
  for (const userData of userDataMock) {
    // Create user and remember the ID
    const user = await db.user.create({
      data: {
        ...userData,
        organizationId:
          orgs.find((org) => org.type === userData.userType.split(" ")[0])
            ?.id || orgs[0].id,
      },
    });

    // Create 2 cash donations for each user
    for (let i = 0; i < 2; ++i) {
      const date = new Date();
      date.setDate(date.getDate() - 2 * i);
      await db.cashDonation.create({
        data: {
          userId: user.id,
          date: date,
          total: Math.floor(Math.random() * 1000),
        },
      });
    }

    // Create 10 donations for each user
    for (let i = 0; i < 10; ++i) {
      const newDonation = await db.donation.create({
        data: {
          userId: user.id,
          date: new Date(new Date().setDate(new Date().getDate() + i)),
        },
      });

      // Create 2 donation details for each donation
      for (let j = 0; j < 2; ++j) {
        await db.donationDetail.create({
          data: {
            donationId: newDonation.id,
            itemId: items[j].id,
            usedQuantity: 3,
            newQuantity: 2,
          },
        });
      }

      if (user.userType === "Agency Partner") {
        await db.outgoingDonationStats.create({
          data: {
            donationId: newDonation.id,
            numberServed: 100,
            whiteNum: 20,
            latinoNum: 25,
            blackNum: 15,
            nativeNum: 10,
            asianNum: 20,
            otherNum: 10,
          },
        });
      }
    }
  }
  // seed admin data
  for (const adminData of adminDataMock) {
    await db.admin.create({
      data: adminData,
    });
  }
}

// Function to clear data from the database
async function clearData() {
  await db.cashDonation.deleteMany();
  await db.donationDetail.deleteMany();
  await db.outgoingDonationStats.deleteMany();
  await db.donation.deleteMany();
  await db.item.deleteMany();
  await db.user.deleteMany();
  await db.organization.deleteMany();
  await db.admin.deleteMany();
  console.log("Data cleared");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await db.$disconnect();
  });
