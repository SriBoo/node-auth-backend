export function validateEmail(email) {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}

export function validatePassword(password) {
  return password && password.length >= 6;
}
