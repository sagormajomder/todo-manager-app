import User from '@/modules/auth/models/user.model.js';
import type { IUser } from '@/types/types.js';

function authRepositories() {
  return {
    create: async ({ name, email, password }: IUser) =>
      await User.create({ name, email, password }),
    findByEmail: async () => {},
  };
}

export default authRepositories;
