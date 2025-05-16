import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/User";
import Order from "@/models/Order";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "quickcart-next" });

/**
 * Inngest Function to save user data to a database (or update if exists)
 */
export const syncUserCreation = inngest.createFunction(
  {
    id: "sync-user-from-clerk",
  },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: `${first_name} ${last_name}`,
      imageUrl: image_url,
    };

    try {
      await connectDB();
      await User.findByIdAndUpdate(id, userData, { upsert: true, new: true });
      console.log("User created or updated:", userData);
    } catch (error) {
      console.error("Error creating/updating user:", error);
    }
  }
);

/**
 * Inngest Function to update user data in the database
 */
export const syncUserUpdation = inngest.createFunction(
  {
    id: "update-user-from-clerk",
  },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: `${first_name} ${last_name}`,
      imageUrl: image_url,
    };

    try {
      await connectDB();
      await User.findByIdAndUpdate(id, userData);
      console.log("User updated:", userData);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  }
);

/**
 * Inngest Function to delete user from the database
 */
export const syncUserDeletion = inngest.createFunction(
  {
    id: "delete-user-with-clerk",
  },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { id } = event.data;

    try {
      await connectDB();
      await User.findByIdAndDelete(id);
      console.log("User deleted:", id);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }
);

