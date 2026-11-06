import Link from 'next/link';
const F = [['Title deed guide', 'Check if your property is registered and what to do next.', '/deed'], ['FLISP calculator', 'Estimate your first-time buyer subsidy.', '/flisp'], ['Rental tribunal', 'Draft a complaint and download it as a PDF.', '/tribunal'], ['AI letter helper', 'Write deposit, eviction or Deeds Office letters.', '/letter'], ['Deeds Office map', 'Locate the office for your province.', '/map'], ['Secure vault', 'Keep your ID, lease and deed papers together.', '/dashboard'], ['Deposit calculator', 'See the refund and interest you are owed.', '/deposit'], ['Lease checker', 'Spot unlawful clauses in your lease.', '/lease'], ['AI assistant', 'Ask questions and get guided answers.', '/assistant']];
export default function Home() {
  return (<><section className="hero"><div style={{ flex: 1.2, minWidth: 300 }}><span className="pill">For South African homeowners and renters</span>
    <h1>Know your property rights. <span>Claim what is yours.</span></h1>
    <p style={{ fontSize: 19, color: '#4a5568' }}>Free, step-by-step help with title deeds, housing subsidies and rental disputes.</p>
    <p><Link className="btn" href="/signup">Create free account</Link> <Link className="btn o" href="/assistant">Ask the AI assistant</Link></p></div>
    <div className="panel"><div>Title deed application</div><div style={{ fontSize: 48, fontWeight: 800 }}>60%</div><div className="bar"><i style={{ width: '60%', background: '#fff' }} /></div><p>Deed search complete<br />Documents uploaded<br />Submit to Deeds Office</p></div></section>
    <div className="wrap"><h2 style={{ textAlign: 'center', fontSize: 36 }}>Tools built for real housing problems</h2>
      <div className="grid">{F.map(f => <Link key={f[0]} href={f[2]} className="card"><h3>{f[0]}</h3><p>{f[1]}</p></Link>)}</div></div></>);
}
