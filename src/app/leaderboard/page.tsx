'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import { GetCompaniesResponse, CompanySortBy } from '@/utils/requests';
import { urlToCompanyItemPage } from '@/utils/routes';
import { CompanyItem } from '@/components/company-item';

const fetcher = (url) => fetch(url).then((r) => r.json());

function SinglePage({ index, onCompanyItemClick }) {
  const { data } = useSWR<GetCompaniesResponse>(
    `/api/companies?${new URLSearchParams({
      sortBy: CompanySortBy.WinPercentageDesc,
    })}`,
    fetcher,
  );

  if (!data || data.companies.length === 0) {
    return null;
  }

  return data.companies.map((item, i) => (
    <CompanyItem
      key={item.name}
      rank={i + 1}
      company={item}
      onClick={onCompanyItemClick}
    />
  ));
}

export default function Page() {
  const [cnt, setCnt] = useState(1);

  const router = useRouter();

  const companyClickHandler = (companyId: string) => {
    router.push(urlToCompanyItemPage({ companyId }));
  };

  const pages = [];
  for (let i = 0; i < cnt; i++) {
    pages.push(
      <SinglePage index={i} key={i} onCompanyItemClick={companyClickHandler} />,
    );
  }

  return (
    <main
      className={
        'bg-blue-400 w-1/2 m-auto rounded-xl flex flex-col items-center'
      }
    >
      <div>Leaderboard</div>
      <div className={'flex flex-col gap-4'}>
        {pages}
        <button onClick={() => setCnt(cnt + 1)}>Load More</button>
      </div>
    </main>
  );
}
