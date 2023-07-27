'use client';

import { CompanyBattle } from '@/app/company-battle';
import { useEffect, useState } from 'react';
import { GetBattleResponse } from '@/utils/requests';
import { api } from '@/utils/fetcher';

export default function Page() {
  const [battle, setBattle] = useState<GetBattleResponse | null>();

  const getNewBattle = () => {
    // NOTE: This will be called twice in dev mode with react strict mode.
    api<GetBattleResponse>('api/battles').then((battleResponse) => {
      setBattle(battleResponse);
    });
  };

  useEffect(() => {
    getNewBattle();
  }, []);

  return (
    <main className={'w-screen flex flex-col items-center'}>
      <CompanyBattle
        company1={battle?.company1}
        company2={battle?.company2}
        onRequestNewBattle={getNewBattle}
      />
      <div className={'text-md italic font-light pt-4 px-2 text-center'}>
        Which S&P 500 company has the best logo?
      </div>
      <div className={'text-xs italic font-light pt-2 text-center'}>
        Company list last updated: 7/5/2023
      </div>
    </main>
  );
}
