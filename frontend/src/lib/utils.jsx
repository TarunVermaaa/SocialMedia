import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// ✅ Utility function
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// ✅ React component
 export  const Utils = () => {
  return <div></div>;
};


export const readFileAsDataURL = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') resolve(reader.result);
    }
    reader.readAsDataURL(file);
  })
}
