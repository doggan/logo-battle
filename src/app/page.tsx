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

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

async function getBattle(): Promise<IBattleResponse> {
  // try {
  //   const res = await fetch(`https://jsonplaceholder.typicode.com/posts/1`);
  //   const data = await res.json();
  //   console.log(data);
  // } catch (err) {
  //   console.log(err);
  // }

  // TODO: use swr?

  // await new Promise((r) => setTimeout(r, 2000));

  return {
    company1: {
      id: '6481560c009f8d9a55773e95',
    },
    company2: {
      id: '6481562d009f8d9a55773e96',
    },
  };
}

async function postVote(
  voteForCompanyId: string,
  voteAgainstCompanyId: string,
) {
  console.log('### postVote');
  const response = await fetch('/api/vote', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      voteForCompanyId,
      voteAgainstCompanyId,
    }),
  });
  // .catch((e) => {
  // console.log('### error: ', e);
  // });
  //   .then(() => {
  //   console.log('### response: ');
  //   console.log(response.json());
  // });

  console.log('### response: ');
  console.log(response);

  // if (response.st)
}

const fetcher = (...args) => fetch(...args).then((res) => res.json());

function useGetBattle() {
  const { data, error, isLoading } = useSWR(`/api/battle`, fetcher);

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

export default function Page() {
  // TODO: ideas for effect on click
  // - highlight winner in green, loser in red (flash animation)
  // - fade out  or disolve loser
  // - fade in new logos or shrink/grow animation with bounce

  // const { data, error, isLoading } = useSWR('/api/user/123', fetcher);
  // const { data, error, isLoading } = useGetBattle();
  const { battle, isLoading, isError } = useGetBattle();
  const { mutate } = useSWRConfig();
  // const { mutate } = usePostVote();

  if (isError) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;

  const onVoteHandler = async (
    voteForCompanyId: string,
    voteAgainstCompanyId: string,
  ) => {
    // setCurrentBattle(null); // TODO: hack
    // postVote(voteForCompanyId, voteAgainstCompanyId);
    // const battleResponse = await getBattle();
    // setCurrentBattle(battleResponse);
    // // - call vote api
    // // - call fetch api to get new battle
    // // - disable buttons after click... show some type of animation

    await mutate(
      `/api/battle`,
      {
        voteForCompanyId,
        voteAgainstCompanyId,
      },
      {
        // populateCache: false,
      },
      // options,
    );
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
              onVoteHandler(battle?.company1.id, battle?.company2.id)
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
              onVoteHandler(battle?.company2.id, battle?.company1.id)
            }
          />
        )}
      </div>
    </main>
  );
}
