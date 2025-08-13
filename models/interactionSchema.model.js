const mongoose = require('mongoose');

const interactionSchema = new mongoose.Schema({
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    contentId: { 
      type: Number, 
      required: true  // References your static content's ID
    },
    contentType: { 
      type: String, 
      required: true, 
      enum: ['quote', 'advice', 'other'] 
    },
    // Track both types of interactions
    isFavorite: { 
      type: Boolean, 
      default: false 
    },
    isLiked: { 
      type: Boolean, 
      default: false 
    },
    // Timestamps for both actions
    favoritedAt: { 
      type: Date 
    },
    likedAt: { 
      type: Date 
    }
  }, { timestamps: true });
  
  // Compound index for efficient queries
  interactionSchema.index({ user: 1, contentId: 1 }, { unique: true });

module.exports = mongoose.model('interaction', interactionSchema);
