import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import {
  CheckIcon,
  EyeIcon,
  SearchIcon,
} from "lucide-react"
import * as React from "react"

import { Input } from "ui-components"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from 'ui-components'

const meta = {
  title: "UI/Input",
  component: Input,
  parameters: {
    controls: { expanded: true },
  },
  args: {
    placeholder: "Type here...",
    size: "default",
    state: "default",
    disabled: false,
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "default", "lg"],
    },
    state: {
      control: "select",
      options: ["default", "success", "error"],
    },
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

// ---------------------------------------------------------------------------
// Sizes
// ---------------------------------------------------------------------------
export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-start gap-6">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Small</label>
        <Input {...args} size="sm" placeholder="Small input" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Default</label>
        <Input {...args} size="default" placeholder="Default input" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Large</label>
        <Input {...args} size="lg" placeholder="Large input" />
      </div>
    </div>
  ),
}

// ---------------------------------------------------------------------------
// States
// ---------------------------------------------------------------------------
export const States: Story = {
  render: (args) => (
    <div className="grid grid-cols-3 gap-x-8 gap-y-6">
      {/* Default */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Default</label>
        <Input {...args} placeholder="Enter text…" />
        <p className="text-xs text-muted-foreground">Helper text below the field</p>
      </div>

      {/* Hover — force via data-hover for pseudo-state addon */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Hover</label>
        <Input {...args} placeholder="Hovered…" data-hover />
        <p className="text-xs text-muted-foreground">Cursor hovering over input</p>
      </div>

      {/* Focused — autoFocus gives a real focus ring on mount */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Focused</label>
        <Input {...args} placeholder="typing…" autoFocus />
        <p className="text-xs text-muted-foreground">Ring appears on focus</p>
      </div>

      {/* Filled */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Filled</label>
        <Input {...args} defaultValue="sarah.williams@example.com" />
        <p className="text-xs text-muted-foreground">Value entered</p>
      </div>

      {/* Error / Invalid */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">
          Email address <span className="text-destructive">*</span>
        </label>
        <Input
          {...args}
          state="error"
          aria-invalid="true"
          defaultValue="invalid-email"
          type="email"
        />
        <p className="flex items-center gap-1 text-xs text-destructive">
          <span aria-hidden>⊗</span> Please enter a valid email
        </p>
      </div>

      {/* Disabled */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Disabled</label>
        <Input {...args} disabled placeholder="Cannot edit" />
        <p className="text-xs text-muted-foreground">Field is read-only</p>
      </div>
    </div>
  ),
}

// ---------------------------------------------------------------------------
// With Icons & Adornments
// ---------------------------------------------------------------------------
export const WithIconsAndAdornments: Story = {
  name: "With Icons & Adornments",
  render: (args) => {
    const [showPassword, setShowPassword] = React.useState(false)

    return (
      <div className="grid grid-cols-3 gap-x-8 gap-y-6">
        {/* Search */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Search</label>
          <InputGroup>
            <InputGroupAddon align="inline-start">
              <InputGroupText>
                <SearchIcon />
              </InputGroupText>
            </InputGroupAddon>
            <InputGroupInput placeholder="Search patients…" />
          </InputGroup>
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Password</label>
          <InputGroup>
            <InputGroupInput
              
              type={showPassword ? "text" : "password"}
              defaultValue="secretpassword"
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                size="icon-xs"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <EyeIcon />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </div>

        {/* Success */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Success</label>
          <InputGroup>
            <Input
              {...args}
              state="success"
              defaultValue="Available"
            />
            <InputGroupAddon align="inline-end">
              <InputGroupText>
                <CheckIcon className="text-green-600" />
              </InputGroupText>
            </InputGroupAddon>
          </InputGroup>
          <p className="flex items-center gap-1 text-xs text-green-600">
            <CheckIcon className="size-3" /> Username is available
          </p>
        </div>

        {/* Price */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">
            Price <span className="text-muted-foreground text-xs font-normal">(optional)</span>
          </label>
          <InputGroup>
            <InputGroupAddon align="inline-start">
              <InputGroupText>£</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput type="number" defaultValue="42.00" />
          </InputGroup>
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Phone</label>
          <InputGroup>
            <InputGroupAddon align="inline-start">
              <InputGroupText>
                <span>🇬🇧</span>
                <span className="text-xs">+44</span>
              </InputGroupText>
            </InputGroupAddon>
            <InputGroupInput type="tel" placeholder="7700 900123" />
          </InputGroup>
        </div>

        {/* Website URL */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Website URL</label>
          <InputGroup>
            <InputGroupAddon align="inline-start">
              <InputGroupText>https://</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput placeholder="example.com" />
          </InputGroup>
        </div>
      </div>
    )
  },
}
