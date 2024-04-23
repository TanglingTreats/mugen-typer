import styles from './completeScreen.module.css';

export default function CompleteScreen(props) {

  function resetChallenge() {
    props.resetChallenge();
  }
  return (
    <div className={props.className}>
      <p>Complete! You got {props.score} correct!</p>
      <button type="button" onClick={() => resetChallenge()}>Restart</button>
    </div>
  );
}
