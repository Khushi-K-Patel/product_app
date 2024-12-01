import { Schema, model, models } from 'mongoose';

const ProductSchema = new Schema({
    name: { type: String, required: true },
    count: { type: Number, required: true },
}, { timestamps: true });

const Product = models.Product || model('Product', ProductSchema);

export default Product;
