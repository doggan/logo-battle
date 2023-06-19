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
