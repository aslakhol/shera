import { WrapLinks } from "../WrapLinks";

type Props = { description: string };

export const Body = ({ description }: Props) => {
  const paragraphs = description.split("\n");

  return (
    <div className="flex flex-col gap-1">
      {paragraphs.map((paragraph, index) => (
        <p className="break-all" key={`event-body-paragraph-${index}`}>
          <WrapLinks text={paragraph} />
        </p>
      ))}
    </div>
  );
};
