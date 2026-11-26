import React from 'react';
import {act, fireEvent, render, screen} from '@testing-library/react';
import GifCard from './GifCard';
const item={id:'cat',title:'Cat',images:{fixed_height:{url:'https://media.giphy.com/cat.gif'}}};
test('announces success only after the clipboard resolves', async () => {
  let finish;
  Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:jest.fn(() => new Promise(resolve => {finish=resolve;}))}});
  render(<GifCard item={item}/>);
  fireEvent.click(screen.getByRole('button',{name:'Copy link to Cat'}));
  expect(screen.getByRole('status').textContent).toBe('Copying…');
  expect(screen.getByRole('button').disabled).toBe(true);
  await act(async () => finish());
  expect(screen.getByRole('status').textContent).toBe('Link copied.');
  expect(navigator.clipboard.writeText).toHaveBeenCalledWith(item.images.fixed_height.url);
});
test('failed copying preserves a usable direct link', async () => {
  Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:jest.fn().mockRejectedValue(new Error('denied'))}});
  render(<GifCard item={item}/>);
  fireEvent.click(screen.getByRole('button'));
  expect(await screen.findByText(/Copy unavailable/)).toBeTruthy();
  expect(screen.getByRole('link').href).toBe(item.images.fixed_height.url);
});
