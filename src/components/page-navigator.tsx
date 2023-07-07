import { clsx } from 'clsx';

interface PageNavigatorProps {
  pageCount: number;
  activePageIndex: number;
  onPageChanged: (pageIndex: number) => void;
}

/**
 * Page navigator with numbered buttons for each page.
 */
export function PageNavigator({
  pageCount,
  activePageIndex,
  onPageChanged,
}: PageNavigatorProps) {
  if (pageCount < 1) {
    return null;
  }

  const content = [];
  for (let i = 0; i < pageCount; i++) {
    content.push(
      <button
        key={i}
        onClick={() => {
          onPageChanged(i);
        }}
      >
        <div
          className={clsx({
            'text-xs w-5 h-5 leading-5 text-center rounded-sm': true,
            'bg-imperial-red text-white': activePageIndex === i,
            'bg-battleship-grey text-white': activePageIndex !== i,
          })}
        >
          {i + 1}
        </div>
      </button>,
    );
  }

  return <div className={'flex gap-1'}>{content}</div>;
}
