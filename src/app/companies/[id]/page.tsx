'use client';

import useSWR from 'swr';
import { Company } from '@/utils/models';
import { CompanyItem } from '@/components/company-item';
import { fetcher } from '@/utils/fetcher';
import { Spinner } from '@/components/spinner';
import {
  PaginatedResourceList,
  RenderPageProps,
} from '@/components/paginated-resource-list';
import { RecentList } from '@/components/recent-list';

export default function Page({ params }: { params: { id: string } }) {
  const companyId = params.id;

  const { data: companyData } = useSWR(`/api/companies/${companyId}`, fetcher);

  if (!companyData) {
    return <Spinner />;
  }

  const company: Company = companyData.company;

  // TODO: get rank for the company

  const renderPage = ({ pageIndex }: RenderPageProps) => (
    <RecentList pageIndex={pageIndex} companyIdFilter={companyId} />
  );

  return (
    <main>
      <div className={'w-1/2 m-auto flex flex-col items-center'}>
        <div className={'pt-4 pb-4'}>
          <CompanyItem key={company.id} rank={0} company={company} />
        </div>
      </div>
      <PaginatedResourceList title={'Battle History'} renderPage={renderPage} />
    </main>
  );
}
