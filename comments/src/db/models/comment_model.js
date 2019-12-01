const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentsSchema = new Schema({
    comment: {
        type: String,
        required: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
});

const OrganizationSchema = new Schema({
  organization: {
        type: String,
        unique: true
    },
  comments: [CommentsSchema]
});


const Comments = mongoose.model("Comments", CommentsSchema);
const Organization = mongoose.model("Organization", OrganizationSchema);

module.exports = { Comments, Organization };