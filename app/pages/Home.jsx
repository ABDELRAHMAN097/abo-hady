"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";

const images = [
  "/image/s1.png",
  "/image/s2.png",
  "/image/s3.png",
];

const Home = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[18vh] md:h-[80vh] overflow-hidden">
      <AnimatePresence>
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.8 }}
          className="absolute w-full h-full"
        >
          <Image
            src={images[index]}
            alt="Slider Image"
            layout="responsive"
            objectFit="cover"
            className="w-full h-full"
            width={100}
            height={100}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Home;
