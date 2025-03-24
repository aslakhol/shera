import Link from "next/link";

type WrapLinksProps = { text: string };

export const WrapLinks = ({ text }: WrapLinksProps) => {
  const parts = text.split(/(\s+)/g);

  return (
    <span>
      {parts.map((part, index) => {
        if (!part.startsWith("http")) {
          return <span key={`wrap-link-${index}`}>{part}</span>;
        }

        const url = validUrl(part);
        if (!url) {
          return <span key={`wrap-link-${index}`}>{part}</span>;
        }

        return (
          <Link
            className="hover:underline"
            key={`wrap-link-${index}`}
            rel="noopener noreferrer"
            target="_blank"
            href={url.href}
          >
            {part}
          </Link>
        );
      })}
    </span>
  );
};

const validUrl = (url: string) => {
  if (!url.startsWith("http")) {
    return null;
  }

  try {
    return new URL(url);
  } catch (error) {
    return null;
  }
};
