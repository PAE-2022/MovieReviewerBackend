import passport from 'passport';

export function authorize() {
  return passport.authenticate('jwt', { session: false });
}

export function authorizeAdmin() {
  return passport.authenticate('jwtAdmin', { session: false });
}