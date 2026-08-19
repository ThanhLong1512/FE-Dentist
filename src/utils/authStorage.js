const ACCESS_TOKEN_KEY = "accessToken";

export const setAccessToken = (token) => {
  if (token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  }
};

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);

export const clearAccessToken = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
};

export const clearAuthSession = () => {
  localStorage.removeItem("userInfo");
  localStorage.removeItem("cart");
  clearAccessToken();
};

export const saveAuthSession = (userData) => {
  const userInfo = {
    id: userData.id || userData._id,
    name: userData.name,
    email: userData.email,
    role: userData.role,
    image: userData.image || userData.photo,
    require_2FA: userData.require_2FA,
    is_2fa_verified: userData.is_2fa_verified,
    last_login: userData.last_login,
  };
  localStorage.setItem("userInfo", JSON.stringify(userInfo));
  if (userData.accessToken) {
    setAccessToken(userData.accessToken);
  }
};
