
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const UserModel = require('./models/Users');
const OrderModel = require('./models/Orders');

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Define a valid user for login
const validUser = {
	email: 'gupta@exportoenterprises.com',
	password: 'Hanuman@123',
};

// MongoDB Atlas connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://studytapdevloper1:studytap@cluster0.gmsppqh.mongodb.net/test';

mongoose.connect(MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
})
	.then(() => {
		console.log('MongoDB connected successfully');
	})
	.catch((err) => {
		console.error('Error connecting to MongoDB:', err);
		// Exit the application if there's an error in connecting to the database
		process.exit(1);
	});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ message: 'Internal server error' });
});

// Login endpoint
app.post('/api/login', (req, res) => {
	const { email, password } = req.body;

	// Check if the entered credentials match the valid user
	if (email === validUser.email && password === validUser.password) {
		// Successful login
		res.status(200).json({ success: true, message: 'Login successful' });
	} else {
		// Invalid credentials
		res.status(401).json({ success: false, message: 'Invalid email or password' });
	}
});

// Endpoint to get all users with their orders
app.get('/get-users', async (req, res) => {
	try {
		const users = await UserModel.find();
		const orders = await OrderModel.find({ userId: { $in: users.map(user => user._id) } });

		const userOrdersMap = orders.reduce((map, order) => {
			map[order.userId] = true;
			return map;
		}, {});

		const usersWithOrders = users.map(user => ({
			...user.toObject(),
			hasOrder: userOrdersMap[user._id] || false,
		}));

		res.json(usersWithOrders);
	} catch (error) {
		console.error('Error fetching users or orders:', error);
		res.status(500).json({ error: error.message || 'Internal Server Error' });
	}
});

// Endpoint to delete a user
app.delete('/delete-user/:userId', async (req, res) => {
	const userId = req.params.userId;
	console.log(`Received delete request for user ID: ${userId}`);

	try {
		const result = await UserModel.findByIdAndDelete(userId);

		if (!result) {
			return res.status(404).json({ message: 'User not found' });
		}

		// Optionally, you can also log more information here
		console.log('User deleted successfully:', result);

		res.status(200).json({ message: 'User deleted successfully' });
	} catch (error) {
		console.error('Error deleting user:', error);
		res.status(500).json({ message: 'Internal server error' });
	}
});


// Endpoint to get all orders
app.get('/get-orders', async (req, res) => {
	try {
	  const orders = await OrderModel.find();
	  res.json({ orders });
	} catch (error) {
	  console.error('Error fetching orders:', error);
	  res.status(500).json({ error: error.message || 'Internal Server Error' });
	}
  });



// Endpoint to get a specific user's orders
app.get('/get-orders/:userId', async (req, res) => {
	try {
		const userId = req.params.userId;
		const orders = await OrderModel.find({ userId: new mongoose.Types.ObjectId(userId) });

		res.json({ orders });
	} catch (error) {
		console.error('Error fetching orders:', error);
		res.status(500).json({ error: error.message || 'Internal Server Error' });
	}
});

// Endpoint to delete an order
app.delete('/delete-order/:orderId', async (req, res) => {
	const orderId = req.params.orderId;
	console.log(`Received delete request for order ID: ${orderId}`);

	try {
		const result = await OrderModel.findByIdAndDelete(orderId);

		if (!result) {
			return res.status(404).json({ message: 'Order not found' });
		}

		// Optionally, you can also log more information here
		console.log('Order deleted successfully:', result);

		res.status(200).json({ message: 'Order deleted successfully' });
	} catch (error) {
		console.error('Error deleting order:', error);
		res.status(500).json({ message: 'Internal server error' });
	}
});

// Endpoint to update an order
app.put('/update-order/:orderId', async (req, res) => {
	const orderId = req.params.orderId;
	const updatedOrderData = req.body; // Assuming you're sending the updated order data in the request body

	try {
		// Use findOneAndUpdate or findByIdAndUpdate to update the order in the database
		const updatedOrder = await OrderModel.findByIdAndUpdate(orderId, updatedOrderData, { new: true });

		if (!updatedOrder) {
			return res.status(404).json({ message: 'Order not found' });
		}

		res.status(200).json({ message: 'Order updated successfully', updatedOrder });
	} catch (error) {
		console.error('Error updating order:', error);
		res.status(500).json({ message: 'Internal server error' });
	}
});

// Start the server
app.listen(3001, () => {
	console.log('Server is running on port 3001');
});
