// Import the express module
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');


// Create an express application
const app = express();


const database = require("./config/database");
const userRoutes = require("./routes/User");
const checkoutRoutes = require("./routes/Checkout");

// Define a port to listen to
const PORT = process.env.PORT || 3000;

database.connect();

// middlewares
app.set('trust proxy', 1);
app.use(express.json());
app.use(cookieParser());

app.use(cors({
	origin: 'http://localhost:5173', // Your frontend URL
	credentials: true, // This is important for cookies/auth headers
  }));
  
//route
app.use("/api/v1/auth",userRoutes);
// app.use("/api/v1/process",orderRoutes);
app.use("/api/v1/checkout",checkoutRoutes);

// Create a basic route
app.get("/", (req, res) => {
	return res.json({
		success:true,
		message:'Your server is up and running....'
	});
});

// Start the server and listen on the defined port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


