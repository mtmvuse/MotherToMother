/**
 * feed the database with test data for development
 * USED FOR TESTING PURPOSES ONLY
 * PRISMA STUDIO - DIRECTLY, SQL WORKBENCH - DIRECTLY
 */
import { db } from "../src/utils/db.server";
import { organizationData, userDataMock, itemDataMock } from "./mockData";

async function main() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const getRandomIndex = (arr: any) => Math.floor(Math.random() * arr.length);
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

    // Create 3 donations for each user
    for (let i = 0; i < 3; ++i) {
      const newDonation = await db.donation.create({
        data: {
          userId: user.id,
          date: new Date(),
        },
      });

      // Create 5 donation details for each donation
      for (let j = 0; j < 5; ++j) {
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
