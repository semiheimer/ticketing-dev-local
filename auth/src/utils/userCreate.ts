import { User } from "../models/user-model";

export const userSync = async () => {
  try {
    await User.deleteMany().then(() => console.log(" - User Deleted All"));
    console.log("All users are deleted");
    const admin = await User.create({
      firstname: "superadmin",
      lastname: "kutlu",
      email: "superadmin@gmail.com",
      password: "aA-#123456",
      username: "superadmin",
      isSuperadmin: true,
    });

    console.log("Admin created");
    await User.create({
      firstname: "semih",
      lastname: "kutlu",
      email: "semih@gmail.com",
      password: "aA-#123456",
      username: "semiheimer",
    });
    console.log("User created");
    const users = await User.find();
  } catch (error) {
    console.error(error);
  }
};
