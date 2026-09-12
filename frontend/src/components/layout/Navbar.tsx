import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import Container from "./Container";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-base font-semibold tracking-tight text-text">
          
          AI Research Assistant
        </Link>

        <nav className="flex items-center gap-2">
          <Link
            href="/chat"
            className="rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium text-text-muted transition-colors hover:text-text"
          >
            Open App
          </Link>
          <a
            href="https://github.com/iqra-ikram"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View source on GitHub"
            className="rounded-[var(--radius-md)] p-2 text-text-muted transition-colors hover:bg-surface-hover hover:text-text"
          >
            <FaGithub size={20} />
          </a>
        </nav>
      </Container>
    </header>
  );
}
