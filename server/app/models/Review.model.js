import { mongoose } from '../services/mongoose.service.js';

const reviewSchema = new mongoose.Schema({
  author: {
    type: mongoose.Types.ObjectId,
    required: [true, "User Id is required"],
    ref: "Users"
  },
  comment: {
    type: mongoose.Types.ObjectId,
    required: [true, "Comment Id is required"],
    ref: "Comments"
  },
  like: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

reviewSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
reviewSchema.set('toJSON', {
    virtuals: true
});

reviewSchema.findById = function (cb) {
    return this.model('Reviews').find({id: this.id}, cb);
};

const Review = mongoose.model('Reviews', reviewSchema);


export async function findById(id) {
  let result = await Review.findById(id).populate('author', '-password').populate('comment');
  delete result._id;
  delete result.__v;
  return result;
}

export async function findByAuthor(authorId, commentId) {
  let result = await Review.findOne({author: authorId, comment: commentId}).populate('author', '-password').populate('comment');
  delete result._id;
  delete result.__v;
  return result;
}

export async function isExist(authorId, commentId) {
  return await Review.exists({author: authorId, comment: commentId});
}


export function createReview(reviewData) {
    const review = new Review(reviewData);
    return review.save();
}

export function list(perPage, page) {
    return new Promise((resolve, reject) => {
        Review.find()
            .select('-password')
            .limit(perPage)
            .skip(perPage * (page - 1))
            .then(reviews => resolve(reviews))
            .catch(err => reject(err))
    });
}

export function patchReview(id, reviewData) {
    return Review.findOneAndUpdate({
        _id: id
    }, reviewData);
}

export function removeById(reviewId) {
    return new Promise((resolve, reject) => {
        Review.deleteMany({_id: reviewId}, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
}
