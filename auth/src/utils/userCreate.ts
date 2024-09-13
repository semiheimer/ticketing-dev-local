import { User } from "../models/user-model";

export const userSync = async () => {
  try {
    await User.deleteMany();
    console.log("All users are deleted");
    const admin = await User.create([
      {
        firstname: "superadmin",
        lastname: "superadmin",
        email: "superadmin@gmail.com",
        password: "aA-#123456",
        username: "superadmin",
        role: "superadmin",
      },
      {
        firstname: "John",
        lastname: "Wayn",
        email: "john@gmail.com",
        password: "aA-#123456",
        username: "john06",
      },
      {
        firstname: "Anthony",
        lastname: "Hopkins",
        email: "anthony@gmail.com",
        password: "aA-#123456",
        username: "anthony06",
      },
    ]);
    console.log("User created");
    console.log(" userSync", admin);
  } catch (error) {
    console.error(error);
  }
};
