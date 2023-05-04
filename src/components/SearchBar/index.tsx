import { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import { ReactComponent as SearchIcon } from '../../assets/finder.svg';
import { RecommendItemsStorageKey } from '../../constants/config';
import useDebounce from '../../hooks/useDebounce';
import { getItemsFromAPI } from '../../services/recommendQuery';
import {
  parseItemsFromLocalstorage,
  saveItemsOnLocalStorage,
  getItemsFromLocalstorage,
} from '../../utils/dataFromLocalstorage';
import RecommendItems from '../RecommendItems';

export default function SearchBar() {
  const [openRecommendItems, setOpenRecommendItems] = useState(false);
  const [recommendItems, setRecommentItems] = useState<RecommendItem[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query);

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!openRecommendItems) {
      setOpenRecommendItems(true);
    }

    setQuery(e.target.value);
  };

  const onKeyDownHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const maxLength = recommendItems.slice(0, 10).length;
    if (e.key === 'ArrowDown') {
      setCurrentIdx(prevIdx => (prevIdx === maxLength - 1 ? maxLength - 1 : prevIdx + 1));
    } else if (e.key === 'ArrowUp') {
      setCurrentIdx(prevIdx => (prevIdx === 0 ? 0 : prevIdx - 1));
    }
  };

  useEffect(() => {
    const getRecommendItems = async (value: string, key: string) => {
      const parsedItems = parseItemsFromLocalstorage(key);
      if (parsedItems) {
        const localStorageRes: RecommendItem[] | null = getItemsFromLocalstorage(
          value,
          parsedItems,
        );
        if (localStorageRes) {
          return setRecommentItems(localStorageRes);
        }
      }

      const apiRes: RecommendItem[] | null = await getItemsFromAPI(value);

      if (apiRes) {
        setRecommentItems(apiRes);
        saveItemsOnLocalStorage(value, apiRes, RecommendItemsStorageKey);
      }
    };
    if (!debouncedQuery) return;
    getRecommendItems(debouncedQuery, RecommendItemsStorageKey);
  }, [debouncedQuery]);

  return (
    <div className={styles.wrapper}>
      <div className="css-yfr80j">
        <div className="css-1c4bgvr">
          <div className="css-umr6cd">
            <label htmlFor="search_bar_main">
              <div className="css-lvxlx">질환명을 검색해주세요.</div>
            </label>
          </div>
          <div className="css-12m9wyz">
            <div className={styles.placeholder}>
              <div className="css-ubpq07">
                {query.length === 0 && (
                  <div className="css-orqhza">
                    <div className="css-daf4fh">
                      <SearchIcon />
                    </div>
                    <div className="css-umr6cd">질환명을 입력해 주세요.</div>
                  </div>
                )}
              </div>
              <input
                onKeyDown={onKeyDownHandler}
                onChange={onChangeHandler}
                id="search_bar_main"
                type="search"
                spellCheck="false"
                width="100%"
                className="css-nwra4i"
              />
            </div>
          </div>
        </div>
      </div>
      <button className="css-j7n9fz" type="button">
        <div className="css-zag2sr">검색버튼</div>
        <div className="css-1i55lp4">
          <SearchIcon />
        </div>
      </button>
      {openRecommendItems && (
        <RecommendItems
          isQuerying={!!query.length}
          recommendItems={recommendItems}
          currentIdx={currentIdx}
        />
      )}
    </div>
  );
}
