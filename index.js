import express from "express";
import bodyParser from "body-parser";
import { MongoClient } from "mongodb";
import cors from "cors";
import morgan from "morgan";
import "dotenv/config";

const app = express();
app.use(cors());
app.use(morgan("tiny"));
app.use(bodyParser.json());

const mongo = await MongoClient.connect(process.env.MONGO);
const db = mongo.db("database-name");

app.post("/get", async (req, res) => {
	const { table, find, one } = req.body;
	const col = db.collection(table);

	const operation = find?.length
		? col.aggregate(find).toArray()
		: one == "first"
		? col.findOne(find)
		: col.find(find).toArray();

	const found = await operation;

	res.send(found);
});

app.post("/set", async (req, res) => {
	const { table, find, data, one } = req.body;
	const col = db.collection(table);
	const update = { $set: data };

	const operation = one
		? col.updateMany(find, update)
		: col.updateOne(find, update);

	const modifiedCount = await operation;

	res.send({ modifiedCount });
});

app.post("/add", async (req, res) => {
	const { table, data } = req.body;
	const col = db.collection(table);
	const operation = data?.length ? col.insertMany(data) : col.insertOne(data);
	const result = await operation.then(result => result);

	res.send({ inserted: result.insertedId || result.insertedIds });
});

app.post("/del", async (req, res) => {
	const { table, find } = req.body;

	const deletedCount = await mongo
		.db("database-name")
		.collection(table)
		.deleteMany(find)
		.then(r => r.deletedCount);

	res.send({ deletedCount });
});

app.listen(3001, () => console.log("mongodb-adapter-api started"));
