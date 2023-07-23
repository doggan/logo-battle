import { Company, Result } from '@/utils/models';
import { useRouter } from 'next/navigation';
import { urlToCompanyItemPage } from '@/utils/routes';
import useSWR from 'swr';
import { GetCompaniesResponse, GetResultsResponse } from '@/utils/requests';
import { fetcher } from '@/utils/fetcher';
import { useEffect, useMemo } from 'react';
import { Spinner } from '@/components/spinner';
import { BattleResult } from '@/components/battle-result';
import { NonIdealState } from '@/components/non-ideal-state';

export interface RecentListProps {
  pageIndex: number;
  pageSize: number;
  onTotalItemCountKnown: (totalItemCount: number) => void;
  /**
   * Optional filtering of results by company ID.
   */
  companyIdFilter?: string;
}

const getCompanyIds = (results: Result[]) => {
  return results.reduce((accumulator: Set<string>, currentValue) => {
    accumulator.add(currentValue.winnerCompanyId);
    accumulator.add(currentValue.loserCompanyId);
    return accumulator;
  }, new Set<string>());
};

export function RecentList({
  pageIndex,
  pageSize,
  onTotalItemCountKnown,
  companyIdFilter,
}: RecentListProps) {
  const router = useRouter();

  const companyClickHandler = (companyId: string) => {
    router.push(urlToCompanyItemPage({ companyId }));
  };

  const { data: resultsData, isLoading: isResultsLoading } =
    useSWR<GetResultsResponse>(
      `/api/results?${new URLSearchParams({
        offset: (pageIndex * pageSize).toString(),
        limit: pageSize.toString(),
        ...(companyIdFilter && { companyId: companyIdFilter }),
      })}`,
      fetcher,
    );

  useEffect(() => {
    if (resultsData) {
      onTotalItemCountKnown(resultsData.totalResultsCount);
    }
  }, [resultsData, onTotalItemCountKnown]);

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
      return new Map<string, Company>();
    }

    const map = new Map<string, Company>();
    companyData.companies.forEach((c) => {
      map.set(c.id, c);
    });
    return map;
  }, [companyData]);

  if (resultsData?.totalResultsCount === 0) {
    return <NonIdealState message={'No recent battles.'} />;
  }

  if (
    isResultsLoading ||
    !resultsData ||
    !companyData ||
    companiesMap.size === 0
  ) {
    return <Spinner />;
  }

  // TODO:
  // ... handle loading and error states

  const renderedResults = resultsData.results.map((r) => {
    const firstCompanyId = r.winnerIsFirst
      ? r.winnerCompanyId
      : r.loserCompanyId;
    const secondCompanyId = r.winnerIsFirst
      ? r.loserCompanyId
      : r.winnerCompanyId;

    return (
      <div
        key={r.id}
        className={
          'flex flex-row items-center shadow-md p-4 bg-white rounded-sm'
        }
      >
        <BattleResult
          company={companiesMap.get(firstCompanyId) as Company}
          onClickCompany={companyClickHandler}
          isWinner={r.winnerIsFirst}
        />
        <div className={'p-4'}>vs.</div>
        <BattleResult
          company={companiesMap.get(secondCompanyId) as Company}
          onClickCompany={companyClickHandler}
          isWinner={!r.winnerIsFirst}
        />
      </div>
    );
  });

  return (
    <div className={'flex flex-col gap-4 items-center'}>{renderedResults}</div>
  );
}
