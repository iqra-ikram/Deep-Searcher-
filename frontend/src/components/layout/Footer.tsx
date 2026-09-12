import { FaGithub, FaLinkedin } from "react-icons/fa";
import Container from "./Container";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border py-8">
      <Container className="flex flex-col items-center justify-between gap-4 text-sm text-text-dim sm:flex-row">
        <p>Built by Iqra Ikram — FastAPI, LangChain &amp; Next.js.</p>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/iqra-ikram"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="transition-colors hover:text-text"
          >
            <FaGithub size={18} />
          </a>
          <a
            href="https://www.linkedin.com/in/iqra-ikram-9660732b4/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
            className="transition-colors hover:text-text"
          >
            <FaLinkedin size={18} />
          </a>
        </div>
      </Container>
    </footer>
  );
}
