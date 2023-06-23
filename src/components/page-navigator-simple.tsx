import { useEffect, useState } from 'react';

interface PageNavigatorSimpleProps {
  onPageChanged: (pageIndex: number) => void;
}

/**
 * Simple page navigator with prev/next buttons.
 */
export function PageNavigatorSimple({
  onPageChanged,
}: PageNavigatorSimpleProps) {
  const [pageIndex, setPageIndex] = useState(0);

  useEffect(() => {
    onPageChanged(pageIndex);
  }, [onPageChanged, pageIndex]);

  return (
    <div className={'flex flex-row gap-4'}>
      <button
        disabled={pageIndex === 0}
        className={'border-2 rounded p-1 text-xs'}
        onClick={() => setPageIndex(pageIndex - 1)}
      >
        &larr; Prev
      </button>
      <button
        className={'border-2 rounded p-1 text-xs'}
        onClick={() => setPageIndex(pageIndex + 1)}
      >
        Next &rarr;
      </button>
    </div>
  );
}
