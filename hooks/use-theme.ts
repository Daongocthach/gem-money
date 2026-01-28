import { ThemeContext } from "@/contexts/theme-provider";
import { useContext } from "react";

export const useTheme = () => useContext(ThemeContext)
