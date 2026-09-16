'use client'

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="w-full max-w-2xl">
  
        <div className="mb-8 h-1 w-16 rounded-full bg-green-600" />


        <p className="text-sm font-medium tracking-wide text-green-600 uppercase">
          Error 404
        </p>

  
        <h1 className="mt-4 text-5xl font-bold tracking-tight text-zinc-900">
          This page has
          <br />
          done a runner.
        </h1>


        <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-600">
          We've filed a strongly worded complaint. In the meantime,
          let's pretend this never happened and get you back to somewhere
          that actually exists.
        </p>


        <div className="mt-10 flex items-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-green-700"
          >
            <ArrowLeft size={16} />
            Take me home
          </Link>

          <Button
            onClick={() => history.back()}
            variant="ghost"
          >
            Go back
          </Button>
        </div>

        <p className="mt-12 border-l-2 border-green-600 pl-4 text-sm text-zinc-500 italic">
          We even checked behind the kettle.
        </p>
      </div>
    </main>
  );
}