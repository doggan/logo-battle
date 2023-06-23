import { useState } from 'react';
import { PageNavigatorSimple } from '@/components/page-navigator-simple';

export interface RenderPageProps {
  pageIndex: number;
}

interface PaginatedResourceListProps {
  title: string;
  renderPage: (props: RenderPageProps) => JSX.Element;
}

export function PaginatedResourceList({
  title,
  renderPage,
}: PaginatedResourceListProps) {
  const [pageIndex, setPageIndex] = useState(0);

  const pageChangedHandler = (pageIndex: number) => {
    setPageIndex(pageIndex);
  };

  return (
    <main className={'flex flex-col items-center'}>
      <div className={'text-xl py-1'}>{title}</div>
      <PageNavigatorSimple onPageChanged={pageChangedHandler} />
      <div className={'flex flex-col gap-4 pt-4 pb-4'}>
        {renderPage({ pageIndex })}

        {/* Preload the next page for smoother navigation. */}
        <div style={{ display: 'none' }}>
          {renderPage({ pageIndex: pageIndex + 1 })}
        </div>
      </div>
    </main>
  );
}
