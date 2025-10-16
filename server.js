const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// In-memory databases
let farmers = [];
let products = [];
let reviews = [];

// --- Farmer Routes ---
app.get('/farmers', (req, res) => res.json(farmers));

app.post('/farmers', (req, res) => {
    const farmer = { ...req.body, id: farmers.length + 1, rating: 0 };
    farmers.push(farmer);
    res.json(farmer);
});

// --- Product Routes ---
app.post('/products', (req,res)=>{
    const product = {...req.body, id: products.length+1};
    products.push(product);
    res.json(product);
});

app.get('/products/:farmerId', (req,res)=>{
    const farmerProducts = products.filter(p=>p.farmerId==req.params.farmerId);
    res.json(farmerProducts);
});

// --- Review Routes ---
app.post('/reviews',(req,res)=>{
    const review = {...req.body, id: reviews.length+1};
    reviews.push(review);

    // update farmer rating
    const farmerReviews = reviews.filter(r=>r.farmerId==review.farmerId);
    const avgRating = farmerReviews.reduce((a,b)=>a+b.rating,0)/farmerReviews.length;
    const farmer = farmers.find(f=>f.id==review.farmerId);
    if(farmer) farmer.rating = avgRating;

    res.json(review);
});

app.get('/reviews/:farmerId',(req,res)=>{
    const farmerReviews = reviews.filter(r=>r.farmerId==req.params.farmerId);
    res.json(farmerReviews);
});

// --- Search Route ---
app.get('/search',(req,res)=>{
    const query = req.query.q?.toLowerCase() || '';
    const result = farmers.filter(f=>{
        return f.name.toLowerCase().includes(query) || products.some(p=>p.farmerId==f.id && p.name.toLowerCase().includes(query));
    });
    res.json(result);
});

app.listen(PORT,()=>console.log(`Server running on port ${PORT}`));
