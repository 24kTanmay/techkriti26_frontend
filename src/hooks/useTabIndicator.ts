'use client'

import { useCallback, useEffect, useRef } from 'react'

/**
 * Shared hook that manages the sliding pill tab-indicator logic.
 * Extracts the duplicated useEffect + useCallback pattern found in every competition page.
 */
export function useTabIndicator(activeTab: string) {
    const indicatorRef = useRef<HTMLDivElement>(null)
    const tabsContainerRef = useRef<HTMLDivElement>(null)

    const updateIndicator = useCallback((targetId: string) => {
        if (!indicatorRef.current || !tabsContainerRef.current) return
        const activeBtn = tabsContainerRef.current.querySelector(
            `[data-target="${targetId}"]`
        ) as HTMLElement | null
        if (!activeBtn) return

        requestAnimationFrame(() => {
            if (indicatorRef.current) {
                indicatorRef.current.style.width = `${activeBtn.offsetWidth}px`
                indicatorRef.current.style.left = `${activeBtn.offsetLeft}px`
            }
        })
    }, [])

    // Reposition indicator whenever the active tab changes
    useEffect(() => {
        updateIndicator(activeTab)
    }, [activeTab, updateIndicator])

    // Keep indicator aligned on window / container resize
    useEffect(() => {
        const container = tabsContainerRef.current
        if (!container) return
        const observer = new ResizeObserver(() => updateIndicator(activeTab))
        observer.observe(container)
        return () => observer.disconnect()
    }, [activeTab, updateIndicator])

    return { indicatorRef, tabsContainerRef }
}
