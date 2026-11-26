import React, { useEffect, useState } from "react";
import GifCard from "./GifCard";

export function normalizeGifs(payload) {
  if (!payload || !Array.isArray(payload.data)) throw new Error('Invalid response');
  const seen = new Set();
  return payload.data.filter(item => {
    const url = item?.images?.fixed_height?.url;
    if (!item?.id || seen.has(item.id) || typeof url !== 'string') return false;
    try { if (new URL(url).protocol !== 'https:') return false; } catch { return false; }
    seen.add(item.id);
    return true;
  });
}

const Gifs = ({ search }) => {
  const [data, setData] = useState([]);
  const [status, setStatus] = useState('loading');
  const [attempt, setAttempt] = useState(0);
  const apiKey = process.env.REACT_APP_GIPHY_API_KEY;
  useEffect(() => {
    if (!apiKey) { setStatus('configuration'); return; }
    let active = true;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);
    setStatus('loading');
    setData([]);
    const params = new URLSearchParams({api_key: apiKey, limit: '25', rating: 'g'});
    if (search) params.set('q', search);
    async function load() {
      try {
        const response = await fetch(`https://api.giphy.com/v1/gifs/${search ? 'search' : 'trending'}?${params}`, {signal:controller.signal});
        if (!response.ok) throw new Error('Request failed');
        const gifs = normalizeGifs(await response.json());
        if (active) { setData(gifs); setStatus('ready'); }
      } catch {
        if (active) setStatus('error');
      } finally { clearTimeout(timer); }
    }
    load();
    return () => { active = false; clearTimeout(timer); controller.abort(); };
  }, [search, attempt, apiKey]);

  if (status === 'configuration') return <p role="status">GIF search is not configured for this deployment.</p>;
  if (status === 'loading') return <p role="status">Loading GIFs…</p>;
  if (status === 'error') return <div role="alert"><p>Could not load GIFs. Please try again.</p><button onClick={() => setAttempt(value => value + 1)}>Retry</button></div>;
  if (!data.length) return <p role="status">No GIFs found{search ? ` for “${search}”` : ''}. Try another search.</p>;
  return data.map(item => <GifCard key={item.id} item={item} />);
};
export default Gifs;
