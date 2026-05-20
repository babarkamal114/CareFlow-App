import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import {
  AlertTriangleIcon,
  CheckIcon,
  InfoIcon,
  XCircleIcon,
  XIcon,
} from "lucide-react"
import * as React from "react"

import {
  Alert,
  AlertAction,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "ui-components"
import { Button } from 'ui-components'

const meta = {
  title: "UI/Alert",
  component: Alert,
  parameters: {
    controls: { expanded: true },
  },
  args: {
    variant: "info",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["success", "info", "warning", "error"],
    },
  },
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

// Playground

export const Playground: Story = {
  render: (args) => (
    <Alert {...args} className="max-w-sm">
      <AlertIcon>
        <InfoIcon />
      </AlertIcon>
      <AlertContent>
        <AlertTitle>Heads up</AlertTitle>
        <AlertDescription>
          This alert is fully controllable from args.
        </AlertDescription>
      </AlertContent>
    </Alert>
  ),
}

// Inline alerts — matches the screenshot section exactly

function InlineAlertsSection() {
  const [dismissed, setDismissed] = React.useState<Set<string>>(new Set())

  function dismiss(id: string) {
    setDismissed((prev) => new Set([...prev, id]))
  }

  return (
    <div className="rounded-xl border bg-background overflow-hidden">
      {/* Section label */}
      <div className="border-b bg-muted/30 px-4 py-2">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Inline alerts
        </span>
      </div>

      <div className="flex flex-col gap-3 p-5 max-w-xl">
        {/* Success */}
        {!dismissed.has("success") && (
          <Alert variant="success">
            <AlertIcon>
              <CheckIcon />
            </AlertIcon>
            <AlertContent>
              <AlertTitle>Visit completed successfully</AlertTitle>
              <AlertDescription>
                Margaret Johnson's morning visit has been logged with all tasks
                completed.
              </AlertDescription>
            </AlertContent>
            <AlertAction>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => dismiss("success")}
                aria-label="Dismiss"
              >
                <XIcon className="size-3.5" />
              </Button>
            </AlertAction>
          </Alert>
        )}

        {/* Info — with action links */}
        {!dismissed.has("info") && (
          <Alert variant="info">
            <AlertIcon>
              <InfoIcon />
            </AlertIcon>
            <AlertContent>
              <AlertTitle>AI insight available</AlertTitle>
              <AlertDescription>
                Robert Ahmed's fluid intake has declined 40% this week. Consider
                a care plan review.
                <div className="mt-2 flex gap-3">
                  <a
                    href="#"
                    className="font-medium underline underline-offset-2 hover:no-underline"
                    onClick={(e) => e.preventDefault()}
                  >
                    Review insight
                  </a>
                  <a
                    href="#"
                    className="font-medium underline underline-offset-2 hover:no-underline"
                    onClick={(e) => e.preventDefault()}
                  >
                    Dismiss
                  </a>
                </div>
              </AlertDescription>
            </AlertContent>
            <AlertAction>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => dismiss("info")}
                aria-label="Dismiss"
              >
                <XIcon className="size-3.5" />
              </Button>
            </AlertAction>
          </Alert>
        )}

        {/* Warning */}
        {!dismissed.has("warning") && (
          <Alert variant="warning">
            <AlertIcon>
              <AlertTriangleIcon />
            </AlertIcon>
            <AlertContent>
              <AlertTitle>Late arrival warning</AlertTitle>
              <AlertDescription>
                Maria Rodriguez is 12 minutes late for Edna Morris's visit.
                Expected arrival in 5 minutes.
              </AlertDescription>
            </AlertContent>
            <AlertAction>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => dismiss("warning")}
                aria-label="Dismiss"
              >
                <XIcon className="size-3.5" />
              </Button>
            </AlertAction>
          </Alert>
        )}

        {/* Error — with action link */}
        {!dismissed.has("error") && (
          <Alert variant="error">
            <AlertIcon>
              <XCircleIcon />
            </AlertIcon>
            <AlertContent>
              <AlertTitle>Missed visit — escalation triggered</AlertTitle>
              <AlertDescription>
                Dorothy Chen's 9:30 AM visit was not attended. Safeguarding
                notification sent to the registered manager.
                <div className="mt-2">
                  <a
                    href="#"
                    className="font-medium underline underline-offset-2 hover:no-underline"
                    onClick={(e) => e.preventDefault()}
                  >
                    View escalation
                  </a>
                </div>
              </AlertDescription>
            </AlertContent>
          </Alert>
        )}

        {dismissed.size === 4 && (
          <p className="text-center text-sm text-muted-foreground py-4">
            All alerts dismissed.{" "}
            <button
              className="underline underline-offset-2"
              onClick={() => setDismissed(new Set())}
            >
              Reset
            </button>
          </p>
        )}
      </div>
    </div>
  )
}

export const InlineAlerts: Story = {
  name: "Inline Alerts",
  render: () => <InlineAlertsSection />,
}

// All variants grid

export const Variants: Story = {
  render: () => (
    <div className="grid max-w-xl gap-2">
      <Alert variant="success">
        <AlertIcon>
          <CheckIcon />
        </AlertIcon>
        <AlertContent>
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>Everything looks good.</AlertDescription>
        </AlertContent>
      </Alert>
      <Alert variant="info">
        <AlertIcon>
          <InfoIcon />
        </AlertIcon>
        <AlertContent>
          <AlertTitle>Info</AlertTitle>
          <AlertDescription>This is informational.</AlertDescription>
        </AlertContent>
      </Alert>
      <Alert variant="warning">
        <AlertIcon>
          <AlertTriangleIcon />
        </AlertIcon>
        <AlertContent>
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>Please review this item.</AlertDescription>
        </AlertContent>
      </Alert>
      <Alert variant="error">
        <AlertIcon>
          <XCircleIcon />
        </AlertIcon>
        <AlertContent>
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Something failed.</AlertDescription>
        </AlertContent>
      </Alert>
    </div>
  ),
}

// With dismiss actions

export const WithDismiss: Story = {
  name: "With Dismiss",
  render: () => {
    const [show, setShow] = React.useState(true)
    return show ? (
      <Alert variant="info" className="max-w-sm">
        <AlertIcon>
          <InfoIcon />
        </AlertIcon>
        <AlertContent>
          <AlertTitle>New feature available</AlertTitle>
          <AlertDescription>
            Auto-scheduling is now live for your team.
          </AlertDescription>
        </AlertContent>
        <AlertAction>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => setShow(false)}
            aria-label="Dismiss"
          >
            <XIcon className="size-3.5" />
          </Button>
        </AlertAction>
      </Alert>
    ) : (
      <p className="text-sm text-muted-foreground">
        Alert dismissed.{" "}
        <button className="underline" onClick={() => setShow(true)}>
          Show again
        </button>
      </p>
    )
  },
}