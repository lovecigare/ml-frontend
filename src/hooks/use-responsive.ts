import { useEffect, useState } from "react";

// Define the breakpoints based on Tailwind CSS default values
const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

type Query = "up" | "down" | "between" | "only";
type Value = keyof typeof breakpoints | number;

export function useResponsive(query: Query, start?: Value, end?: Value): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      let match = false;

      const startValue = typeof start === "string" ? breakpoints[start] : start;
      const endValue = typeof end === "string" ? breakpoints[end] : end;

      if (query === "up" && startValue !== undefined) {
        match = window.innerWidth >= startValue;
      }

      if (query === "down" && startValue !== undefined) {
        match = window.innerWidth < startValue;
      }

      if (query === "between" && startValue !== undefined && endValue !== undefined) {
        match = window.innerWidth >= startValue && window.innerWidth < endValue;
      }

      if (query === "only" && startValue !== undefined) {
        match =
          window.innerWidth >= startValue &&
          window.innerWidth < (breakpoints[(Object.keys(breakpoints) as Array<keyof typeof breakpoints>)[Object.keys(breakpoints).indexOf(start as string) + 1]] || Infinity);
      }

      setMatches(match);
    };

    handleResize(); // Check on mount
    window.addEventListener("resize", handleResize); // Check on resize

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [query, start, end]);

  return matches;
}