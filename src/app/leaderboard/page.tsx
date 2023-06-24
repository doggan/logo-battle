'use client';

import {
  PaginatedResourceList,
  RenderPageProps,
} from '@/components/paginated-resource-list';
import { LeaderboardList } from '@/app/leaderboard/leaderboard-list';
import { useState } from 'react';

/**
 * We want 10 pages to show each of the 500 companies, so 50 companies per page.
 */
const PAGE_SIZE = 50;

export default function Page() {
  const [totalItemCount, setTotalItemCount] = useState<number>();

  const renderPage = ({ pageIndex, pageSize }: RenderPageProps) => (
    <LeaderboardList
      pageIndex={pageIndex}
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
      <PaginatedResourceList
        title={'Leaderboard'}
        renderPage={renderPage}
        pageSize={PAGE_SIZE}
        totalItemCount={totalItemCount}
        showPageNumbers={true}
      />
    </main>
  );
}
