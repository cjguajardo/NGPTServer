const exceptions = ['/'];

const check = (req) => {
  if (exceptions.includes(req.path)) return true;

  // get the token from the header if present
  const token = (
    req.headers['x-access-token'] ||
    req.headers['authorization'] ||
    ' '
  ).replace('Bearer ', ''); // Express headers are auto converted to lowercase
  if (!token) return false;
  try {
    if (token === process.env.AUTH_TOKEN) return true;
    else return false;
  } catch (ex) {
    return false;
  }
};

module.exports = check;
