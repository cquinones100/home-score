import React, { FC, Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HomeWithImageUrls from "../../../../src/types/HomeWithImageUrls";
import { homeShowUrl } from "./Show";

const Index: FC = () => {
  const [homes, setHomes] = useState<HomeWithImageUrls[]>(null as unknown as HomeWithImageUrls[]);

  useEffect(() => {
    const getResp = async () => {
      const resp = await fetch('http://localhost:3001/homes', {
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
          <th />
        </tr>
      </thead>
      <tbody>
        {
          homes && (homes! as HomeWithImageUrls[]).map((home, index) => {
            return (
              <Fragment key={index}>
                <tr>
                  <td>{home.address}</td>
                  <td><a href={home.url}>{home.url}</a></td>
                  <td>{(home.score * 100).toFixed(2)}</td>
                  <td>
                    <Link to={homeShowUrl(home.home_id, { useRoot: false })}>
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
