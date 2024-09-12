const mongoose = require('mongoose');

const passwordSchema = new mongoose.Schema({
  website: { type: String, required: true },
  password: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Link to the user who owns this password
});

const Password = mongoose.model('Password', passwordSchema);

module.exports = Password;
