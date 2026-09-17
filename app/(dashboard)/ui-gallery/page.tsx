"use client"

import {
  AlertCircle,
  AlertTriangle,
  BellIcon,
  Check,
  Info,
  SearchIcon,
} from "lucide-react"
import * as React from "react"

import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Badge,
  Button,
  ButtonGroup,
  Checkbox,
  DatePicker,
  EmptyState,
  Field,
  FieldDescription,
  IconButton,
  Input,
  Label,
  Progress,
  ProgressIndicator,
  ProgressTrack,
  RadioGroup,
  RadioGroupItem,
  Separator,
  Skeleton,
  Slider,
  StatCard,
  StatCardHeader,
  StatCardIcon,
  StatCardLabel,
  StatCardTrend,
  StatCardValue,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  toast,
} from @/components/ui

import { GalleryBadgesAvatars } from "./gallery-badges-avatars"
import { GalleryCards } from "./gallery-cards"
import { GalleryTables } from "./gallery-tables"

export default function UiGalleryPage(): React.ReactElement {
  const statMetricLabelId = React.useId()
  const [date, setDate] = React.useState<Date | undefined>()
  const [progress, setProgress] = React.useState(40)
  const [slider, setSlider] = React.useState([30])

  return (
    <div className="cf-container max-w-4xl space-y-12 py-8">
      <div>
        <h1 className="font-heading text-cf-h2 font-bold">UI gallery</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Internal preview of CareFlow shadcn components.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="font-heading text-lg font-bold">Buttons</h2>
        <div className="flex flex-wrap gap-2">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="brandOutline">Brand outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button size="xl">Extra large</Button>
          <Button loading>Loading</Button>
        </div>
        <ButtonGroup>
          <Button variant="secondary" size="sm">
            Prev
          </Button>
          <Button variant="secondary" size="sm">
            Step 2
          </Button>
          <Button variant="secondary" size="sm">
            Next
          </Button>
        </ButtonGroup>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-lg font-bold">Icon buttons</h2>
        <div className="flex flex-wrap items-center gap-2">
          <IconButton aria-label="Search" variant="outline" size="sm">
            <SearchIcon />
          </IconButton>
          <IconButton aria-label="Notifications" variant="ghost">
            <BellIcon />
          </IconButton>
          <IconButton aria-label="Add" variant="solid" size="lg">
            <SearchIcon />
          </IconButton>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-lg font-bold">Forms</h2>
        <div className="grid max-w-md gap-4">
          <Field>
            <Label htmlFor="g-name" required>
              Full name
            </Label>
            <Input id="g-name" placeholder="Jane Cooper" />
            <FieldDescription>Use the name on the care record.</FieldDescription>
          </Field>
          <Field>
            <Label htmlFor="g-nickname" optional>
              Preferred name
            </Label>
            <Input id="g-nickname" placeholder="Jay" />
          </Field>
          <Field>
            <Label htmlFor="g-notes">Notes</Label>
            <Textarea id="g-notes" rows={3} placeholder="Visit notes…" />
            <FieldDescription tone="success">
              Autosaves while you type.
            </FieldDescription>
          </Field>
          <Field>
            <Label htmlFor="g-code">Access code</Label>
            <Input id="g-code" placeholder="0000" aria-invalid />
            <FieldDescription tone="error">Must be four digits.</FieldDescription>
          </Field>
          <div className="flex items-center gap-2">
            <Checkbox id="g-agree" />
            <Label htmlFor="g-agree">Agree to terms</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="g-active" />
            <Label htmlFor="g-active">Active</Label>
          </div>
          <RadioGroup defaultValue="a" className="flex gap-4">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="a" id="g-a" />
              <Label htmlFor="g-a">Option A</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="b" id="g-b" />
              <Label htmlFor="g-b">Option B</Label>
            </div>
          </RadioGroup>
          <div className="space-y-2">
            <Label>Date</Label>
            <DatePicker value={date} onChange={setDate} />
          </div>
          <div className="space-y-2">
            <Label>Slider</Label>
            <Slider
              value={slider}
              onValueChange={(v) =>
                setSlider(Array.isArray(v) ? [...v] : [v])
              }
              max={100}
              step={1}
            />
          </div>
          <div className="space-y-2">
            <Label>Progress</Label>
            <div className="space-y-3">
              <Progress value={progress} trackSize="sm" />
              <Progress value={progress} />
              <Progress value={progress} trackSize="lg" />
            </div>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => setProgress((p) => (p >= 100 ? 0 : p + 10))}
            >
              Bump
            </Button>
          </div>
        </div>
      </section>

      <GalleryBadgesAvatars />
      <GalleryCards />

      <section className="space-y-4">
        <h2 className="font-heading text-lg font-bold">Alert & toast</h2>
        <div className="flex max-w-lg flex-col gap-3">
          <Alert variant="success">
            <AlertIcon>
              <Check aria-hidden />
            </AlertIcon>
            <AlertContent>
              <AlertTitle>Visit completed</AlertTitle>
              <AlertDescription>
                Notes were saved to the patient timeline.
              </AlertDescription>
            </AlertContent>
          </Alert>
          <Alert variant="info">
            <AlertIcon>
              <Info aria-hidden />
            </AlertIcon>
            <AlertContent>
              <AlertTitle>Heads up</AlertTitle>
              <AlertDescription>
                This is an informational alert using CareFlow styles.
              </AlertDescription>
            </AlertContent>
          </Alert>
          <Alert variant="warning">
            <AlertIcon>
              <AlertTriangle aria-hidden />
            </AlertIcon>
            <AlertContent>
              <AlertTitle>Review medication</AlertTitle>
              <AlertDescription>
                One dose is due within the hour.
              </AlertDescription>
            </AlertContent>
          </Alert>
          <Alert variant="error">
            <AlertIcon>
              <AlertCircle aria-hidden />
            </AlertIcon>
            <AlertContent>
              <AlertTitle>Sync failed</AlertTitle>
              <AlertDescription>Try again or contact support.</AlertDescription>
            </AlertContent>
          </Alert>
        </div>
        <Button type="button" variant="secondary" onClick={() => toast("Saved")}>
          Show toast
        </Button>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-lg font-bold">Tabs</h2>
        <Tabs defaultValue="one" className="max-w-md">
          <TabsList>
            <TabsTrigger value="one">Visits</TabsTrigger>
            <TabsTrigger value="two">Medication</TabsTrigger>
          </TabsList>
          <TabsContent value="one">Visits content</TabsContent>
          <TabsContent value="two">Medication content</TabsContent>
        </Tabs>
      </section>

      <GalleryTables />

      <section className="space-y-4">
        <h2 className="font-heading text-lg font-bold">Skeleton</h2>
        <div className="flex items-center gap-4">
          <Skeleton className="size-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-lg font-bold">Stat card</h2>
        <StatCard
          className="max-w-sm"
          aria-labelledby={statMetricLabelId}
        >
          <StatCardHeader>
            <StatCardIcon tone="brand">
              <Check aria-hidden className="size-[18px]" strokeWidth={2} />
            </StatCardIcon>
          </StatCardHeader>
          <StatCardLabel id={statMetricLabelId}>Visits today</StatCardLabel>
          <StatCardValue>127</StatCardValue>
          <StatCardTrend>
            <Badge variant="secondary" className="gap-1">
              <Check className="size-2.5" strokeWidth={3} aria-hidden />
              96.1%
            </Badge>
            <span>vs last week</span>
          </StatCardTrend>
        </StatCard>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-lg font-bold">Empty state</h2>
        <EmptyState
          title="No patients yet"
          description="Add a patient to see them listed here."
        >
          <Button size="sm">Add patient</Button>
        </EmptyState>
      </section>

      <Separator />
      <p className="text-xs text-muted-foreground">End of gallery</p>
    </div>
  )
}
