import { ThemeColorKeys, ThemeColors } from "@/types"
import { useTheme } from "./use-theme"

export function useGetColorByKey() {
  const { colors } = useTheme()

  function getColorByKey(
    colorName?: ThemeColorKeys
  ): string | undefined {
    if (!colorName) return undefined

    if ((colors as ThemeColors)[colorName as keyof ThemeColors]) {
      return (colors as ThemeColors)[colorName as keyof ThemeColors]
    }

    return colorName
  }

  return { getColorByKey }
}
