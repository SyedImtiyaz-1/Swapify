const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/create-listing', authMiddleware, async (req, res) => {
    const { title, price, description, phoneNumber, coverImageName, additionalImageNames, category, subcategory, location } = req.body;
    
    if (!location?.lat || !location?.lon) {
        return res.status(400).json({ 
            message: 'Location coordinates are required'
        });
    }

    try {
        const listing = new Listing({
            title,
            price,
            description,
            seller_no: phoneNumber,
            cover_image: coverImageName,
            additional_images: additionalImageNames,
            category,
            subcategory,
            location_display_name: location.display_name,
            location: {
                type: "Point",
                coordinates: [parseFloat(location.lon), parseFloat(location.lat)]
            },
            seller_id: req.userId
        });

        const savedListing = await listing.save();
        const populatedListing = await Listing.findById(savedListing._id)
            .populate('seller_id', 'username email');
        
        res.status(200).json({ 
            message: 'Listing created successfully', 
            listing: populatedListing 
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error creating listing',
            error: error.message
        });
    }
});

router.get('/listings', async (req, res) => {
    try {
        const listings = await Listing.find({ deleted: { $ne: true } })
            .populate('seller_id', 'username email')
            .sort({ created_at: -1 }); // Sort by created_at in descending order (most recent first)
        res.status(200).json(listings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching listings' });
    }
});

router.get('/listings/:id', async (req, res) => {
    try {
        const listing = await Listing.findOne({ 
            _id: req.params.id,
            deleted: { $ne: true }
        }).populate('seller_id', '-password');
        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }
        res.status(200).json(listing);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching listing' });
    }
});

router.get('/my-listings', authMiddleware, async (req, res) => {
    try {
        const listings = await Listing.find({ 
            seller_id: req.userId,
            deleted: { $ne: true }
        });
        res.status(200).json(listings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching listings' });
    }
});

router.delete('/listings/:id', authMiddleware, async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        
        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        if (listing.seller_id.toString() !== req.userId) {
            return res.status(403).json({ message: 'Unauthorized to delete this listing' });
        }

        await Listing.findByIdAndUpdate(req.params.id, { deleted: true });
        res.status(200).json({ message: 'Listing deleted successfully' });
    } catch (error) {
        console.error('Error deleting listing:', error);
        res.status(500).json({ message: 'Error deleting listing' });
    }
});

router.put('/listings/:id', authMiddleware, async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        
        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        if (listing.seller_id.toString() !== req.userId) {
            return res.status(403).json({ message: 'Unauthorized to update this listing' });
        }

        const { title, price, description, phoneNumber, coverImageName, additionalImageNames, category, subcategory, location } = req.body;

        const updateData = {
            title,
            price,
            description,
            seller_no: phoneNumber,
            cover_image: coverImageName,
            additional_images: additionalImageNames,
            category,
            subcategory,
            location_display_name: location.display_name,
            location: {
                type: "Point",
                coordinates: [parseFloat(location.lon), parseFloat(location.lat)]
            }
        };

        const updatedListing = await Listing.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        ).populate('seller_id', 'username email');

        res.status(200).json({ 
            message: 'Listing updated successfully',
            listing: updatedListing
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error updating listing',
            error: error.message
        });
    }
});

router.get('/search-listings', async (req, res) => {
    try {
        const { query, latitude, longitude, maxDistance = 50 } = req.query;
        
        if (!query) {
            return res.status(400).json({ 
                listings: [],
                message: 'Search query is required' 
            });
        }

        // Build the base query
        let searchQuery = {
            deleted: { $ne: true },
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        };

        // Add location filter if coordinates are provided
        if (latitude && longitude) {
            const coordinates = [parseFloat(longitude), parseFloat(latitude)];
            
            // Validate coordinates
            if (isNaN(coordinates[0]) || isNaN(coordinates[1])) {
                return res.status(400).json({
                    listings: [],
                    message: 'Invalid coordinates provided'
                });
            }

            searchQuery.location = {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: coordinates
                    },
                    $maxDistance: parseInt(maxDistance) * 1000 // Convert km to meters
                }
            };
        }


        // Execute search
        const listings = await Listing.find(searchQuery)
            .populate('seller_id', 'username email')
            .sort({ created_at: -1 })
            .limit(50);


        // Process listings to add distance if location provided
        const processedListings = listings.map(listing => {
            const listingObj = listing.toObject();

            if (latitude && longitude) {
                const [lon2, lat2] = listing.location.coordinates;
                const distance = calculateDistance(
                    parseFloat(latitude),
                    parseFloat(longitude),
                    lat2,
                    lon2
                );
                listingObj.distance = parseFloat(distance.toFixed(2));
            }

            return listingObj;
        });

        res.status(200).json({
            listings: processedListings,
            total: processedListings.length,
            message: `Found ${processedListings.length} listings`
        });
    } catch (error) {
        console.error('Error in search API:', error);
        res.status(500).json({ 
            listings: [],
            total: 0,
            message: 'Failed to fetch search results',
            error: error.message
        });
    }
});

router.get('/nearby-listings', async (req, res) => {
    try {
        const { longitude, latitude, maxDistance = 50000, category } = req.query;
        
        // Validate presence of coordinates
        if (!longitude || !latitude) {
            return res.status(400).json({ 
                listings: [],
                message: 'Longitude and latitude are required'
            });
        }

        // Parse and validate coordinates
        const parsedLon = parseFloat(longitude);
        const parsedLat = parseFloat(latitude);
        const parsedMaxDistance = parseInt(maxDistance);

        if (isNaN(parsedLon) || isNaN(parsedLat)) {
            return res.status(400).json({ 
                listings: [],
                message: 'Invalid coordinates format'
            });
        }

        // Build the query
        let query = {
            deleted: { $ne: true },
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parsedLon, parsedLat]
                    },
                    $maxDistance: parsedMaxDistance
                }
            }
        };

        // Add category filter if provided
        if (category && category !== 'all') {
            // Search in both category and category fields
            query.$or = [
                { category: category },
                { category: category }
            ];
        }


        // Find listings within specified radius only
        const listings = await Listing.find(query)
            .populate('seller_id', 'username email')
            .sort({ created_at: -1 });

       

        // Calculate accurate distances and filter by max distance
        const listingsWithDistance = listings
            .map(listing => {
                const coordinates = listing.location.coordinates;
                const distance = calculateDistance(
                    parsedLat,
                    parsedLon,
                    coordinates[1],
                    coordinates[0]
                );
                
                return {
                    ...listing.toObject(),
                    distance: parseFloat(distance.toFixed(2))
                };
            })
            .filter(listing => listing.distance <= (parsedMaxDistance / 1000)) // Convert meters to km
            .sort((a, b) => a.distance - b.distance);

        // Return response with consistent format
        return res.status(200).json({
            listings: listingsWithDistance,
            message: listingsWithDistance.length > 0 
                ? `Found ${listingsWithDistance.length} listings within ${parsedMaxDistance/1000}km`
                : `No listings found within ${parsedMaxDistance/1000}km of your location`
        });

    } catch (error) {
        console.error('Error in nearby-listings:', error);
        res.status(500).json({ 
            listings: [],
            message: 'Unable to fetch listings at this time. Please try again later.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Helper function to calculate distance between two points
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in km
}

function toRad(value) {
    return value * Math.PI / 180;
}

module.exports = router;

