import { clsx } from 'clsx';

interface PageNavigatorSimpleProps {
  pageCount: number;
  activePageIndex: number;
  onPageChanged: (pageIndex: number) => void;
}

/**
 * Simple page navigator with prev/next buttons.
 */
export function PageNavigatorSimple({
  pageCount,
  activePageIndex,
  onPageChanged,
}: PageNavigatorSimpleProps) {
  if (pageCount < 1) {
    return null;
  }

  const hasPreviousPage = activePageIndex > 0;
  const hasNextPage = activePageIndex < pageCount - 1;

  return (
    <div className={'flex flex-row gap-4'}>
      <div className="inline-flex">
        <button
          disabled={!hasPreviousPage}
          onClick={() => onPageChanged(activePageIndex - 1)}
          className={clsx({
            ['inline-flex items-center text-sm px-4']: true,
            ['opacity-30']: !hasPreviousPage,
          })}
        >
          <svg
            aria-hidden="true"
            className="w-5 h-5 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
          Newer
        </button>
        <button
          disabled={!hasNextPage}
          onClick={() => onPageChanged(activePageIndex + 1)}
          className={clsx({
            ['inline-flex items-center text-sm px-4']: true,
            ['opacity-30']: !hasNextPage,
          })}
        >
          Older
          <svg
            aria-hidden="true"
            className="w-5 h-5 ml-2"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  );
}
