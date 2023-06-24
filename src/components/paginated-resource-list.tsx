import { useState } from 'react';
import { PageNavigatorSimple } from '@/components/page-navigator-simple';
import { PageNavigator } from '@/components/page-navigator';

export interface RenderPageProps {
  pageIndex: number;
  pageSize: number;
}

interface PaginatedResourceListProps {
  title: string;
  renderPage: (props: RenderPageProps) => JSX.Element;
  pageSize: number;
  /**
   * The total number of items in the list.
   * This is used for pagination, since it allows us to know
   * how many pages will be necessary to show all the items.
   *
   * With the current pagination strategy, the total # of items
   * is not known until the first query for items. So there is
   * a period of time when the total # of items is unknown.
   */
  totalItemCount?: number;
  /**
   * If true, show numbered buttons for each page.
   * Otherwise, simpler next/previous buttons are shown.
   */
  showPageNumbers?: boolean;
}

export function PaginatedResourceList({
  title,
  renderPage,
  pageSize,
  totalItemCount,
  showPageNumbers = false,
}: PaginatedResourceListProps) {
  const [pageIndex, setPageIndex] = useState(0);

  const pageChangedHandler = (pageIndex: number) => {
    setPageIndex(pageIndex);
  };

  const totalPageCount = totalItemCount
    ? Math.ceil(totalItemCount / pageSize)
    : 1;
  const hasNextPage = pageIndex < totalPageCount - 1;

  return (
    <main className={'flex flex-col items-center'}>
      <div className={'text-xl py-1'}>{title}</div>
      {showPageNumbers ? (
        <PageNavigator
          pageCount={totalPageCount}
          onPageChanged={pageChangedHandler}
        />
      ) : (
        <PageNavigatorSimple
          pageCount={totalPageCount}
          onPageChanged={pageChangedHandler}
        />
      )}
      <div className={'flex flex-col gap-4 pt-4 pb-4'}>
        {renderPage({ pageIndex, pageSize })}

        {/* Preload the next page for smoother navigation. */}
        {hasNextPage && (
          <div className={'hidden'}>
            {renderPage({ pageIndex: pageIndex + 1, pageSize })}
          </div>
        )}
      </div>
    </main>
  );
}
