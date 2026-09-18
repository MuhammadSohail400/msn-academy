import { createSlice } from '@reduxjs/toolkit';

const SESSION_KEY = 'msn_active_assessment';

const loadSession = () => {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const saveSession = (state) => {
  try {
    if (!state.attemptId) {
      sessionStorage.removeItem(SESSION_KEY);
      return;
    }
    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        attemptId: state.attemptId,
        courseId: state.courseId,
        courseTitle: state.courseTitle,
        startedAt: state.startedAt,
        durationMinutes: state.durationMinutes,
        answers: state.answers,
        flags: state.flags,
      })
    );
  } catch {
    // Ignore storage quota issues
  }
};

const cached = loadSession();

const initialState = {
  attemptId: cached?.attemptId || null,
  courseId: cached?.courseId || null,
  courseTitle: cached?.courseTitle || '',
  startedAt: cached?.startedAt || null,
  durationMinutes: cached?.durationMinutes || 120,
  secondsLeft: 7200,
  questions: [],
  currentIndex: 0,
  answers: cached?.answers || {},
  flags: cached?.flags || {},
  isSavingAnswer: false,
  isSubmitting: false,
  isLoading: false,
  error: null,
  result: null,
};

const assessmentSlice = createSlice({
  name: 'assessments',
  initialState,
  reducers: {
    initAssessment(state, action) {
      const { attemptId, courseId, courseTitle, startedAt, durationMinutes, questions, answers, flags } = action.payload;
      state.attemptId = attemptId;
      state.courseId = courseId;
      state.courseTitle = courseTitle || state.courseTitle;
      state.startedAt = startedAt;
      state.durationMinutes = durationMinutes || 120;
      state.questions = questions || [];
      state.currentIndex = 0;
      state.answers = answers || {};
      state.flags = flags || {};
      state.result = null;

      // Calculate initial seconds left based on startedAt
      const elapsedSeconds = Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000);
      const totalSeconds = (state.durationMinutes || 120) * 60;
      state.secondsLeft = Math.max(0, totalSeconds - elapsedSeconds);

      saveSession(state);
    },
    setCurrentIndex(state, action) {
      state.currentIndex = Math.max(0, Math.min(action.payload, state.questions.length - 1));
    },
    setAnswer(state, action) {
      const { questionId, selectedOptionKey } = action.payload;
      state.answers[questionId] = selectedOptionKey;
      saveSession(state);
    },
    toggleFlag(state, action) {
      const questionId = action.payload;
      state.flags[questionId] = !state.flags[questionId];
      saveSession(state);
    },
    decrementTimer(state) {
      if (state.secondsLeft > 0) {
        state.secondsLeft -= 1;
      }
    },
    setSecondsLeft(state, action) {
      state.secondsLeft = Math.max(0, action.payload);
    },
    setSavingAnswer(state, action) {
      state.isSavingAnswer = action.payload;
    },
    setSubmitting(state, action) {
      state.isSubmitting = action.payload;
    },
    setAssessmentResult(state, action) {
      state.result = action.payload;
      // Clear ongoing active attempt cache once submitted
      sessionStorage.removeItem(SESSION_KEY);
    },
    setAssessmentLoading(state, action) {
      state.isLoading = action.payload;
    },
    setAssessmentError(state, action) {
      state.error = action.payload;
    },
    resetAssessmentState(state) {
      sessionStorage.removeItem(SESSION_KEY);
      return {
        ...initialState,
        attemptId: null,
        courseId: null,
        questions: [],
        answers: {},
        flags: {},
        result: null,
      };
    },
  },
});

export const {
  initAssessment,
  setCurrentIndex,
  setAnswer,
  toggleFlag,
  decrementTimer,
  setSecondsLeft,
  setSavingAnswer,
  setSubmitting,
  setAssessmentResult,
  setAssessmentLoading,
  setAssessmentError,
  resetAssessmentState,
} = assessmentSlice.actions;

export default assessmentSlice.reducer;
