import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import DrawOutlineButton from "../components/DrawOutlineButton";

// // Reuse DrawOutlineButton if not globally available
// const DrawOutlineButton = ({ children, ...rest }) => {
//   return (
//     <button
//       {...rest}
//       className="group relative w-[150px] bg-[#e2f3fcdd] cursor-pointer px-4 py-2 font-medium rounded-sm text-[#57708c] transition-colors duration-[400ms] hover:text-[#1e5588] hover:bg-[#cbe2fc]"
//     >
//       <span>{children}</span>

//       {/* TOP */}
//       <span className="absolute left-0 top-0 h-[2px] w-0 bg-[#1e5588] transition-all duration-100 group-hover:w-full" />

//       {/* RIGHT */}
//       <span className="absolute right-0 top-0 h-0 w-[2px] bg-[#1e5588] transition-all delay-100 duration-100 group-hover:h-full" />

//       {/* BOTTOM */}
//       <span className="absolute bottom-0 right-0 h-[2px] w-0 bg-[#1e5588] transition-all delay-200 duration-100 group-hover:w-full" />

//       {/* LEFT */}
//       <span className="absolute bottom-0 left-0 h-0 w-[2px] bg-[#1e5588] transition-all delay-300 duration-100 group-hover:h-full" />
//     </button>
//   );
// };

export default function Signup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white p-10 rounded-2xl shadow-lg w-full mt-40 max-w-md"
    >
      <h2 className="text-3xl font-bold mb-8 text-center text-[#1e5588]">
        Welcome to our platform!!
      </h2>

      <form className="space-y-5">
        <motion.input
          type="text"
          placeholder="Full Name"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e5588]"
          whileFocus={{ scale: 1.02 }}
        />
        <motion.input
          type="email"
          placeholder="Email"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e5588]"
          whileFocus={{ scale: 1.02 }}
        />
        <motion.input
          type="password"
          placeholder="Password"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e5588]"
          whileFocus={{ scale: 1.02 }}
        />

        <motion.div className="w-full flex items-center justify-center">
          <DrawOutlineButton>Sign Up</DrawOutlineButton>
        </motion.div>
      </form>

      <p className="text-sm text-center mt-6">
        Already have an account?{" "}
        <Link
          to="/"
          className="text-[#1e5588] font-medium hover:underline"
        >
          Login
        </Link>
      </p>
    </motion.div>
  );
}
