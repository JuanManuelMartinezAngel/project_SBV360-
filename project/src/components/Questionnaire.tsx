import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Question, Answer } from '../types/questionnaire';
import { useAuthStore } from '../store/auth';
import { ArrowRight, Loader2 } from 'lucide-react';

export function Questionnaire() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .order('order_number');

      if (error) throw error;
      setQuestions(data || []);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionId: string, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!user) return;
    setSubmitting(true);

    try {
      const answersToSubmit = Object.entries(answers).map(([questionId, answer]) => ({
        user_id: user.id,
        question_id: questionId,
        answer,
      }));

      const { error } = await supabase
        .from('answers')
        .insert(answersToSubmit);

      if (error) throw error;
      // Navigate to results or next step
    } catch (error) {
      console.error('Error submitting answers:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  const renderQuestion = (question: Question) => {
    switch (question.type) {
      case 'select':
        return (
          <select
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswer(question.id, e.target.value)}
          >
            <option value="">Selecciona una opción</option>
            {question.options.map((option: string) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case 'multiselect':
        return (
          <div className="space-y-2">
            {question.options.map((option: string) => (
              <label key={option} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={answers[question.id]?.includes(option)}
                  onChange={(e) => {
                    const current = answers[question.id] || [];
                    const value = e.target.checked
                      ? [...current, option]
                      : current.filter((item: string) => item !== option);
                    handleAnswer(question.id, value);
                  }}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );
      default:
        return (
          <input
            type={question.type}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswer(question.id, e.target.value)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-8">
        <div className="mb-8">
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-indigo-600 rounded-full transition-all duration-300"
              style={{
                width: `${((currentIndex + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
          <p className="mt-2 text-sm text-gray-600 text-right">
            {currentIndex + 1} de {questions.length}
          </p>
        </div>

        {currentQuestion && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {currentQuestion.question}
            </h2>
            {renderQuestion(currentQuestion)}
          </div>
        )}

        <div className="mt-8 flex justify-between">
          <button
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 disabled:opacity-50"
          >
            Anterior
          </button>
          
          {isLastQuestion ? (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center space-x-2 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Finalizar</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => setCurrentIndex((prev) => prev + 1)}
              className="flex items-center space-x-2 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              <span>Siguiente</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}