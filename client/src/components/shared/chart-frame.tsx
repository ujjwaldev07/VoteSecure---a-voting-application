import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'

interface ChartFrameProps {
  height: number
  children: ReactNode
}

export function ChartFrame({ height, children }: ChartFrameProps) {
  const frameRef = useRef<HTMLDivElement>(null)
  const [hasSize, setHasSize] = useState(false)

  useLayoutEffect(() => {
    const element = frameRef.current
    if (!element) return

    const updateSize = () => {
      const { width, height: measuredHeight } = element.getBoundingClientRect()
      setHasSize(width > 0 && measuredHeight > 0)
    }

    updateSize()
    const observer = new ResizeObserver(updateSize)
    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={frameRef} className="w-full min-w-0" style={{ height, minHeight: height }}>
      {hasSize ? children : <div className="h-full w-full" aria-busy="true" />}
    </div>
  )
}
