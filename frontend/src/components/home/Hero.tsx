import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "@/components/layout/Container";
import SupportedSources from "./SupportedSources";

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-10 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]" />
      </div>

      <Container>
        <div className="mx-auto max-w-3xl text-center">
          

          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-text sm:text-5xl lg:text-6xl">
            Ask questions.
            <br />
            Get answers grounded in your sources.
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-text-muted">
            Chat with PDFs, websites, and YouTube videos. Every answer is backed by real
            citations pulled from the source itself.
          </p>

          <div className="mt-9 flex items-center justify-center gap-3">
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-accent px-6 py-3 text-sm font-semibold text-[var(--accent-contrast)] transition-colors hover:bg-accent-strong"
            >
              Start researching <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <SupportedSources />
        </div>
      </Container>
    </section>
  );
}
