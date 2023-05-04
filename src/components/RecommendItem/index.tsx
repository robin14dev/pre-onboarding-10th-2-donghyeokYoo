import styles from './style.module.scss';
import { ReactComponent as SearchIcon } from '../../assets/finder.svg';

type RecommendItemProps = {
  name: string;
  isCurrent: boolean;
};

export default function RecommendItem({ name, isCurrent }: RecommendItemProps) {
  return (
    <div className={styles.wrapper} style={isCurrent ? { backgroundColor: '#e8e7e7' } : undefined}>
      <div className={styles.svgWrapper}>
        <SearchIcon />
      </div>
      <span>{name}</span>
    </div>
  );
}
