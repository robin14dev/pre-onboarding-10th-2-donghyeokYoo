import { useState } from 'react';
import axios from 'axios';
import styles from './styles.module.scss';
import { ReactComponent as SearchIcon } from '../../assets/finder.svg';
import { RecommendItemsStorageKey } from '../../constants/config';
import {
  parseItemsFromLocalstorage,
  saveItemsOnLocalStorage,
  getItemsFromLocalstorage,
} from '../../utils/parsingFromLocalstorage';
import RecommendItems from '../RecommendItems';

export default function SearchBar() {
  const [isQuerying, setIsQuerying] = useState(false);
  const [openRecommendItems, setOpenRecommendItems] = useState(false);
  const [recommendItems, setRecommentItems] = useState<RecommendItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);

  const getItemsFromAPI = async (query: string) => {
    try {
      setIsLoading(true);
      const itemsRes = await axios({
        method: 'get',
        url: `api/v1/search-conditions/?name=${query}`,
      });

      return itemsRes.data.length > 0 ? itemsRes.data : null;
    } catch (error) {
      console.log(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getRecommendItems = async (query: string, key: string) => {
    const parsedItems = parseItemsFromLocalstorage(RecommendItemsStorageKey);
    if (parsedItems) {
      const localStorageRes: RecommendItem[] | null = getItemsFromLocalstorage(query, parsedItems);
      if (localStorageRes) {
        return setRecommentItems(localStorageRes);
      }
    }

    const apiRes: RecommendItem[] | null = await getItemsFromAPI(query);

    if (apiRes) {
      setRecommentItems(apiRes);
      saveItemsOnLocalStorage(query, apiRes, RecommendItemsStorageKey);
    }
  };

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    if (!query) {
      setIsQuerying(false);
      return;
    }

    if (!openRecommendItems) {
      setOpenRecommendItems(true);
    }
    if (!isQuerying) {
      setIsQuerying(true);
    }
    getRecommendItems(query, RecommendItemsStorageKey);
  };

  const onKeyDownHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      setCurrentIdx(prevIdx => prevIdx + 1);
    } else if (e.key === 'ArrowUp') {
      setCurrentIdx(prevIdx => prevIdx - 1);
    }
  };

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
                <div className="css-orqhza">
                  <div className="css-daf4fh">
                    <SearchIcon />
                  </div>
                  <div className="css-umr6cd">질환명을 입력해 주세요.</div>
                </div>
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
          isQuerying={isQuerying}
          recommendItems={recommendItems}
          currentIdx={currentIdx}
        />
      )}
    </div>
  );
}
