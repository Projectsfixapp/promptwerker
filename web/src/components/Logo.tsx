"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";

export default function Logo() {
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 300], [1, 0.34]);

  return (
    <motion.div
      style={{ scale }}
      className="fixed left-6 top-6 z-40 origin-top-left sm:left-10 sm:top-8"
    >
      <Link href="/" aria-label="Zur Startseite">
        <img
          src="/logo-promptwerker.png"
          alt="promptwerker"
          className="h-auto w-[300px] sm:w-[440px]"
        />
      </Link>
    </motion.div>
  );
}
