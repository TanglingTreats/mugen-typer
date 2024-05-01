import styles from "./caret.module.css";
import { forwardRef } from "react";

const Caret = forwardRef((props, ref) => {

  return (
    <span ref={ref} className={`${styles.caret} h-7 -ml-0.5 absolute`}></span>
  );
});

Caret.displayName = "Caret";

export default Caret;
