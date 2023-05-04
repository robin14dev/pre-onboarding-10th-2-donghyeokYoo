import { useState } from 'react';
import styles from './style.module.scss';
import RecommendItem from '../RecommendItem';

type RecommendItemsProps = {
  recommendItems: RecommendItem[] | null;
  isQuerying: boolean;
  currentIdx: number;
};

export default function RecommendItems({
  recommendItems,
  isQuerying,
  currentIdx,
}: RecommendItemsProps) {
  const [items, setItems] = useState(recommendItems);
  if (items !== recommendItems) {
    setItems(recommendItems);
  }

  return (
    <div className={styles.wrapper}>
      {!isQuerying ? (
        <div>검색어 없음</div>
      ) : (
        <>
          <div className={styles.title}>추천 검색어</div>
          {items &&
            items
              .slice(0, 10)
              .map((item, idx) => (
                <RecommendItem isCurrent={idx === currentIdx} key={item.id} name={item.name} />
              ))}
        </>
      )}
    </div>
  );
}
