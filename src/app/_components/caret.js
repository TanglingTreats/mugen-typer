import styles from "./caret.module.css";

export default function Caret(props) {
  return (
    <span className={`${styles.caret} h-7 -ml-0.5 absolute`}></span>
  );
};
