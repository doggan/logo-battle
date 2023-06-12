'use client';

import { Logo } from '@/app/logo';
import { useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { Simulate } from 'react-dom/test-utils';
import error = Simulate.error;
import useSWR, { useSWRConfig } from 'swr';

// TODO: move to models (share with server)
interface IBattleResponse {
  company1: ICompany;
  company2: ICompany;
}

interface ICompany {
  id: string;
  name: string;
  imageName: string;
}

const fetcher = (...args) => fetch(...args).then((res) => res.json());

function useGetBattle() {
  const { data, error, isLoading } = useSWR(`/api/battles`, fetcher);

  console.log('### useGetBattle');

  return {
    battle: data as IBattleResponse,
    isLoading,
    isError: error,
  };
}

// function usePostVote() {
//   const { mutate } = useSWRConfig();
//
//   // mutate(`/api/battle`, data, options)
// }

// const fetcher = (...args) => fetch(url, {
//   method: 'post',
//   headers: {
//     "Content-Type": "application/json"
//   },
//   body: JSON.stringify(props.payload)
// }).then(res => res.json())
//
// const { data, error} = useSWR(url, fetcher, { suspense: true });

function api<T>(url: string): Promise<T> {
  return fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json() as Promise<T>;
  });
}

function getBattle(): Promise<IBattleResponse> {
  //Promise<IBattleResponse> {
  // api<{ title: string; message: string }>('v1/posts/1')
  //   .then(({ title, message }) => {
  //     console.log(title, message)
  //   })
  //   .catch(error => {
  //     /* show error message */
  //   })

  return api<IBattleResponse>('api/battles');
  // .then((battle) => {
  //   console.log('### got batle:', battle);
  // })
  // .catch((error) => {
  //   console.error(error);
  // });

  // const response = await fetch('/api/battles', {
  //   method: 'GET',
  // });

  // return result;
}

export default function Page() {
  // TODO: ideas for effect on click
  // - highlight winner in green, loser in red (flash animation)
  // - fade out  or disolve loser
  // - fade in new logos or shrink/grow animation with bounce

  const [battle, setBattle] = useState<IBattleResponse | null>();
  const [isFighting, setIsFighting] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const battleResponse = await getBattle();
      setBattle(battleResponse);
    };

    // TODO:
    fetchData().catch(console.error);
  }, []);

  const onVoteHandler = async (
    companyId1: string,
    companyId2: string,
    didVoteForCompany1: boolean,
  ) => {
    setIsFighting(true);

    console.log('### postVote');

    const response = await fetch('/api/results', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        companyId1,
        companyId2,
        didVoteForCompany1,
      }),
    });
    // TOOD: error handling

    console.log('### response: ');
    console.log(response);

    const battleResponse = await getBattle();
    setBattle(battleResponse);

    setIsFighting(false);

    // // - call vote api
    // // - call fetch api to get new battle
    // // - disable buttons after click... show some type of animation
    // await mutate(
    //   `/api/battle`,
    //   {
    //     voteForCompanyId,
    //     voteAgainstCompanyId,
    //   },
    //   {
    //     // populateCache: false,
    //   },
    //   // options,
    // );
    // myMutate(voteForCompanyId, voteAgainstCompanyId);
  };

  console.log('#### swr res: ', battle);

  return (
    <main className={'w-screen flex flex-col items-center'}>
      <div
        className={'p-8 flex justify-between items-center flex-col md:flex-row'}
      >
        {!battle && (
          <div
            className={'w-[300px] h-[300px] flex items-center justify-center'}
          >
            <ClipLoader aria-label="Loading Spinner" data-testid="loader" />
          </div>
        )}
        {battle && (
          <Logo
            companyId={battle.company1.id}
            companyName={battle.company1.name}
            imageName={`/logos/${battle.company1.imageName}`}
            onClick={() =>
              onVoteHandler(battle.company1.id, battle.company2.id, true)
            }
          />
        )}
        <div className={'p-5'}>vs.</div>
        {!battle && (
          <div
            className={'w-[300px] h-[300px] flex items-center justify-center'}
          >
            <ClipLoader aria-label="Loading Spinner" data-testid="loader" />
          </div>
        )}
        {battle && (
          <Logo
            companyId={battle.company2.id}
            companyName={battle.company2.name}
            imageName={`/logos/${battle.company2.imageName}`}
            onClick={() =>
              onVoteHandler(battle.company1.id, battle.company2.id, false)
            }
          />
        )}
      </div>
      <div>
        {isFighting && (
          <ClipLoader
            color={'red'}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        )}
      </div>
    </main>
  );
}
