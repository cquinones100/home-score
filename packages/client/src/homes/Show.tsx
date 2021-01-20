import { ChangeEvent, FC, useEffect, useState } from "react";
import Home from "../types/Home";

type Props = {
  match: {
    params: {
      id: number,
      user_name: string
    }
  }
};

const Show: FC<Props> = (props) => {
  const [home, setHome] = useState<Home>(null as unknown as Home);

  const { id, user_name } = props.match.params;

  useEffect(() => {
    const fetchHome = async () => {
      const resp = 
        await fetch(`/homes/${id}?user_name=${user_name}`, {
          headers: {
            'Content-Type': 'application/json'
          },
        });

      const json = await resp.json();

      setHome(json);
    }

    if (!home) fetchHome();

  }, [home, id, user_name])

  const onChangeCategory =
    (e: ChangeEvent<HTMLInputElement>, attribute: 'weight' | 'score') => {
      console.log('coming soon!')
    };

  if (home) {
    return (
      <>
        <h1>{home.address}</h1>
        {home.image_urls.map(imageUrl => {
          return (
            <img key={imageUrl} alt={home.address} src={imageUrl} />
          )
        })}
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Weight</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {
              home!.categories!.map((category, index) => {
                return (
                  <tr key={index}>
                    <td>{category.name}</td>
                    <td>
                      <input
                        value={category.weight}
                        onChange={e => onChangeCategory(e, 'weight')}
                      />
                    </td>
                    <td>
                      <input
                        value={category.weight}
                        onChange={e => onChangeCategory(e, 'score')}
                      />
                    </td>
                  </tr>
                );
              })
            }
            <tr>
              <td />
              <td />
              <td>{home.score}</td>
            </tr>
          </tbody>
        </table>
      </>
    )
  }

  return <div />;
}

export default Show;
