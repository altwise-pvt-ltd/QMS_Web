import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

const Title = ({ title }) => {
  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="mb-6 text-center"
    >
      <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase">
        {title}
      </h1>
      <div className="h-1 w-16 bg-indigo-500 mx-auto mt-2 rounded-full" />
    </motion.div>
  );
};

Title.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Title;
