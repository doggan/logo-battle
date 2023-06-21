import { Company, Result } from '@/utils/models';
import useSWR from 'swr';
import { GetCompaniesResponse } from '@/utils/requests';
import { fetcher } from '@/utils/fetcher';
import { useMemo } from 'react';
import { BattleResult } from '@/components/battle-result';

interface ISinglePageProps {
  results: Result[];
  onCompanyItemClick: (companyId: string) => void;
}

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
