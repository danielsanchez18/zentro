"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { useIsDesktop } from "@/hooks/use-media-query"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

/**
 * Diálogo responsive: modal centrado desde `md` y drawer inferior en mobile.
 * Misma API para ambos, así las páginas no tienen que decidir el formato.
 *
 * <ResponsiveDialog open={open} onOpenChange={setOpen}>
 *   <ResponsiveDialogContent>
 *     <ResponsiveDialogHeader>
 *       <ResponsiveDialogTitle>…</ResponsiveDialogTitle>
 *     </ResponsiveDialogHeader>
 *     …
 *   </ResponsiveDialogContent>
 * </ResponsiveDialog>
 */
const ResponsiveContext = React.createContext(true)
const useDesktop = () => React.useContext(ResponsiveContext)

function ResponsiveDialog(props: React.ComponentProps<typeof Dialog>) {
  const isDesktop = useIsDesktop()
  // La raíz es siempre la misma (Dialog y Drawer comparten el primitivo de
  // Base UI). Así, al cruzar el breakpoint con el diálogo abierto, solo cambia
  // el contenido y no se desmonta/reabre todo el componente.
  return (
    <ResponsiveContext.Provider value={isDesktop}>
      <Dialog {...props} />
    </ResponsiveContext.Provider>
  )
}

function ResponsiveDialogTrigger(props: React.ComponentProps<typeof DialogTrigger>) {
  return useDesktop() ? <DialogTrigger {...props} /> : <DrawerTrigger {...props} />
}

function ResponsiveDialogClose(props: React.ComponentProps<typeof DialogClose>) {
  return useDesktop() ? <DialogClose {...props} /> : <DrawerClose {...props} />
}

function ResponsiveDialogContent({
  className,
  ...props
}: React.ComponentProps<typeof DialogContent>) {
  return useDesktop() ? (
    <DialogContent className={className} {...props} />
  ) : (
    <DrawerContent className={cn("px-0", className)} {...props} />
  )
}

function ResponsiveDialogHeader(props: React.ComponentProps<"div">) {
  return useDesktop() ? <DialogHeader {...props} /> : <DrawerHeader {...props} />
}

function ResponsiveDialogFooter(props: React.ComponentProps<"div">) {
  return useDesktop() ? <DialogFooter {...props} /> : <DrawerFooter {...props} />
}

function ResponsiveDialogTitle(props: React.ComponentProps<typeof DialogTitle>) {
  return useDesktop() ? <DialogTitle {...props} /> : <DrawerTitle {...props} />
}

function ResponsiveDialogDescription(
  props: React.ComponentProps<typeof DialogDescription>
) {
  return useDesktop() ? (
    <DialogDescription {...props} />
  ) : (
    <DrawerDescription {...props} />
  )
}

export {
  ResponsiveDialog,
  ResponsiveDialogTrigger,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogFooter,
  ResponsiveDialogTitle,
  ResponsiveDialogDescription,
}
