const { MongoClient } = require('mongodb');
const express = require('express');
const cors = require('cors');
const path = require('path'); // Add this to handle serving HTML

const app = express();

const uri = "mongodb://localhost:27017"; // Change this to your MongoDB URI
const client = new MongoClient(uri);

let db;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve the static files from root

// Connect to MongoDB
client.connect()
    .then(() => {
        db = client.db('DosageSegment'); // Replace with your actual database name
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB', err);
    });

// Serve the HTML file when the user accesses the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Dosage_Divider.html'));
});

// Handle the calculation POST request
// app.post('/calculate', async (req, res) => {
//     try {
//         const { drugName, p, x, q, a, b } = req.body;

//         // Ensure that 'db' is initialized and connected before trying to use it
//         if (!db) {
//             return res.status(500).json({ message: 'Database not connected' });
//         }

//         // Perform a case-insensitive search using a regular expression
//         const drugData = await db.collection('segment').findOne({ 
//             "Generic Name": { $regex: new RegExp(`^${drugName}$`, 'i') } // Use the correct field name and regex for case-insensitive search
//         });

//         if (!drugData) {
//             return res.status(404).json({ message: 'Drug not found' });
//         }

//         // Perform the calculations
//         const c = p * q;
//         const d = (b * c) / a;
//         const e = (x * b) / d;
//         const f = e / b;

//         res.json({ e, f, comments: drugData.Comments });

//     } catch (error) {
//         console.error('Error in /calculate:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });

app.post('/calculate', async (req, res) => {
    try {
        const { drugName, p, x, q, a, b } = req.body;
        console.log("Received data:", { drugName, p, x, q, a, b });

        if (!db) {
            return res.status(500).json({ message: 'Database not connected' });
        }

        const drugData = await db.collection('segment').findOne({
            "Generic Name": { $regex: new RegExp(drugName.trim(), 'i') } // Case-insensitive partial match
        });
        
        console.log("Database result:", drugData); // Check what is returned from the database

        if (!drugData) {
            return res.status(404).json({ message: 'Drug not found' });
        }

        const c = p * q;
        const d = (b * c) / a;
        const e = (x * b) / d;
        const f = e / b;

        res.json({ e, f, comments: drugData.Comments });

    } catch (error) {
        console.error('Error in /calculate:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
