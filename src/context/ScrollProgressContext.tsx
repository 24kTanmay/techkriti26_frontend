'use client'

import React, { createContext, useContext, useRef } from 'react'

export const ScrollProgressContext = createContext<React.MutableRefObject<number>>({ current: 0 } as any)

export const useScrollProgress = () => useContext(ScrollProgressContext)

export function ScrollProgressProvider({ children }: { children: React.ReactNode }) {
  const progressRef = useRef(0)
  return (
    <ScrollProgressContext.Provider value={progressRef}>
      {children}
    </ScrollProgressContext.Provider>
  )
}
