import connectDB from "@/config/db";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    console.log("Clerk userId:", userId);

    await connectDB();

    let user = await User.findById(userId).lean();

    // If not found, create it from Clerk data
    if (!user) {
      const clerkResponse = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        },
      });

      const clerkUser = await clerkResponse.json();

      if (!clerkUser || clerkUser.id !== userId) {
        return NextResponse.json({ success: false, message: "User not found" });
      }

      const newUser = new User({
        _id: clerkUser.id,
        name: `${clerkUser.first_name} ${clerkUser.last_name}`,
        email: clerkUser.email_addresses[0].email_address,
        imageUrl: clerkUser.image_url,
        cartItems: {}, // default empty
      });

      await newUser.save();

      user = newUser.toObject(); // convert Mongoose doc to plain object
    }

    const formattedUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      imageUrl: user.imageUrl,
      cartItems: user.cartItems,
      __v: user.__v,
    };

    return NextResponse.json({ success: true, user: formattedUser });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ success: false, message: error.message });
  }
}

