import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    minlength: 3,
    maxlength: 20,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  name: { type: String, required: true , minlength: 2, maxlength: 20},
  lastname: { type: String, required: true, minlength: 2, maxlength: 20},
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  image: {
    type: String,
  },
  photoFav: {
    type: [Schema.Types.ObjectId],
    ref: "Photos",
  },
  following: [{
    type: Schema.Types.ObjectId,
    ref: "User"
  }],
  followers: [{
    type: Schema.Types.ObjectId,
    ref: "User"
  }],
  profilephoto: {
    type: String,
  },
  leyend: {
    type: String,
    default: "Hey, I'm using Photera",
    minlength: 3,
    maxlength: 50,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

const User = models.User || model("User", UserSchema);
export default User;
