import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import React from "react";

// ✅ Utility function
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// ✅ React component
 export  const Utils = () => {
  return <div></div>;
};

