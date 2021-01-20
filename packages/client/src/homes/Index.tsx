import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Home from "../../../../src/types/Home";

const Index = () => {
  const [homes, setHomes] = useState<Home[]>(null as unknown as Home[]);

  useEffect(() => {
    const getResp = async () => {
      const resp = await fetch('/homes', {
        headers: {
          'Content-Type': 'application/json'
        },
      });

      const json = await resp.json();

      setHomes(json);
    };

    if (!homes) getResp();
  }, [homes]);

  return (
    <table>
      <thead>
        <tr>
          <th>Address</th>
          <th>Url</th>
          <th>Score</th>
          <th>User</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {
          homes && (homes! as Home[]).map((home, index) => {
            return (
              <Fragment key={index}>
                <tr>
                  <td>{home.address}</td>
                  <td><a href={home.url}>{home.url}</a></td>
                  <td>{Number(home.score).toFixed(2)}</td>
                  <td>{home.user_name}</td>
                  <td>
                    <Link
                      to={`/homes/${home.home_id}?user_name=${home.user_name}`}
                    >
                      View
                    </Link>
                  </td>
                </tr>
              </Fragment>
            );
          })
        }
      </tbody>
    </table>
  );
}

export default Index;
