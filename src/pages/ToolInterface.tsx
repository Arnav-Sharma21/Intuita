import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import { Mail, FileText, Smartphone, Briefcase, BarChart3, Calendar, ArrowLeft, Sparkles, Send, Download, RefreshCcw, Upload } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { runTool, uploadFile } from '../lib/api';
import { useTypewriter } from '../hooks/useTypewriter';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

// Custom SVG Animations for each tool
const EmailAnimation = () => (
  <div className="relative w-full h-full flex items-center justify-center">
    <motion.div animate={{ y: [-10, 10, -10] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="absolute z-10">
      <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="1" className="drop-shadow-2xl">
        <rect x="3" y="5" width="18" height="14" rx="2" ry="2" />
        <polyline points="3 7 12 13 21 7" />
      </svg>
    </motion.div>
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent blur-xl"></div>
  </div>
);

const SummaryAnimation = () => (
  <div className="relative w-full h-full flex items-center justify-center">
    <motion.div className="relative z-10 w-24 h-32 border border-[var(--border)] bg-[var(--bg-1)] rounded-sm flex flex-col gap-2 p-4 overflow-hidden">
      <motion.div animate={{ y: [0, 100, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} className="absolute top-0 left-0 right-0 h-1 bg-[var(--text)] shadow-[0_0_10px_var(--text)] z-20"></motion.div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-2 bg-[var(--bg-3)] rounded w-full"></div>
      ))}
    </motion.div>
  </div>
);

const SocialAnimation = () => (
  <div className="relative w-full h-full flex items-center justify-center gap-4">
    {[0, 1, 2].map((i) => (
      <motion.div key={i} animate={{ y: [0, -15, 0], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }} className="w-16 h-24 border border-[var(--border)] bg-[var(--bg-2)] rounded-md flex items-end p-2">
        <div className="w-4 h-4 rounded-full bg-[var(--bg-3)]"></div>
      </motion.div>
    ))}
  </div>
);

const BusinessAnimation = () => (
  <div className="relative w-full h-full flex items-center justify-center">
    <motion.div animate={{ rotateY: [0, 360] }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}>
      <Briefcase size={100} strokeWidth={1} className="text-[var(--text)] drop-shadow-lg" />
    </motion.div>
  </div>
);

const AnalysisAnimation = () => (
  <div className="relative w-full h-full flex items-end justify-center gap-2 pb-12">
    {[40, 80, 50, 100, 70].map((h, i) => (
      <motion.div key={i} animate={{ height: [`${h}px`, `${h * 0.5}px`, `${h}px`] }} transition={{ duration: 2, delay: i * 0.2, repeat: Infinity, ease: 'easeInOut' }} className="w-8 bg-[var(--text)] opacity-80" />
    ))}
  </div>
);

const PlanningAnimation = () => (
  <div className="relative w-full h-full flex items-center justify-center">
    <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }} transition={{ duration: 5, repeat: Infinity }}>
      <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="1">
        <circle cx="12" cy="5" r="3" />
        <circle cx="5" cy="19" r="3" />
        <circle cx="19" cy="19" r="3" />
        <line x1="10.5" y1="7.5" x2="6.5" y2="16.5" />
        <line x1="13.5" y1="7.5" x2="17.5" y2="16.5" />
        <line x1="7.5" y1="19" x2="16.5" y2="19" />
      </svg>
    </motion.div>
  </div>
);

const toolConfigs: Record<string, any> = {
  email: {
    title: 'Cover Letter AI',
    desc: 'Craft a personalized job application email instantly.',
    icon: Mail,
    image: '/tool_bg_email.png',
    fields: ['jobTitle', 'company', 'keyStrengths'],
    labels: ['Job Title', 'Company Name', 'Key Strengths'],
    animation: <EmailAnimation />
  },
  summary: {
    title: 'Document Summarizer',
    desc: 'Extract key insights from long PDF reports.',
    icon: FileText,
    image: '/tool_bg_summary.png',
    fields: ['topic'],
    labels: ['Focus Area (e.g. Financials)'],
    animation: <SummaryAnimation />
  },
  social: {
    title: 'Social Plan Generator',
    desc: 'Create a 7-day social media plan tailored to your audience.',
    icon: Smartphone,
    image: '/tool_bg_social.png',
    fields: ['topic', 'audience', 'platform'],
    labels: ['Brand Topic', 'Target Audience', 'Platforms'],
    animation: <SocialAnimation />
  },
  business: {
    title: 'Proposal Drafter',
    desc: 'Draft a professional client proposal in your tone.',
    icon: Briefcase,
    image: '/tool_bg_business.png',
    fields: ['clientName', 'projectScope', 'pricing'],
    labels: ['Client Name', 'Project Scope', 'Pricing'],
    animation: <BusinessAnimation />
  },
  analysis: {
    title: 'Data Analyst',
    desc: 'Analyze CSV spreadsheets and pull insights automatically.',
    icon: BarChart3,
    image: '/tool_bg_analysis.png',
    fields: ['topic'],
    labels: ['Specific Questions'],
    animation: <AnalysisAnimation />
  },
  planning: {
    title: 'Business Planner',
    desc: 'Build a comprehensive business plan outline.',
    icon: Calendar,
    image: '/tool_bg_planning.png',
    fields: ['industry', 'valueProposition', 'competitors'],
    labels: ['Industry', 'Core Value Proposition', 'Competitors'],
    animation: <PlanningAnimation />
  }
};

