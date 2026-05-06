import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import type { WizardInput, WizardResult, UploadedFile, AnalyzeResult } from '../lib/api';

interface State {
  // Wizard
  wizard: WizardInput;
  step: number;
  result: WizardResult | null;
  generating: boolean;
  // Tweak
  tweaking: boolean;
  // Upload / Analyze
  uploadedFile: UploadedFile | null;
  uploading: boolean;
  analysisType: string;
  analysisResult: AnalyzeResult | null;
  analyzing: boolean;
  // Tool pages
  toolResult: Record<string, string>;   // toolId → result string
  toolLoading: Record<string, boolean>; // toolId → loading bool
  // Global
  error: string | null;
}

const defaultWizard: WizardInput = {
  goalType: '', purpose: '', tone: 50,
  audience: '', additionalContext: '',
  includeCTA: false, length: 'medium', platform: '',
};

const init: State = {
  wizard: defaultWizard, step: 0, result: null, generating: false,
  tweaking: false,
  uploadedFile: null, uploading: false,
  analysisType: 'summarize', analysisResult: null, analyzing: false,
  toolResult: {}, toolLoading: {},
  error: null,
};

type A =
  | { type: 'WIZARD_FIELD'; k: keyof WizardInput; v: any }
  | { type: 'WIZARD_STEP'; n: number }
  | { type: 'WIZARD_NEXT' }
  | { type: 'WIZARD_PREV' }
  | { type: 'WIZARD_RESET' }
  | { type: 'SET_GENERATING'; v: boolean }
  | { type: 'SET_RESULT'; r: WizardResult }
  | { type: 'SET_TWEAKING'; v: boolean }
  | { type: 'TWEAK_RESULT'; text: string }
  | { type: 'SET_UPLOADING'; v: boolean }
  | { type: 'SET_FILE'; f: UploadedFile | null }
  | { type: 'SET_ANALYSIS_TYPE'; t: string }
  | { type: 'SET_ANALYZING'; v: boolean }
  | { type: 'SET_ANALYSIS_RESULT'; r: AnalyzeResult }
  | { type: 'SET_TOOL_LOADING'; toolId: string; v: boolean }
  | { type: 'SET_TOOL_RESULT'; toolId: string; text: string }
  | { type: 'SET_ERROR'; msg: string | null }
  | { type: 'CLEAR' };

function reducer(s: State, a: A): State {
  switch (a.type) {
    case 'WIZARD_FIELD':       return { ...s, wizard: { ...s.wizard, [a.k]: a.v } };
    case 'WIZARD_STEP':        return { ...s, step: a.n };
    case 'WIZARD_NEXT':        return { ...s, step: s.step + 1 };
    case 'WIZARD_PREV':        return { ...s, step: Math.max(0, s.step - 1) };
    case 'WIZARD_RESET':       return { ...s, wizard: defaultWizard, step: 0, result: null };
    case 'SET_GENERATING':     return { ...s, generating: a.v };
    case 'SET_RESULT':         return { ...s, result: a.r, generating: false };
    case 'SET_TWEAKING':       return { ...s, tweaking: a.v };
    case 'TWEAK_RESULT':       return s.result
      ? { ...s, result: { ...s.result, result: a.text }, tweaking: false }
      : s;
    case 'SET_UPLOADING':      return { ...s, uploading: a.v };
    case 'SET_FILE':           return { ...s, uploadedFile: a.f, analysisResult: null };
    case 'SET_ANALYSIS_TYPE':  return { ...s, analysisType: a.t };
    case 'SET_ANALYZING':      return { ...s, analyzing: a.v };
    case 'SET_ANALYSIS_RESULT':return { ...s, analysisResult: a.r, analyzing: false };
    case 'SET_TOOL_LOADING':   return { ...s, toolLoading: { ...s.toolLoading, [a.toolId]: a.v } };
    case 'SET_TOOL_RESULT':    return { ...s, toolResult: { ...s.toolResult, [a.toolId]: a.text }, toolLoading: { ...s.toolLoading, [a.toolId]: false } };
    case 'SET_ERROR':          return { ...s, error: a.msg };
    case 'CLEAR':              return { ...s, result: null, analysisResult: null, error: null };
    default:                   return s;
  }
}

const Ctx = createContext<{ s: State; d: React.Dispatch<A> } | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [s, d] = useReducer(reducer, init);
  return <Ctx.Provider value={{ s, d }}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}
