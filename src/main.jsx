import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Bot, CheckCircle2, ChevronRight, Database, Download, FileCheck2, FileText, Fish, Loader2, MessageSquareText, Send, Sparkles, UploadCloud } from 'lucide-react';
import './styles.css';

const detectedFields = [
  ['Lokalitet', 'Internkontroll'],
  ['Antall fisk', 'FishTalk'],
  ['Siste avlusningsdato', 'Fiskehelserapport'],
  ['Ansvarlig områdeleder', 'Internkontroll'],
  ['MTB-utnyttelse %', 'FishTalk'],
  ['Veterinæransvarlig', 'Fiskehelserapport'],
];

const reportData = {
  'Lokalitet': 'Lokalitet 3 – Langøyfjorden',
  'Antall fisk': '812 450 stk atlantisk laks',
  'Siste avlusningsdato': '14. april 2026',
  'Ansvarlig områdeleder': 'Kari Nilsen',
  'MTB-utnyttelse %': '78,4 %',
  'Veterinæransvarlig': 'Dr. Ingrid Vikan, AquaVet Nord',
};

const initialMessages = [
  {
    role: 'assistant',
    text: 'Hei! Jeg har tilgang til EK, internkontroll, FishTalk, fiskehelserapporter og leverandørdata. Spør meg om hva som helst om driften – prøv for eksempel: «Når var siste avlusing?»',
    source: 'Tilkoblet 6 datakilder · Oppdatert i sanntid',
  },
];

function getAnswer(question) {
  const q = question.toLowerCase();
  if (q.includes('avlusing') || q.includes('avlusning') || q.includes('siste behandling')) {
    return {
      text: 'Siste registrerte avlusing var 14. april 2026 på Lokalitet 3 – Langøyfjorden. Behandlingen ble gjennomført med ferskvannsbehandling, og ansvarlig veterinær var Dr. Ingrid Vikan fra AquaVet Nord.',
      source: 'Kilde: Fiskehelserapport_Q1_2026.pdf, side 4',
    };
  }
  if (q.includes('fôrplan') || q.includes('forplan') || q.includes('vår') || q.includes('biomar') || q.includes('fôr')) {
    return {
      text: 'Vårplanen anbefaler BioMar EFICO Enviro 920 i vekslende pelletstørrelse 6–9 mm. Planlagt fôrmengde er 1 280 tonn for perioden mars–mai, med justering etter temperaturkurve og appetittscore.',
      source: 'Kilde: BioMar_fôrplan_vår2026.pdf, side 3',
    };
  }
  if (q.includes('mtb') || q.includes('maksimal') || q.includes('tillatelse') || q.includes('lokalitet 3')) {
    return {
      text: 'Tillatt MTB for Lokalitet 3 er 3 120 tonn. Dokumentet angir at biomassen skal fordeles på seks merder, med månedlig kontroll mot FishTalk og rapportering ved avvik over 85 % utnyttelse.',
      source: 'Kilde: Lokalitet_3_tillatelse.pdf, side 2',
    };
  }
  return {
    text: 'Jeg fant relevante opplysninger i internkontrollmaterialet. Dokumentene peker på at avvik skal registreres innen 24 timer, kvalitetssikres av områdeleder og lukkes med korrigerende tiltak før neste månedsrapportering.',
    source: 'Kilde: Internkontroll_2024.pdf, side 17',
  };
}

