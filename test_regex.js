const str = 'className="bg-brand-card/80 border-purple-950/20 text-zinc-300 bg-zinc-900 dark:bg-zinc-900"';

let res = str;
const mappings = [
  { pattern: /(?<!dark:)bg-brand-card(?!\/)/g, replacement: 'bg-white dark:bg-brand-card shadow-sm dark:shadow-none' },
  { pattern: /(?<!dark:)bg-brand-card\/([0-9]+)/g, replacement: 'bg-white dark:bg-brand-card/$1 shadow-sm dark:shadow-none' },
  { pattern: /(?<!dark:)bg-zinc-900/g, replacement: 'bg-slate-50 dark:bg-zinc-900' },
  { pattern: /(?<!dark:)bg-zinc-950(?!\/)/g, replacement: 'bg-slate-100 dark:bg-zinc-950' },
  { pattern: /(?<!dark:)bg-zinc-950\/([0-9]+)/g, replacement: 'bg-slate-100 dark:bg-zinc-950/$1' },
  { pattern: /(?<!dark:)bg-zinc-800(?!\/)/g, replacement: 'bg-slate-100 dark:bg-zinc-800' },
  { pattern: /(?<!dark:)bg-zinc-800\/([0-9]+)/g, replacement: 'bg-slate-100 dark:bg-zinc-800/$1' },
  { pattern: /(?<!dark:)border-zinc-800(?!\/)/g, replacement: 'border-slate-200 dark:border-zinc-800' },
  { pattern: /(?<!dark:)border-zinc-800\/([0-9]+)/g, replacement: 'border-slate-200 dark:border-zinc-800/$1' },
  { pattern: /(?<!dark:)border-zinc-700/g, replacement: 'border-slate-300 dark:border-zinc-700' },
  { pattern: /(?<!dark:)border-purple-950\/([0-9]+)/g, replacement: 'border-slate-200 dark:border-purple-950/$1' },
  { pattern: /(?<!dark:)text-zinc-200/g, replacement: 'text-slate-800 dark:text-zinc-200' },
  { pattern: /(?<!dark:)text-zinc-250/g, replacement: 'text-slate-700 dark:text-zinc-250' },
  { pattern: /(?<!dark:)text-zinc-300/g, replacement: 'text-slate-700 dark:text-zinc-300' },
  { pattern: /(?<!dark:)text-zinc-400/g, replacement: 'text-slate-600 dark:text-zinc-400' },
  { pattern: /(?<!dark:)text-zinc-500/g, replacement: 'text-slate-500 dark:text-zinc-500' },
  { pattern: /(?<!dark:)bg-black\/([0-9]+)/g, replacement: 'bg-slate-100 dark:bg-black/$1' },
];

mappings.forEach(m => {
  res = res.replace(m.pattern, m.replacement);
});
console.log(res);
