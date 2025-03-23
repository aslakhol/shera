import { WrapLinks } from "../WrapLinks";

type Props = { description: string };

export const Body = ({ description }: Props) => {
  return (
    <p className="whitespace-pre-wrap break-words">
      <WrapLinks text={description} />
    </p>
  );
};
