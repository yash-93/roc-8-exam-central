export type Session = {
  itemId: string;
  listKey: string;
  data: {
    name: string;
    role: string;
  };
};

export type Item = {
  id: string;
  name: string;
  role: string;
}

export type AccessArgs = {
  session?: Session;
  item?: any;
};

export type ListAccessArgs = {
  itemId?: string;
  session?: Session;
  item?: Item;
};
