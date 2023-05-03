export const parseItemsFromLocalstorage = (key: string): ItemsInLocalStorage | null => {
  if (localStorage.getItem(key)) {
    const queries = localStorage.getItem(key) as string;
    return JSON.parse(queries);
  }
  return null;
};

export const saveItemsOnLocalStorage = (
  query: string,
  items: RecommendItem[],
  storageKey: string,
) => {
  console.log('save', query, items);

  const parsedItems = parseItemsFromLocalstorage(storageKey);
  if (!parsedItems) {
    localStorage.setItem(storageKey, JSON.stringify({ [query]: items }));
  } else {
    const nextItems = parsedItems && Object.assign(parsedItems, { [query]: items });

    localStorage.setItem(storageKey, JSON.stringify(nextItems));
  }
};

export const getItemsFromLocalstorage = (query: string, items: ItemsInLocalStorage) => {
  return items[query] ? items[query] : null;
};
