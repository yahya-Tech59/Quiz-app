import axios from "axios";
import React, { createContext, useContext, useState } from "react";

const table = {
  sports: 19,
  history: 23,
  politics: 24,
};

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [waiting, setWaiting] = useState(true);
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState([]);
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [error, setError] = useState(false);
  const [quiz, setQuiz] = useState({
    amount: 10,
    category: "sports",
    diffculty: "ease",
  });
  const [modal, setModal] = useState(false);

  const fetchQuestion = async (url) => {
    setLoading(true);
    setWaiting(false);
    const response = await axios.get(url).catch((err) => console.log(err));

    if (response) {
      const data = response.data.results;
      if (data.length) {
        setQuestion(data);
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
      const index = oldIndex;
      if (index > oldIndex.length - 1) {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const { amount, category, diffculty } = quiz;
    const url = `https://opentdb.com/api.php?amount=${amount}&difficulty=${diffculty}$category=${table[category]}&type=multiple`;
    fetchQuestion(url);
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setQuiz({ ...quiz, [name]: value });
  };

  return (
    <AppContext.Provider
      value={{
        waiting,
        loading,
        question,
        index,
        correct,
        error,
        quiz,
        modal,
        nextQuestion,
        checkAnswers,
        closeModal,
        handleSubmit,
        handleChange,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};

// export { AppContext, AppProvider };

// Action Types
// export const Quiz_Action_Types = {
//   SET_WAITING: "SET_WAITING",
//   SET_LOADING: "SET_LOADING",
//   SET_QUESTION: "SET_QUESTION",
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
//     case Quiz_Action_Types.SET_QUESTION:
//       return { ...state, question: payload };
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
//   question: [],
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

// const [{waiting, loading, question, index, correct, error, quiz, modal}, dispatch] = useReducer(quizReducer, initialState);

// const { waiting, loading, question, index, correct, error, quiz, modal } =
//   state;

// Example of how to dispatch actions
// dispatch({ type: Quiz_Action_Types.SET_LOADING, payload: true });
