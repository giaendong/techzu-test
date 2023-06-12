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
  deletedAt: {
    type: Date,
    default: null,
  },
  replies: [{
    type: mongoose.Types.ObjectId,
    ref: "Comments",
    index: true
  }]
}, { timestamps: true });

commentSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

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

export function countReplies(parentId) {
  return Comment.countDocuments({parentId, deletedAt: null});
}

export function listParent(perPage, page) {
  return new Promise((resolve, reject) => {
      Comment.find({parentId: null, deletedAt: null})
          .sort({createdAt: -1})
          .populate({
            path: 'replies',
            perDocumentLimit: 3,
            options: {
              sort: {
                createdAt: -1
              }
            },
            populate: {
              path: 'author',
              select: '-password',
            }
          })
          .populate('author', '-password')
          .limit(perPage)
          .skip(perPage * (page - 1))
          .then(comment => resolve(comment))
          .catch(err => reject(err))
  });
}

export function countComment() {
  return Comment.countDocuments({parentId: null, deletedAt: null});
}

export function patchComment(id, commentData) {
    return Comment.findByIdAndUpdate(id, commentData);
}

export function removeById(id) {
  return Comment.findByIdAndUpdate(id, {deletedAt: new Date().toISOString()});
}
