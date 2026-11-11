import mongoose from 'mongoose';
export const TYPES = ['impact', 'programs', 'steps', 'stories'];
// One document per item. `data` holds the item exactly as the front end renders it.
export const Content = mongoose.model('Content', new mongoose.Schema({
  type: { type: String, enum: TYPES, required: true, index: true },
  order: { type: Number, default: 0 },
  data: { type: mongoose.Schema.Types.Mixed, required: true },
}, { timestamps: true }));
