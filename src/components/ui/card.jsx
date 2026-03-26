import React from 'react'
import { cn } from '../../lib/utils'

export function Card({ className = '', ...props }) {
  return <div className={cn('bg-white text-neutral-950', className)} {...props} />
}

export function CardContent({ className = '', ...props }) {
  return <div className={cn(className)} {...props} />
}
