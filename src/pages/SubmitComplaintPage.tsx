import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ImagePlus,
  Send,
  AlertCircle,
  Loader2,
  MapPin,
  X,
} from 'lucide-react';

import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/lib/auth';
import { api } from '@/lib/api';

export default function SubmitComplaintPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = (file: File | null) => {
    setError('');

    if (!file) {
      setSelectedFile(null);
      setPreviewUrl('');
      return;
    }

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ];

    if (!allowedTypes.includes(file.type)) {
      setError('Only JPG, PNG, and WEBP images are allowed.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB.');
      return;
    }

    setSelectedFile(file);

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const removeImage = () => {
    setSelectedFile(null);
    setPreviewUrl('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');
    setSubmitting(true);

    try {
      let imageUrl: string | undefined;

      // Upload image first if one was selected
      if (selectedFile) {
        const uploadResult = await api.uploadImage(selectedFile);
        imageUrl = uploadResult.image_url;
      }

      // Create complaint
      await api.createComplaint({
        description,
        location,
        image_url: imageUrl,
      });

      setSubmitted(true);

      setTimeout(() => {
        navigate('/student/complaints');
      }, 2000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to submit complaint',
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <DashboardLayout
        role="student"
        userName={user?.name || 'Student'}
      >
        <div className="flex items-center justify-center p-12">
          <div className="text-center">

            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <Send className="h-8 w-8 text-emerald-600" />
            </div>

            <h2 className="text-xl font-bold text-slate-900">
              Complaint Submitted!
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Your complaint has been received and will be
              classified and routed automatically.
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Redirecting to your complaints...
            </p>

          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      role="student"
      userName={user?.name || 'Student'}
    >
      <div className="max-w-3xl p-6 lg:p-8">

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            Submit a Complaint
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Fill in the details below. Our system will classify
            and route it automatically.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <div className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

            {/* Description */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Description
              </label>

              <textarea
                required
                rows={5}
                minLength={10}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue in detail. Include what happened, when it started, and any relevant context."
                className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />

              <p className="mt-1 text-xs text-slate-400">
                {description.length} characters — the more detail you provide,
                the better the AI classification.
              </p>
            </div>

            {/* Location */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Location
              </label>

              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Block C, Floor 2, Room 204"
                  className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
            </div>

            {/* Image upload */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Attach Image (optional)
              </label>

              {!selectedFile ? (
                <label className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-slate-300 px-6 py-8 text-center transition-colors hover:border-teal-400 hover:bg-teal-50/30">

                  <div>
                    <ImagePlus className="mx-auto h-8 w-8 text-slate-400" />

                    <p className="mt-2 text-sm text-slate-500">
                      Click to select an image
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      JPG, PNG or WEBP — maximum 5MB
                    </p>
                  </div>

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) =>
                      handleFileChange(
                        e.target.files?.[0] || null,
                      )
                    }
                  />

                </label>
              ) : (
                <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-slate-50 p-3">

                  <img
                    src={previewUrl}
                    alt="Complaint preview"
                    className="max-h-64 w-full rounded-lg object-contain"
                  />

                  <div className="mt-2 flex items-center justify-between">

                    <p className="max-w-[80%] truncate text-xs text-slate-500">
                      {selectedFile.name}
                    </p>

                    <button
                      type="button"
                      onClick={removeImage}
                      className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50"
                    >
                      <X className="h-3.5 w-3.5" />
                      Remove
                    </button>

                  </div>

                </div>
              )}
            </div>

          </div>

          {/* Info note */}
          <div className="flex items-start gap-2.5 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">

            <AlertCircle className="mt-0.5 h-4.5 w-4.5 shrink-0 text-blue-600" />

            <p className="text-sm text-blue-700">
              Once submitted, the ML model will analyze your complaint
              text and automatically assign it to the correct department.
            </p>

          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3">

            <button
              type="button"
              onClick={() => navigate('/student')}
              className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-700 disabled:opacity-60"
            >

              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}

              {submitting
                ? 'Submitting...'
                : 'Submit Complaint'}

            </button>

          </div>

        </form>

      </div>
    </DashboardLayout>
  );
}