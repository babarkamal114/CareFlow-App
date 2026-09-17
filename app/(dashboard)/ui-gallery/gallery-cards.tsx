import type { ReactElement } from "react"

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  toast,
} from @/components/ui

export function GalleryCards(): ReactElement {
  return (
    <section className="space-y-4">
      <h2 className="font-heading text-lg font-bold">Cards</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card variant="default" className="max-w-md">
          <CardHeader>
            <CardTitle>Default</CardTitle>
            <CardDescription>Border + surface</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Base card variant.</p>
          </CardContent>
        </Card>
        <Card variant="elevated" className="max-w-md">
          <CardHeader>
            <CardTitle>Elevated</CardTitle>
            <CardDescription>Shadow + light border</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Matches HTML `.card-elevated`.
            </p>
          </CardContent>
        </Card>
        <Card
          variant="interactive"
          className="max-w-md"
          aria-label="Open visit summary (demo)"
          onClick={() => toast("Interactive card activated")}
        >
          <CardHeader>
            <CardTitle>Interactive</CardTitle>
            <CardDescription>
              Click or press Enter or Space — keyboard focus ring.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Pointer and hover shadow; uses role button when onClick is set.
            </p>
          </CardContent>
        </Card>
        <Card variant="outlined" className="max-w-md">
          <CardHeader>
            <CardTitle>Outlined</CardTitle>
            <CardDescription>Emphasis ring</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Selected / highlighted state.
            </p>
          </CardContent>
        </Card>
      </div>
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Patient profile</CardTitle>
          <CardDescription>With footer actions</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Content uses design tokens.
          </p>
        </CardContent>
        <CardFooter className="gap-2">
          <Button size="sm">Open</Button>
          <Button size="sm" variant="secondary">
            Dismiss
          </Button>
        </CardFooter>
      </Card>
    </section>
  )
}
