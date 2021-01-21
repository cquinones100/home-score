const serverFetch = (async (path, init) => {
  const args = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    ...init
  }
  return await fetch(`http://localhost:3001${path}`, args);
}) as typeof fetch;

export default serverFetch;
