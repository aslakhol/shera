import Linkify from "linkify-react";

type Props = { description: string };

export const Body = ({ description }: Props) => {
  const paragraphs = description.split("\n");

  return (
    <div className="flex flex-col gap-1">
      {paragraphs.map((paragraph, index) => (
        <Linkify as="p" className="break-all py-2" key={`event-body-paragraph-${index}`}>{paragraph}</Linkify>
      ))}
    </div>
  );
};
