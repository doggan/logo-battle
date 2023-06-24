'use client';

import {
  PaginatedResourceList,
  RenderPageProps,
} from '@/components/paginated-resource-list';
import { RecentList } from '@/components/recent-list';
import { useState } from 'react';
import { RECENT_RESULTS_PAGE_SIZE } from '@/utils/consts';

export default function Page() {
  const [totalItemCount, setTotalItemCount] = useState<number>();

  const renderPage = ({ pageIndex, pageSize }: RenderPageProps) => (
    <RecentList
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
    <PaginatedResourceList
      title={'Recent Battles'}
      renderPage={renderPage}
      pageSize={RECENT_RESULTS_PAGE_SIZE}
      totalItemCount={totalItemCount}
    />
  );
}
