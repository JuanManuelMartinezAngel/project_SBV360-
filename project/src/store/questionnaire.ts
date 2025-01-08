import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Question, Answer } from '../types/questionnaire';

interface QuestionnaireState {
  questions: Question[];
  answers: Answer[];
  loading: boolean;
  error: string | null;
  fetchQuestions: () => Promise<void>;
  submitAnswers: (answers: Omit<Answer, 'id' | 'created_at' | 'updated_at'>[]) => Promise<void>;
}

export const useQuestionnaireStore = create<QuestionnaireState>((set) => ({
  questions: [],
  answers: [],
  loading: false,
  error: null,
  fetchQuestions: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .order('order_number');

      if (error) throw error;
      set({ questions: data || [] });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
  submitAnswers: async (answers) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('answers')
        .insert(answers);

      if (error) throw error;
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));