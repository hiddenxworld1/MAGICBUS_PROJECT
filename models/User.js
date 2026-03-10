const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'moderator', 'admin'],
    default: 'student'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'banned'],
    default: 'active'
  }
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt    = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, salt);
  next();
});

// Compare password
UserSchema.methods.comparePassword = function(enteredPassword) {
  return bcrypt.compareSync(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);