function App() {
  const [activeTab, setActiveTab] = useState('chat');
  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-mark">Append Consulting × Emilsen Fisk</div>
        <span>AI-demo</span>
      </header>

      <section className="intro-card">
        <div>
          <p className="eyebrow"><Sparkles size={14} /> Frontend-simulering</p>
          <h1>AI-demo for dokumentinnsikt og automatisk rapportering</h1>
          <p>En rolig arbeidsflate som viser hvordan dokumenter, fagsystemer og rapportmaler kan kobles sammen.</p>
        </div>
        <div className="hero-stats">
          <div><strong>6</strong><span>datakilder tilkoblet</span></div>
          <div><strong>6</strong><span>rapportfelt mappet</span></div>
          <div><strong>0</strong><span>backend-kall</span></div>
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
          <div><h2>Informasjonsassistent</h2><p>Still spørsmål om drift, lokaliteter og rapportering – jeg har tilgang til alle systemer.</p></div>
          <span className="status-pill"><span /> Indeks klar</span>
        </header>
        <div className="suggestions">
          {['Når var siste avlusing?', 'Hva er fôrplanen for vår?', 'Hva er MTB på lokalitet 3?'].map(s => <button key={s} onClick={() => ask(s)}>{s}</button>)}
        </div>
        <div className="messages">
          {messages.map((msg, idx) => <ChatMessage key={idx} msg={msg} />)}
          {thinking && <div className="message assistant"><div className="avatar"><Bot size={17} /></div><div className="bubble thinking"><Loader2 size={16} className="spin" /> Søker i dokumenter og verifiserer kilde …</div></div>}
          <div ref={bottomRef} />
        </div>
        <form className="chat-input" onSubmit={(e) => { e.preventDefault(); ask(); }}>
          <input value={input} onChange={e => setInput(e.target.value)} placeholder="Skriv et spørsmål om dokumentene …" />
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
    ['Internkontroll', uploaded ? 'Tilkoblet' : 'Venter'],
    ['FishTalk', generating || ready ? 'Data hentet' : 'Klar'],
    ['Fiskehelserapport', generating || ready ? 'Verifisert' : 'Klar'],
  ], [uploaded, generating, ready]);

  return (
    <section className="workspace-grid report-grid">
      <aside className="side-panel">
        <div className="panel-title"><Database size={18} /> Datakilder</div>
        <div className="source-list">
          {sourceStatus.map(([name, status]) => <div className="source-row" key={name}><span>{name}</span><strong>{status}</strong></div>)}
        </div>
        <button className="primary wide" onClick={uploadTemplate}><UploadCloud size={18} /> Last opp mal</button>
        {uploaded && <div className="uploaded-file"><FileText size={19} /> Mattilsynet_kontrollskjema.pdf</div>}
      </aside>

      <section className="generator-panel">
        <header className="section-header">
          <div><h2>Rapportgenerator</h2><p>Systemet leser malen, finner felter og fyller dem med kvalitetssikrede data.</p></div>
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
          <div className="progress-copy"><strong>Henter data fra kildene</strong><span>{progress}%</span></div>
          <div className="progress-track"><div style={{ width: `${progress}%` }} /></div>
          <div className="steps"><span>Leser mal</span><ChevronRight size={15} /><span>Mapper felter</span><ChevronRight size={15} /><span>Validerer data</span></div>
        </div>}

        {ready && <ReportPreview downloaded={downloaded} onDownload={() => { setDownloaded(true); setTimeout(() => setDownloaded(false), 3000); }} />}
      </section>
    </section>
  );
}

function EmptyState() {
  return <div className="empty-state"><Fish size={42} /><h3>Start med en rapportmal</h3><p>Klikk «Last opp mal» for å simulere opplasting av Mattilsynets kontrollskjema.</p></div>;
}

function ReportPreview({ downloaded, onDownload }) {
  return (
    <article className="report-preview animate-in">
      <div className="report-top"><div><p>Ferdig utfylt rapport</p><h3>Mattilsynet kontrollskjema – Emilsen Fisk</h3></div><span>Utkast · 22.05.2026</span></div>
      <div className="report-fields">
        {Object.entries(reportData).map(([key, value]) => <div key={key}><span>{key}</span><strong>{value}</strong></div>)}
      </div>
      <div className="report-note"><strong>Kontrollnotat:</strong> Alle felter er automatisk utfylt fra oppgitte kilder og markert for faglig gjennomgang før innsending.</div>
      <button className="secondary" onClick={onDownload}><Download size={18} /> Last ned rapport</button>
      {downloaded && <div className="toast"><CheckCircle2 size={18} /> Rapporten er klargjort for nedlasting.</div>}
    </article>
  );
}

createRoot(document.getElementById('root')).render(<App />);
