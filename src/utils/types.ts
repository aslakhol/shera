export type UserNetwork = Array<{
  userId: string;
  name: string;
  events: Array<{
    publicId: string;
    title: string;
  }>;
}>;
