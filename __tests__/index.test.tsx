import { render, screen } from '@testing-library/react';

import Home from '../src/pages/index';
import { trpc } from '~/utils/trpc';

import '@testing-library/jest-dom';

describe('Home', () => {
  it('renders a heading', () => {
    // Need to wrap the component in withTRPC to get the trpc context
    const HomeWithTrpc = trpc.withTRPC(Home);
    render(<HomeWithTrpc />);

    const heading = screen.getByRole('heading', {
      name: /Welcome to your tRPC with typegoose starter!/i,
    });

    expect(heading).toBeInTheDocument();
  });
});
