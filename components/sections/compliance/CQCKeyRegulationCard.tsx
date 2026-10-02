'use client';

import { useState } from 'react';
import {
  Card, CardHeader, CardTitle, CardContent, Badge,
  Button, Sheet, SheetContent, SheetHeader, SheetTitle,
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui';
import {
  ChevronRight, CheckCircle2, XCircle,
  AlertTriangle, FileText, Users, ArrowUpRight, Search, X,
} from 'lucide-react';

type RegStatus = 'Compliant' | 'Attention' | 'Risk' | 'N/A';

interface Regulation {
  id: number; reg: string; title: string; description: string;
  category: 'Safe' | 'Effective' | 'Caring' | 'Responsive' | 'Well-Led';
  status: RegStatus; progress: number; lastInspected: string;
  evidenceItems: { label: string; done: boolean }[];
  actions: { label: string; owner: string; due: string }[];
  linkedItems: { label: string; type: string }[];
}

const ALL_REGULATIONS: Regulation[] = [
  { id:1,  reg:'Reg 4',   title:'Requirements where the service provider is an individual or partnership', description:'Fitness of individuals and partnerships providing regulated activities',      category:'Well-Led',   status:'Compliant', progress:100, lastInspected:'1 Mar 2026',  evidenceItems:[{label:'Provider fitness assessed',done:true},{label:'Partnership agreements documented',done:true}], actions:[], linkedItems:[] },
  { id:2,  reg:'Reg 5',   title:'Fit and proper persons: directors',                                       description:'Directors and equivalent roles must be fit and proper persons',               category:'Well-Led',   status:'Compliant', progress:100, lastInspected:'1 Mar 2026',  evidenceItems:[{label:'DBS checks complete for directors',done:true},{label:'References verified',done:true}], actions:[], linkedItems:[{label:'Director records',type:'Staff'}] },
  { id:3,  reg:'Reg 6',   title:'Requirement to have a registered manager',                                description:'A registered manager must be appointed where required',                       category:'Well-Led',   status:'Compliant', progress:100, lastInspected:'5 Mar 2026',  evidenceItems:[{label:'Registered manager appointed',done:true},{label:'CQC registration current',done:true}], actions:[], linkedItems:[] },
  { id:4,  reg:'Reg 7',   title:'Requirements relating to registered managers',                            description:'Registered managers must be fit, proper and experienced',                     category:'Well-Led',   status:'Compliant', progress:100, lastInspected:'5 Mar 2026',  evidenceItems:[{label:'Manager qualifications verified',done:true},{label:'Manager DBS current',done:true}], actions:[], linkedItems:[] },
  { id:5,  reg:'Reg 8',   title:'General duty of candour and transparency',                               description:'Providers must be open and transparent with service users',                    category:'Well-Led',   status:'Compliant', progress:95,  lastInspected:'10 Mar 2026', evidenceItems:[{label:'Duty of candour policy in place',done:true},{label:'Incidents notified to families',done:true},{label:'Candour training completed',done:false}], actions:[{label:'Complete duty of candour refresher training',owner:'Emma C.',due:'30 Apr'}], linkedItems:[] },
  { id:6,  reg:'Reg 9',   title:'Person-centred care',                                                    description:'Care plan reviews overdue, preference matching gaps',                          category:'Responsive', status:'Attention', progress:70,  lastInspected:'5 Feb 2026',  evidenceItems:[{label:'Care plans reviewed within 12 months',done:false},{label:'Patient preferences documented',done:true},{label:'Family involvement recorded',done:true},{label:'Overdue reviews actioned',done:false}], actions:[{label:'Complete 11 overdue care plan reviews',owner:'Sarah W.',due:'This week'},{label:'Update preference-matching for 4 patients',owner:'Priya P.',due:'25 Apr'}], linkedItems:[{label:'11 overdue care plans',type:'Care Plan'},{label:'4 preference gaps',type:'Patient'}] },
  { id:7,  reg:'Reg 10',  title:'Dignity and respect',                                                    description:'Service users must be treated with dignity and respect at all times',           category:'Caring',     status:'Compliant', progress:98,  lastInspected:'8 Mar 2026',  evidenceItems:[{label:'Dignity training completed by all staff',done:true},{label:'Privacy during personal care recorded',done:true},{label:'Dignity audit passed',done:true}], actions:[], linkedItems:[] },
  { id:8,  reg:'Reg 11',  title:'Need for consent',                                                       description:'Consent must be obtained before care or treatment is provided',                category:'Caring',     status:'Compliant', progress:96,  lastInspected:'8 Mar 2026',  evidenceItems:[{label:'Consent forms signed for all patients',done:true},{label:'Mental capacity assessments where required',done:true},{label:'Consent reviewed annually',done:false}], actions:[{label:'Annual consent review for 3 patients',owner:'Emma C.',due:'28 Apr'}], linkedItems:[{label:'Consent forms x142',type:'Consent'}] },
  { id:9,  reg:'Reg 12',  title:'Safe care and treatment',                                                description:'Risk assessments, medication safety, infection control',                       category:'Safe',       status:'Compliant', progress:100, lastInspected:'12 Mar 2026', evidenceItems:[{label:'All risk assessments up to date',done:true},{label:'Medication administration records complete',done:true},{label:'Infection control audits passed',done:true},{label:'PRN protocols documented',done:true}], actions:[], linkedItems:[{label:'142 risk assessments',type:'Risk'},{label:'38 MAR sheets',type:'Medication'}] },
  { id:10, reg:'Reg 13',  title:'Safeguarding service users from abuse',                                  description:'Safeguarding workflows, DBS tracking, training',                               category:'Safe',       status:'Compliant', progress:92,  lastInspected:'1 Mar 2026',  evidenceItems:[{label:'DBS checks current for all staff',done:true},{label:'Safeguarding training completed',done:true},{label:'Concern reporting workflow in place',done:true},{label:'MASH referral process documented',done:false}], actions:[{label:'Document MASH referral SOP',owner:'Emma C.',due:'28 Apr'}], linkedItems:[{label:'31 staff DBS records',type:'Staff'},{label:'2 open safeguarding concerns',type:'Safeguarding'}] },
  { id:11, reg:'Reg 14',  title:'Meeting nutritional and hydration needs',                                description:'Service users nutritional and hydration needs must be met',                     category:'Effective',  status:'Compliant', progress:94,  lastInspected:'6 Mar 2026',  evidenceItems:[{label:'Nutrition assessments completed',done:true},{label:'Hydration monitoring recorded in visits',done:true},{label:'Specialist diets documented',done:false}], actions:[{label:'Document specialist diets for 2 patients',owner:'Priya P.',due:'22 Apr'}], linkedItems:[] },
  { id:12, reg:'Reg 15',  title:'Premises and equipment',                                                 description:'Premises and equipment must be clean, secure and suitable',                    category:'Safe',       status:'Compliant', progress:100, lastInspected:'1 Feb 2026',  evidenceItems:[{label:'Equipment maintenance logs up to date',done:true},{label:'PPE stocks sufficient',done:true}], actions:[], linkedItems:[] },
  { id:13, reg:'Reg 16',  title:'Receiving and acting on complaints',                                     description:'A complaints process must be in place and complaints acted upon',               category:'Responsive', status:'Compliant', progress:90,  lastInspected:'3 Mar 2026',  evidenceItems:[{label:'Complaints policy published',done:true},{label:'All complaints responded to within 28 days',done:true},{label:'Complaint trends reviewed quarterly',done:false}], actions:[{label:'Q1 complaint trend review',owner:'Emma C.',due:'30 Apr'}], linkedItems:[] },
  { id:14, reg:'Reg 17',  title:'Good governance',                                                        description:'Audit trails, record keeping, quality monitoring',                             category:'Well-Led',   status:'Compliant', progress:95,  lastInspected:'10 Mar 2026', evidenceItems:[{label:'Audit trail enabled and complete',done:true},{label:'Quality monitoring reports filed',done:true},{label:'Record keeping policy reviewed',done:true},{label:'Management oversight meetings held',done:false}], actions:[{label:'Schedule Q2 management meeting',owner:'Emma C.',due:'30 Apr'}], linkedItems:[{label:'Audit trail log',type:'Audit'},{label:'Quality reports x3',type:'Report'}] },
  { id:15, reg:'Reg 18',  title:'Staffing',                                                               description:'Expired training certs, supervision overdue for 4 staff',                     category:'Effective',  status:'Risk',      progress:65,  lastInspected:'20 Jan 2026', evidenceItems:[{label:'All mandatory training current',done:false},{label:'Supervision records up to date',done:false},{label:'Staffing ratios met',done:true},{label:'Agency staff induction complete',done:true}], actions:[{label:'Renew 3 expired training certs',owner:'Emma C.',due:'Urgent'},{label:'Complete 4 overdue supervisions',owner:'Sarah W.',due:'This week'},{label:'Book refresher training sessions',owner:'Emma C.',due:'30 Apr'}], linkedItems:[{label:'3 expired certs',type:'Training'},{label:'4 staff overdue',type:'Staff'}] },
  { id:16, reg:'Reg 19',  title:'Fit and proper persons employed',                                        description:'All staff must be fit and proper for their role',                              category:'Safe',       status:'Compliant', progress:97,  lastInspected:'5 Mar 2026',  evidenceItems:[{label:'DBS checks completed for all staff',done:true},{label:'References obtained and verified',done:true},{label:'Right to work checks completed',done:true},{label:'Staff fitness review annual',done:false}], actions:[{label:'Annual fitness review for 2 staff members',owner:'Emma C.',due:'10 May'}], linkedItems:[{label:'31 staff records',type:'Staff'}] },
  { id:17, reg:'Reg 20',  title:'Duty of candour',                                                        description:'Providers must be open with people when things go wrong',                      category:'Well-Led',   status:'Compliant', progress:93,  lastInspected:'10 Mar 2026', evidenceItems:[{label:'Notifiable incidents reported to CQC',done:true},{label:'Patients and families notified of errors',done:true},{label:'Candour policy reviewed',done:false}], actions:[{label:'Annual candour policy review',owner:'Emma C.',due:'1 May'}], linkedItems:[] },
  { id:18, reg:'Reg 20A', title:'Requirement to display performance assessments',                          description:'CQC rating must be displayed prominently',                                     category:'Well-Led',   status:'Compliant', progress:100, lastInspected:'1 Jan 2026',  evidenceItems:[{label:'CQC rating displayed on website',done:true},{label:'Rating displayed at premises',done:true}], actions:[], linkedItems:[] },
  { id:19, reg:'Reg 21',  title:'Admission of children',                                                  description:'Requirements for admission of children to regulated activities',               category:'Safe',       status:'N/A',       progress:100, lastInspected:'N/A',         evidenceItems:[{label:'Not applicable — adult-only service',done:true}], actions:[], linkedItems:[] },
  { id:20, reg:'Reg 22',  title:'Accounts and financial records',                                         description:'Accurate accounts and financial records must be maintained',                   category:'Well-Led',   status:'Compliant', progress:98,  lastInspected:'15 Feb 2026', evidenceItems:[{label:'Financial records up to date',done:true},{label:'Annual accounts filed',done:true},{label:'Patient financial records audited',done:false}], actions:[{label:'Q1 financial audit completion',owner:'Emma C.',due:'30 Apr'}], linkedItems:[] },
  { id:21, reg:'Reg 23',  title:'Notification of death of a service user',                                description:'Deaths must be notified to CQC within required timeframes',                    category:'Safe',       status:'Compliant', progress:100, lastInspected:'1 Mar 2026',  evidenceItems:[{label:'Death notification procedure in place',done:true},{label:'All notifications submitted on time',done:true}], actions:[], linkedItems:[] },
  { id:22, reg:'Reg 24',  title:'Notification of absence',                                                description:'Absence of the registered person must be notified to CQC',                   category:'Well-Led',   status:'Compliant', progress:100, lastInspected:'1 Mar 2026',  evidenceItems:[{label:'Absence notification procedure documented',done:true}], actions:[], linkedItems:[] },
  { id:23, reg:'Reg 25',  title:'Notification of other incidents',                                        description:'Specified incidents must be notified to CQC promptly',                        category:'Safe',       status:'Compliant', progress:88,  lastInspected:'10 Mar 2026', evidenceItems:[{label:'Incident notification procedure in place',done:true},{label:'All required incidents reported to CQC',done:true},{label:'Timelines for notification met',done:false}], actions:[{label:'Review notification timelines for last quarter',owner:'Emma C.',due:'25 Apr'}], linkedItems:[] },
  { id:24, reg:'Reg 26',  title:'Notice of changes',                                                      description:'CQC must be notified of specified changes to registration',                    category:'Well-Led',   status:'Compliant', progress:100, lastInspected:'1 Jan 2026',  evidenceItems:[{label:'Change notification process documented',done:true}], actions:[], linkedItems:[] },
  { id:25, reg:'Reg 27',  title:'Infection prevention and control',                                       description:'Infection prevention and control measures must be in place',                   category:'Safe',       status:'Compliant', progress:96,  lastInspected:'12 Mar 2026', evidenceItems:[{label:'IPC policy current and published',done:true},{label:'IPC training completed by all staff',done:true},{label:'PPE use audited',done:true},{label:'IPC lead designated',done:false}], actions:[{label:'Designate IPC lead for 2026',owner:'Emma C.',due:'15 Apr'}], linkedItems:[] },
  { id:26, reg:'Reg 28',  title:'Nominated individual',                                                   description:'A nominated individual must be appointed for corporate providers',              category:'Well-Led',   status:'Compliant', progress:100, lastInspected:'1 Jan 2026',  evidenceItems:[{label:'Nominated individual appointed and recorded',done:true}], actions:[], linkedItems:[] },
  { id:27, reg:'Reg 29',  title:'Management of regulated activity in absence',                            description:'Arrangements for managing regulated activities during absence',                 category:'Well-Led',   status:'Compliant', progress:100, lastInspected:'1 Jan 2026',  evidenceItems:[{label:'Deputy manager identified',done:true},{label:'Absence management plan in place',done:true}], actions:[], linkedItems:[] },
  { id:28, reg:'Reg 30',  title:'Consultation with service users on changes',                             description:'Service users must be consulted on changes that affect them',                  category:'Responsive', status:'Attention', progress:75,  lastInspected:'1 Feb 2026',  evidenceItems:[{label:'Consultation process documented',done:true},{label:'Recent change consultations evidenced',done:false}], actions:[{label:'Evidence Q1 change consultations',owner:'Sarah W.',due:'28 Apr'}], linkedItems:[] },
  { id:29, reg:'Reg 31',  title:'Local authority and NHS body notifications',                             description:'Notifications to relevant bodies must be made as required',                    category:'Well-Led',   status:'Compliant', progress:100, lastInspected:'1 Mar 2026',  evidenceItems:[{label:'LA notification procedure in place',done:true},{label:'NHS notifications log maintained',done:true}], actions:[], linkedItems:[] },
  { id:30, reg:'Reg 32',  title:'Notice of termination of pregnancies',                                   description:'Requirements for notification of termination of pregnancies',                  category:'Safe',       status:'N/A',       progress:100, lastInspected:'N/A',         evidenceItems:[{label:'Not applicable to this service type',done:true}], actions:[], linkedItems:[] },
  { id:31, reg:'Reg 34',  title:'Complaints',                                                             description:'Complaints must be investigated and responded to appropriately',               category:'Responsive', status:'Compliant', progress:90,  lastInspected:'3 Mar 2026',  evidenceItems:[{label:'Complaints policy up to date',done:true},{label:'All complaints responded to within 28 days',done:true},{label:'Learning from complaints evidenced',done:false}], actions:[{label:'Document learning from Q1 complaints',owner:'Emma C.',due:'30 Apr'}], linkedItems:[] },
];

const KEY_REGS = ALL_REGULATIONS.filter(r => [6, 9, 10, 14, 15].includes(r.id));

const STATUS_BAR:    Record<RegStatus, string> = { Compliant:'var(--cf-success)', Attention:'var(--cf-warning)', Risk:'var(--cf-error)', 'N/A':'var(--cf-ink-20)' };
const STATUS_TEXT:   Record<RegStatus, string> = { Compliant:'text-[color:var(--cf-success)]', Attention:'text-[color:var(--cf-warning)]', Risk:'text-[color:var(--cf-error)]', 'N/A':'text-[color:var(--cf-ink-40)]' };
const STATUS_BORDER: Record<RegStatus, string> = { Compliant:'border-l-[3px] border-l-[color:var(--cf-success)]', Attention:'border-l-[3px] border-l-[color:var(--cf-warning)]', Risk:'border-l-[3px] border-l-[color:var(--cf-error)]', 'N/A':'border-l-[3px] border-l-[color:var(--cf-ink-20)]' };
const STATUS_BADGE:  Record<RegStatus, string> = { Compliant:'pastel-success', Attention:'pastel-warning', Risk:'pastel-danger', 'N/A':'secondary' };
const CAT_STYLE:     Record<string,    string> = { Safe:'bg-[var(--cf-info-muted)] text-[color:var(--cf-info)]', Effective:'bg-[var(--cf-success-muted)] text-[color:var(--cf-success)]', Caring:'bg-[var(--cf-warning-muted)] text-[color:var(--cf-warning)]', Responsive:'bg-[var(--cf-info-muted)] text-[color:var(--cf-info)]', 'Well-Led':'bg-[var(--cf-success-muted)] text-[color:var(--cf-success)]' };

const STATUS_PILL_COLOR: Record<string, string> = {
  All:'var(--cf-brand-500)', Compliant:'var(--cf-success)',
  Attention:'var(--cf-warning)', Risk:'var(--cf-error)', 'N/A':'var(--cf-ink-40)',
};

// ── Key trick: use variant="ghost" + h-auto + p-0 to neutralise shadcn base styles ──
function Pill({ label, active, color, onClick }: { label: string; active: boolean; color?: string; onClick: () => void }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      style={active ? { backgroundColor: color ?? 'var(--cf-brand-500)', color: '#fff', borderColor: color ?? 'var(--cf-brand-500)' } : {}}
      className={[
        // reset shadcn base geometry
        'h-auto px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-150',
        active
          ? 'shadow-sm'
          : 'bg-[var(--cf-surface)] text-[color:var(--cf-ink-60)] border-[var(--cf-border)] hover:bg-[var(--cf-surface-muted)] hover:border-[var(--cf-brand-300)] hover:text-[color:var(--cf-ink)]',
      ].join(' ')}
    >
      {label}
    </Button>
  );
}

