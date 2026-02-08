import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import DrawOutlineButton from "../components/DrawOutlineButton";

// const DrawOutlineButton = ({ children, ...rest }) => {
//   return (
//     <button
//       {...rest}
//       className="group relative w-[150px] cursor-pointer px-4 py-2 bg-[#e2f3fcdd] font-medium rounded-md text-[#57708c] transition-colors duration-[400ms] hover:text-[#1e5588] hover:bg-[#cbe2fc]"
//     >
//       <span>{children}</span>

//       {/* TOP */}
//       <span className="absolute left-0 top-0 h-[2px] w-0 bg-[#1e5588] transition-all rounded-md duration-100 group-hover:w-full" />

//       {/* RIGHT */}
//       <span className="absolute right-0 top-0 h-0 w-[2px] bg-[#1e5588] transition-all rounded-md delay-100 duration-100 group-hover:h-full" />

//       {/* BOTTOM */}
//       <span className="absolute bottom-0 right-0 h-[2px] w-0 bg-[#1e5588] transition-all rounded-md delay-200 duration-100 group-hover:w-full" />

//       {/* LEFT */}
//       <span className="absolute bottom-0 left-0 h-0 w-[2px] bg-[#1e5588] transition-all rounded-md delay-300 duration-100 group-hover:h-full" />
//     </button>
//   );
// };

export default function Login() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white p-10 rounded-2xl shadow-lg mt-48 w-full max-w-md"
    >
      <h2 className="text-3xl font-bold mb-8 text-center text-[#1e5588]">
        Login
      </h2>

      <form className="space-y-5">
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

        {/* <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-lg font-semibold shadow-md hover:from-indigo-600 hover:to-purple-600"
        > */}
          <motion.div className="w-full flex items-center justify-center">
            <DrawOutlineButton>Login</DrawOutlineButton>
          </motion.div>
        {/* </motion.button> */}
      </form>

      <p className="text-sm text-center mt-6">
        Don&apos;t have an account?{" "}
        <Link to="/signup" className="text-[#1e5588] font-medium hover:underline">
          Sign up
        </Link>
      </p>
    </motion.div>
  );
}
