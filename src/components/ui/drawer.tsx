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

/** Distancia (px) que hay que arrastrar para cerrar/contraer o expandir. */
const CLOSE_THRESHOLD = 80
const EXPAND_THRESHOLD = 50
/** Alto máximo al expandir, como fracción del alto de la ventana. */
const EXPANDED_RATIO = 0.95

function DrawerContent({
  className,
  children,
  style,
  ...props
}: DrawerPrimitive.Popup.Props) {
  const closeRef = React.useRef<HTMLButtonElement>(null)
  const popupRef = React.useRef<HTMLDivElement>(null)
  const [expanded, setExpanded] = React.useState(false)
  // Arrastre activo: desplazamiento vertical (negativo = hacia arriba) y alto inicial.
  const [drag, setDrag] = React.useState<{ dy: number; startHeight: number } | null>(null)
  const startY = React.useRef<number | null>(null)
  // El último desplazamiento se guarda en una ref: al soltar no hay que
  // depender de un render intermedio para leerlo.
  const lastDy = React.useRef(0)

  const onPointerDown = (event: React.PointerEvent) => {
    startY.current = event.clientY
    lastDy.current = 0
    setDrag({ dy: 0, startHeight: popupRef.current?.offsetHeight ?? 0 })
    event.currentTarget.setPointerCapture(event.pointerId)
  }
  const onPointerMove = (event: React.PointerEvent) => {
    if (startY.current === null) return
    const dy = event.clientY - startY.current
    lastDy.current = dy
    setDrag((current) => (current ? { ...current, dy } : current))
  }
  const onPointerUp = () => {
    if (startY.current === null) return
    const dy = lastDy.current
    if (dy < -EXPAND_THRESHOLD) {
      setExpanded(true)
    } else if (dy > CLOSE_THRESHOLD) {
      if (expanded) setExpanded(false)
      else closeRef.current?.click()
    }
    startY.current = null
    setDrag(null)
  }

  // Estilo según el estado: arrastrando hacia arriba crece en vivo;
  // hacia abajo se desplaza; expandido ocupa casi toda la pantalla.
  const maxHeight = `${EXPANDED_RATIO * 100}dvh`
  let dynamicStyle: React.CSSProperties | undefined
  if (drag && drag.dy < 0) {
    const limit = typeof window === "undefined" ? drag.startHeight : window.innerHeight * EXPANDED_RATIO
    dynamicStyle = { height: Math.min(drag.startHeight - drag.dy, limit), maxHeight, transition: "none" }
  } else if (drag && drag.dy > 0) {
    dynamicStyle = {
      ...(expanded && { height: maxHeight, maxHeight }),
      transform: `translateY(${drag.dy}px)`,
      transition: "none",
    }
  } else if (expanded) {
    dynamicStyle = { height: maxHeight, maxHeight }
  }

  return (
    <DrawerPrimitive.Portal data-slot="drawer-portal">
      <DrawerPrimitive.Backdrop
        data-slot="drawer-overlay"
        className="fixed inset-0 z-50 bg-black/30 transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-xs"
      />
      <DrawerPrimitive.Popup
        ref={popupRef}
        data-slot="drawer-content"
        data-expanded={expanded || undefined}
        style={{ ...(style as React.CSSProperties), ...dynamicStyle }}
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 mx-auto flex w-full max-h-[70dvh] flex-col rounded-t-3xl border-t border-border bg-card text-card-foreground shadow-2xl outline-none transition-[transform,height,max-height] duration-300 ease-out data-ending-style:translate-y-full data-starting-style:translate-y-full pb-[env(safe-area-inset-bottom)]",
          className
        )}
        {...props}
      >
        <div
          className="flex shrink-0 cursor-grab touch-none justify-center pt-3 pb-3 active:cursor-grabbing"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          aria-hidden="true"
          title={expanded ? "Arrastra hacia abajo para contraer" : "Arrastra hacia arriba para expandir"}
        >
          <div className="h-1.5 w-12 rounded-full bg-muted-foreground/30" />
        </div>
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">{children}</div>
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
