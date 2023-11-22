import { useState, useContext, createContext } from "react";
import axios from "axios";

const table = {
  sports: 21,
  history: 23,
  politics: 24,
};

const AppContext = createContext();
const AppProvider = ({ children }) => {
  const [waiting, setWaiting] = useState(true); //waiting
  const [loading, setLoading] = useState(false); //loading
  const [questions, setQuestions] = useState([]); //questions
  const [index, setIndex] = useState(0); //index
  const [correct, setCorrect] = useState(0); //correct
  const [error, setError] = useState(false); //error
  const [quiz, setQuiz] = useState({
    amount: 10,
    category: "sports",
    difficulty: "easy",
  });
  const [modal, setModal] = useState(false);
  //fetchQuestions

  const fetchQuestions = async (url) => {
    setLoading(true);
    setWaiting(false);
    const response = await axios(url).catch((err) => console.log(err));

    if (response) {
      const data = response.data.results;
      if (data.length) {
        setQuestions(data);
        setLoading(false);
        setWaiting(false);
        setError(false);
      } else {
        setWaiting(true);
        setLoading(true);
      }
    } else {
      setWaiting(true);
    }
  };
  const openModal = () => {
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
    setWaiting(true);
    setCorrect(0);
  };

  const nextQuestion = () => {
    setIndex((oldIndex) => {
      const index = oldIndex + 1;
      if (index > questions.length - 1) {
        openModal();
        return 0;
      } else {
        return index;
      }
    });
  };
  const checkAnswers = (value) => {
    if (value) {
      setCorrect((oldState) => oldState + 1);
    }
    nextQuestion();
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setQuiz({ ...quiz, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { amount, difficulty, category } = quiz;
    const url = `https://opentdb.com/api.php?amount=${amount}&difficulty=${difficulty}&category=${table[category]}&type=multiple`;
    fetchQuestions(url);
  };

  return (
    <AppContext.Provider
      value={{
        waiting,
        loading,
        questions,
        index,
        correct,
        error,
        modal,
        nextQuestion,
        checkAnswers,
        closeModal,
        quiz,
        handleChange,
        handleSubmit,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };

// if (error.response && error.response.status === 429) {
//   const retryAfter = error.response.headers["retry-after"];
//   // Retry after a delay (in seconds)
//   setTimeout(() => fetchQuestions(url), retryAfter * 1000);
// } else {
//   console.log(error);
//   setWaiting(true);
// }

// Action Types
// export const Quiz_Action_Types = {
//   SET_WAITING: "SET_WAITING",
//   SET_LOADING: "SET_LOADING",
//   SET_questions: "SET_questions",
//   SET_INDEX: "SET_INDEX",
//   SET_CORRECT: "SET_CORRECT",
//   SET_ERROR: "SET_ERROR",
//   SET_QUIZ: "SET_QUIZ",
//   SET_MODAL: "SET_MODAL",
// };

// Reducer Function
// const quizReducer = (state, action) => {
// const { type, payload } = action;
//   switch (type) {
//     case Quiz_Action_Types.SET_WAITING:
//       return { ...state, waiting: payload };
//     case Quiz_Action_Types.SET_LOADING:
//       return { ...state, loading: payload };
//     case Quiz_Action_Types.SET_questions:
//       return { ...state, questions: payload };
//     case Quiz_Action_Types.SET_INDEX:
//       return { ...state, index: payload };
//     case Quiz_Action_Types.SET_CORRECT:
//       return { ...state, correct: payload };
//     case Quiz_Action_Types.SET_ERROR:
//       return { ...state, error: payload };
//     case Quiz_Action_Types.SET_QUIZ:
//       return { ...state, quiz: payload };
//     case Quiz_Action_Types.SET_MODAL:
//       return { ...state, modal: payload };
//     default:
//       return state;
//       throw new Error(`There is no ${type} in quizReducer`);
//   }
// };

// Initial State
// const initialState = {
//   waiting: true,
//   loading: false,
//   questions: [],
//   index: 0,
//   correct: 0,
//   error: false,
//   quiz: {
//     amount: 10,
//     category: "sports",
//     difficulty: "easy",
//   },
//   modal: false,
// };

// const [{waiting, loading, questions, index, correct, error, quiz, modal}, dispatch] = useReducer(quizReducer, initialState);

// const { waiting, loading, questions, index, correct, error, quiz, modal } =
//   state;

// Example of how to dispatch actions
// dispatch({ type: Quiz_Action_Types.SET_LOADING, payload: true });
