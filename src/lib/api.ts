import axios, { AxiosError } from 'axios';

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  timeout: 90000,
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor — normalise errors
http.interceptors.response.use(
  (r) => r,
  (err: AxiosError<{ error: string }>) => {
    const msg = err.response?.data?.error || err.message || 'Something went wrong';
    return Promise.reject(new Error(msg));
  }
);

// ── Types ─────────────────────────────────────────────────────

export interface WizardInput {
  goalType: string;
  purpose: string;
  tone: number;
  audience?: string;
  additionalContext?: string;
  includeCTA?: boolean;
  length?: 'short' | 'medium' | 'long';
  platform?: string;
}

export interface WizardResult {
  success: boolean;
  result: string;
  metadata: {
    goalType: string;
    purpose: string;
    tone: number;
    toneLabel: string;
    audience: string | null;
    hasCTA: boolean;
    wordCount: number;
    charCount: number;
    generatedAt: string;
  };
}

export interface TweakResult {
  success: boolean;
  result: string;
  tweak: string;
  wordCount: number;
  generatedAt: string;
}

export interface ToolResult {
  success: boolean;
  result: string;
  toolId: string;
  wordCount: number;
  generatedAt: string;
}

export interface UploadedFile {
  filename: string;
  fileType: string;
  content: string;
  size: number;
  wordCount: number;
  charCount: number;
}

export interface AnalyzeResult {
  success: boolean;
  result: string;
  metadata: {
    filename: string;
    fileType: string;
    analysisType: string;
    wordCount: number;
    generatedAt: string;
  };
}

// ── API Calls ─────────────────────────────────────────────────

export async function runWizard(data: WizardInput): Promise<WizardResult> {
  const { data: res } = await http.post<WizardResult>('/api/wizard', data);
  return res;
}

export async function tweakContent(
  original: string,
  tweak: string,
  newTone?: number
): Promise<TweakResult> {
  const { data: res } = await http.post<TweakResult>('/api/tweak', { original, tweak, newTone });
  return res;
}

export async function runTool(
  toolId: string,
  fields: Record<string, string>
): Promise<ToolResult> {
  const { data: res } = await http.post<ToolResult>(`/api/tools/${toolId}`, fields);
  return res;
}

export async function uploadFile(file: File): Promise<UploadedFile> {
  const form = new FormData();
  form.append('file', file);
  const { data: res } = await http.post<{ success: boolean; file: UploadedFile }>(
    '/api/upload', form,
    { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 30000 }
  );
  return res.file;
}

export async function analyzeFile(
  file: UploadedFile,
  analysisType: string
): Promise<AnalyzeResult> {
  const { data: res } = await http.post<AnalyzeResult>('/api/analyze', { file, analysisType });
  return res;
}

export async function exportToPDF(
  content: string,
  title: string,
  metadata?: object
): Promise<void> {
  const response = await http.post('/api/export/pdf', { content, title, metadata }, {
    responseType: 'blob',
  });
  const url = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `intuita-${title.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function checkHealth(): Promise<boolean> {
  try {
    await http.get('/api/health');
    return true;
  } catch {
    return false;
  }
}