export default function ToolInterface() {
  const { id } = useParams<{ id: string }>();
  // Use mapping or direct id
  let mappedId = id;
  if (id === 'cover_letter') mappedId = 'email';
  if (id === 'summarizer') mappedId = 'summary';
  if (id === 'social_plan') mappedId = 'social';
  if (id === 'proposal') mappedId = 'business';
  if (id === 'data_analyst') mappedId = 'analysis';
  if (id === 'business_planner') mappedId = 'planning';

  const toolId = mappedId || 'email';
  const config = toolConfigs[toolId] || toolConfigs.email;

  const { s, d } = useApp();
  
  const loading = s.toolLoading[toolId] || false;
  const result = s.toolResult[toolId] || '';

  const [fields, setFields] = useState<Record<string, string>>({});
  const setField = (k: string, v: string) => setFields(prev => ({ ...prev, [k]: v }));

  const { displayed, done, skip } = useTypewriter(result, 12);

  const [uploadedFile, setUploadedFile] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      const data = await uploadFile(file);
      setUploadedFile(data);
      setField('content', data.content); // for summarizer
      setField('csvContent', data.content); // for data analyst
      toast.success(`${file.name} uploaded — ${data.wordCount.toLocaleString()} words`);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleGenerate = async () => {
    d({ type: 'SET_TOOL_LOADING', toolId, v: true });
    try {
      const res = await runTool(toolId, fields);
      d({ type: 'SET_TOOL_RESULT', toolId, text: res.result });
      toast.success('Done!');
    } catch (err: any) {
      d({ type: 'SET_TOOL_LOADING', toolId, v: false });
      toast.error(err.message);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result);
    toast.success('Copied!');
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Top Navbar */}
      <div className="border-b border-[var(--border)] px-6 py-4 flex items-center justify-between sticky top-0 bg-[var(--bg)]/80 backdrop-blur-md z-50">
        <Link to="/" className="flex items-center gap-2 text-[var(--text-2)] hover:text-[var(--text)] transition-colors text-sm">
          <ArrowLeft size={16} /> Back to Examples
        </Link>
        <span className="font-['Clash_Display'] font-semibold">intuita</span>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12 min-h-[calc(100vh-70px)]">
        
        {/* Left Side: Form Controls */}
        <div className="flex flex-col justify-center">
          <div className="mb-8">
            <div className="w-12 h-12 rounded-xl bg-[var(--bg-2)] border border-[var(--border)] flex items-center justify-center mb-6">
              <config.icon size={24} className="text-[var(--text)]" />
            </div>
            <h1 className="t-display" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', marginBottom: '1rem' }}>{config.title}</h1>
            <p className="t-body text-lg max-w-md">{config.desc}</p>
          </div>

          <div className="space-y-5 bg-[var(--bg-1)] p-8 rounded-[24px] border border-[var(--border)] shadow-2xl relative overflow-hidden">
            {/* Ambient Background Effect */}
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-[var(--text)] opacity-[0.03] rounded-full blur-3xl"></div>
            
            {(toolId === 'summary' || toolId === 'analysis') && (
              <div>
                <label className="block t-label mb-2 text-xs uppercase tracking-wider">Upload File (PDF, DOCX, CSV)</label>
                <div 
                  onClick={() => fileRef.current?.click()}
                  className="w-full bg-[var(--bg-2)] border border-[var(--border)] border-dashed rounded-lg px-4 py-6 text-[var(--text-2)] text-sm flex flex-col items-center justify-center cursor-pointer hover:border-[var(--text)] transition-colors"
                >
                  <input 
                    type="file" 
                    ref={fileRef} 
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])} 
                    className="hidden" 
                    accept=".pdf,.docx,.doc,.csv,.txt"
                  />
                  <Upload size={24} className="mb-2" />
                  {uploading ? 'Uploading...' : uploadedFile ? uploadedFile.filename : 'Click to upload a file'}
                </div>
              </div>
            )}

            {config.fields.map((field: string, i: number) => (
              <div key={i}>
                <label className="block t-label mb-2 text-xs uppercase tracking-wider">{config.labels[i]}</label>
                <input 
                  type="text" 
                  value={fields[field] || ''}
                  onChange={(e) => setField(field, e.target.value)}
                  placeholder={`Enter ${config.labels[i].toLowerCase()}...`}
                  className="w-full bg-[var(--bg-2)] border border-[var(--border)] rounded-lg px-4 py-3 text-[var(--text)] text-sm focus:outline-none focus:border-[var(--text)] transition-colors"
                />
              </div>
            ))}
            
            <button 
              onClick={handleGenerate}
              disabled={loading}
              className="mt-4 w-full bg-[var(--text)] text-[var(--bg)] px-6 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 group"
            >
              {loading ? (
                <>Generating <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><Sparkles size={16}/></motion.span></>
              ) : (
                <>Generate Output <Send size={16} className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </div>
        </div>

        {/* Right Side: Visuals & Output */}
        <div className="relative rounded-[32px] border border-[var(--border)] overflow-hidden bg-[var(--bg-1)] flex items-center justify-center min-h-[500px]">
          {/* Background Image / Generated Image */}
          <div 
            className="absolute inset-0 opacity-20 bg-cover bg-center transition-opacity"
            style={{ backgroundImage: `url(${config.image})`, filter: 'grayscale(100%)' }}
          ></div>
          
          <AnimatePresence mode="wait">
            {!result && !loading && (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full relative z-10">
                {config.animation}
              </motion.div>
            )}

            {loading && (
              <motion.div key="generating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative z-10 flex flex-col items-center justify-center w-full h-full">
                <div className="relative w-32 h-32">
                  <motion.div className="absolute inset-0 border-t-2 border-[var(--text)] rounded-full" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} />
                  <motion.div className="absolute inset-2 border-r-2 border-[var(--text-2)] rounded-full" animate={{ rotate: -360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }} />
                  <config.icon size={32} className="absolute inset-0 m-auto text-[var(--text)] animate-pulse" />
                </div>
                <p className="mt-8 font-mono text-sm tracking-widest uppercase">Synthesizing...</p>
              </motion.div>
            )}

            {result && !loading && (
              <motion.div key="result" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="absolute inset-0 z-10 w-full h-full p-8 flex flex-col">
                <div className="flex-1 bg-[var(--bg)]/90 backdrop-blur-md border border-[var(--border)] rounded-[20px] p-8 shadow-2xl overflow-y-auto relative group/result">
                  <div className="flex items-center gap-2 mb-6 border-b border-[var(--border)] pb-4">
                    <Sparkles size={20} className="text-[var(--text)]" />
                    <h3 className="font-['Clash_Display'] font-semibold text-lg">AI Generated {config.title}</h3>
                  </div>
                  <div className="font-['Inter'] leading-relaxed text-[var(--text)] prose prose-invert">
                    <ReactMarkdown>{done ? result : displayed}</ReactMarkdown>
                    {!done && <span style={{ opacity: 0.5, animation: 'blink 1s infinite' }}>|</span>}
                  </div>
                  {!done && (
                    <button onClick={skip} className="absolute bottom-4 right-4 btn btn-ghost text-xs opacity-0 group-hover/result:opacity-100 transition-opacity">
                      Skip animation →
                    </button>
                  )}
                </div>
                <div className="mt-6 flex justify-end gap-3 shrink-0">
                  <button onClick={handleCopy} className="flex items-center gap-2 px-6 py-3 rounded-lg border border-[var(--border)] bg-[var(--bg-2)] hover:bg-[var(--bg-3)] transition-colors text-sm font-medium">
                    <Download size={16} /> Copy
                  </button>
                  <button onClick={() => d({ type: 'SET_TOOL_RESULT', toolId, text: '' })} className="flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--text)] text-[var(--bg)] hover:opacity-90 transition-opacity text-sm font-medium">
                    <RefreshCcw size={16} /> Start Over
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
