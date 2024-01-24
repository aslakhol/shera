type Props = { description: string };

export const Body = ({ description }: Props) => {
  const paragraphs = description.split("\n");

  return (
    <div className="description prose">
      {paragraphs.map((paragraph, index) => (
        <p key={`event-body-paragraph-${index}`}>{paragraph}</p>
      ))}
    </div>
  );
};
