const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
  maxAge: Number(process.env.COOKIE_EXPIRY || 259200000),
});

module.exports = getCookieOptions;

