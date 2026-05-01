import { NotFoundContent } from "@/components/layout/not-found-content";
import styles from "@/app/not-found.module.css";

export default function NotFoundPage() {
  return (
    <main className={styles.root}>
      <NotFoundContent />
    </main>
  );
}
