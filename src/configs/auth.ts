const loadAuthConfig = () => {
  const authBearerTokenKey =
    process.env.NEXT_PUBLIC_ADMIN_AUTH_TOKEN_KEY ||
    "mainnet_yieldlab_auth_bearer_token";

  return {
    authBearerTokenKey
  };
};

export { loadAuthConfig };
