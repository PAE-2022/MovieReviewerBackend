import { checkJwt } from '@config/authz';

export const authorize = () => {
  return checkJwt;
};
