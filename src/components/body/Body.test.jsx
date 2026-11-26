import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Body from './Body';
test('Enter submits trimmed queries and Trending clears the form', () => {
  const setSearch = jest.fn();
  render(<Body setSearch={setSearch} />);
  userEvent.type(screen.getByRole('searchbox', { name: 'Search GIFs' }), '  cats  {enter}');
  expect(setSearch).toHaveBeenLastCalledWith('cats');
  userEvent.click(screen.getByRole('button', {name:'Trending'}));
  expect(setSearch).toHaveBeenLastCalledWith('');
  expect(screen.getByRole('searchbox').value).toBe('');
});
