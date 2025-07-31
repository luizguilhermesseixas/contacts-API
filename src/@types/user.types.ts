import { Contact } from '@prisma/client';

export type User = {
  id: string;
  name: string;
  email: string;
  contacts?: Contact[];
  createdAt: Date;
  updatedAt: Date;
};
