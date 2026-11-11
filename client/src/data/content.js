export const ORG = {
  name: 'Karnataka Human Rights Public Service Committee', short: 'KHRPSC',
  person: 'Samartha S Gowda', phone: '9743930128', email: 'thekhrpsc@gmail.com',
  address: '#572, 1st D Main, Vinayaka Layout, Nagrabhavi, near Hanumagiri Temple, Bangalore - 560072',
  mission: 'Humanitarian aid for families in need, and a legal voice for the innocent who have been falsely accused. Strictly non-political.',
};
export const NAV = [['Mission', 'mission'], ['Work', 'work'], ['Process', 'journey'], ['Principles', 'stories'], ['Events', 'events'], ['Contact', 'contact']];

export const MANIFESTO = [
  { text: 'Every person deserves dignity, justice and a voice.', to: 1 },
  { text: 'When hardship or a false accusation takes those away, we step in with practical help and committed advocacy, without politics, until they are restored.', to: 0.55 },
];

// PLACEHOLDER FIGURES: replace with verified numbers before the site goes live.
export const IMPACT = [
  { to: 10000, suffix: '+', label: 'People reached', note: 'Families and individuals who have received our support.' },
  { to: 250, suffix: '+', label: 'Cases supported', note: 'Legal guidance and advocacy for the falsely accused.' },
  { to: 50, suffix: '+', label: 'Community initiatives', note: 'Outreach programs and support events held in person.' },
  { to: 25, suffix: '+', label: 'Years of service', note: 'A sustained commitment to the people of Karnataka.' },
];

export const PROGRAMS = [
  { category: 'Humanitarian aid', title: 'Humanitarian Assistance', art: 'arcs', topic: 'aid', indicator: 'For families in hardship',
    text: 'Direct financial aid and social welfare support for individuals and families facing hardship.',
    more: 'Reach us by phone, email or in person at our Bengaluru office.' },
  { category: 'Legal and advocacy', title: 'Legal & Advocacy Support', art: 'columns', topic: 'legal', indicator: 'For the falsely accused',
    text: 'Guidance and advocacy for innocent individuals who have been falsely accused, so they can pursue justice.',
    more: 'Tell us what happened. We listen first, then advise on the way forward.' },
  { category: 'Community', title: 'Community Outreach', art: 'nodes', topic: 'volunteer', indicator: 'Outreach and support events',
    text: 'Outreach programs and support events that bring help and awareness directly to communities.',
    more: 'Volunteers are welcome at every event we organise.' },
];

// Edit freely: this describes how a request moves through the Committee.
export const STEPS = [
  { t: 'A call for help', d: 'Someone reaches us by phone, email or in person at our Bengaluru office. Every request is received with respect.', art: 'rings' },
  { t: 'We listen and understand', d: 'We hear the whole story and understand the situation before promising anything.', art: 'nodes' },
  { t: 'We stand beside you', d: 'Financial aid, social welfare support, or legal guidance and advocacy, depending on what is needed.', art: 'columns' },
  { t: 'Support that continues', d: 'We stay in touch, and carry help into communities through outreach programs and events.', art: 'arcs' },
];

// Shown until real, consented testimonials are added in reviews.js
export const COMMITMENTS = [
  { quote: 'Our approach is strictly non-political and humanitarian.', name: 'Our principle', role: 'Non-political' },
  { quote: 'No one should stand alone against a false charge.', name: 'Our promise', role: 'Legal and advocacy support' },
  { quote: 'We take help to where communities are, through outreach and support events.', name: 'Our way of working', role: 'Community outreach' },
];

// Add real profile URLs here; the footer renders only entries that exist.
export const SOCIALS = [/* { label: 'Instagram', href: 'https://…' } */];
export const LEGAL = [{ label: 'Privacy', href: '#' }, { label: 'Terms', href: '#' }];
