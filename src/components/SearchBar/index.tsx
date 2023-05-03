import { useState } from 'react';
import styles from './styles.module.scss';
import RecommendItems from '../RecommendItems';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [openRecommendItems, setOpenRecommendItems] = useState(true);
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
                    <svg
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      preserveAspectRatio="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M6.56 0a6.56 6.56 0 015.255 10.49L16 14.674 14.675 16l-4.186-4.184A6.56 6.56 0 116.561 0zm0 1.875a4.686 4.686 0 100 9.372 4.686 4.686 0 000-9.372z" />
                    </svg>
                  </div>
                  <div className="css-umr6cd">질환명을 입력해 주세요.</div>
                </div>
              </div>
              <input
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
          <svg
            viewBox="0 0 16 16"
            fill="currentColor"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M6.56 0a6.56 6.56 0 015.255 10.49L16 14.674 14.675 16l-4.186-4.184A6.56 6.56 0 116.561 0zm0 1.875a4.686 4.686 0 100 9.372 4.686 4.686 0 000-9.372z" />
          </svg>
        </div>
      </button>
      {openRecommendItems && <RecommendItems query={query} />}
    </div>
  );
}
