import { useState, useContext, createContext, useReducer } from "react";
import axios from "axios";

const table = {
  sports: 21,
  history: 23,
  politics: 24,
};

const initialState = {
  waiting: true,
  loading: false,
  questions: [],
  index: 0,
  correct: 0,
  error: false,
  quiz: {
    amount: 10,
    category: "sports",
    difficulty: "easy",
  },
  modal: false,
};

export const QuizActionTypes = {
  SET_WAITING: "SET_WAITING",
  SET_LOADING: "SET_LOADING",
  SET_QUESTIONS: "SET_QUESTIONS",
  SET_INDEX: "SET_INDEX",
  SET_CORRECT: "SET_CORRECT",
  SET_ERROR: "SET_ERROR",
  SET_QUIZ: "SET_QUIZ",
  SET_MODAL: "SET_MODAL",
};

const quizReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case QuizActionTypes.SET_WAITING:
      return { ...state, waiting: payload };
    case QuizActionTypes.SET_LOADING:
      return { ...state, loading: payload };
    case QuizActionTypes.SET_QUESTIONS:
      return { ...state, questions: payload };
    case QuizActionTypes.SET_INDEX:
      return { ...state, index: payload };
    case QuizActionTypes.SET_CORRECT:
      return { ...state, correct: payload };
    case QuizActionTypes.SET_ERROR:
      return { ...state, error: payload };
    case QuizActionTypes.SET_QUIZ:
      return { ...state, quiz: payload };
    case QuizActionTypes.SET_MODAL:
      return { ...state, modal: payload };
    default:
      throw new Error(`Unknown action type: ${type}`);
  }
};

const AppContext = createContext();
const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  const fetchQuestions = async (url) => {
    dispatch({ type: QuizActionTypes.SET_LOADING, payload: true });
    dispatch({ type: QuizActionTypes.SET_WAITING, payload: false });

    try {
      const response = await axios(url);
      const data = response.data.results;

      if (data.length) {
        dispatch({ type: QuizActionTypes.SET_QUESTIONS, payload: data });
        dispatch({ type: QuizActionTypes.SET_LOADING, payload: false });
        dispatch({ type: QuizActionTypes.SET_WAITING, payload: false });
        dispatch({ type: QuizActionTypes.SET_ERROR, payload: false });
      } else {
        dispatch({ type: QuizActionTypes.SET_WAITING, payload: true });
        dispatch({ type: QuizActionTypes.SET_LOADING, payload: true });
      }
    } catch (error) {
      dispatch({ type: QuizActionTypes.SET_WAITING, payload: true });
      console.log(error);
    }
  };

  const openModal = () => {
    dispatch({ type: QuizActionTypes.SET_MODAL, payload: true });
  };

  const closeModal = () => {
    dispatch({ type: QuizActionTypes.SET_MODAL, payload: false });
    dispatch({ type: QuizActionTypes.SET_WAITING, payload: true });
    dispatch({ type: QuizActionTypes.SET_CORRECT, payload: 0 });
  };

  const nextQuestion = () => {
    dispatch((prevState) => ({
      ...prevState,
      index: prevState.index + 1,
      ...(prevState.index > prevState.questions.length - 1
        ? { modal: true, index: 0 }
        : null),
    }));
  };

  //   const nextQuestion = () => {
  //     dispatch((prevState) => {
  //       const newIndex = prevState.index + 1;
  //       return {
  //         ...prevState,
  //         index: newIndex,
  //         ...(newIndex > prevState.questions.length - 1
  //           ? { type: QuizActionTypes.SET_MODAL, payload: true, index: 0 }
  //           : //   ? { modal: true, index: 0 }
  //             null),
  //       };
  //     });
  //   };

  //   const nextQuestion = () => {
  //     dispatch((prevState) => {
  //       const newIndex = prevState.index + 1;
  //       return {
  //         type: QuizActionTypes.SET_INDEX,
  //         payload: prevState.index + 1,
  //         ...(newIndex > prevState.questions.length - 1
  //           ? { type: QuizActionTypes.SET_MODAL, payload: true }
  //           : {}),
  //       };
  //     });
  //   };

  const checkAnswers = (value) => {
    if (value) {
      dispatch((prevState) => ({
        ...prevState,
        correct: prevState.correct + 1,
      }));
    }
    nextQuestion();
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    dispatch({
      type: QuizActionTypes.SET_QUIZ,
      payload: { ...state.quiz, [name]: value },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { amount, difficulty, category } = state.quiz;
    const url = `https://opentdb.com/api.php?amount=${amount}&difficulty=${difficulty}&category=${table[category]}&type=multiple`;
    fetchQuestions(url);
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        dispatch,
        nextQuestion,
        checkAnswers,
        openModal,
        closeModal,
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
