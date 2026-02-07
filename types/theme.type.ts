export type ThemeColors = {
    text: string
    tint: string
    icon: string

    background: string
    onBackground: string

    card: string
    onCard: string
    cardVariant: string
    onCardVariant: string
    cardDisabled: string
    onCardDisabled: string

    outline: string
    outlineVariant: string

    primary: string
    onPrimary: string
    primaryContainer: string

    secondary: string
    onSecondary: string
    secondaryContainer: string

    tertiary: string
    onTertiary: string
    tertiaryContainer: string

    quaternary: string
    onQuaternary: string
    quaternaryContainer: string

    quinary: string
    onQuinary: string
    quinaryContainer: string

    senary: string
    onSenary: string
    senaryContainer: string

    warning: string
    onWarning: string
    warningContainer: string

    error: string
    onError: string
    errorContainer: string

    success: string
    onSuccess: string
    successContainer: string

    backdrop: string
    modal: string
    shadow: string
    ring: string
}

export type AppTheme = {
    colors: ThemeColors
}
export type WithThemeColor<T extends string> = T | (string & Record<never, never>)
export type ThemeColorKeys = WithThemeColor<keyof ThemeColors>