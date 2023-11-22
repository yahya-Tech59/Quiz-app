import "./App.css";
import { SetUpForm } from "./Components/SetUpForm";
import { Modal } from "./Components/Modal";
import { LoadinScreen } from "./Components/LoadinScreen";

function App() {
  return (
    <main>
      <section className="quiz">
        <p className="correct-answers">Correct Answers: 3</p>
        <article className="container">
          <h2>Text</h2>
          <div className="btn-container"></div>
        </article>
        <button className="next-question">Next Questions</button>
      </section>
    </main>
  );
}

export default App;
