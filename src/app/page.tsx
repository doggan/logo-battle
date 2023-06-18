'use client';

import { CompanyBattle } from '@/app/company-battle';
import { useEffect, useState } from 'react';
import { GetBattleResponse } from '@/utils/requests';
import { api } from '@/utils/fetcher';

export default function Page() {
  const [battle, setBattle] = useState<GetBattleResponse | null>();

  const getNewBattle = () => {
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
    </main>
  );
}
