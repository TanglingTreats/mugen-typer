import styles from "./infiniteLoad.module.css";

export default function InfiniteLoading() {
  return (
    <svg width="300px" height="200px" viewBox="0 0 187.3 93.7" preserveAspectRatio="xMidYMid meet"
      style={{ left: "50%", top: "45%", position: "absolute", transform: "translate(-50%, -50%) matrix(1, 0, 0, 1, 0, 0)" }}>
      <path stroke="#ededed" id={styles.outline} fill="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10"
        d="M93.9,46.4
        c9.3,9.5,13.8,17.9,23.5,17.9
        s17.5-7.8,17.5-17.5
        s-7.8-17.6-17.5-17.5
        c-9.7,0.1-13.3,7.2-22.1,17.1
        c-8.9,8.8-15.7,17.9-25.4,17.9
        s-17.5-7.8-17.5-17.5
        s7.8-17.5,17.5-17.5
        S86.2,38.6,93.9,46.4z" />
      <path id="outline-bg" opacity="0.05" fill="none" stroke="#ededed" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10"
        d="M93.9,46.4
        c9.3,9.5,13.8,17.9,23.5,17.9
        s17.5-7.8,17.5-17.5
        s-7.8-17.6-17.5-17.5
        c-9.7,0.1-13.3,7.2-22.1,17.1
        c-8.9,8.8-15.7,17.9-25.4,17.9
        s-17.5-7.8-17.5-17.5
        s7.8-17.5,17.5-17.5
        S86.2,38.6,93.9,46.4z" />
    </svg>
  );
}
