import { connectToDatabase } from "@/lib/mongodb";

const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS", 
    "Access-Control-Allow-Headers": "Content-Type, Authorization" 
};

export async function OPTIONS() {
    return new Response(null, { status: 204, headers });
}

export async function GET(request) {
    const { database } = await connectToDatabase();
    const collection = database.collection(process.env.MONGODB_COLLECTION);

    const results = await collection.find({}).toArray();

    return new Response(JSON.stringify(results), { headers });
}

export async function POST(request) {
    const content = request.headers.get("content-type");

    if (content !== "application/json") {
        return new Response(JSON.stringify({ message: "Debes proporcionar datos JSON" }), { headers });
    }

    const { database } = await connectToDatabase();
    const collection = database.collection(process.env.MONGODB_COLLECTION);

    const { nombre, precio, tipo } = await request.json(); 
    const results = await collection.insertOne({ nombre, precio, tipo });

    return new Response(JSON.stringify(results), { headers });
}
