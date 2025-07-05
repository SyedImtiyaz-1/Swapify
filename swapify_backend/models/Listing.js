const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    title: { type: String, required: true },
    seller_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    seller_no: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    cover_image: { type: String, required: true },
    additional_images: [{ type: String }],
    category: { type: String, required: true },
    subcategory: { type: String, required: true },
    location_display_name: { type: String, required: true },
    country: { type: String },
    state: { type: String },
    city: { type: String },
    pincode: { type: String },
    created_at: { type: Date, default: Date.now },
    deleted: { type: Boolean, default: false },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
});

// Create a 2dsphere index for geospatial queries
listingSchema.index({ location: "2dsphere" });

// Create a text index for text search with field weights
listingSchema.index({
    title: 'text',
    description: 'text',
    location_display_name: 'text',
    city: 'text',
    state: 'text'
}, {
    weights: {
        title: 10,
        description: 5,
        location_display_name: 3,
        city: 2,
        state: 1
    },
    name: "TextSearchIndex"
});

// Create a compound index for common queries
listingSchema.index({ 
    deleted: 1, 
    created_at: -1 
});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;