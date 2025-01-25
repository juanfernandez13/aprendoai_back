export const UserSerializer = (user: any) => ({
  id: user.id,
  email: user.email,
  firstName: user.firstName,
});
