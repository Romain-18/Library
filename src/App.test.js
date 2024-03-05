import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter, Route } from 'react-router-dom';
import App from './App';
import AdvancedSearch from './pages/rechercheAvancée';
import WorkPage from './pages/oeuvresPage';
import Search from './pages/recherche';

jest.setTimeout(60000);

describe('App', () => {
  it('displays the header and footer', () => {
    render(<App />);

    expect(screen.getByText('Library')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Advanced Search/i })).toBeInTheDocument();
    expect(screen.getByText('2023 Library. all rights reserved.')).toBeInTheDocument();
  });

  it('switches to dark mode when the button is clicked', () => {
    render(<App />);
    const darkModeSwitch = screen.getByRole('switch');
    fireEvent.click(darkModeSwitch);
    expect(document.body.classList.contains('darkMode')).toBe(false);
  });
});

describe('AdvancedSearch', () => {
  it('correctly displays the search form', () => {
    render(<AdvancedSearch />);
    expect(screen.getByPlaceholderText('Title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Author')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Type')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
  });

  it('updates the states when typing in the search fields', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AdvancedSearch />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Title'), { target: { value: 'The Lord of the Rings' } });
    fireEvent.change(screen.getByPlaceholderText('Author'), { target: { value: 'J.R.R. Tolkien' } });
    fireEvent.change(screen.getByPlaceholderText('Type'), { target: { value: 'Fantasy' } });
    expect(screen.getByDisplayValue('The Lord of the Rings')).toBeInTheDocument();
    expect(screen.getByDisplayValue('J.R.R. Tolkien')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Fantasy')).toBeInTheDocument();

    await waitFor(() => {
      const books = screen.getAllByText(/No results found/i);
      expect(books).toHaveLength(1);
    }, { timeout: 10000 });
  });
});

describe('WorkPage', () => {
  it('displays "Loading..." during loading', () => {
    render(<WorkPage />, { wrapper: MemoryRouter });
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});

describe('Search', () => {
  it('displays an error message in case of search error', async () => {
    jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Search error'));

    render(
      <MemoryRouter initialEntries={['/search?term=Harry+Potter']}>
        <Search />
      </MemoryRouter>
    );

    expect(await screen.findByText('An error occurred while searching.')).toBeInTheDocument();
  });

  it('displays search results', async () => {
    const mockData = {
      docs: [
        {
          key: '123',
          title: 'Harry Potter and the Philosopher\'s Stone',
          cover_i: '456',
          author_name: ['J.K. Rowling'],
        },
        {
          key: '789',
          title: 'Harry Potter and the Chamber of Secrets',
          cover_i: '101',
          author_name: ['J.K. Rowling'],
        },
      ],
    };

    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: async () => mockData,
    });

    render(
      <MemoryRouter initialEntries={['/search?term=Harry+Potter']}>
        <Search />
      </MemoryRouter>
    );

    expect(await screen.findByText('Harry Potter and the Philosopher\'s Stone')).toBeInTheDocument();
    expect(screen.getByText('Harry Potter and the Chamber of Secrets')).toBeInTheDocument();
  });

  it('displays a message if no result is found', async () => {
    const mockData = { docs: [] };

    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: async () => mockData,
    });

    render(
      <MemoryRouter initialEntries={['/search?term=NonexistentTerm']}>
        <Search />
      </MemoryRouter>
    );

    expect(await screen.findByText('No results found.')).toBeInTheDocument();
  });
});
