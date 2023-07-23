import { useRouter } from 'next/navigation';
import { urlToCompanyItemPage } from '@/utils/routes';
import useSWR from 'swr';
import { CompanySortBy, GetCompaniesResponse } from '@/utils/requests';
import { fetcher } from '@/utils/fetcher';
import { Spinner } from '@/components/spinner';
import { CompanyItem } from '@/components/company-item';
import { useEffect } from 'react';

export interface LeaderboardListProps {
  pageIndex: number;
  pageSize: number;
  onTotalItemCountKnown: (totalItemCount: number) => void;
}

export function LeaderboardList({
  pageIndex,
  pageSize,
  onTotalItemCountKnown,
}: LeaderboardListProps) {
  const router = useRouter();

  const companyClickHandler = (companyId: string) => {
    router.push(urlToCompanyItemPage({ companyId }));
  };

  const { data: companiesData } = useSWR<GetCompaniesResponse>(
    `/api/companies?${new URLSearchParams({
      offset: (pageIndex * pageSize).toString(),
      limit: pageSize.toString(),
      sortBy: CompanySortBy.WinPercentageDesc,
    })}`,
    fetcher,
  );

  useEffect(() => {
    if (companiesData) {
      onTotalItemCountKnown(companiesData.totalCompaniesCount);
    }
  }, [companiesData, onTotalItemCountKnown]);

  if (!companiesData) {
    return <Spinner />;
  }

  // TODO:
  // ... error states

  // TODO: rank is not correct since this is paginated
  const renderedResults = companiesData.companies.map((c, i) => {
    return (
      <CompanyItem key={c.name} company={c} onClick={companyClickHandler} />
    );
  });

  return (
    <div className={'flex flex-col gap-4 items-center'}>{renderedResults}</div>
  );
}
