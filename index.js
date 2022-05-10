const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://dbuser1:R5K0m7Y84uCB7R2n@azmain951.txngk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const categoriesCollection = client.db("ExamPrep").collection("categories");
        const booksCollection = client.db("ExamPrep").collection("books");
        const questionsCollection = client.db("ExamPrep").collection("questions");

        app.get('/categories', async (req, res) => {
            const query = {};
            const cursor = categoriesCollection.find(query);
            const categories = await cursor.toArray();
            res.send(categories);
        });

        app.get('/books', async (req, res) => {
            const query = {};
            const cursor = booksCollection.find(query);
            const books = await cursor.toArray();
            res.send(books);
        });

        app.get('/questions', async (req, res) => {
            const query = {};
            const cursor = questionsCollection.find(query);
            const questions = await cursor.toArray();
            res.send(questions);
        });

        app.get('/question', async (req, res) => {
            const category = req.query.category;
            const no = req.query.no;
            if (req.query.category && !req.query.no) {
                const query = { category };
                const cursor = questionsCollection.find(query);
                const result = await cursor.toArray();
                res.send(result);
            }
            if (req.query.category && req.query.no) {
                const query = { category, bscNo: no };
                const cursor = questionsCollection.find(query);
                const result = await cursor.toArray();
                res.send(result);
            }
        });
        app.post('/questions', async (req, res) => {
            const newQuestion = req.body;
            console.log('adding new user', newQuestion);
            const result = await questionsCollection.insertOne(newQuestion);
            res.send(result);
        });
    }
    finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('ExamPrep server is running');
});

app.listen(port, () => {
    console.log('Listen in port:', port);
});