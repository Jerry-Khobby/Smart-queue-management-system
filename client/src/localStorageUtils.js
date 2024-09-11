// localStorageUtils.js

// Function to set the token with expiration time
export const setItem = (key, value, maxAge = 24 * 60 * 60 * 1000) => {
  let result = {
    data: value,
    expireTime: Date.now() + maxAge, // Expiration time is current time + maxAge
  };
  window.localStorage.setItem(key, JSON.stringify(result));
};

// Function to get the token and check if it has expired
export const getItem = (key) => {
  const itemStr = window.localStorage.getItem(key);
  if (!itemStr) return null;

  const item = JSON.parse(itemStr);
  const now = Date.now();

  // Check if the token has expired
  if (now > item.expireTime) {
    window.localStorage.removeItem(key);
    return null; // Token has expired
  }
  return item.data; // Return valid token
};
