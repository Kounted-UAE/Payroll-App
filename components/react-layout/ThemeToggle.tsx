import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function KountedThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex text-zinc-300 outline-blue-500 hover:text-zinc-400 dark:text-zinc-500 dark:hover:text-zinc-400"
      aria-label="Toggle theme"
    >
      {/* Light mode icon (shows in light mode only) */}
     <svg
  xmlns="http://www.w3.org/2000/svg"
  fill="currentColor"
  viewBox="0 0 24 24"
  className="size-5 dark:hidden"
  aria-hidden="true"
>
  <path d="M12 4a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V5a1 1 0 0 1 1-1zm6.364 1.636a1 1 0 0 1 1.414 1.414l-.707.707a1 1 0 1 1-1.414-1.414l.707-.707zM18 11a1 1 0 1 1 0 2h-1a1 1 0 1 1 0-2h1zm-6 5a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7-4a1 1 0 1 1 0-2h1a1 1 0 1 1 0 2H5zm-.707 5.364a1 1 0 1 1-1.414-1.414l.707-.707a1 1 0 1 1 1.414 1.414l-.707.707zM12 18a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1zm7.071.071a1 1 0 0 1-1.414 1.414l-.707-.707a1 1 0 0 1 1.414-1.414l.707.707z" />
</svg>


      {/* Dark mode icon (shows in dark mode only) */}
     <svg
  xmlns="http://www.w3.org/2000/svg"
  fill="currentColor"
  viewBox="0 0 24 24"
  className="hidden size-5 dark:inline"
  aria-hidden="true"
>
  <path d="M21 12.79A9 9 0 0 1 11.21 3a1 1 0 0 0-.85 1.53A7 7 0 1 0 19.47 12a1 1 0 0 0 1.53-.85z" />
</svg>

    </button>
  )
}