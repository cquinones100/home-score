const serverFetch = (async (path, init) => {
  const args = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    ...init
  }
  return await fetch(`https://cquinones.com/home-score/api${path}`, args);
}) as typeof fetch;

export default serverFetch;
