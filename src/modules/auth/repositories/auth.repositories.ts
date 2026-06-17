import User from '@/modules/auth/models/user.model.js';
import type { IUser } from '@/types/types.js';

function authRepositories() {
  return {
    create: async ({ name, email, password }: IUser) =>
      await User.create({ name, email, password }),
    findById: async (id: string) => await User.findById(id),
  };
}

export default authRepositories;
