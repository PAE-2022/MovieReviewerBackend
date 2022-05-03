import passport from 'passport';

export function authorize() {
  return passport.authenticate('jwt', { session: false });
}
