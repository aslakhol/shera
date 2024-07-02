export type UserNetwork = Array<Friend>;

export type Friend = {
  userId: string;
  name: string;
  events: Array<{
    publicId: string;
    title: string;
  }>;
};
