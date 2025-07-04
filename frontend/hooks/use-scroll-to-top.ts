import { useEffect } from 'react'

/**
 * Custom hook to scroll to the top of the page when a component mounts
 * Useful for resetting scroll position when navigating between routes/components
 */
export const useScrollToTop = () => {
  useEffect(() => {
    // Scroll to top of the page
    window.scrollTo(0, 0)
  }, [])
}

/**
 * Custom hook to scroll to top whenever specified dependencies change
 * @param deps - Array of dependencies to watch for changes
 */
export const useScrollToTopOnChange = (deps: any[]) => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, deps)
}