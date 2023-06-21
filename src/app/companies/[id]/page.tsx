'use client';

import useSWR from 'swr';
import { Company } from '@/utils/models';
import { CompanyItem } from '@/components/company-item';
import { PageNavigator } from '@/components/page-navigator';
import { GetResultsResponse } from '@/utils/requests';
import { useState } from 'react';
import { fetcher } from '@/utils/fetcher';
import { urlToCompanyItemPage } from '@/utils/routes';
import { useRouter } from 'next/navigation';
import { SinglePage } from '@/components/single-page';
import { Spinner } from '@/components/spinner';

const MAX_RESULTS = 500;
const PAGE_SIZE = 4;

export default function Page({ params }: { params: { id: string } }) {
  const companyId = params.id;

  const router = useRouter();

  const { data } = useSWR(`/api/companies/${companyId}`, fetcher);

  const { data: resultsData } = useSWR<GetResultsResponse>(
    `/api/results?${new URLSearchParams({
      companyId: companyId,
      limit: MAX_RESULTS.toString(),
    })}`,
    fetcher,
  );

  const [pageIndex, setPageIndex] = useState(0);
  // const [allResults, setAllResults] = useState<Result[]>([]);

  if (!data || !resultsData) {
    return <Spinner />;
  }

  const company: Company = data.company;

  const pageChangedHandler = (pageIndex: number) => {
    console.log('### pageIndex changed: ', pageIndex);
    setPageIndex(pageIndex);
  };

  // TODO: get rank for the company

  const companyClickHandler = (companyId: string) => {
    router.push(urlToCompanyItemPage({ companyId }));
  };

  return (
    <main>
      <div className={'w-1/2 m-auto flex flex-col items-center'}>
        <div className={'pt-4 pb-4'}>
          <CompanyItem key={company.id} rank={0} company={company} />
        </div>
      </div>
      <div
        className={
          'bg-blue-400 w-1/2 m-auto rounded-xl flex flex-col items-center'
        }
      >
        <div>Battle History</div>
        <PageNavigator pageCount={5} onPageChanged={pageChangedHandler} />
        <div className={'flex flex-col gap-4 pt-4 pb-4'}>
          <SinglePage
            results={resultsData.results.slice(
              PAGE_SIZE * pageIndex,
              PAGE_SIZE * (pageIndex + 1),
            )}
            onCompanyItemClick={companyClickHandler}
          />
          {/*<button onClick={() => setPageIndex(pageIndex - 1)}>Previous</button>*/}
          {/*<button onClick={() => setPageIndex(pageIndex + 1)}>Next</button>*/}
        </div>
      </div>
    </main>
  );
}
