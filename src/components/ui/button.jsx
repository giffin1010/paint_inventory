import React from 'react'
import { cn } from '../../lib/utils'

export function Button({
  className = '',
  variant = 'default',
  size = 'default',
  type = 'button',
  ...props
}) {
  const variantClasses = {
    default: 'bg-black text-white hover:bg-neutral-800',
    outline: 'border border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-50',
  }

  const sizeClasses = {
    default: 'px-4 py-2',
    icon: 'p-0',
  }

  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50',
        variantClasses[variant] || variantClasses.default,
        sizeClasses[size] || sizeClasses.default,
        className,
      )}
      {...props}
    />
  )
}
