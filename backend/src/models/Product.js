import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true,
  },
  brand: {
    type: String,
    default: 'Zenach',
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: 0,
  },
  sizes: {
    type: [Number],
    required: [true, 'Please add available sizes'],
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['men', 'women', 'kids'],
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  imageUrl: {
    type: String,
    required: [true, 'Please add an image URL'],
  },
  stock: {
    type: Number,
    required: [true, 'Please add stock quantity'],
    min: 0,
    default: 0,
  },
}, {
  timestamps: true,
});

// Index for text search
productSchema.index({ name: 'text', description: 'text' });

export default mongoose.model('Product', productSchema);
