export function useSetupDarkMode(): void {
  const darkMode: string | null = localStorage.getItem('dark-mode');
  const body = document.querySelector('body');

  body?.classList.remove('dark');
  body?.classList.remove('bg-slate-700');
  body?.classList.add('bg-gray-100');

  if (darkMode && darkMode === 'yes') {
    body?.classList.add('dark');
    body?.classList.remove('bg-gray-100');
    body?.classList.add('bg-slate-700');
  }
}
