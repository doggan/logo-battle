'use client';

import { Logo } from '@/app/logo';
import { useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { Simulate } from 'react-dom/test-utils';
import error = Simulate.error;

// TODO: move to models (share with server)
interface IBattleResponse {
  company1: ICompany;
  company2: ICompany;
}

interface ICompany {
  id: string;
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

export default function Page() {
  const [currentBattle, setCurrentBattle] = useState<IBattleResponse | null>();

  // TODO: ideas for effect on click
  // - highlight winner in green, loser in red (flash animation)
  // - fade out  or disolve loser
  // - fade in new logos or shrink/grow animation with bounce

  const onVoteHandler = async (
    voteForCompanyId: string,
    voteAgainstCompanyId: string,
  ) => {
    setCurrentBattle(null); // TODO: hack
    postVote(voteForCompanyId, voteAgainstCompanyId);
    const battleResponse = await getBattle();
    setCurrentBattle(battleResponse);

    // // - call vote api
    // // - call fetch api to get new battle
    // // - disable buttons after click... show some type of animation
  };

  useEffect(() => {
    const fetchData = async () => {
      const battleResponse = await getBattle();
      setCurrentBattle(battleResponse);
    };

    // TODO:
    fetchData().catch(console.error);
  }, []);

  console.log(currentBattle);

  return (
    <main className={'w-screen flex flex-col items-center'}>
      <div
        className={'p-8 flex justify-between items-center flex-col md:flex-row'}
      >
        {!currentBattle && (
          <div
            className={'w-[300px] h-[300px] flex items-center justify-center'}
          >
            <ClipLoader aria-label="Loading Spinner" data-testid="loader" />
          </div>
        )}
        {currentBattle && (
          <Logo
            companyId={currentBattle.company1.id}
            imageName={'/logos/test1.svg'}
            onClick={() =>
              onVoteHandler(
                currentBattle?.company1.id,
                currentBattle?.company2.id,
              )
            }
          />
        )}
        <div className={'p-5'}>vs.</div>
        {!currentBattle && (
          <div
            className={'w-[300px] h-[300px] flex items-center justify-center'}
          >
            <ClipLoader aria-label="Loading Spinner" data-testid="loader" />
          </div>
        )}
        {currentBattle && (
          <Logo
            companyId={currentBattle.company2.id}
            imageName={'/logos/test1.svg'}
            onClick={() =>
              onVoteHandler(
                currentBattle?.company2.id,
                currentBattle?.company1.id,
              )
            }
          />
        )}
      </div>
    </main>
  );
}
