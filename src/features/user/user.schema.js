import mongoose, { modelNames } from "mongoose";
// const { Schema } = mongoose;

export const userSchema = new mongoose.Schema({
  //blueprint
  name: {
    type: String,
    // minLength: 3,
    minLength: [3, "Name should be min 3 chars"],
    maxLength: [20, "name cannot be more than 20 chars"],
  }, // String is shorthand for {type: String}
  email: {
    type: String,
    unique: true,
    required: true,
    match: [
      /^[a-zA-Z0-9_.±]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/,
      "Enter a valid email",
    ],
  }, //to pass error message then use-- required : [true, "email is must "]
  // body: String,
  password: {
    type: String,
    required: true,
    // validate: function (value) {
    //   return /^(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(value);
    //   // return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,12}$/.test(
    //   //   value,
    //   // );
    // },
    // message:
    //   "password should be 8 to 12 chars , atleast one  special char and one  number",
  },
  type: {
    type: String,
    enum: ["customer", "seller", "admin"],
  },
});

//define model
export const User = mongoose.model("User", userSchema);
