import type { Metadata } from 'next';

const defaultTitle = 'V Tasker Admin Panel';
const defaultDescription =
  'Manage V Tasker tasks, users, payments, disputes, reports, rewards, and moderation from one admin workspace.';

type MetaTagsOptions = {
  title?: string;
  description?: string;
};

export const buildMetaTags = ({ title, description }: MetaTagsOptions = {}): Metadata => ({
  title: title ?? {
    default: defaultTitle,
    template: '%s | V Tasker',
  },
  description: description ?? defaultDescription,
  applicationName: 'V Tasker',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
});
