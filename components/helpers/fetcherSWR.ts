
export const fetcherSWR = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
        const error = new Error('An error occurred while fetching the data.')
        throw error
      }
    const data = await response.json();
    return data.data;
};