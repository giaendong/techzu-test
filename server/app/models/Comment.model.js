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
  let result = await Comment.findById(id).populate('author', '-password');
  result = result.toJSON();
  delete result.__v;
  return result;
}

export function createComment(commentData) {
    const comment = new Comment(commentData);
    return comment.save();
}

const authorLookup = [
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        pipeline: [
          {
            $project: { password: 0 }
          }
        ],
        as: "author"
      }
    },
    { $set: { author: { $arrayElemAt: ["$author", 0] } } },
  ];

function reviewLookup(authorId) {
  const _authorId = new mongoose.Types.ObjectId(authorId);
  return [
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "comment",
        pipeline: [{ $match: { like: 1 } }],
        as: "likes"
      }
    },
    {
      $addFields: {
        "likeCount": { $size: "$likes" }
      }
    },
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "comment",
        pipeline: [{ $match: { like: -1 } }],
        as: "dislikes"
      }
    },
    {
      $addFields: {
        "dislikeCount": { $size: "$dislikes" }
      }
    },
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "comment",
        pipeline: [{$match: { author: _authorId }}],
        as: "userLikes"
      }
    },
    { 
      $project: {  
        __v: 0,
        likes: 0,
        dislikes: 0,
      }
    },
  ] 
}

export function listReply(parentId, authorId) {
  const _parentId = new mongoose.Types.ObjectId(parentId);
  return new Promise((resolve, reject) => {
    Comment.aggregate([
      {
        $match: {
          deletedAt: null,
          parentId: _parentId
        },
      },
      { $sort: { createdAt: -1 } },
      ...authorLookup,
      { 
        $lookup: {
          from: "comments",
          localField: "replies",
          foreignField: "_id",
          pipeline: [
            ...authorLookup,
            ...reviewLookup(authorId),
            { $match: { deletedAt: null } },
            { $sort: { createdAt: -1 } },
            { $limit: 3 }
          ],
          as: "replies"
        }
      },
      ...reviewLookup(authorId)
    ])
    .then(comment => resolve(comment))
    .catch(err => reject(err))
  })
}

export function countReplies(parentId) {
  return Comment.countDocuments({parentId, deletedAt: null});
}

export function listParent(perPage, page, authorId, sortBy) {
  let sort = {};
  if (sortBy === 'likes') {
    sort.likeCount = -1;
  } else if (sortBy === 'dislikes') {
    sort.dislikeCount = -1;
  } else {
    sort.createdAt = -1;
  }
  return new Promise((resolve, reject) => {
    Comment.aggregate([
      {
        $match: {
          deletedAt: null,
          parentId: null
        },
      },
      ...authorLookup,
      { 
        $lookup: {
          from: "comments",
          localField: "replies",
          foreignField: "_id",
          pipeline: [
            ...authorLookup,
            ...reviewLookup(authorId),
            { $match: { deletedAt: null } },
            { $sort: { createdAt: -1 } },
            { $limit: 3 }
          ],
          as: "replies"
        }
      },
      ...reviewLookup(authorId),
      { $sort: sort },
      { $skip: perPage * (page - 1) },
      { $limit: perPage },
    ])
    .then(comment => resolve(comment))
    .catch(err => reject(err))
  })
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
