'use client';
// TODO: could this be a server component?? ^^ no need for state or use effect?

import { useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import { Company, Result } from '@/utils/models';
import Image from 'next/image';
import { GetCompaniesResponse } from '@/utils/requests';
import { urlToCompanyItemPage } from '@/utils/routes';
import { PageNavigator } from '@/components/page-navigator';
import { fetcher } from '@/utils/fetcher';

const MAX_RESULTS = 500;
const PAGE_SIZE = 4;

interface IBattleResult {
  company: Company;
  onClickCompany: (companyId: string) => void;
  isWinner: boolean;
}

function BattleResult({ company, onClickCompany, isWinner }: IBattleResult) {
  return (
    <button
      className={'relative w-28 h-24'}
      onClick={() => onClickCompany(company.id)}
    >
      <Image
        className="w-full"
        src={`/logos/${company.imageName}`}
        width={100}
        height={100}
        alt={company.name}
      />
      {!isWinner && (
        <Image
          className={'w-full top-0 left-0 absolute opacity-80'}
          src={'/x.png'}
          width={64}
          height={64}
          alt={'X'}
        />
      )}
    </button>
  );
}

interface ISinglePageProps {
  results: Result[];
  onCompanyItemClick: (companyId: string) => void;
}

// TODO: move somewhere else and share logic
export function SinglePage({ results, onCompanyItemClick }: ISinglePageProps) {
  const companyIds = results.reduce(
    (accumulator: Set<string>, currentValue) => {
      accumulator.add(currentValue.companyId1);
      accumulator.add(currentValue.companyId2);
      return accumulator;
    },
    new Set<string>(),
  );

  const { data } = useSWR<GetCompaniesResponse>(
    `/api/companies?${new URLSearchParams({
      ids: Array.from(companyIds).join(','),
    })}`,
    fetcher,
  );

  const companiesMap = useMemo(() => {
    if (!data) {
      return null;
    }

    const map = new Map<string, Company>();
    data.companies.forEach((c) => {
      map.set(c.id, c);
    });
    return map;
  }, [data]);

  if (!data || !companiesMap) {
    return null;
  }

  const renderedResults = results.map((r) => {
    return (
      <div key={r.id}>
        <div
          className={
            'flex flex-row items-center shadow-md p-4 bg-white rounded'
          }
        >
          <BattleResult
            company={companiesMap.get(r.companyId1) as Company}
            onClickCompany={onCompanyItemClick}
            isWinner={r.didVoteForCompany1}
          />
          <div className={'p-4'}>vs.</div>
          <BattleResult
            company={companiesMap.get(r.companyId2) as Company}
            onClickCompany={onCompanyItemClick}
            isWinner={!r.didVoteForCompany1}
          />
        </div>
      </div>
    );
  });

  const companies = data.companies;

  console.log('final companies: ', companies);
  // TODO: instead of rendering the companies, we need to render the battle (2 companies per result).

  return <>{renderedResults}</>;
}

export default function Page() {
  const [pageIndex, setPageIndex] = useState(0);
  const [allResults, setAllResults] = useState<Result[]>([]);

  const router = useRouter();

  const { data } = useSWR(
    `/api/results?${new URLSearchParams({
      limit: MAX_RESULTS.toString(),
    })}`,
    fetcher,
  );

  useEffect(() => {
    if (data) {
      setAllResults(data.results);
    }
  }, [data]);

  // TODO: error handling
  if (!data || data.results.length === 0) {
    return null;
  }

  const companyClickHandler = (companyId: string) => {
    console.log('## lcick: ', companyId);
    router.push(urlToCompanyItemPage({ companyId }));
  };

  const pageChangedHandler = (pageIndex: number) => {
    console.log('### pageIndex changed: ', pageIndex);
    setPageIndex(pageIndex);
  };

  const pageCount = Math.ceil(data.results.length / PAGE_SIZE);

  console.log('## all results: ', allResults);
  if (allResults.length === 0) {
    return null;
  }

  return (
    <main
      className={
        'bg-blue-400 w-1/2 m-auto rounded-xl flex flex-col items-center'
      }
    >
      <div>Recent Battles</div>
      <PageNavigator pageCount={pageCount} onPageChanged={pageChangedHandler} />
      <div className={'flex flex-col gap-4 pt-4 pb-4'}>
        <SinglePage
          results={allResults.slice(
            PAGE_SIZE * pageIndex,
            PAGE_SIZE * (pageIndex + 1),
          )}
          onCompanyItemClick={companyClickHandler}
        />
        {/*<button onClick={() => setPageIndex(pageIndex - 1)}>Previous</button>*/}
        {/*<button onClick={() => setPageIndex(pageIndex + 1)}>Next</button>*/}
      </div>
    </main>
  );

  //
  // const [cnt, setCnt] = useState(1);
  //
  // const router = useRouter();
  //
  // // TODO: move to shared place... for the route definition
  // const companyClickHandler = (companyId: string) => {
  //   router.push(`/companies/${companyId}`);
  // };
  //
  // const pages = [];
  // for (let i = 0; i < cnt; i++) {
  //   pages.push(
  //     <SinglePage index={i} key={i} onCompanyItemClick={companyClickHandler} />,
  //   );
  // }

  // return (
  //   <main className={'flex flex-col items-center'}>
  //     <div>Recent Battles</div>
  //     <div className={'flex flex-col gap-4'}>
  //       {pages}
  //       <button onClick={() => setCnt(cnt + 1)}>Load More</button>
  //     </div>
  //   </main>
  // );
}
