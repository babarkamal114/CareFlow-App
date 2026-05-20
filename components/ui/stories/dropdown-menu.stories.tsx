import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import {
  CalendarIcon, ClipboardIcon, CopyIcon, EditIcon, ExternalLinkIcon, EyeIcon, FileTextIcon, LogOutIcon, MailIcon, MoreHorizontalIcon, PlusIcon, SettingsIcon, Trash2Icon, UserIcon, UsersIcon,
} from "lucide-react"
import * as React from "react"

import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "ui-components"

const meta = {
  title: "UI/Dropdown Menu",
  component: DropdownMenu,
  parameters: {
    controls: { expanded: true },
    layout: "centered",
  },
} satisfies Meta<typeof DropdownMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        Actions
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Quick actions</DropdownMenuLabel>
          <DropdownMenuItem>Mark complete</DropdownMenuItem>
          <DropdownMenuItem>Reschedule</DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem variant="destructive">
          Cancel visit
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}
export const WithIcons: Story = {
  name: "With Icons",
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        Patient actions
      </DropdownMenuTrigger>
     <DropdownMenuContent className="w-52">
     <DropdownMenuGroup>
    <DropdownMenuLabel>Patient</DropdownMenuLabel>
          <DropdownMenuItem>
            <UserIcon />
            View profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <EditIcon />
            Edit details
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CalendarIcon />
            Schedule visit
          </DropdownMenuItem>
          <DropdownMenuItem>
            <FileTextIcon />
            View care plan
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <MailIcon />
            Send message
          </DropdownMenuItem>
          <DropdownMenuItem>
            <ExternalLinkIcon />
            Open in new tab
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <Trash2Icon />
          Delete patient
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}
export const WithShortcuts: Story = {
  name: "With Shortcuts",
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        Edit
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuItem>
          <CopyIcon />
          Copy
          <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ClipboardIcon />
          Paste
          <DropdownMenuShortcut>⌘V</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <EyeIcon />
          Preview
          <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ExternalLinkIcon />
          Open
          <DropdownMenuShortcut>⌘O</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <Trash2Icon />
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}
export const WithSubmenu: Story = {
  name: "With Submenu",
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        More options
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuItem>
          <EyeIcon />
          View
        </DropdownMenuItem>
        <DropdownMenuItem>
          <EditIcon />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <UsersIcon />
            Assign to
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>Sarah Williams</DropdownMenuItem>
            <DropdownMenuItem>James Carter</DropdownMenuItem>
            <DropdownMenuItem>Emily Nguyen</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <PlusIcon />
              Add carer
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <FileTextIcon />
            Export as
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>PDF</DropdownMenuItem>
            <DropdownMenuItem>CSV</DropdownMenuItem>
            <DropdownMenuItem>JSON</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <Trash2Icon />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}
export const WithCheckboxItems: Story = {
  name: "With Checkboxes",
  render: () => {
    const [showNotes, setShowNotes] = React.useState(true)
    const [showHistory, setShowHistory] = React.useState(false)
    const [showAlerts, setShowAlerts] = React.useState(true)
    const [compactView, setCompactView] = React.useState(false)

    return (
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" />}>
          View options
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-52">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Display</DropdownMenuLabel>

            <DropdownMenuCheckboxItem
              checked={showNotes}
              onCheckedChange={setShowNotes}
            >
              Show notes
            </DropdownMenuCheckboxItem>

            <DropdownMenuCheckboxItem
              checked={showHistory}
              onCheckedChange={setShowHistory}
            >
              Visit history
            </DropdownMenuCheckboxItem>

            <DropdownMenuCheckboxItem
              checked={showAlerts}
              onCheckedChange={setShowAlerts}
            >
              Active alerts
            </DropdownMenuCheckboxItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel>Layout</DropdownMenuLabel>

            <DropdownMenuCheckboxItem
              checked={compactView}
              onCheckedChange={setCompactView}
            >
              Compact view
            </DropdownMenuCheckboxItem>
          </DropdownMenuGroup>

        </DropdownMenuContent>
      </DropdownMenu>
    )
  },
}
export const WithRadioItems: Story = {
  name: "With Radio Group",
  render: () => {
    const [status, setStatus] = React.useState("active")
    const [sortBy, setSortBy] = React.useState("name")

    return (
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" />}>
          Filter & sort
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-48">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Status</DropdownMenuLabel>

            <DropdownMenuRadioGroup value={status} onValueChange={setStatus}>
              <DropdownMenuRadioItem value="active">Active</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="inactive">Inactive</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="pending">Pending</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>

            <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
              <DropdownMenuRadioItem value="name">Name</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="date">Date added</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="visits">Visit count</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuGroup>

        </DropdownMenuContent>
      </DropdownMenu>
    )
  },
}
export const RowActions: Story = {
  name: "Row Actions (Icon Trigger)",
  render: () => (
    <div className="flex items-center justify-between rounded-lg border bg-background px-4 py-3">
      <div>
        <p className="text-sm font-medium">Margaret Johnson</p>
        <p className="text-xs text-muted-foreground">Next visit: 2 Apr 2026</p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
          <MoreHorizontalIcon />
          <span className="sr-only">Row actions</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem>
            <EyeIcon />
            View
          </DropdownMenuItem>
          <DropdownMenuItem>
            <EditIcon />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CalendarIcon />
            Reschedule
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">
            <Trash2Icon />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
}
export const UserMenu: Story = {
  name: "User Account Menu",
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring" />
        }
      >
        <span className="inline-flex size-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
          SW
        </span>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">

        {/* ✅ FIX: wrap label inside group */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex flex-col gap-0.5 py-2">
            <span className="font-semibold text-foreground">Sarah Williams</span>
            <span className="text-xs font-normal text-muted-foreground">
              sarah@careconnect.com
            </span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <UserIcon />
            Profile
          </DropdownMenuItem>

          <DropdownMenuItem>
            <SettingsIcon />
            Settings
            <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <LogOutIcon />
          Sign out
          <DropdownMenuShortcut>⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  ),
}