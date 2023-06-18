export const fetcher = async (url: string) => {
  const response = await fetch(url);

  // TODO: better error handling???
  if (!response.ok) {
    throw new Error('An error occurred while fetching the data.');
  }
  return await response.json();
};

export function api<T>(url: string): Promise<T> {
  return fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json() as Promise<T>;
  });
}
