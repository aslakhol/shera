type EventBodyProps = { description: string };

const EventBody = (props: EventBodyProps) => {
  const { description } = props;

  const paragraphs = description.split("\n");

  return (
    <div className="description prose">
      {paragraphs.map((paragraph) => (
        <p>{paragraph}</p>
      ))}
    </div>
  );
};

export default EventBody;
