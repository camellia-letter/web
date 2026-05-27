'use client';

import { ReactNode } from "react";
import { createTheme, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { colors } from "@/styles/theme";

const theme = createTheme({
  colors,
  primaryColor: 'pink',
  defaultRadius: 'md',
  fontFamily: 'var(--font-maru-buri)',
  headings: {
    fontFamily: 'var(--font-maru-buri)',
  },
});

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <MantineProvider theme={theme}>
      <Notifications position="top-center" />
      {children}
    </MantineProvider>
  );
};
