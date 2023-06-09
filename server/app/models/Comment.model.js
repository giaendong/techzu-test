import { mongoose } from '../services/mongoose.service.js';

const commentSchema = new mongoose.Schema({
  author: {
    type: mongoose.Types.ObjectId,
    required: [true, "User Id is required"],
    ref: "Users"
  },
  comment: {
    type: String,
    required: [true, "Comment is required"],
  },
  parentId: {
    type: mongoose.Types.ObjectId,
    ref: "Comments",
    default: null,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
  deletedAt: {
    type: Date,
    default: null,
  },
  replies: [{
    type: mongoose.Types.ObjectId,
    ref: "Comments"
  }]
});

commentSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
commentSchema.set('toJSON', {
    virtuals: true
});

commentSchema.findById = function (cb) {
    return this.model('Comments').find({id: this.id}, cb);
};

const Comment = mongoose.model('Comments', commentSchema);

export async function findById(id) {
  const result = await Comment.findById(id);
  result = result.toJSON();
  delete result._id;
  delete result.__v;
  return result;
}

export function createComment(commentData) {
    const comment = new Comment(commentData);
    return comment.save();
}

export function listReply(perPage, page, parentId) {
    return new Promise((resolve, reject) => {
        Comment.find({parentId})
            .limit(perPage)
            .skip(perPage * page)
            .then(comment => resolve(comment))
            .catch(err => reject(err))
    });
}

export function listParent(perPage, page) {
  return new Promise((resolve, reject) => {
      Comment.find({parentId: null})
          .populate({path: 'replies', perDocumentLimit: 10})
          .populate('author', '-password')
          .limit(perPage)
          .skip(perPage * page)
          .then(comment => resolve(comment))
          .catch(err => reject(err))
  });
}

export function patchComment(id, commentData) {
    return Comment.findByIdAndUpdate(id, commentData);
}

export function removeById(id) {
    return new Promise((resolve, reject) => {
        Comment.deleteMany({_id: id}, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
}
