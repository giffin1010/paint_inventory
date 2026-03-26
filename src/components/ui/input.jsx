import React from 'react'
import { cn } from '../../lib/utils'

export const Input = React.forwardRef(function Input({ className = '', ...props }, ref) {
  return (
    <input
      ref={ref}
      className={cn(
        'flex w-full min-w-0 border border-neutral-300 bg-white px-3 py-2 text-sm outline-none ring-0 placeholder:text-neutral-400 focus:border-neutral-500',
        className,
      )}
      {...props}
    />
  )
})