// ── Reg row — variant="ghost" + h-auto + p-0 so layout classes win ───────────
function RegRow({ reg, onClick }: { reg: Regulation; onClick: () => void }) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={[
        'h-auto w-full p-4 rounded-xl border border-[var(--cf-border)]',
        STATUS_BORDER[reg.status],
        'bg-[var(--cf-surface)] hover:bg-[var(--cf-surface-muted)] transition-colors group',
        'flex flex-col items-stretch text-left',
      ].join(' ')}
    >
      {/* Row 1 */}
      <div className="flex items-center gap-2 flex-wrap mb-1">
        <span className="text-xs font-bold text-[color:var(--cf-ink-40)] flex-shrink-0">{reg.reg}</span>
        <span className="text-sm font-semibold text-[color:var(--cf-ink)] flex-1 group-hover:text-[color:var(--cf-brand-500)] transition-colors">{reg.title}</span>
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${CAT_STYLE[reg.category]}`}>{reg.category}</span>
        <Badge variant={STATUS_BADGE[reg.status] as any} className="text-xs flex-shrink-0">{reg.status}</Badge>
        <ChevronRight className="h-4 w-4 text-[color:var(--cf-ink-40)] group-hover:text-[color:var(--cf-ink)] transition-colors flex-shrink-0" />
      </div>
      {/* Row 2 */}
      <p className="text-xs text-[color:var(--cf-ink-60)] mb-2 text-left">{reg.description}</p>
      {/* Row 3 */}
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-[var(--cf-border)] rounded-full h-1.5">
          <div className="h-1.5 rounded-full" style={{ width:`${reg.progress}%`, backgroundColor:STATUS_BAR[reg.status] }} />
        </div>
        <span className={`text-[11px] font-bold flex-shrink-0 ${STATUS_TEXT[reg.status]}`}>{reg.progress}%</span>
      </div>
    </Button>
  );
}

// ── Individual reg drawer ────────────────────────────────────────────────────
function RegDrawer({ reg, open, onClose }: { reg: Regulation | null; open: boolean; onClose: () => void }) {
  if (!reg) return null;
  const done = reg.evidenceItems.filter(e => e.done).length;
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[440px] sm:w-[500px] p-0 flex flex-col">
        <SheetHeader className="px-6 py-5 border-b border-[var(--cf-border-light)]">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-xs font-bold text-[color:var(--cf-ink-40)]">{reg.reg}</span>
            <SheetTitle className="text-base font-bold text-[color:var(--cf-ink)]">{reg.title}</SheetTitle>
          </div>
          <div className="flex items-center gap-2 flex-wrap mt-1">
            <Badge variant={STATUS_BADGE[reg.status] as any}>{reg.status}</Badge>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${CAT_STYLE[reg.category]}`}>{reg.category}</span>
          </div>
          <p className="text-sm text-[color:var(--cf-ink-60)] mt-2">{reg.description}</p>
          <div className="mt-4">
            <div className="flex justify-between mb-1.5">
              <span className="text-xs text-[color:var(--cf-ink-60)]">Compliance score</span>
              <span className={`text-sm font-bold ${STATUS_TEXT[reg.status]}`}>{reg.progress}%</span>
            </div>
            <div className="w-full bg-[var(--cf-border)] rounded-full h-2">
              <div className="h-2 rounded-full" style={{ width:`${reg.progress}%`, backgroundColor:STATUS_BAR[reg.status] }} />
            </div>
            <p className="text-xs text-[color:var(--cf-ink-40)] mt-1.5">Last inspected: {reg.lastInspected}</p>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Evidence */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-4 w-4 text-[color:var(--cf-ink-60)]" />
              <p className="text-sm font-bold text-[color:var(--cf-ink)]">Evidence Checklist</p>
              <span className="text-xs text-[color:var(--cf-ink-40)] ml-auto">{done}/{reg.evidenceItems.length} complete</span>
            </div>
            <div className="space-y-2">
              {reg.evidenceItems.map((item, i) => (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-lg border ${item.done ? 'bg-[var(--cf-success-muted)] border-[color:var(--cf-success)]/20' : 'bg-[var(--cf-error-muted)] border-[color:var(--cf-error)]/20'}`}>
                  {item.done ? <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-[color:var(--cf-success)]" /> : <XCircle className="h-4 w-4 flex-shrink-0 text-[color:var(--cf-error)]" />}
                  <span className={`text-sm ${item.done ? 'text-[color:var(--cf-ink)]' : 'text-[color:var(--cf-error)] font-medium'}`}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          {reg.actions.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-4 w-4 text-[color:var(--cf-warning)]" />
                <p className="text-sm font-bold text-[color:var(--cf-ink)]">Actions Required</p>
              </div>
              <div className="space-y-2">
                {reg.actions.map((a, i) => (
                  <div key={i} className="flex items-start justify-between gap-3 p-3 rounded-lg border border-[color:var(--cf-warning)]/20 bg-[var(--cf-warning-muted)]">
                    <p className="text-sm text-[color:var(--cf-ink)] flex-1">{a.label}</p>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-semibold text-[color:var(--cf-ink)]">{a.owner}</p>
                      <p className="text-xs font-medium text-[color:var(--cf-warning)]">{a.due}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Linked items */}
          {reg.linkedItems.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-4 w-4 text-[color:var(--cf-ink-60)]" />
                <p className="text-sm font-bold text-[color:var(--cf-ink)]">Linked Items</p>
              </div>
              <div className="space-y-2">
                {reg.linkedItems.map((item, i) => (
                  <Button key={i} variant="ghost" className="h-auto w-full p-3 rounded-lg border border-[var(--cf-border)] bg-[var(--cf-surface)] hover:bg-[var(--cf-surface-muted)] transition-colors flex items-center justify-between text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded-md bg-[var(--cf-surface-muted)] text-[color:var(--cf-ink-60)] font-medium">{item.type}</span>
                      <span className="text-sm text-[color:var(--cf-ink)]">{item.label}</span>
                    </div>
                    <ArrowUpRight className="h-3.5 w-3.5 text-[color:var(--cf-ink-40)]" />
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-[var(--cf-border-light)] flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 gap-1.5"><Users className="h-3.5 w-3.5" />Assign Actions</Button>
          <Button size="sm" className="flex-1 gap-1.5"><FileText className="h-3.5 w-3.5" />Export Evidence</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ── View All 31 modal ────────────────────────────────────────────────────────
const CATEGORIES = ['All','Safe','Effective','Caring','Responsive','Well-Led'] as const;
const STATUSES   = ['All','Compliant','Attention','Risk','N/A'] as const;

function AllRegulationsModal({ open, onClose, onSelect }: { open:boolean; onClose:()=>void; onSelect:(r:Regulation)=>void }) {
  const [search,   setSearch]   = useState('');
  const [category, setCategory] = useState('All');
  const [status,   setStatus]   = useState('All');

  const filtered = ALL_REGULATIONS.filter(r => {
    const q = search.toLowerCase();
    return (
      (!q || r.title.toLowerCase().includes(q) || r.reg.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)) &&
      (category === 'All' || r.category === category) &&
      (status   === 'All' || r.status   === status)
    );
  });

  const counts = {
    Compliant: ALL_REGULATIONS.filter(r => r.status === 'Compliant').length,
    Attention: ALL_REGULATIONS.filter(r => r.status === 'Attention').length,
    Risk:      ALL_REGULATIONS.filter(r => r.status === 'Risk').length,
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full max-h-[88vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-[var(--cf-border-light)] flex-shrink-0 space-y-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-xl font-bold text-[color:var(--cf-ink)]">All CQC Regulations</DialogTitle>
              <p className="text-sm text-[color:var(--cf-ink-60)] mt-0.5">HSCA 2008 (Regulated Activities) Regulations 2014 — {ALL_REGULATIONS.length} regulations</p>
            </div>
            <div className="flex items-center gap-4 text-xs flex-shrink-0 mt-1">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full inline-block" style={{backgroundColor:'var(--cf-success)'}} /><span className="text-[color:var(--cf-ink-60)]">{counts.Compliant} Compliant</span></span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full inline-block" style={{backgroundColor:'var(--cf-warning)'}} /><span className="text-[color:var(--cf-ink-60)]">{counts.Attention} Attention</span></span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full inline-block" style={{backgroundColor:'var(--cf-error)'}} /><span className="text-[color:var(--cf-ink-60)]">{counts.Risk} Risk</span></span>
            </div>
          </div>

          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[color:var(--cf-ink-40)]" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search regulations…"
              className="w-full pl-9 pr-8 py-2 text-sm bg-[var(--cf-surface-muted)] border border-[var(--cf-border)] rounded-lg text-[color:var(--cf-ink)] placeholder:text-[color:var(--cf-ink-40)] focus:outline-none focus:ring-2 focus:ring-[var(--cf-brand-200)]" />
            {search && (
              <Button variant="ghost" size="icon" onClick={() => setSearch('')} className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7">
                <X className="h-3.5 w-3.5 text-[color:var(--cf-ink-40)]" />
              </Button>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 mt-3 flex-wrap">
            <div className="flex gap-1.5 flex-wrap">
              {CATEGORIES.map(c => <Pill key={c} label={c} active={category===c} onClick={() => setCategory(c)} />)}
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {STATUSES.map(s => <Pill key={s} label={s} active={status===s} color={STATUS_PILL_COLOR[s]} onClick={() => setStatus(s)} />)}
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {filtered.length === 0 ? (
            <p className="text-sm text-[color:var(--cf-ink-40)] text-center py-12">No regulations match your filters.</p>
          ) : (
            <div className="space-y-2">
              {filtered.map(reg => (
                <RegRow key={reg.id} reg={reg} onClick={() => { onSelect(reg); onClose(); }} />
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Main exported card ───────────────────────────────────────────────────────
export function KeyRegulationsCard() {
  const [selectedReg, setSelectedReg] = useState<Regulation | null>(null);
  const [drawerOpen,  setDrawerOpen]  = useState(false);
  const [modalOpen,   setModalOpen]   = useState(false);

  const openDrawer = (reg: Regulation) => { setSelectedReg(reg); setDrawerOpen(true); };

  return (
    <>
      <Card className="border-cf-border-light shadow-cf-sm rounded-2xl w-full h-full">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="font-bold">Key Regulations</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setModalOpen(true)}
              className="text-sm text-[color:var(--cf-ink-60)] hover:text-[color:var(--cf-ink)] hover:underline h-auto py-1">
              View All 31
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {KEY_REGS.map(reg => (
              <Button
                key={reg.id}
                variant="ghost"
                onClick={() => openDrawer(reg)}
                className={[
                  'h-auto w-full p-4 rounded-xl border border-[var(--cf-border)]',
                  STATUS_BORDER[reg.status],
                  'bg-[var(--cf-surface)] hover:bg-[var(--cf-surface-muted)] transition-colors group',
                  'flex flex-col items-stretch text-left',
                ].join(' ')}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-[color:var(--cf-ink)] group-hover:text-[color:var(--cf-brand-500)] transition-colors">{reg.title}</p>
                    <p className="text-xs text-[color:var(--cf-ink-60)] mt-0.5 text-left">{reg.description}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                    <Badge variant={STATUS_BADGE[reg.status] as any}>{reg.status}</Badge>
                    <ChevronRight className="h-4 w-4 text-[color:var(--cf-ink-40)] group-hover:text-[color:var(--cf-ink)] transition-colors" />
                  </div>
                </div>
                <div className="w-full bg-[var(--cf-border)] rounded-full h-1.5">
                  <div className="h-1.5 rounded-full" style={{ width:`${reg.progress}%`, backgroundColor:STATUS_BAR[reg.status] }} />
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <AllRegulationsModal open={modalOpen} onClose={() => setModalOpen(false)} onSelect={openDrawer} />
      <RegDrawer reg={selectedReg} open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}