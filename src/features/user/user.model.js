import { getDataBase } from "../../config/mongoDB.config.js";

export default class UserModel {
  constructor(_name, _email, _password, _type) {
    this.name = _name;
    this.email = _email;
    this.password = _password;
    this.type = _type;
  }

  // static login(email, password) {
  //   const user = users.find(
  //     (user) => user.email == email && user.password == password
  //   );
  //   return user;
  // }

  //   static async signUp(name, email, password, type) {
  //     const newUser = new UserModel(name, email, password, type);
  //     //1 get E-Commerce db
  //     const db = getDataBase();
  //     //2. get collection
  //     const collection = db.collection("users");
  //     //3 insert new user to User collection in E-Commerce db
  //     const createdUser = await collection.insertOne(newUser);
  //     //users.push(newUser);
  //     return createdUser;
  //   }
  static getAllUsers() {
    return users;
  }
}

// export const users = [
//   {
//     id: 1,
//     name: "Seller",
//     email: "seller@gmail.com",
//     password: 12345,
//     type: "seller",
//   },
//   {
//     id: 2,
//     name: "Customer",
//     email: "customer@gmail.com",
//     password: 12345,
//     type: "customer",
//   },
// ];
