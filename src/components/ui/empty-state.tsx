import React from 'react'
import { LucideIcon } from 'lucide-react'
import { Button } from './button'
import { cn } from '@/lib/utils'

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
        'flex flex-col items-center justify-center text-center rounded-xl border border-dashed border-gray-300 bg-gray-50/50 p-8 transition-colors',
        compact ? 'py-6 px-4' : 'py-12 px-6',
        className
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm border border-gray-200 mb-4 text-gray-500">
        <Icon className="h-7 w-7 text-gray-500 stroke-[1.5]" />
      </div>
      <h3 className="text-base font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && (
        <>
          {actionHref ? (
            <Button asChild className="gap-2 shadow-sm">
              <a href={actionHref}>
                {ActionIcon && <ActionIcon className="h-4 w-4" />}
                {actionLabel}
              </a>
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
