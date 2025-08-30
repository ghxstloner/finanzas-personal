"use client"

import type * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

function Avatar({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn("relative flex size-8 shrink-0 overflow-hidden rounded-full", className)}
      {...props}
    />
  )
}

function AvatarImage({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image data-slot="avatar-image" className={cn("aspect-square size-full", className)} {...props} />
  )
}

function AvatarFallback({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn("bg-muted flex size-full items-center justify-center rounded-full", className)}
      {...props}
    />
  )
}

function AvatarInitials({ name, className }: { name: string; className?: string }) {
  const getInitials = (fullName: string) => {
    if (!fullName) return "?"

    // Handle email addresses
    if (fullName.includes("@")) {
      const emailName = fullName.split("@")[0]
      return emailName.charAt(0).toUpperCase()
    }

    // Handle full names
    const names = fullName.trim().split(" ")
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase()
    }

    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase()
  }

  return <span className={cn("text-sm font-medium", className)}>{getInitials(name)}</span>
}

export { Avatar, AvatarImage, AvatarFallback, AvatarInitials }
