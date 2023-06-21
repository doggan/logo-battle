import { ClipLoader } from 'react-spinners';

export function Spinner() {
  return (
    <div className={'w-full h-full flex items-center justify-center'}>
      <ClipLoader aria-label="Loading Spinner" data-testid="loader" />
    </div>
  );
}
