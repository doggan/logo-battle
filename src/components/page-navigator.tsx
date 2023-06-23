import { useState } from 'react';
import { clsx } from 'clsx';

interface PageNavigatorProps {
  pageCount: number;
  onPageChanged: (pageIndex: number) => void;
}

/**
 * Page navigator with numbered buttons for each page.
 */
export function PageNavigator({
  pageCount,
  onPageChanged,
}: PageNavigatorProps) {
  const [activePage, setActivePage] = useState(0);

  if (pageCount < 1) {
    return null;
  }

  const content = [];
  for (let i = 0; i < pageCount; i++) {
    content.push(
      <button
        key={i}
        onClick={() => {
          setActivePage(i);
          onPageChanged(i);
        }}
      >
        <div
          className={clsx({
            'text-xs w-5 h-5 leading-5 text-center rounded-sm': true,
            'bg-imperial-red text-white': activePage === i,
            'bg-battleship-grey text-white': activePage !== i,
          })}
        >
          {i + 1}
        </div>
      </button>,
    );
  }

  return <div className={'flex gap-1'}>{content}</div>;
}
