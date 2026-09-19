import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Brain,
  Zap,
  BarChart3,
  Users,
  CheckCircle2,
  ArrowRight,
  Wifi,
  Bus,
  Wrench,
  DollarSign,
  GraduationCap,
} from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Classification',
    description:
      'NLP and machine learning automatically categorize complaints into Wi-Fi, Transport, Maintenance, Fees, and Academics.',
  },
  {
    icon: Zap,
    title: 'Smart Department Routing',
    description:
      'Once classified, complaints are instantly routed to the correct department — no manual triage needed.',
  },
  {
    icon: BarChart3,
    title: 'Real-Time Tracking',
    description:
      'Students can track complaint status from submission to resolution, with live updates at every stage.',
  },
  {
    icon: Users,
    title: 'Role-Based Access',
    description:
      'Separate dashboards for students, staff, and administrators, each tailored to their responsibilities.',
  },
];

const categories = [
  { icon: Wifi, label: 'Wi-Fi', color: 'bg-cyan-500' },
  { icon: Bus, label: 'Transport', color: 'bg-indigo-500' },
  { icon: Wrench, label: 'Maintenance', color: 'bg-amber-500' },
  { icon: DollarSign, label: 'Fees', color: 'bg-teal-500' },
  { icon: GraduationCap, label: 'Academics', color: 'bg-violet-500' },
];

const steps = [
  {
    num: '01',
    title: 'Submit',
    description: 'Students file a complaint with a title, description, and optional image.',
  },
  {
    num: '02',
    title: 'Classify',
    description: 'The ML model analyzes the text and assigns a category automatically.',
  },
  {
    num: '03',
    title: 'Route',
    description: 'The complaint is sent to the department responsible for that category.',
  },
  {
    num: '04',
    title: 'Resolve',
    description: 'Staff update the status, and students are notified when it is resolved.',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-40 border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="h-7 w-7 text-teal-600" />
              <span className="text-lg font-bold text-slate-900">
                CampusComplaints
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                Features
              </a>
              <a href="#how" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                How It Works
              </a>
              <a href="#categories" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                Categories
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-teal-700"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-teal-50/50 via-white to-white" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-1.5">
              <Brain className="h-4 w-4 text-teal-600" />
              <span className="text-xs font-medium text-teal-700">
                Powered by NLP & Machine Learning
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900">
              Smart Campus Complaint Management
            </h1>
            <p className="mt-6 text-lg text-slate-600 leading-relaxed">
              Students submit complaints. AI classifies and routes them. Departments
              resolve faster. Everyone stays informed.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-teal-700 hover:shadow-md"
              >
                Register as Student
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-all hover:border-slate-400 hover:bg-slate-50"
              >
                Staff / Admin Login
              </Link>
            </div>
          </div>

          {/* Hero stats */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { value: '5', label: 'Categories' },
              { value: '8', label: 'Complaints Tracked' },
              { value: '5', label: 'Departments' },
              { value: '3', label: 'User Roles' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-slate-200 bg-white/60 p-4 text-center backdrop-blur-sm"
              >
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="mt-1 text-xs text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">
              Built for a smarter campus
            </h2>
            <p className="mt-3 text-slate-600">
              Everything you need to turn complaints into resolutions.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="mb-4 inline-flex rounded-lg bg-teal-50 p-3">
                    <Icon className="h-6 w-6 text-teal-600" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">How it works</h2>
            <p className="mt-3 text-slate-600">
              Four steps from complaint to resolution.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <div key={step.num} className="relative">
                <div className="rounded-xl border border-slate-200 bg-white p-6">
                  <span className="text-3xl font-bold text-teal-100">
                    {step.num}
                  </span>
                  <h3 className="mt-2 text-base font-semibold text-slate-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                    {step.description}
                  </p>
                </div>
                {idx < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-3 -translate-y-1/2 z-10">
                    <ArrowRight className="h-5 w-5 text-slate-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="py-20 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">
              Complaint categories
            </h2>
            <p className="mt-3 text-slate-600">
              The ML model classifies every complaint into one of these categories.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.label}
                  className="flex flex-col items-center rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm"
                >
                  <div className={`mb-3 rounded-xl p-3 ${cat.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-slate-900">
                    {cat.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-slate-900">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-teal-400" />
          <h2 className="mt-4 text-3xl font-bold text-white">
            Ready to make your campus smarter?
          </h2>
          <p className="mt-3 text-slate-400">
            Register today and start submitting complaints in minutes.
          </p>
          <Link
            to="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-teal-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-teal-400"
          >
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-teal-600" />
            <span className="text-sm font-semibold text-slate-700">
              CampusComplaints
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Smart Campus Complaint Management System — NLP & ML Project
          </p>
        </div>
      </footer>
    </div>
  );
}
