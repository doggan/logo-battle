'use client';
// TODO: could this be a server component?? ^^ no need for state or use effect?

import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import { Result } from '@/utils/models';
import { urlToCompanyItemPage } from '@/utils/routes';
import { PageNavigator } from '@/components/page-navigator';
import { fetcher } from '@/utils/fetcher';
import { SinglePage } from '@/components/single-page';

const MAX_RESULTS = 500;
const PAGE_SIZE = 4;

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
    router.push(urlToCompanyItemPage({ companyId }));
  };

  const pageChangedHandler = (pageIndex: number) => {
    setPageIndex(pageIndex);
  };

  const pageCount = Math.ceil(data.results.length / PAGE_SIZE);

  if (allResults.length === 0) {
    return null;
  }

  return (
    <main
      className={
        'my-6 flex flex-col items-center md:shadow md:w-1/2 md:m-auto md:rounded md:py-2'
      }
    >
      <div className={'text-xl py-1'}>Recent Battles</div>
      <PageNavigator pageCount={pageCount} onPageChanged={pageChangedHandler} />
      <div className={'flex flex-col gap-4 pt-4 pb-4'}>
        <SinglePage
          results={allResults.slice(
            PAGE_SIZE * pageIndex,
            PAGE_SIZE * (pageIndex + 1),
          )}
          onCompanyItemClick={companyClickHandler}
        />
      </div>
    </main>
  );
}
