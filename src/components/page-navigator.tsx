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
            'text-xs rounded-sm w-6 h-6 leading-6 text-center': true,
            'text-white bg-imperial-red': activePageIndex === i,
            'text-black': activePageIndex !== i,
          })}
        >
          {i + 1}
        </div>
      </button>,
    );
  }

  return <div className={'flex gap-px'}>{content}</div>;
}
