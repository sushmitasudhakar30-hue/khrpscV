import { useState } from 'react';
import Mark from './Mark.jsx';

// Official KHRPSC emblem. The image lives at client/public/khrpsc-logo.png.
// If the file is missing, the original line-drawn scales mark is shown instead.
export default function Logo({ className = 'h-10 w-10' }) {
  const [missing, setMissing] = useState(false);
  if (missing) return <Mark className={className} />;
  return (
    <img src="/khrpsc-logo.png" alt="KHRPSC emblem" onError={() => setMissing(true)}
      className={`${className} shrink-0 rounded-full object-contain`} />
  );
}