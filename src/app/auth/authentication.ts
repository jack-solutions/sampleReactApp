export const saveAuthData = (userdata) => {
  localStorage.setItem('user', JSON.stringify(userdata));
}

export const isTokenValid = (data?) => {
  if (!data) {
    const user = localStorage.getItem('user');
    if (!user) return false;
    data = JSON.parse(user);
  }
  return true;
}

export const isAuthenticated = () => {
  const user = localStorage.getItem('user');
  try {
    return user && isTokenValid(JSON.parse(user));
  } catch {
    return false;
  }
}

export const refreshToken = () => {

}

export const getToken = () => {
  return JSON.parse(localStorage.getItem('user')).token;
}

export const removeAuthData = () => {
  localStorage.removeItem('user');
}