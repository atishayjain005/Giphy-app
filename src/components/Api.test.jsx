import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import Gifs, { normalizeGifs } from './Api';
const gif = name => ({id:name,title:name,images:{fixed_height:{url:`https://media.giphy.com/${name}.gif`}}});
const response = data => ({ok:true,json:async () => ({data})});
beforeEach(() => { process.env.REACT_APP_GIPHY_API_KEY='test-key'; global.fetch=jest.fn(); });
afterEach(() => { delete process.env.REACT_APP_GIPHY_API_KEY; jest.useRealTimers(); });
test('missing configuration does not send a request', async () => {
  delete process.env.REACT_APP_GIPHY_API_KEY;
  render(<Gifs search=""/>);
  expect(await screen.findByText(/not configured/)).toBeTruthy();
  expect(fetch).not.toHaveBeenCalled();
});
test('filters malformed and duplicate results', () => {
  expect(normalizeGifs({data:[null, {}, gif('cat'), gif('cat'), {id:'bad',images:{fixed_height:{url:'http://unsafe.example/gif'}}}]})).toEqual([gif('cat')]);
  expect(() => normalizeGifs({data:null})).toThrow();
});
test('shows errors and supports retry to an empty result', async () => {
  fetch.mockResolvedValueOnce({ok:false}).mockResolvedValueOnce(response([]));
  render(<Gifs search="cat"/>);
  fireEvent.click(await screen.findByText('Retry'));
  expect(await screen.findByText(/No GIFs found/)).toBeTruthy();
  expect(fetch).toHaveBeenCalledTimes(2);
});
test('late prior response cannot overwrite a new search', async () => {
  let finishOld;
  fetch.mockImplementationOnce(() => new Promise(resolve => {finishOld=resolve;})).mockResolvedValueOnce(response([gif('new')]));
  const {rerender}=render(<Gifs search="old"/>);
  const signal=fetch.mock.calls[0][1].signal;
  rerender(<Gifs search="new"/>);
  expect(await screen.findByAltText('new')).toBeTruthy();
  await act(async () => finishOld(response([gif('old')])));
  expect(screen.queryByAltText('old')).toBeNull();
  expect(signal.aborted).toBe(true);
});
test('aborted timeout exposes retry', async () => {
  jest.useFakeTimers();
  fetch.mockImplementation((url,{signal}) => new Promise((resolve,reject) => signal.addEventListener('abort', () => reject(new Error('aborted')))));
  render(<Gifs search=""/>);
  await act(async () => jest.advanceTimersByTime(12000));
  expect(screen.getByText('Retry')).toBeTruthy();
});
