import authRepositories from '@/modules/auth/repositories/auth.repositories.js';
import type { IUser, TPayload } from '@/types/types.js';
import { generateAccessToken } from '@/utils/jwt.js';

function authServices(repo = authRepositories()) {
  function generateTokenPair(payload: TPayload) {
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateAccessToken(payload);

    return {
      accessToken,
      refreshToken,
    };
  }

  return {
    register: async (userData: IUser) => {
      const user = await repo.create(userData);
      const tokens = generateTokenPair({ id: user.id });

      return {
        user,
        ...tokens,
      };
    },
    login: () => {},
  };
}

export default authServices;
