
import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageCircle,
  Send,
  ArrowLeft,
  Bot,
  User,
  Loader2,
  FileText,
  LogOut,
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';

interface Source {
  document_name: string;
  page_number: number;
  similarity_score: number;
}

interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
}

export default function AIAssistantPage() {
  const { user, logout } = useAuth();

  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || loading) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      role: 'user',
      content: trimmedQuestion,
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuestion('');
    setLoading(true);
    setError('');

    try {
      const response = await api.askRag(trimmedQuestion);

      const assistantMessage: ChatMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.answer,
        sources: response.sources,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to get an answer. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const suggestedQuestions = [
    'What are the college bus timings?',
    'What is the attendance requirement?',
    'What are the exam guidelines?',
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* Header */}
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">

          <div className="flex items-center gap-3">
            <Link
              to="/student/services"
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            >
              <ArrowLeft size={20} />
            </Link>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
              <Bot size={23} />
            </div>

            <div>
              <h1 className="font-semibold text-slate-900">
                Campus AI Assistant
              </h1>
              <p className="text-xs text-slate-500">
                College information assistant
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-slate-500 sm:block">
              {user?.name}
            </span>

            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>

        </div>
      </header>

      {/* Main Chat Area */}
      <main className="mx-auto flex max-w-4xl flex-col px-4 py-8">

        {/* Welcome Section */}
        <div className="mb-8 text-center">

          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
            <MessageCircle size={30} />
          </div>

          <h2 className="text-2xl font-bold text-slate-900">
            How can I help you today?
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Ask questions about your college using its uploaded documents.
          </p>

        </div>

        {/* Suggested Questions */}
        {messages.length === 0 && (
          <div className="mb-8 grid gap-3 sm:grid-cols-3">

            {suggestedQuestions.map((item) => (
              <button
                key={item}
                onClick={() => setQuestion(item)}
                className="rounded-xl border border-slate-200 bg-white p-4 text-left text-sm text-slate-600 shadow-sm transition hover:border-teal-400 hover:bg-teal-50"
              >
                {item}
              </button>
            ))}

          </div>
        )}

        {/* Messages */}
        <div className="mb-6 min-h-[300px] space-y-5">

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === 'user'
                  ? 'justify-end'
                  : 'justify-start'
              }`}
            >

              {message.role === 'assistant' && (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                  <Bot size={19} />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
                  message.role === 'user'
                    ? 'bg-teal-600 text-white'
                    : 'border border-slate-200 bg-white text-slate-700'
                }`}
              >

                <div className="whitespace-pre-wrap text-sm leading-7">
                  {message.content}
                </div>

                {/* Sources */}
                {message.sources && message.sources.length > 0 && (
                  <div className="mt-4 border-t border-slate-200 pt-3">

                    <p className="mb-3 flex items-center gap-2 text-xs font-semibold text-teal-700">
                      <FileText size={14} />
                      Sources
                    </p>

                    <div className="space-y-2">

                      {message.sources.map((source, index) => (
                        <div
                          key={`${source.document_name}-${source.page_number}-${index}`}
                          className="rounded-lg bg-slate-50 p-3 text-xs text-slate-600"
                        >
                          <p className="font-medium text-slate-800">
                            {source.document_name}
                          </p>

                          <p className="mt-1 text-slate-500">
                            Page {source.page_number}
                          </p>
                        </div>
                      ))}

                    </div>
                  </div>
                )}

              </div>

              {message.role === 'user' && (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-700">
                  <User size={18} />
                </div>
              )}

            </div>
          ))}

          {/* Loading */}
          {loading && (
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <Loader2 size={20} className="animate-spin text-teal-600" />
              Finding information in your college documents...
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

        </div>

        {/* Question Input */}
        <form
          onSubmit={handleSubmit}
          className="sticky bottom-4 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg"
        >

          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask anything about your college..."
            disabled={loading}
            className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400"
          />

          <button
            type="submit"
            disabled={!question.trim() || loading}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send size={19} />
          </button>

        </form>

        <p className="mt-4 text-center text-xs text-slate-400">
          Answers are generated using your college's uploaded documents.
        </p>

      </main>
    </div>
  );
}
