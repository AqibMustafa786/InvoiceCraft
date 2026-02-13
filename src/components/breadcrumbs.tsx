"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { ChevronRight } from "lucide-react"

type BreadcrumbProps = React.HTMLAttributes<HTMLElement>

export function Breadcrumbs({ className, ...props }: BreadcrumbProps) {
  const pathname = usePathname()
  const segments = React.useMemo(() => {
    const segments = pathname.split("/").filter((s) => s)
    return ["Home", ...segments]
  }, [pathname])

  return (
    <nav
      aria-label="breadcrumbs"
      className={cn(
        "flex items-center text-sm font-medium text-muted-foreground",
        className
      )}
      {...props}
    >
      {segments.map((segment, index) => {
        const isLast = index === segments.length - 1
        const href =
          index === 0
            ? "/"
            : `/${segments.slice(1, index + 1).join("/")}`

        return (
          <React.Fragment key={href}>
            <Link
              aria-current={isLast ? "page" : undefined}
              href={href}
              className={cn(
                "capitalize transition-colors hover:text-foreground",
                isLast ? "text-foreground" : ""
              )}
            >
              {segment.replace(/-/g, " ")}
            </Link>
            {!isLast && <ChevronRight className="h-4 w-4" />}
          </React.Fragment>
        )
      })}
    </nav>
  )
}
