export async function getFreshToken(getToken) {
  const token = await getToken({
    skipCache: true,
  });

  if (!token) {
    throw new Error("Authentication token unavailable.");
  }

  return token;
}
