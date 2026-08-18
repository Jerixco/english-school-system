import React from 'react'
import { LucideIcon } from 'lucide-react'
import { Button } from './button'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
  actionIcon?: LucideIcon
  className?: string
  compact?: boolean
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  actionIcon: ActionIcon,
  className,
  compact = false,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center rounded-xl border border-dashed border-[hsl(35,10%,85%)] bg-[hsl(35,10%,94%)]/50 p-8 transition-colors',
        compact ? 'py-6 px-4' : 'py-12 px-6',
        className
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white shadow-sm border border-[hsl(35,10%,85%)] mb-4 text-[hsl(20,5%,45%)]">
        <Icon className="h-7 w-7 text-[hsl(20,5%,45%)] stroke-[1.5]" />
      </div>
      <h3 className="text-base font-outfit font-semibold text-[hsl(20,10%,10%)] mb-1">{title}</h3>
      <p className="text-sm text-[hsl(20,5%,45%)] max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && (
        <>
          {actionHref ? (
            <Button asChild className="gap-2 shadow-sm">
              <Link href={actionHref}>
                {ActionIcon && <ActionIcon className="h-4 w-4" />}
                {actionLabel}
              </Link>
            </Button>
          ) : (
            <Button onClick={onAction} className="gap-2 shadow-sm">
              {ActionIcon && <ActionIcon className="h-4 w-4" />}
              {actionLabel}
            </Button>
          )}
        </>
      )}
    </div>
  )
}
