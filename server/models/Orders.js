const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },
    type: String,
    quantity: String,
    specifications: String,
    procurement: Boolean,
    sorting: Boolean,
    packing: Boolean,
    shipping: Boolean,
    orderDelivered: Boolean,
    orderDate: { type: Date, default: Date.now },
});

const OrderModel = mongoose.model("orders", OrderSchema);

module.exports = OrderModel;