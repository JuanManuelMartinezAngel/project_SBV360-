export interface Question {
  id: string;
  question: string;
  options: any;
  type: 'text' | 'select' | 'multiselect' | 'number';
  category: string;
  order_number: number;
}

export interface Answer {
  id: string;
  user_id: string;
  question_id: string;
  answer: any;
  created_at: string;
  updated_at: string;
}