import Link from "next/link";

type WrapLinksProps = { text: string };

export const WrapLinks = ({ text }: WrapLinksProps) => {
  const parts = text.split(/\s+/g);

  return (
    <span>
      {parts.map((part, index) => {
        if (part.startsWith("http")) {
          const url = safeParseUrl(part);
          if (!url) {
            return <span key={`wrap-link-${index}`}> {part} </span>;
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
        }

        return <span key={`wrap-link-${index}`}> {part} </span>;
      })}
    </span>
  );
};

const safeParseUrl = (url: string) => {
  if (!url.startsWith("http")) {
    return null;
  }

  try {
    return new URL(encodeURI(url));
  } catch (error) {
    return null;
  }
};
