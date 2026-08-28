import React, { useState } from 'react';
import {
  Upload,
  FileText,
  Sparkles,
  Plus,
  X,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AiService } from '../services/aiService';
import { EmploymentType, BiasSeverity, BiasCategory } from '../types';
import { SeverityBadge } from '../components/SeverityBadge';

export const JobCreatePage: React.FC = () => {
  const { createJob, navigate } = useApp();

  const [method, setMethod] = useState<'manual' | 'upload'>('upload');
  const [isExtracting, setIsExtracting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('Senior Python Backend Developer');
  const [department, setDepartment] = useState('Core Platform');
  const [location, setLocation] = useState('San Francisco, CA (Hybrid)');
  const [employmentType, setEmploymentType] = useState<EmploymentType>('Full-time');
  const [experienceRequired, setExperienceRequired] = useState('2–5 years');
  const [salaryRange, setSalaryRange] = useState('$140,000 - $175,000');
  const [description, setDescription] = useState(
    'We are seeking a young and energetic Senior Python Backend Developer to design high-throughput RESTful microservices with FastAPI and optimize SQL schemas. Must be a native English speaker and rockstar developer.'
  );

  const [requiredSkills, setRequiredSkills] = useState<string[]>([
    'Python',
    'FastAPI',
    'REST APIs',
    'SQL',
    'Git',
  ]);
  const [preferredSkills, setPreferredSkills] = useState<string[]>([
    'Docker',
    'AWS',
    'React',
    'Redis',
    'PostgreSQL',
  ]);
  const [educationRequirements, setEducationRequirements] = useState(
    'B.S. in Computer Science, Software Engineering, or equivalent practical industry experience.'
  );
  const [responsibilities, setResponsibilities] = useState<string[]>([
    'Architect robust, scalable microservices in Python using FastAPI and async frameworks',
    'Optimize relational database schemas, complex SQL queries, and caching strategies',
    'Maintain automated CI/CD workflows, Git version control, and unit test coverage (>85%)',
  ]);
  const [qualifications, setQualifications] = useState<string[]>([
    '2–5 years of professional backend software development experience',
    'Deep fluency in Python 3.10+, async I/O, and RESTful API architecture',
    'Strong hands-on experience with SQL databases and ORMs',
  ]);

  // Skill input helper
  const [newReqSkill, setNewReqSkill] = useState('');
  const [newPrefSkill, setNewPrefSkill] = useState('');

  // Bias flags preview on current description
  const [detectedFlags, setDetectedFlags] = useState<any[]>([
    {
      issue: 'Potential age-related wording',
      severity: 'medium' as BiasSeverity,
      category: 'age' as BiasCategory,
      detectedPhrase: 'young and energetic',
      suggestedRevision: 'Motivated professional with relevant experience.',
      explanation: 'Phrases like "young and energetic" can deter experienced talent.',
    },
    {
      issue: 'Potential nationality / language criterion',
      severity: 'medium' as BiasSeverity,
      category: 'nationality' as BiasCategory,
      detectedPhrase: 'native English speaker',
      suggestedRevision: 'Strong professional English communication skills.',
      explanation: 'Specifying native speaker excludes fluent bilingual professionals.',
    },
    {
      issue: 'Potentially gender-skewed phrasing',
      severity: 'high' as BiasSeverity,
      category: 'gender' as BiasCategory,
      detectedPhrase: 'rockstar developer',
      suggestedRevision: 'Skilled software engineer with collaborative background.',
      explanation: 'Aggressive jargon correlates with reduced applicant pool diversity.',
    },
  ]);

  const handleDocUploadSimulation = async (sampleType: 'python' | 'frontend' | 'ml') => {
    setIsExtracting(true);
    let sampleText = '';
    if (sampleType === 'python') {
      sampleText =
        'Job Description: Senior Python Backend Developer. Core Platform squad. Seeking young and energetic engineer with 2-5 years experience in Python, FastAPI, SQL, and REST APIs. Docker and AWS preferred. Must be a native English speaker.';
    } else if (sampleType === 'frontend') {
      sampleText =
        'Job Description: Senior Frontend Engineer (React/TypeScript). User Experience team. 3-6 years building responsive SPAs in React, TypeScript, Tailwind CSS, Next.js, and GraphQL.';
    } else {
      sampleText =
        'Job Description: Machine Learning & NLP Specialist. Applied Research. 3-7 years in PyTorch, Transformers, Python, NLP embeddings, and Vector Databases.';
    }

    try {
      const extracted = await AiService.extractJobRequirements(sampleText);
      setTitle(extracted.title);
      setDepartment(extracted.department);
      setExperienceRequired(extracted.experienceRequired);
      setRequiredSkills(extracted.requiredSkills);
      setPreferredSkills(extracted.preferredSkills);
      setEducationRequirements(extracted.educationRequirements);
      setResponsibilities(extracted.responsibilities);
      setQualifications(extracted.qualifications);
      setDescription(sampleText);

      // Re-scan bias
      const flags = await AiService.analyzeJobBias(sampleText, 'temp', extracted.title);
      setDetectedFlags(flags);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleApplyNeutralRevision = (flagIdx: number) => {
    const flag = detectedFlags[flagIdx];
    if (flag && flag.detectedPhrase && flag.suggestedRevision) {
      const newDesc = description.replace(flag.detectedPhrase, flag.suggestedRevision);
      setDescription(newDesc);
      setDetectedFlags(detectedFlags.filter((_, i) => i !== flagIdx));
    }
  };

  const handleAddReqSkill = () => {
    if (newReqSkill.trim() && !requiredSkills.includes(newReqSkill.trim())) {
      setRequiredSkills([...requiredSkills, newReqSkill.trim()]);
      setNewReqSkill('');
    }
  };

  const handleRemoveReqSkill = (skill: string) => {
    setRequiredSkills(requiredSkills.filter((s) => s !== skill));
  };

  const handleAddPrefSkill = () => {
    if (newPrefSkill.trim() && !preferredSkills.includes(newPrefSkill.trim())) {
      setPreferredSkills([...preferredSkills, newPrefSkill.trim()]);
      setNewPrefSkill('');
    }
  };

  const handleRemovePrefSkill = (skill: string) => {
    setPreferredSkills(preferredSkills.filter((s) => s !== skill));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const newJob = await createJob({
        title,
        department,
        location,
        employmentType,
        experienceRequired,
        salaryRange,
        description,
        requiredSkills,
        preferredSkills,
        educationRequirements,
        responsibilities,
        qualifications,
        status: 'active',
      });
      navigate(`/jobs/${newJob.id}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Create New Job Requisition
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Define role parameters, extract requirements via AI, and scan wording for potential bias indicators.
          </p>
        </div>

        {/* Method Toggle */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => setMethod('upload')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              method === 'upload' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Upload Job Doc (AI Extract)
          </button>
          <button
            type="button"
            onClick={() => setMethod('manual')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              method === 'manual' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Manual Entry Form
          </button>
        </div>
      </div>

      {/* Method 2: Document Upload Helper Banner */}
      {method === 'upload' && (
        <div className="bg-indigo-50/70 border border-indigo-200 rounded-2xl p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-600/20">
              <Upload className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-indigo-950">
                AI Job Requirement Extraction & Bias Analysis
              </h3>
              <p className="text-xs text-indigo-900/80 mt-1 max-w-2xl">
                Upload a Job Description (PDF, DOCX, TXT) or choose a pre-configured sample document to instantly extract required skills, experience tenures, responsibilities, and scan for inclusive wording.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => handleDocUploadSimulation('python')}
              disabled={isExtracting}
              className="p-3 bg-white hover:bg-indigo-100/50 rounded-xl border border-indigo-200 text-left transition-all cursor-pointer shadow-xs disabled:opacity-50"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-slate-900">Senior Python Dev</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Python, FastAPI, SQL, REST (Includes demo bias flags)</p>
            </button>

            <button
              type="button"
              onClick={() => handleDocUploadSimulation('frontend')}
              disabled={isExtracting}
              className="p-3 bg-white hover:bg-indigo-100/50 rounded-xl border border-indigo-200 text-left transition-all cursor-pointer shadow-xs disabled:opacity-50"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-slate-900">Frontend Engineer</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">React, TypeScript, Tailwind, Next.js</p>
            </button>

            <button
              type="button"
              onClick={() => handleDocUploadSimulation('ml')}
              disabled={isExtracting}
              className="p-3 bg-white hover:bg-indigo-100/50 rounded-xl border border-indigo-200 text-left transition-all cursor-pointer shadow-xs disabled:opacity-50"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-slate-900">ML / NLP Engineer</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">PyTorch, Transformers, Vector DBs</p>
            </button>
          </div>

          {isExtracting && (
            <div className="p-3 bg-white rounded-xl border border-indigo-200 flex items-center justify-center gap-2 text-xs font-bold text-indigo-700 animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>AI is extracting job requirements and scanning wording...</span>
            </div>
          )}
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Job Details */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            1. Role Overview
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Job Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Department *</label>
              <input
                type="text"
                required
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Location *</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Employment Type</label>
              <select
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value as EmploymentType)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-hidden"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Experience Required *</label>
              <input
                type="text"
                required
                value={experienceRequired}
                onChange={(e) => setExperienceRequired(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Salary Range</label>
              <input
                type="text"
                value={salaryRange}
                onChange={(e) => setSalaryRange(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Job Description Body *
            </label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-hidden leading-relaxed"
            />
          </div>
        </div>

        {/* Section 2: Bias Analysis for Job Description */}
        {detectedFlags.length > 0 && (
          <div className="bg-amber-50/60 rounded-xl border border-amber-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-bold text-amber-950">
                  Potential Bias Detected in Job Description ({detectedFlags.length} Flags)
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-amber-800">
                Human Review & Revision Recommended
              </span>
            </div>

            <p className="text-xs text-amber-900/80">
              The AI screening assistant scanned your job wording for non-job-relevant criteria that could deter qualified applicant diversity.
            </p>

            <div className="space-y-3">
              {detectedFlags.map((flag, idx) => (
                <div key={idx} className="bg-white p-4 rounded-xl border border-amber-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{flag.issue}</span>
                      <SeverityBadge severity={flag.severity} size="sm" />
                    </div>
                    {flag.detectedPhrase && description.includes(flag.detectedPhrase) && (
                      <button
                        type="button"
                        onClick={() => handleApplyNeutralRevision(idx)}
                        className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-md transition-colors cursor-pointer text-xs flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Apply Neutral Revision
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded bg-rose-50 border border-rose-100 text-rose-900">
                      <span className="font-bold block text-[10px] uppercase text-rose-600">Detected Phrase:</span>
                      "{flag.detectedPhrase}"
                    </div>
                    <div className="p-2 rounded bg-emerald-50 border border-emerald-100 text-emerald-900">
                      <span className="font-bold block text-[10px] uppercase text-emerald-600">Suggested Revision:</span>
                      "{flag.suggestedRevision}"
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 italic">{flag.explanation}</p>
                </div>
              ))}
            </div>

            <div className="p-2.5 rounded-lg bg-white/70 border border-amber-200 text-[11px] text-amber-900">
              <strong>Transparency note:</strong> These indicators are advisory flags intended to help recruiters build inclusive job postings. The system does not assert intentional discrimination.
            </div>
          </div>
        )}

        {/* Section 3: Extracted Requirements (Skills, Education, Responsibilities) */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            2. Structured Job Requirements
          </h3>

          {/* Required Skills */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Required Technical Skills (Weighted 40% in candidate screening)
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {requiredSkills.map((sk) => (
                <span
                  key={sk}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-50 text-indigo-800 border border-indigo-200"
                >
                  {sk}
                  <button
                    type="button"
                    onClick={() => handleRemoveReqSkill(sk)}
                    className="hover:text-rose-600 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2 max-w-sm">
              <input
                type="text"
                value={newReqSkill}
                onChange={(e) => setNewReqSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddReqSkill();
                  }
                }}
                placeholder="Add skill (e.g. FastAPI, SQL)..."
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleAddReqSkill}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg text-xs cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>

          {/* Preferred Skills */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Preferred Skills (Bonus 10% weight)
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {preferredSkills.map((sk) => (
                <span
                  key={sk}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
                >
                  {sk}
                  <button
                    type="button"
                    onClick={() => handleRemovePrefSkill(sk)}
                    className="hover:text-rose-600 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2 max-w-sm">
              <input
                type="text"
                value={newPrefSkill}
                onChange={(e) => setNewPrefSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddPrefSkill();
                  }
                }}
                placeholder="Add preferred skill (e.g. Docker, AWS)..."
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleAddPrefSkill}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg text-xs cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>

          {/* Education */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Education Requirements (5% weight)
            </label>
            <input
              type="text"
              value={educationRequirements}
              onChange={(e) => setEducationRequirements(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-indigo-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={() => navigate('/jobs')}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isSaving ? 'Creating Job...' : 'Publish Job & Ready for Screening'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
