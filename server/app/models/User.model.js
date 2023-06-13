import { mongoose } from '../services/mongoose.service.js';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Your email address is required"],
    unique: true,
  },
  username: {
    type: String,
    required: [true, "Your username is required"],
  },
  password: {
    type: String,
    required: [true, "Your password is required"],
  }
}, { timestamps: true });

userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
userSchema.set('toJSON', {
    virtuals: true
});

userSchema.findById = function (cb) {
    return this.model('Users').find({id: this.id}, cb);
};

const User = mongoose.model('Users', userSchema);


export function findByEmail(email) {
    return User.find({email: email});
}

export async function findById(id) {
  let result = await User.findById(id).select('-password');
  delete result._id;
  delete result.__v;
  return result;
}

export function createUser(userData) {
    const user = new User(userData);
    return user.save();
}

export function list(perPage, page) {
    return new Promise((resolve, reject) => {
        User.find()
            .select('-password')
            .limit(perPage)
            .skip(perPage * (page - 1))
            .then(users => resolve(users))
            .catch(err => reject(err))
    });
}

export function patchUser(id, userData) {
    return User.findOneAndUpdate({
        _id: id
    }, userData);
}

export function removeById(userId) {
    return new Promise((resolve, reject) => {
        User.deleteMany({_id: userId}, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
}
