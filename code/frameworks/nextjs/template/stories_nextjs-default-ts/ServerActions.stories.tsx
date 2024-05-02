import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent } from '@storybook/test';
import { cookies } from '@storybook/nextjs/headers.mock';
import { revalidatePath } from '@storybook/nextjs/cache.mock';
import { redirect } from '@storybook/nextjs/navigation.mock';

import { accessRoute, login, logout } from './server-actions';

function Component() {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <form>
        <button type="submit" formAction={login}>
          Login
        </button>
      </form>
      <form>
        <button type="submit" formAction={logout}>
          Logout
        </button>
      </form>
      <form>
        <button type="submit" formAction={accessRoute}>
          Access protected route
        </button>
      </form>
    </div>
  );
}

export default {
  component: Component,
  parameters: {
    test: {
      // This is needed until Next will update to the React 19 beta: https://github.com/vercel/next.js/pull/65058
      // In the React 19 beta ErrorBoundary errors (such as redirect) are only logged, and not thrown.
      // We will also suspress console.error logs for re the console.error logs for redirect in the next framework.
      // Using the onCaughtError react root option:
      //   react: {
      //     rootOptions: {
      //       onCaughtError(error: unknown) {
      //         if (isNextRouterError(error)) return;
      //         console.error(error);
      //       },
      //     },
      // See: code/frameworks/nextjs/src/preview.tsx
      dangerouslyIgnoreUnhandledErrors: true,
    },
  },
} as Meta<typeof Component>;

export const Default: StoryObj<typeof Component> = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    const loginBtn = canvas.getByText('Login');
    const logoutBtn = canvas.getByText('Logout');
    const accessRouteBtn = canvas.getByText('Access protected route');

    await step('accessRoute flow - logged out', async () => {
      await userEvent.click(accessRouteBtn);
      await expect(cookies().get).toHaveBeenCalledWith('user');
      await expect(redirect).toHaveBeenCalledWith('/');
    });

    await step('accessRoute flow - logged', async () => {
      cookies.mockRestore();
      cookies().set('user', 'storybookjs');
      await userEvent.click(accessRouteBtn);
      await expect(cookies().get).toHaveBeenCalledWith('user');
      await expect(revalidatePath).toHaveBeenCalledWith('/');
      await expect(redirect).toHaveBeenCalledWith('/protected');
    });

    await step('logout flow', async () => {
      cookies.mockRestore();
      await userEvent.click(logoutBtn);
      await expect(cookies().delete).toHaveBeenCalled();
      await expect(revalidatePath).toHaveBeenCalledWith('/');
      await expect(redirect).toHaveBeenCalledWith('/');
    });

    await step('login flow', async () => {
      cookies.mockRestore();
      await userEvent.click(loginBtn);
      await expect(cookies().set).toHaveBeenCalledWith('user', 'storybookjs');
      await expect(revalidatePath).toHaveBeenCalledWith('/');
      await expect(redirect).toHaveBeenCalledWith('/');
    });
  },
};
