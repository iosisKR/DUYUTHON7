import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
  //여기에 이제 사용자 정보(사용횟수)추가하는거임?
});

module.exports = mongoose.model('User', userSchema);