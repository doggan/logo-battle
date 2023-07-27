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
import { RECENT_RESULTS_PAGE_SIZE } from '@/utils/consts';
import { useState } from 'react';

export default function Page({ params }: { params: { id: string } }) {
  const companyId = params.id;

  const [totalItemCount, setTotalItemCount] = useState<number>();
  const { data: companyData } = useSWR(`/api/companies/${companyId}`, fetcher);

  if (!companyData) {
    return <Spinner />;
  }

  const company: Company = companyData.company;

  const renderPage = ({ pageIndex, pageSize }: RenderPageProps) => (
    <RecentList
      pageIndex={pageIndex}
      companyIdFilter={companyId}
      pageSize={pageSize}
      onTotalItemCountKnown={(newTotalItemCount) => {
        if (newTotalItemCount !== totalItemCount) {
          setTotalItemCount(newTotalItemCount);
        }
      }}
    />
  );

  return (
    <main>
      <div className={'py-4'}>
        <CompanyItem key={company.id} company={company} />
      </div>
      <PaginatedResourceList
        title={'Battle History'}
        renderPage={renderPage}
        pageSize={RECENT_RESULTS_PAGE_SIZE}
        totalItemCount={totalItemCount}
      />
    </main>
  );
}
