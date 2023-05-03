import { useState } from 'react';
import styles from './style.module.scss';
import RecommendItem from '../RecommendItem';

type RecommendItemsProps = {
  query: string;
};

const dummyData = [
  {
    name: '갑상선암',
    id: 4373,
  },
  {
    name: '갑상선염',
    id: 4376,
  },
  {
    name: '갑상선중독증',
    id: 4378,
  },
  {
    name: '갑상선 중독',
    id: 4381,
  },
  {
    name: '갑상선암종',
    id: 4375,
  },
  {
    name: '갑상선염증',
    id: 4377,
  },
  {
    name: '갑상선 결절',
    id: 4355,
  },
  {
    name: '갑상선 항진증',
    id: 4372,
  },
];

export default function RecommendItems({ query }: RecommendItemsProps) {
  const [items, setItems] = useState(dummyData);
  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>추천 검색어</div>
      {items.map(item => (
        <RecommendItem key={item.id} name={item.name} />
      ))}
    </div>
  );
}
