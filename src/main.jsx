import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Bot, CheckCircle2, ChevronRight, Database, Download, FileCheck2, FileText, Files, Loader2, MessageSquareText, Send, Sparkles, UploadCloud } from 'lucide-react';
import './styles.css';

const detectedFields = [
  ['Rapportperiode', 'Excel/CSV-eksport'],
  ['Nøkkeltall for drift', 'ERP/fagsystem'],
  ['Åpne avvik', 'Kvalitetssystem'],
  ['Ansvarlig leder', 'Organisasjonsdata'],
  ['Kommentar til utvikling', 'Månedsnotater'],
  ['Tiltak neste periode', 'Prosjektverktøy'],
];

const reportData = {
  'Rapportperiode': 'Mai 2026',
  'Område': 'Region Nord · Produksjon og drift',
  'Nøkkeltall': '97,8 % leveransegrad · 14 åpne avvik',
  'Ansvarlig leder': 'Kari Nilsen',
  'Viktigste tiltak': 'Automatisk varsling ved avvik over terskelverdi',
  'Datagrunnlag': 'ERP, kvalitetssystem, Excel-eksport og PDF-notater',
};

const initialMessages = [
  {
    role: 'assistant',
    text: 'Hei! Jeg er koblet til dokumenter, rapportmaler og fagsystemer. Spør meg om drift, avvik, nøkkeltall eller datagrunnlag – prøv for eksempel: «Hvilke avvik må følges opp denne måneden?»',
    source: 'Tilkoblet 5 datakilder · Demo med simulerte data',
  },
];

function getAnswer(question) {
  const q = question.toLowerCase();
  if (q.includes('avvik') || q.includes('følge') || q.includes('oppfølging')) {
    return {
      text: 'Jeg finner 14 åpne avvik i perioden. Tre bør prioriteres fordi de har høy risiko eller nærmer seg frist: manglende signering av kontrollskjema, forsinket vedlikeholdskontroll og uavklart leverandøravvik.',
      source: 'Kilde: Kvalitetssystem · Avvikslogg mai 2026',
    };
  }
  if (q.includes('nøkkeltall') || q.includes('kpi') || q.includes('måned') || q.includes('status')) {
    return {
      text: 'Månedsstatusen viser 97,8 % leveransegrad, 4,2 % lavere energiforbruk enn budsjett og 14 åpne avvik. Den viktigste endringen fra forrige måned er redusert responstid på kritiske hendelser.',
      source: 'Kilde: ERP-eksport, driftsdashboard og månedsnotat',
    };
  }
  if (q.includes('rapport') || q.includes('mal') || q.includes('styre') || q.includes('ledelse')) {
    return {
      text: 'Rapportmalen kan fylles automatisk med nøkkeltall, avviksstatus, kommentarer og foreslåtte tiltak. Felter som krever faglig vurdering markeres tydelig før eksport til PDF eller Word.',
      source: 'Kilde: Ledelsesrapport_mal.docx og datakartlegging',
    };
  }
  return {
    text: 'Jeg fant relevante opplysninger i dokumentgrunnlaget. Dataene kan kobles til rapportmalen, men to felter bør kvalitetssikres manuelt før innsending: fritekstkommentar og endelig tiltaksansvarlig.',
    source: 'Kilde: Dokumentindeks · Rapportgrunnlag mai 2026',
  };
}

function App() {
  const [activeTab, setActiveTab] = useState('chat');
  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-mark">Append Consulting</div>
        <span>AI-demo · automatisert rapportering</span>
      </header>

      <section className="intro-card">
        <div>
          <p className="eyebrow"><Sparkles size={14} /> Frontend-simulering</p>
          <h1>Automatisert rapportering fra dokumenter og fagsystemer</h1>
          <p>En universell demo som viser hvordan virksomheter kan hente data fra flere kilder, fylle rapportmaler automatisk og la fagpersoner kvalitetssikre før utsending.</p>
        </div>
      </section>

      <nav className="tabs" aria-label="Demo-faner">
        <button className={activeTab === 'chat' ? 'active' : ''} onClick={() => setActiveTab('chat')}><MessageSquareText size={18} /> Informasjonsassistent</button>
        <button className={activeTab === 'report' ? 'active' : ''} onClick={() => setActiveTab('report')}><FileCheck2 size={18} /> Rapportgenerator</button>
      </nav>

      {activeTab === 'chat' ? <DocumentAssistant /> : <ReportGenerator />}
    </main>
  );
}

function DocumentAssistant() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages, thinking]);

  function ask(prefill) {
    const question = (prefill ?? input).trim();
    if (!question || thinking) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: question }]);
    setThinking(true);
    const wait = 1050 + Math.random() * 850;
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', ...getAnswer(question) }]);
      setThinking(false);
    }, wait);
  }

  return (
    <section className="workspace-grid chat-grid">
      <section className="chat-panel">
        <header className="section-header">
          <div><h2>Informasjonsassistent</h2><p>Still spørsmål på tvers av dokumenter, rapporter og fagsystemer – med kildehenvisning tilbake til datagrunnlaget.</p></div>
          <span className="status-pill"><span /> Indeks klar</span>
        </header>
        <div className="suggestions">
          {['Hvilke avvik må følges opp denne måneden?', 'Vis nøkkeltall for måneden', 'Kan rapportmalen fylles automatisk?'].map(s => <button key={s} onClick={() => ask(s)}>{s}</button>)}
        </div>
        <div className="messages">
          {messages.map((msg, idx) => <ChatMessage key={idx} msg={msg} />)}
          {thinking && <div className="message assistant"><div className="avatar"><Bot size={17} /></div><div className="bubble thinking"><Loader2 size={16} className="spin" /> Søker i dokumenter og verifiserer kilde …</div></div>}
          <div ref={bottomRef} />
        </div>
        <form className="chat-input" onSubmit={(e) => { e.preventDefault(); ask(); }}>
          <input value={input} onChange={e => setInput(e.target.value)} placeholder="Skriv et spørsmål om rapportgrunnlaget …" />
          <button type="submit"><Send size={18} /> Send</button>
        </form>
      </section>
    </section>
  );
}

