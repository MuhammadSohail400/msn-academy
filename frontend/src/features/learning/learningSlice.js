import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeCourse: null,
  currentLesson: null,
  curriculum: [],
  progressPercentage: 0,
  completedLessonIds: [],
  isCurriculumDrawerOpen: false,
  isLoading: false,
  error: null,
};

const learningSlice = createSlice({
  name: 'learning',
  initialState,
  reducers: {
    setActiveCourse(state, action) {
      state.activeCourse = action.payload;
    },
    setCurrentLesson(state, action) {
      state.currentLesson = action.payload;
    },
    setCurriculum(state, action) {
      state.curriculum = action.payload;
    },
    setProgress(state, action) {
      state.progressPercentage = action.payload.percentage ?? state.progressPercentage;
      state.completedLessonIds = action.payload.completedLessonIds ?? state.completedLessonIds;
    },
    markLessonCompleted(state, action) {
      const lessonId = action.payload;
      if (!state.completedLessonIds.includes(lessonId)) {
        state.completedLessonIds.push(lessonId);
      }
    },
    toggleCurriculumDrawer(state) {
      state.isCurriculumDrawerOpen = !state.isCurriculumDrawerOpen;
    },
    setCurriculumDrawerOpen(state, action) {
      state.isCurriculumDrawerOpen = action.payload;
    },
    setLearningLoading(state, action) {
      state.isLoading = action.payload;
    },
    setLearningError(state, action) {
      state.error = action.payload;
    },
    resetLearningState() {
      return initialState;
    },
  },
});

export const {
  setActiveCourse,
  setCurrentLesson,
  setCurriculum,
  setProgress,
  markLessonCompleted,
  toggleCurriculumDrawer,
  setCurriculumDrawerOpen,
  setLearningLoading,
  setLearningError,
  resetLearningState,
} = learningSlice.actions;

export default learningSlice.reducer;
