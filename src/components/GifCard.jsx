import React, { useEffect, useRef, useState } from 'react';
export default function GifCard({ item }) {
  const [state, setState] = useState('idle');
  const mounted = useRef(true);
  const busy = useRef(false);
  useEffect(() => () => { mounted.current = false; }, []);
  const url = item.images.fixed_height.url;
  const title = item.title || 'Untitled GIF';
  async function copy() {
    if (busy.current) return;
    busy.current = true;
    setState('copying');
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Unavailable');
      await navigator.clipboard.writeText(url);
      if (mounted.current) setState('copied');
    } catch {
      if (mounted.current) setState('failed');
    } finally { busy.current = false; }
  }
  return <article className="gif">
    <img src={url} alt={title} loading="lazy" />
    <button onClick={copy} aria-label={`Copy link to ${title}`} disabled={state === 'copying'}>Copy GIF link</button>
    <p role="status">{state === 'copying' ? 'Copying…' : state === 'copied' ? 'Link copied.' : state === 'failed' ? 'Copy unavailable. Open the GIF to copy its address.' : ''}</p>
    <a href={url} target="_blank" rel="noreferrer">Open GIF<span className="sr-only">: {title} (new tab)</span></a>
  </article>;
}
