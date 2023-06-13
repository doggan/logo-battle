'use client';

import { useState } from 'react';
import useSWR from 'swr';
import Image from 'next/image';
import { Company } from '@/app/api/battles/route';
import { useRouter } from 'next/navigation';

const fetcher = (url) => fetch(url).then((r) => r.json());

interface ICompanyItemProps {
  rank: number;
  company: Company;
  onClick: (companyId: string) => void;
}

export function formatPercentage(ratio: number) {
  return `${(ratio * 100).toFixed(2)}`;
}

function CompanyItem({ rank, company, onClick }: ICompanyItemProps) {
  const { id, imageName, name, wins, losses } = company;

  return (
    <button className="shadow-md relative" onClick={() => onClick(id)}>
      <div
        className={'absolute top-0 left-0 bg-gray-400 rounded-tl rounded-br'}
      >
        <span className={'p-1 text-white font-bold'}>{rank}</span>
      </div>
      <div className="p-4 flex flex-row">
        <div className={'flex items-center'}>
          <Image
            className="w-full"
            src={`/logos/${imageName}`}
            width={100}
            height={100}
            alt={name}
          />
        </div>
        <div className="pl-4">
          <div className="text-gray-900 font-bold text-xl mb-2">{name}</div>
          <p className="text-gray-700 text-base">
            Win Rate:{' '}
            <span className={'font-bold'}>
              {formatPercentage(wins / (wins + losses))}%
            </span>
            <br />
            Wins: <span className={'text-green-500 font-bold'}>{wins}</span>
            <br />
            Losses: <span className={'text-red-500 font-bold'}>{losses}</span>
          </p>
        </div>
      </div>
    </button>
  );
}

function SinglePage({ index, onCompanyItemClick }) {
  const { data } = useSWR(`/api/companies?page=${index}`, fetcher);

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
    router.push(`/companies/${companyId}`);
  };

  const pages = [];
  for (let i = 0; i < cnt; i++) {
    pages.push(
      <SinglePage index={i} key={i} onCompanyItemClick={companyClickHandler} />,
    );
  }

  return (
    <main className={'flex flex-col items-center'}>
      <div>Leaderboard</div>
      <div className={'flex flex-col gap-4'}>
        {pages}
        <button onClick={() => setCnt(cnt + 1)}>Load More</button>
      </div>
    </main>
  );
}
