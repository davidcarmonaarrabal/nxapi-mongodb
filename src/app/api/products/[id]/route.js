import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
};

export async function OPTIONS() {
    return new Response(null, { status: 204, headers });
}

export async function GET(request, { params }) {
    try {
        const { id } = params;
        if (!ObjectId.isValid(id)) {
            return new Response(JSON.stringify({ message: "ID no válido" }), { status: 400, headers });
        }

        const { database } = await connectToDatabase();
        const collection = database.collection(process.env.MONGODB_COLLECTION);

        const result = await collection.findOne({ _id: new ObjectId(id) });

        if (!result) {
            return new Response(JSON.stringify({ message: "Documento no encontrado" }), { status: 404, headers });
        }

        return new Response(JSON.stringify(result), { headers });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: "Error en el servidor" }), { status: 500, headers });
    }
}

export async function PUT(request, { params }) {
    try {
        if (request.headers.get("content-type") !== "application/json") {
            return new Response(JSON.stringify({ message: "Debes proporcionar datos JSON" }), { status: 400, headers });
        }

        const { id } = params;
        if (!ObjectId.isValid(id)) {
            return new Response(JSON.stringify({ message: "ID no válido" }), { status: 400, headers });
        }

        const { database } = await connectToDatabase();
        const collection = database.collection(process.env.MONGODB_COLLECTION);

        const { nombre, precio, tipo } = await request.json();
        const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: { nombre, precio, tipo } });

        if (result.matchedCount === 0) {
            return new Response(JSON.stringify({ message: "Documento no encontrado" }), { status: 404, headers });
        }

        return new Response(JSON.stringify({ message: "Actualizado correctamente" }), { headers });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: "Error en el servidor" }), { status: 500, headers });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = params;
        if (!ObjectId.isValid(id)) {
            return new Response(JSON.stringify({ message: "ID no válido" }), { status: 400, headers });
        }

        const { database } = await connectToDatabase();
        const collection = database.collection(process.env.MONGODB_COLLECTION);

        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return new Response(JSON.stringify({ message: "Documento no encontrado" }), { status: 404, headers });
        }

        return new Response(JSON.stringify({ message: "Eliminado correctamente" }), { headers });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: "Error en el servidor" }), { status: 500, headers });
    }
}
