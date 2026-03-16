const getSameSite = () => {
  if (process.env.COOKIE_SAME_SITE) {
    return process.env.COOKIE_SAME_SITE;
  }

  return process.env.NODE_ENV === 'production' ? 'strict' : 'lax';
};

const getCookieOptions = () => {
  const sameSite = getSameSite();

  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' || sameSite === 'none',
    sameSite,
    maxAge: Number(process.env.COOKIE_EXPIRY || 259200000),
  };
};

module.exports = getCookieOptions;
