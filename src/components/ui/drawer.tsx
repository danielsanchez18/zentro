"use client"

import * as React from "react"
import { Dialog as DrawerPrimitive } from "@base-ui/react/dialog"

import { cn } from "@/lib/utils"

/**
 * Drawer inferior (bottom sheet / offcanvas bottom) pensado para mobile.
 * - Sube desde abajo con esquinas redondeadas y una manija.
 * - Se cierra tocando el fondo, con Escape o arrastrando la manija hacia abajo.
 */
function Drawer({ ...props }: DrawerPrimitive.Root.Props) {
  return <DrawerPrimitive.Root data-slot="drawer" {...props} />
}

function DrawerTrigger({ ...props }: DrawerPrimitive.Trigger.Props) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />
}

function DrawerClose({ ...props }: DrawerPrimitive.Close.Props) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />
}

const CLOSE_THRESHOLD = 80

function DrawerContent({
  className,
  children,
  ...props
}: DrawerPrimitive.Popup.Props) {
  const closeRef = React.useRef<HTMLButtonElement>(null)
  const [dragY, setDragY] = React.useState(0)
  const startY = React.useRef<number | null>(null)

  const onPointerDown = (event: React.PointerEvent) => {
    startY.current = event.clientY
    event.currentTarget.setPointerCapture(event.pointerId)
  }
  const onPointerMove = (event: React.PointerEvent) => {
    if (startY.current === null) return
    setDragY(Math.max(0, event.clientY - startY.current))
  }
  const onPointerUp = () => {
    if (dragY > CLOSE_THRESHOLD) closeRef.current?.click()
    startY.current = null
    setDragY(0)
  }

  return (
    <DrawerPrimitive.Portal data-slot="drawer-portal">
      <DrawerPrimitive.Backdrop
        data-slot="drawer-overlay"
        className="fixed inset-0 z-50 bg-black/30 transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-xs"
      />
      <DrawerPrimitive.Popup
        data-slot="drawer-content"
        style={dragY ? { transform: `translateY(${dragY}px)`, transition: "none" } : undefined}
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 flex max-h-[85dvh] flex-col rounded-t-3xl border-t border-border bg-card text-card-foreground shadow-2xl outline-none transition-transform duration-300 ease-out data-ending-style:translate-y-full data-starting-style:translate-y-full pb-[env(safe-area-inset-bottom)]",
          className
        )}
        {...props}
      >
        <div
          className="flex shrink-0 cursor-grab touch-none justify-center pt-3 pb-2 active:cursor-grabbing"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          aria-hidden="true"
        >
          <div className="h-1.5 w-12 rounded-full bg-muted-foreground/30" />
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
        <DrawerPrimitive.Close ref={closeRef} className="sr-only">
          Cerrar
        </DrawerPrimitive.Close>
      </DrawerPrimitive.Popup>
    </DrawerPrimitive.Portal>
  )
}

function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-header"
      className={cn("flex flex-col gap-1 px-5 pb-3", className)}
      {...props}
    />
  )
}

function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn("mt-auto flex flex-col gap-2 px-5 pt-3 pb-5", className)}
      {...props}
    />
  )
}

function DrawerTitle({ className, ...props }: DrawerPrimitive.Title.Props) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn("font-heading text-base font-semibold text-foreground", className)}
      {...props}
    />
  )
}

function DrawerDescription({ className, ...props }: DrawerPrimitive.Description.Props) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Drawer,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}
