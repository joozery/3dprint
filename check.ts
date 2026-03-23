import mongoose from "mongoose";

const QuoteSchema = new mongoose.Schema({}, { strict: false });
const Quote = mongoose.models.Quote || mongoose.model("Quote", QuoteSchema);

async function main() {
    await mongoose.connect("mongodb+srv://devwooyou:joozery1234@devtreed.z96n0sz.mongodb.net/3dprintpro?retryWrites=true&w=majority&appName=devtreed");
    const quotes = await Quote.find().sort({_id: -1}).limit(2);
    console.log(JSON.stringify(quotes, null, 2));
    process.exit(0);
}
main();
