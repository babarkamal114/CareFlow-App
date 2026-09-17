import type { ReactElement } from "react"

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarStatus,
  AvatarWrap,
  Badge,
  Chip,
} from @/components/ui

export function GalleryBadgesAvatars(): ReactElement {
  return (
    <>
      <section className="space-y-4">
        <h2 className="font-heading text-lg font-bold">Badges & chips</h2>
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Chip tone="success">Active</Chip>
          <Chip
            tone="warning"
            accessibleLabel="Shift filter"
            onDismiss={() => undefined}
          >
            <span className="inline-flex items-center gap-1">
              <span aria-hidden>·</span> Shift
            </span>
          </Chip>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-lg font-bold">Avatars</h2>
        <p className="text-xs text-muted-foreground">
          Sizes (HTML xs → xl), square default, and round + status.
        </p>
        <div className="flex flex-wrap items-end gap-3">
          <Avatar size="xs">
            <AvatarFallback>EC</AvatarFallback>
          </Avatar>
          <Avatar size="sm">
            <AvatarFallback>EC</AvatarFallback>
          </Avatar>
          <Avatar size="default">
            <AvatarFallback>EC</AvatarFallback>
          </Avatar>
          <Avatar size="lg">
            <AvatarFallback>EC</AvatarFallback>
          </Avatar>
          <Avatar size="xl">
            <AvatarFallback>EC</AvatarFallback>
          </Avatar>
          <AvatarWrap>
            <Avatar shape="round" size="lg">
              <AvatarFallback>MJ</AvatarFallback>
            </Avatar>
            <AvatarStatus tone="blue" />
          </AvatarWrap>
        </div>
        <h3 className="text-sm font-semibold">Avatar group</h3>
        <AvatarGroup>
          <Avatar>
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>CD</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>EF</AvatarFallback>
          </Avatar>
        </AvatarGroup>
      </section>
    </>
  )
}
