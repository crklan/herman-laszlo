export function getBodyClassNames(themePreference?: string): string {
  // Use browser default if cookie is not set
  const isDarkMode =
    !themePreference && typeof document !== 'undefined'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : themePreference === `dark`
  return [
    `transition-colors ease-in-out h-full flex flex-col bg-background`,
    isDarkMode && `dark`,
  ]
    .join(' ')
    .trim()
}
