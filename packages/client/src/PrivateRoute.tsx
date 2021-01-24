import React, { FC, useEffect, useState } from "react";
import { Redirect, Route, RouterProps } from "react-router-dom";
import serverFetch from "./utils/serverFetch";

const PrivateRoute: FC<{ component: FC<RouterProps>, path: string }> =
  ({ component: Component, ...rest }) => {
    const [fetching, setFetching] = useState<boolean>(true);
    const [authenticated, setAuthenticated] = useState<boolean>(null as unknown as boolean);

    useEffect(() => {
      const fetchAuthentication = async () => {
        const resp = await serverFetch('/current');

        if (resp.ok) setAuthenticated(true);

        setFetching(false);
      };

      if (authenticated === null) fetchAuthentication();
    }, [authenticated])

    if (fetching) return <div />;

    console.log('hiii')

    return (
      <Route {...rest} render={(props) => (
        authenticated === true
          ? <Component {...props} />
          : <Redirect to='/login' />
      )} />
    );
  }

export default PrivateRoute;