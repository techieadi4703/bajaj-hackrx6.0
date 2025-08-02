import React from "react";
import { motion } from "framer-motion";
import DrawOutlineButton from "../components/DrawOutlineButton";


const user = {
  name: "Aditya Srivastava",
  email: "aditya@example.com",
  phone: "+91 9876543210",
  location: "Mumbai, India",
  memberSince: "January 2023",
};

const Homepage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white p-10 rounded-2xl shadow-lg mt-20 max-w-3xl mx-auto font-sans"
    >
      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="text-3xl font-bold text-[#1e5588] mb-2"
      >
        Welcome, {user.name}!
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="text-[#57708c] mb-6"
      >
        We're glad to have you here.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-[#f0f7ff] border border-[#cbe2fc] p-6 rounded-lg mb-6"
      >
        <h2 className="text-xl font-semibold text-[#1e5588] mb-3">
          Your Details
        </h2>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <p><strong>Location:</strong> {user.location}</p>
        <p><strong>Member Since:</strong> {user.memberSince}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <h2 className="text-xl font-semibold text-[#1e5588] mb-3">
          Quick Actions
        </h2>
        <div className="flex gap-4">
          <DrawOutlineButton>Edit Profile</DrawOutlineButton>
          <DrawOutlineButton>Logout</DrawOutlineButton>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-xl font-semibold text-[#1e5588] mb-3">
          Notifications
        </h2>
        <ul className="list-disc list-inside text-[#57708c]">
          <li>Welcome to the platform! 🎉</li>
          <li>Your profile is 80% complete.</li>
          <li>Check out the latest updates in your dashboard.</li>
        </ul>
      </motion.div>
    </motion.div>
  );
};

export default Homepage;