function ChatMessage({ msg }) {
  return (
    <div className={`message ${msg.role}`}>
      {msg.role === 'assistant' && <div className="avatar"><Bot size={17} /></div>}
      <div className="bubble">
        <p>{msg.text}</p>
        {msg.source && <cite>{msg.source}</cite>}
      </div>
    </div>
  );
}

function ReportGenerator() {
  const [uploaded, setUploaded] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  function uploadTemplate() {
    setUploaded(false); setReady(false); setDownloaded(false); setProgress(0);
    setTimeout(() => setUploaded(true), 450);
  }

  function generateReport() {
    setGenerating(true); setReady(false); setDownloaded(false); setProgress(0);
    let value = 0;
    const timer = setInterval(() => {
      value += 8 + Math.random() * 13;
      if (value >= 100) {
        value = 100;
        clearInterval(timer);
        setTimeout(() => { setGenerating(false); setReady(true); }, 350);
      }
      setProgress(Math.round(value));
    }, 210);
  }

  const sourceStatus = useMemo(() => [
    ['Rapportmal', uploaded ? 'Lastet inn' : 'Venter'],
    ['ERP/fagsystem', generating || ready ? 'Data hentet' : 'Klar'],
    ['Kvalitetssystem', generating || ready ? 'Verifisert' : 'Klar'],
    ['Excel/CSV', generating || ready ? 'Mappet' : 'Klar'],
  ], [uploaded, generating, ready]);

  return (
    <section className="workspace-grid report-grid">
      <aside className="side-panel">
        <div className="panel-title"><Database size={18} /> Datakilder</div>
        <div className="source-list">
          {sourceStatus.map(([name, status]) => <div className="source-row" key={name}><span>{name}</span><strong>{status}</strong></div>)}
        </div>
        <button className="primary wide" onClick={uploadTemplate}><UploadCloud size={18} /> Last opp mal</button>
        {uploaded && <div className="uploaded-file"><FileText size={19} /> Ledelsesrapport_mal.docx</div>}
      </aside>

      <section className="generator-panel">
        <header className="section-header">
          <div><h2>Rapportgenerator</h2><p>Systemet leser malen, identifiserer felter og fyller dem med kvalitetssikrede data fra valgte kilder.</p></div>
          <span className="status-pill"><span /> Simulert frontendflyt</span>
        </header>

        {!uploaded && <EmptyState />}

        {uploaded && <div className="field-card animate-in">
          <h3>Oppdagede felter i malen</h3>
          <div className="field-list">
            {detectedFields.map(([field, source]) => <div className="field-row" key={field}><div><CheckCircle2 size={17} /> {field}</div><span>Hentes fra: {source}</span></div>)}
          </div>
          <button className="primary" onClick={generateReport} disabled={generating}><Sparkles size={18} /> Generer rapport</button>
        </div>}

        {generating && <div className="progress-card animate-in">
          <div className="progress-copy"><strong>Henter og kvalitetssikrer data</strong><span>{progress}%</span></div>
          <div className="progress-track"><div style={{ width: `${progress}%` }} /></div>
          <div className="steps"><span>Leser mal</span><ChevronRight size={15} /><span>Mapper felter</span><ChevronRight size={15} /><span>Validerer kilder</span></div>
        </div>}

        {ready && <ReportPreview downloaded={downloaded} onDownload={() => { setDownloaded(true); setTimeout(() => setDownloaded(false), 3000); }} />}
      </section>
    </section>
  );
}

function EmptyState() {
  return <div className="empty-state"><Files size={42} /><h3>Start med en rapportmal</h3><p>Klikk «Last opp mal» for å simulere opplasting av en Word-, Excel- eller PDF-mal.</p></div>;
}

function ReportPreview({ downloaded, onDownload }) {
  return (
    <article className="report-preview animate-in">
      <div className="report-top"><div><p>Ferdig utfylt rapport</p><h3>Ledelsesrapport · automatisk utkast</h3></div><span>Utkast · 10.06.2026</span></div>
      <div className="report-fields">
        {Object.entries(reportData).map(([key, value]) => <div key={key}><span>{key}</span><strong>{value}</strong></div>)}
      </div>
      <div className="report-note"><strong>Kontrollnotat:</strong> Alle felter er automatisk utfylt fra oppgitte kilder. Felter med faglig skjønn markeres for gjennomgang før rapporten deles eller sendes inn.</div>
      <button className="secondary" onClick={onDownload}><Download size={18} /> Last ned rapport</button>
      {downloaded && <div className="toast"><CheckCircle2 size={18} /> Rapporten er klargjort for nedlasting.</div>}
    </article>
  );
}

createRoot(document.getElementById('root')).render(<App />);
