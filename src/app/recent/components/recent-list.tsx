import { Company, Result } from '@/utils/models';
import { useRouter } from 'next/navigation';
import { urlToCompanyItemPage } from '@/utils/routes';
import useSWR from 'swr';
import { GetCompaniesResponse, GetResultsResponse } from '@/utils/requests';
import { fetcher } from '@/utils/fetcher';
import { useMemo } from 'react';
import { Spinner } from '@/components/spinner';
import { BattleResult } from '@/components/battle-result';

// TODO: move to shared constants?
const PAGE_SIZE = 4;

export interface RecentListProps {
  pageIndex: number;
}

const getCompanyIds = (results: Result[]) => {
  return results.reduce((accumulator: Set<string>, currentValue) => {
    accumulator.add(currentValue.companyId1);
    accumulator.add(currentValue.companyId2);
    return accumulator;
  }, new Set<string>());
};

export function RecentList({ pageIndex }: RecentListProps) {
  const router = useRouter();

  const companyClickHandler = (companyId: string) => {
    router.push(urlToCompanyItemPage({ companyId }));
  };

  const { data: resultsData } = useSWR<GetResultsResponse>(
    `/api/results?${new URLSearchParams({
      offset: (pageIndex * PAGE_SIZE).toString(),
      limit: PAGE_SIZE.toString(),
    })}`,
    fetcher,
  );

  const companyIds = resultsData
    ? getCompanyIds(resultsData.results)
    : new Set<string>();
  const { data: companyData } = useSWR<GetCompaniesResponse>(
    companyIds.size === 0
      ? null
      : `/api/companies?${new URLSearchParams({
          ids: Array.from(companyIds).join(','),
        })}`,
    fetcher,
  );

  const companiesMap = useMemo(() => {
    if (!companyData) {
      return null;
    }

    const map = new Map<string, Company>();
    companyData.companies.forEach((c) => {
      map.set(c.id, c);
    });
    return map;
  }, [companyData]);

  if (!resultsData || !companyData || !companiesMap) {
    return <Spinner />;
  }

  // TODO:
  // ... handle loading and error states

  const renderedResults = resultsData.results.map((r) => {
    return (
      <div key={r.id}>
        <div
          className={
            'flex flex-row items-center shadow-md p-4 bg-white rounded'
          }
        >
          <BattleResult
            company={companiesMap.get(r.companyId1) as Company}
            onClickCompany={companyClickHandler}
            isWinner={r.didVoteForCompany1}
          />
          <div className={'p-4'}>vs.</div>
          <BattleResult
            company={companiesMap.get(r.companyId2) as Company}
            onClickCompany={companyClickHandler}
            isWinner={!r.didVoteForCompany1}
          />
        </div>
      </div>
    );
  });

  return <>{renderedResults}</>;
}
