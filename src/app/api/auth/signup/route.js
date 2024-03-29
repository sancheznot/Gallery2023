import { NextResponse } from "next/server";
import User from "@/models/User";
import { connectMongoDB } from "@/lib/mongodb";
import bycrypt from "bcryptjs";
import BlackList from "@/models/BlackList";
const profileImage =
  "https://upload.wikimedia.org/wikipedia/commons/5/50/User_icon-cp.svg";

export async function POST(request) {
  const { username, email, name, lastname, password } = await request.json();

  if (!username || username.length < 3 || username.length > 20) {
    return NextResponse.json(
      { message: "Username must be between 3 and 20 characters long" },
      { status: 400 }
    );
  }
  if (!email || !email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
    return NextResponse.json(
      { message: "Please add a valid email" },
      { status: 400 }
    );
  }
  if (!name || !lastname) {
    return NextResponse.json(
      { message: "Please add your name and lastname" },
      { status: 400 }
    );
  }
  if (!password || password.length < 6) {
    return NextResponse.json(
      { message: "Password must be at least 6 characters long" },
      { status: 400 }
    );
  }

  try {
    await connectMongoDB();
    const emailFound = await User.findOne({ email: email });
    const userFound = await User.findOne({ username: username });

    if (emailFound) {
      return NextResponse.json({ message: "Email is in use" }, { status: 400 });
    }
    if (userFound) {
      return NextResponse.json(
        { message: "Username is in use" },
        { status: 400 }
      );
    }

    const userBanned = await BlackList.findOne({  username: username });
    const emailBanned = await BlackList.findOne ({ email: email });

    if (userBanned) {
      return NextResponse.json(
        { message: "Username is banned" },
        { status: 400 }
      );
    }
    if (emailBanned) {
      return NextResponse.json(
        { message: "Email is banned" },
        { status: 400 }
      );
    }

    const salt = await bycrypt.genSalt(12);
    const passwordEncryted = await bycrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      name,
      lastname,
      password: passwordEncryted,
      image: profileImage,
    });
    const userSaved = await newUser.save();
    return NextResponse.json({ message: "User created" }, userSaved);
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
