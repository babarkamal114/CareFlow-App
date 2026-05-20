import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Checkbox, Switch, Label, RadioGroup, RadioGroupItem  } from 'ui-components'

const meta = {
  title: "UI/CheckboxRadioSwitch",
  parameters: {
    controls: { expanded: true },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// ---------------------------------------------------------------------------
// All three panels side-by-side — mirrors the design reference exactly
// ---------------------------------------------------------------------------
export const Overview: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      {/* ── CHECKBOXES ───────────────────────────────────────────── */}
      <div className="rounded-xl border bg-background p-6">
        <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Checkboxes
        </p>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Checkbox id="unchecked" />
            <Label htmlFor="unchecked">Unchecked</Label>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id="checked" defaultChecked />
            <Label htmlFor="checked">Checked</Label>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id="indeterminate" indeterminate />
            <Label htmlFor="indeterminate">Indeterminate</Label>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id="disabled" disabled />
            <Label htmlFor="disabled" className="text-muted-foreground">
              Disabled
            </Label>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id="disabled-checked" defaultChecked disabled />
            <Label htmlFor="disabled-checked" className="text-muted-foreground">
              Disabled checked
            </Label>
          </div>
        </div>
      </div>

      {/* ── RADIO BUTTONS ────────────────────────────────────────── */}
      <div className="rounded-xl border bg-background p-6">
        <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Radio Buttons
        </p>
        <RadioGroup defaultValue="two">
          <div className="flex items-center gap-2">
            <RadioGroupItem value="one" id="r-one" />
            <Label htmlFor="r-one">Option one</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="two" id="r-two" />
            <Label htmlFor="r-two">Option two (selected)</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="three" id="r-three" />
            <Label htmlFor="r-three">Option three</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="disabled" id="r-disabled" disabled />
            <Label htmlFor="r-disabled" className="text-muted-foreground">
              Disabled
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* ── SWITCHES ─────────────────────────────────────────────── */}
      <div className="rounded-xl border bg-background p-6">
        <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Switches
        </p>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Switch id="sw-off" />
            <Label htmlFor="sw-off">Off</Label>
          </div>

          <div className="flex items-center gap-2">
            <Switch id="sw-on" defaultChecked />
            <Label htmlFor="sw-on">On</Label>
          </div>

          <div className="flex items-center gap-2">
            <Switch id="sw-large" defaultChecked size="default" />
            <Label htmlFor="sw-large">Large on</Label>
          </div>

          <div className="flex items-center gap-2">
            <Switch id="sw-disabled" disabled />
            <Label htmlFor="sw-disabled" className="text-muted-foreground">
              Disabled
            </Label>
          </div>
        </div>
      </div>
    </div>
  ),
}

// ---------------------------------------------------------------------------
// Individual playgrounds
// ---------------------------------------------------------------------------
export const CheckboxPlayground: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="cb-play" />
      <Label htmlFor="cb-play">Label</Label>
    </div>
  ),
}

export const RadioPlayground: Story = {
  render: () => (
    <RadioGroup defaultValue="a">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="a" id="rp-a" />
        <Label htmlFor="rp-a">Option A</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="b" id="rp-b" />
        <Label htmlFor="rp-b">Option B</Label>
      </div>
    </RadioGroup>
  ),
}

export const SwitchPlayground: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="sw-play" />
      <Label htmlFor="sw-play">Toggle me</Label>
    </div>
  ),
}
