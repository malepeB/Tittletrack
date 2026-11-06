export const RIGHTS = [
 { t: 'Illegal eviction', k: 'evict eviction landlord lock out', b: 'A landlord may not lock you out, cut services or remove your belongings without a court order. Only a court can order an eviction after hearing both sides.' },
 { t: 'Deposit disputes', k: 'deposit refund return', b: 'Your deposit must be held in an interest-bearing account. The landlord must inspect with you at move-in and move-out and refund the deposit plus interest, less proven damage.' },
 { t: 'Lease obligations', k: 'lease contract written rent increase', b: 'A lease can be written or oral and is still binding. Landlords must give proper notice and cannot change terms the lease does not allow.' },
 { t: 'Title deed and RDP houses', k: 'title deed rdp ownership registered', b: 'A title deed is the legal proof you own a property. Many RDP owners never received one. Check registration status at the Deeds Office and ask for help to register.' },
 { t: 'Bond and transfer costs', k: 'bond transfer costs attorney', b: 'Buying costs more than the price: transfer duty above the threshold, conveyancing fees, bond registration fees and deeds office charges.' },
 { t: 'FLISP subsidy', k: 'flisp subsidy first time buyer', b: 'The Finance Linked Individual Subsidy helps first-time buyers earning roughly R3 501 to R22 000 a month. You need a bond approval and apply through NHFC.' }];
export const DEEDS = [['Pretoria', -25.75, 28.19, 'Gauteng, Limpopo, Mpumalanga (north)'], ['Johannesburg', -26.2, 28.04, 'Gauteng (Witwatersrand)'], ['Cape Town', -33.92, 18.42, 'Western Cape'], ['Bloemfontein', -29.12, 26.2, 'Free State'], ['Kimberley', -28.74, 24.76, 'Northern Cape'], ['Pietermaritzburg', -29.6, 30.38, 'KwaZulu-Natal'], ['Mthatha', -31.59, 28.78, 'Eastern Cape (Transkei)'], ['Vryburg', -26.95, 24.73, 'North West']];
export const PROVINCES = ['Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape', 'Free State', 'Limpopo', 'Mpumalanga', 'North West', 'Northern Cape'];
export const FLOW = {
 deed: ['Gather ID and proof of ownership', 'Find your Deeds Office', 'Request deed search', 'Submit registration request', 'Collect your title deed'],
 flisp: ['Get bond pre-approval', 'Check eligibility here', 'Collect payslips and ID', 'Complete NHFC application', 'Submit and track outcome'],
 tribunal: ['Write down the dispute', 'Collect lease and proof', 'Complete complaint form', 'Submit to your provincial tribunal', 'Attend the hearing']};
export const FLOW_TITLES = { deed: 'Title deed registration', flisp: 'FLISP application', tribunal: 'Tribunal complaint' };
export const R = n => 'R ' + Math.round(n).toLocaleString('en-ZA');
export function localAnswer(q) {
  const l = q.toLowerCase(), w = l.split(/\W+/).filter(x => x.length > 3);
  const best = RIGHTS.map(r => [w.filter(x => (r.t + r.k).toLowerCase().includes(x)).length, r]).sort((a, b) => b[0] - a[0])[0];
  return best[0] ? `${best[1].t}: ${best[1].b}` : 'I am not sure about that. Try the Rights library or contact a legal advice office.';
}
