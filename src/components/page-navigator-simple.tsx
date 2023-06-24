import { useEffect, useState } from 'react';

interface PageNavigatorSimpleProps {
  pageCount: number;
  onPageChanged: (pageIndex: number) => void;
}

/**
 * Simple page navigator with prev/next buttons.
 */
export function PageNavigatorSimple({
  pageCount,
  onPageChanged,
}: PageNavigatorSimpleProps) {
  const [pageIndex, setPageIndex] = useState(0);

  useEffect(() => {
    onPageChanged(pageIndex);
  }, [onPageChanged, pageIndex]);

  // <div className="flex flex-col items-center">
  //   <!-- Help text -->
  //   <span className="text-sm text-gray-700 dark:text-gray-400">
  //     Showing <span className="font-semibold text-gray-900 dark:text-white">1</span> to <span
  //     className="font-semibold text-gray-900 dark:text-white">10</span> of <span
  //     className="font-semibold text-gray-900 dark:text-white">100</span> Entries
  // </span>
  //   <div className="inline-flex mt-2 xs:mt-0">
  //     <!-- Buttons -->
  //     <button
  //       className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-l hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
  //       <svg aria-hidden="true" className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"
  //            xmlns="http://www.w3.org/2000/svg">
  //         <path fill-rule="evenodd"
  //               d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
  //               clip-rule="evenodd"></path>
  //       </svg>
  //       Prev
  //     </button>
  //     <button
  //       className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-800 border-0 border-l border-gray-700 rounded-r hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
  //       Next
  //       <svg aria-hidden="true" className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20"
  //            xmlns="http://www.w3.org/2000/svg">
  //         <path fill-rule="evenodd"
  //               d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
  //               clip-rule="evenodd"></path>
  //       </svg>
  //     </button>
  //   </div>
  // </div>

  const hasPreviousPage = pageIndex > 0;
  const hasNextPage = pageIndex < pageCount - 1;

  return (
    <div className={'flex flex-row gap-4'}>
      <div className="inline-flex mt-2 xs:mt-0">
        <button
          disabled={!hasPreviousPage}
          onClick={() => setPageIndex(pageIndex - 1)}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-l hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
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
          Prev
        </button>
        <button
          disabled={!hasNextPage}
          onClick={() => setPageIndex(pageIndex + 1)}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-800 border-0 border-l border-gray-700 rounded-r hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        >
          Next
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

  // {/*<button*/}
  // {/*  disabled={pageIndex === 0}*/}
  // {/*  className={'border-2 rounded p-1 text-xs'}*/}
  // {/*  onClick={() => setPageIndex(pageIndex - 1)}*/}
  // {/*>*/}
  // {/*  &larr; Prev*/}
  // {/*</button>*/}
  // {/*<button*/}
  // {/*  className={'border-2 rounded p-1 text-xs'}*/}
  // {/*  onClick={() => setPageIndex(pageIndex + 1)}*/}
  // {/*>*/}
  // {/*  Next &rarr;*/}
  // {/*</button>*/}
}
