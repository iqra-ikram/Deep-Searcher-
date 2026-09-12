export function isValidYoutubeUrl(url: string) {
  try {
    const parsed = new URL(url);

    if (
      parsed.hostname === "youtu.be"
    ) {
      const id = parsed.pathname.slice(1);
      return id.length === 11;
    }

    if (
      parsed.hostname === "www.youtube.com" ||
      parsed.hostname === "youtube.com" ||
      parsed.hostname === "m.youtube.com"
    ) {
      const id = parsed.searchParams.get("v");
      return id !== null && id.length === 11;
    }

    return false;
  } catch {
    return false;
  }
}

export function isValidWebsiteUrl(url: string): boolean {
    try {
        const parsed = new URL(url);

        const host = parsed.hostname.toLowerCase();

        if (
            host.includes("youtube.com") ||
            host.includes("youtu.be")
        ) {
            return false;
        }

        return (
            (parsed.protocol === "http:" ||
                parsed.protocol === "https:") &&
            host.includes(".")
        );

    } catch {
        return false;
    }
}

export function isValidPdf(file: File | null): boolean {
  if (!file) return false;

  return (
    file.type === "application/pdf" ||
    file.name.toLowerCase().endsWith(".pdf")
  );
}