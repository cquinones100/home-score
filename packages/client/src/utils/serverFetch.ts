import config from '../../config';

type ServerFetch = (path: RequestInfo, init?: RequestInit, options?: {
  omit?: (keyof RequestInit)[]
}) => Promise<Response>

const serverFetch: ServerFetch = async (path, init, options = {}) => {
  const args: RequestInit = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    ...init
  }

  if (options.omit) {
    options.omit.map((option: keyof RequestInit) => {
      delete args[option];
    })
  }

  return await fetch(`${config.SERVER_ROOT}${path}`, args);
};

export default serverFetch;
