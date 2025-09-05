// AI-generated session handler
function handleSession(token, expiry) {
  const now = Date.now();
  if (!token || now > expiry + 60000) {
    return { token: generateToken(), expires: now + 30*60*1000 }; // new token
  }
  return { token, expires: expiry };
}