
module.exports = (req, res, next) => {
    console.log('=== HEADERS ===');
    console.log('Authorization:', req.headers.authorization);
    console.log('=== USER ===');
    console.log('Authentifié:', !!req.user);
    if (req.user) {
      console.log('User ID:', req.user.id);
      console.log('User ID type:', typeof req.user.id);
    }
    next();
  };