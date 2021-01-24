import config from "../../config";

const serverFetch = (async (path, init) => {
  const args = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    ...init
  }
  return await fetch(`${config.SERVER_ROOT}${path}`, args);
}) as typeof fetch;

export default serverFetch;
