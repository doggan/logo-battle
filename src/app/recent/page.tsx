'use client';
// TODO: could this be a server component?? ^^ no need for state or use effect?

import { useRouter } from 'next/navigation';
import {
  PaginatedResourceList,
  RenderPageProps,
} from '@/components/paginated-resource-list';
import { RecentList } from '@/app/recent/components/recent-list';

export default function Page() {
  // const [pageIndex, setPageIndex] = useState(0);
  // const [allResults, setAllResults] = useState<Result[]>([]);

  // const router = useRouter();

  // const { data } = useSWR(
  //   `/api/results?${new URLSearchParams({
  //     limit: PAGE_SIZE.toString(),
  //   })}`,
  //   fetcher,
  // );
  //
  // useEffect(() => {
  //   if (data) {
  //     setAllResults(data.results);
  //   }
  // }, [data]);
  //
  // // TODO: error handling
  // if (!data || data.results.length === 0) {
  //   return null;
  // }
  //
  // const companyClickHandler = (companyId: string) => {
  //   router.push(urlToCompanyItemPage({ companyId }));
  // };

  // const pageChangedHandler = (pageIndex: number) => {
  //   setPageIndex(pageIndex);
  // };

  // const pageCount = Math.ceil(data.results.length / PAGE_SIZE);
  //
  // if (allResults.length === 0) {
  //   return null;
  // }

  const renderPage = ({ pageIndex }: RenderPageProps) => (
    <RecentList pageIndex={pageIndex} />
  );

  return (
    <PaginatedResourceList title={'Recent Battles'} renderPage={renderPage} />
    // <main
    //   className={
    //     'my-6 flex flex-col items-center md:shadow md:w-1/2 md:m-auto md:rounded md:py-2'
    //   }
    // >
    //   <div className={'text-xl py-1'}>Recent Battles</div>
    //   <PageNavigator pageCount={pageCount} onPageChanged={pageChangedHandler} />
    //   <div className={'flex flex-col gap-4 pt-4 pb-4'}>
    //     <SinglePage
    //       results={allResults.slice(
    //         PAGE_SIZE * pageIndex,
    //         PAGE_SIZE * (pageIndex + 1),
    //       )}
    //       onCompanyItemClick={companyClickHandler}
    //     />
    //   </div>
    // </main>
  );
}
