import styles from './style.module.scss';

type RecommendItemProps = {
  name: string;
};

export default function RecommendItem({ name }: RecommendItemProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.svgWrapper}>
        <svg
          viewBox="0 0 16 16"
          fill="currentColor"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M6.56 0a6.56 6.56 0 015.255 10.49L16 14.674 14.675 16l-4.186-4.184A6.56 6.56 0 116.561 0zm0 1.875a4.686 4.686 0 100 9.372 4.686 4.686 0 000-9.372z" />
        </svg>
      </div>
      <span>{name}</span>
    </div>
  );
}
