const mongoose = require('mongoose');

const uri = "mongodb+srv://devwooyou:joozery1234@devtreed.z96n0sz.mongodb.net/3dprintpro?retryWrites=true&w=majority&appName=devtreed";

async function main() {
  await mongoose.connect(uri);
  console.log("Connected to MongoDB");

  const db = mongoose.connection.db;
  const collection = db.collection('users');

  const user = await collection.findOne({ email: 'zerryboy28@gmail.com' });
  if (!user) {
    console.log("User not found, creating a new user for testing...");
    await collection.insertOne({
      name: "Zerry Boy",
      email: "zerryboy28@gmail.com",
      isVerified: true,
      shippingAddresses: [{
        label: "International Office",
        fullName: "Zerry Boy",
        phone: "+1 555-123-4567",
        address: "123 Tech Lane, Suite 400",
        district: "California",
        subDistrict: "San Francisco",
        province: "United States",
        zipCode: "94105",
        isDefault: true,
        isInternational: true
      }]
    });
    console.log("User created with international address.");
  } else {
    console.log("User found, updating shipping addresses...");
    await collection.updateOne(
      { email: 'zerryboy28@gmail.com' },
      {
        $push: {
          shippingAddresses: {
            label: "US Office",
            fullName: user.name || "Zerry Boy",
            phone: "+1 555-123-4567",
            address: "456 Silicon Valley Blvd",
            district: "California",
            subDistrict: "San Jose",
            province: "United States",
            zipCode: "95112",
            isDefault: false,
            isInternational: true
          }
        }
      }
    );
    console.log("International address added to existing user.");
  }

  await mongoose.disconnect();
}

main().catch(console.error);
