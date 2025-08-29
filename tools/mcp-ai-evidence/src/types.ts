export type Evidence = {
  pid: string;
  meta?: { headSha?: string; node?: string; pnpm?: string; runUrl?: string };
  findings?: Record<string, unknown>;
  timestamp: string;
};

export type ComplianceReport = { 
  ok: boolean; 
  missing: string[]; 
  notes?: string[] 
};
