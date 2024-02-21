type Props = { description: string };

export const Body = ({ description }: Props) => {
  const paragraphs = description.split("\n");

  return (
    <div className="flex flex-col gap-1">
      {paragraphs.map((paragraph, index) => (
        <p key={`event-body-paragraph-${index}`}>{paragraph}</p>
      ))}
    </div>
  );
};
