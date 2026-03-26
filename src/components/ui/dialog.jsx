import React, { createContext, useContext, useState } from 'react'
import ReactDOM from 'react-dom'
import { cn } from '../../lib/utils'

const DialogContext = createContext(null)

export function Dialog({ open: controlledOpen, onOpenChange, children }) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const open = controlledOpen ?? uncontrolledOpen
  const setOpen = (value) => {
    onOpenChange?.(value)
    if (controlledOpen === undefined) setUncontrolledOpen(value)
  }

  return <DialogContext.Provider value={{ open, setOpen }}>{children}</DialogContext.Provider>
}

export function DialogTrigger({ asChild = false, children }) {
  const { setOpen } = useContext(DialogContext)
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: (e) => {
        children.props.onClick?.(e)
        setOpen(true)
      },
    })
  }
  return <button onClick={() => setOpen(true)}>{children}</button>
}

export function DialogContent({ className = '', children }) {
  const { open, setOpen } = useContext(DialogContext)
  if (!open) return null

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4" onClick={() => setOpen(false)}>
      <div
        className={cn('relative w-full bg-white shadow-2xl', className)}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close"
          className="absolute right-4 top-4 rounded-full border border-neutral-300 bg-white px-2 py-1 text-sm text-neutral-500 hover:bg-neutral-50"
          onClick={() => setOpen(false)}
        >
          ×
        </button>
        {children}
      </div>
    </div>,
    document.body,
  )
}

export function DialogHeader({ className = '', ...props }) {
  return <div className={cn('pr-10', className)} {...props} />
}

export function DialogTitle({ className = '', ...props }) {
  return <h2 className={cn('text-lg font-semibold', className)} {...props} />
}
