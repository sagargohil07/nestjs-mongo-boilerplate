export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  access_token_secret: process.env.JWT_SECRET,
});
