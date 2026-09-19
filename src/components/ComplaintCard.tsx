import { useState } from 'react';
import type { Complaint } from '@/types';
import { StatusBadge, PriorityBadge, CategoryBadge } from './Badges';
import { Clock, MapPin, Star, Send, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function ComplaintCard({
  complaint,
  onClick,
}: {
  complaint: Complaint;
  onClick?: () => void;
}) {
  const imageUrl = (
    complaint as Complaint & { imageUrl?: string | null }
  ).imageUrl;

  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleFeedbackSubmit = async () => {
    if (rating === 0) {
      setError('Please select a rating.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await api.createFeedback({
        complaint_id: complaint.id,
        rating,
        comment: comment.trim() || undefined,
      });

      setFeedbackSubmitted(true);
      setShowFeedback(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to submit feedback',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      onClick={onClick}
      className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all ${
        onClick
          ? 'cursor-pointer hover:border-teal-300 hover:shadow-md'
          : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">
              {complaint.id}
            </span>

            <CategoryBadge category={complaint.category} />
          </div>

          <h3 className="truncate text-sm font-semibold text-slate-900">
            {complaint.title}
          </h3>
        </div>

        <StatusBadge status={complaint.status} />
      </div>

      <p className="mt-2 text-sm text-slate-500 line-clamp-2">
        {complaint.description}
      </p>

      {imageUrl && (
        <div className="mt-4 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
          <img
            src={imageUrl}
            alt="Complaint attachment"
            className="h-48 w-full object-cover"
          />
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <PriorityBadge priority={complaint.priority} />

          {complaint.location && (
            <span className="inline-flex items-center gap-1 text-xs text-slate-400">
              <MapPin className="h-3.5 w-3.5" />
              {complaint.location}
            </span>
          )}

          {!complaint.location && (
            <span className="text-xs text-slate-400">
              {complaint.department}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Clock className="h-3.5 w-3.5" />
          {formatDate(complaint.createdAt)}
        </div>
      </div>

      {/* Feedback section for resolved complaints */}
      {complaint.status === 'Resolved' && (
        <div className="mt-4 border-t border-slate-100 pt-4">
          {feedbackSubmitted ? (
            <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
              <Star className="h-4 w-4 fill-current" />
              Thank you! Your feedback has been submitted.
            </div>
          ) : !showFeedback ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowFeedback(true);
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-sm font-medium text-teal-700 transition-colors hover:bg-teal-100"
            >
              <Star className="h-4 w-4" />
              Give Feedback
            </button>
          ) : (
            <div
              onClick={(e) => e.stopPropagation()}
              className="rounded-lg bg-slate-50 p-4"
            >
              <p className="text-sm font-semibold text-slate-700">
                Rate the resolution
              </p>

              <div className="mt-2 flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="rounded p-1 transition-transform hover:scale-110"
                    aria-label={`Rate ${star} out of 5`}
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Optional comment..."
                rows={3}
                className="mt-3 w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />

              {error && (
                <p className="mt-2 text-xs text-rose-600">
                  {error}
                </p>
              )}

              <div className="mt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowFeedback(false);
                    setError('');
                  }}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleFeedbackSubmit}
                  className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-3 py-2 text-xs font-semibold text-white hover:bg-teal-700 disabled:opacity-60"
                >
                  {submitting ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Send className="h-3.5 w-3.5" />
                  )}

                  {submitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}