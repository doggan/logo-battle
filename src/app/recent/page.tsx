'use client';

import {
  PaginatedResourceList,
  RenderPageProps,
} from '@/components/paginated-resource-list';
import { RecentList } from '@/components/recent-list';

export default function Page() {
  const renderPage = ({ pageIndex }: RenderPageProps) => (
    <RecentList pageIndex={pageIndex} />
  );

  return (
    <PaginatedResourceList title={'Recent Battles'} renderPage={renderPage} />
  );
}
