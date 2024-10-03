import mongoose from "mongoose";
import { PasswordEncrypt } from "../helpers/passwordEncrypt";
import { USER_ROLE } from "../utils/constants";

// const { createRefreshJWT, createAccessJWT } = require("../helpers/jwtHelpers");

interface UserAttrs {
  email: string;
  password: string;
  username: string;
  firstname: string;
  lastname: string;
  isActive?: boolean;
  //   is_staff: boolean;
  isSuperAdmin?: Boolean;
  //   location: string;
  //   last_login: Date;
  role: USER_ROLE;
  //   avatar: string;
  //   avatarPublicId: string;
}

interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
  username: string;
  firstname: string;
  lastname: string;
  isActive?: Boolean;
  isSuperAdmin?: Boolean;
  role: USER_ROLE;
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      index: true,
    },

    password: {
      type: String,
      trim: true,
      required: true,
      select: false,
      set: (password: string) => PasswordEncrypt.toHash(password),
    },

    email: {
      type: String,
      trim: true,
      index: true,
      required: [true, "Email field is required."],
      unique: true,
      validate: [
        (email: string) => {
          const emailRegexCheck =
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          return emailRegexCheck.test(email);
        },
        "Email format is not correct.",
      ],
    },

    firstname: {
      type: String,
      trim: true,
      required: true,
      minLength: 3,
    },

    lastname: {
      type: String,
      trim: true,
      required: true,
      minLength: 2,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // is_staff: {
    //   type: Boolean,
    //   default: false,
    // },

    isSuperAdmin: {
      type: Boolean,
      default: function (document: UserDoc) {
        return document.role === USER_ROLE.SUPERADMIN;
      },
    },
    // location: {
    //   type: String,
    //   default: "Texas",
    // },
    // last_login: {
    //   type: Date,
    //   default: null,
    // },
    role: {
      type: String,
      enum: Object.values(USER_ROLE),
      required: true,
      default: USER_ROLE.USER,
    },
    // avatar: String,
    // avatarPublicId: String,
  },
  {
    collection: "users",
    timestamps: true,
  }
);

// FOR REACT PROJECT:
userSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.password;
    ret.createdAt = ret?.createdAt.toLocaleDateString("tr-tr");
  },
});
// 2. alternative
// UserSchema.virtual("createds").get(function () {
//   return this.createdAt.toLocaleDateString("tr-tr");
// });

// 3. alternative
// UserSchema.pre("init", function (data) {
//   data.id = data._id;
// data.createds = data.createdAt.toLocaleDateString("tr-tr");
// });

// 4. alternative
// const mySchema = new Schema({
//   // Diğer alanlar...
//   createdAt: {
//     type: Date,
//     default: Date.now, // Opsiyonel olarak varsayılan değer olarak şu anki
//tarihi atayabiliriz.
//     get: function () {
//       return this.createdAt.toISOString();
//     },
//Mongoose'da set yöntemi, belirli bir alanın değeri ayarlanırken çalışır.
//Bu yöntem, save, updateOne, findOneAndUpdate gibi Mongoose işlevleri
// tarafından tetiklenir.
//  set: function(value) {
// Değer set edilirken çalışacak işlem
// Burada gelen değeri bir Date nesnesine dönüştürebiliriz
// Örneğin:
//         return new Date(value);
//     }
//   },
// });

// created after User instance, this method have to call
// userSchema.methods.generateAuthToken = function (isRefresh = false) {
//   const token = { accessToken: "", refreshToken: "" };

//   token.accessToken = createAccessJWT({
//     id: this._id,
//     email: this.email,
//     is_superadmin: this.is_superadmin,
//     first_name: this.first_name,
//     last_name: this.last_name,
//     is_active: this.is_active,
//   });

//   if (isRefresh)
//     token.refreshToken = createRefreshJWT({
//       id: this._id,
//       email: this.email,
//     });
//   return token;
// };

// userSchema.pre("save", function (next) {
//   if (this.role === USER_ROLE.SUPERADMIN) {
//     this.isSuperAdmin = true;
//   } else {
//     this.isSuperAdmin = false;
//   }
//   next();
// });

// userSchema.pre("save", async function (done) {
//   if (this.isModified("password")) {
//     const hashed = await Password.toHash(this.get("password"));
//     this.set("password", hashed);
//   }
//   done();
// });
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

export const User = mongoose.model<UserDoc, UserModel>("User", userSchema);
