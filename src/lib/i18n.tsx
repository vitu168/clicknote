'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export type Language = 'en' | 'km';

const translations = {
  en: {
    // Sidebar groups
    'group.workspace':     'Workspace',
    'group.insights':      'Insights',
    'group.communication': 'Communication',
    // Nav items
    'nav.dashboard':     'Dashboard',
    'nav.notes':         'Notes',
    'nav.favorites':     'Favorites',
    'nav.archive':       'Archive',
    'nav.calendar':      'Calendar',
    'nav.analytics':     'Analytics',
    'nav.members':       'Members',
    'nav.messenger':     'Messenger',
    'nav.notifications': 'Notifications',
    'nav.settings':      'Settings',
    'nav.profile':       'Profile',
    // Header page descriptions
    'desc.dashboard':     'Overview of your workspace',
    'desc.notes':         'Capture ideas and tasks',
    'desc.favorites':     'Your starred notes',
    'desc.archive':       'Notes you have archived',
    'desc.analytics':     'Usage and performance',
    'desc.users':         'People on the platform',
    'desc.messenger':     'Stay connected',
    'desc.notifications': 'Recent activity',
    'desc.profile':       'Your public profile',
    'desc.settings':      'Manage your preferences',
    // Header actions
    'action.search':         'Search',
    'action.sign_out':       'Sign out',
    'action.your_profile':   'Your profile',
    'action.settings':       'Settings',
    'action.change_color':   'Change accent color',
    'action.dark_mode':      'Switch to dark mode',
    'action.light_mode':     'Switch to light mode',
    'action.active':         'Active',
    // Settings
    'settings.appearance':        'Appearance',
    'settings.appearance_desc':   'Customize the look of your workspace',
    'settings.accent_color':      'Accent Color',
    'settings.language':          'Language',
    'settings.language_desc':     'Choose your preferred language',
    'settings.profile':           'Profile Information',
    'settings.profile_desc':      'Update your personal details',
    'settings.notifications':     'Notification Preferences',
    'settings.notifications_desc':'Choose what you want to be notified about',
    // Languages
    'lang.en': 'English',
    'lang.km': 'Khmer',
    // Buttons
    'btn.new_note':   'New Note',
    'btn.save':       'Save Changes',
    'btn.saving':     'Saving…',
    'btn.cancel':     'Cancel',
    'btn.refresh':    'Refresh',
    'btn.all_notes':  'All Notes',
    'btn.favorites':  'Favorites',
    // Greeting
    'greeting.morning':   'Good morning',
    'greeting.afternoon': 'Good afternoon',
    'greeting.evening':   'Good evening',
    // Misc
    'misc.loading': 'Loading your workspace…',
  },
  km: {
    // Sidebar groups
    'group.workspace':     'កន្លែងធ្វើការ',
    'group.insights':      'ការយល់ដឹង',
    'group.communication': 'ការទំនាក់ទំនង',
    // Nav items
    'nav.dashboard':     'ផ្ទាំងគ្រប់គ្រង',
    'nav.notes':         'កំណត់ចំណាំ',
    'nav.favorites':     'បញ្ជីចូលចិត្ត',
    'nav.archive':       'ប័ណ្ណសារ',
    'nav.calendar':      'ប្រតិទិន',
    'nav.analytics':     'ការវិភាគ',
    'nav.members':       'សមាជិក',
    'nav.messenger':     'សារ',
    'nav.notifications': 'ការជូនដំណឹង',
    'nav.settings':      'ការកំណត់',
    'nav.profile':       'ប្រវត្តិរូប',
    // Header page descriptions
    'desc.dashboard':     'ទិដ្ឋភាពរួមនៃកន្លែងធ្វើការ',
    'desc.notes':         'ចាប់យកគំនិតនិងភារកិច្ច',
    'desc.favorites':     'កំណត់ចំណាំដែលអ្នកចូលចិត្ត',
    'desc.archive':       'កំណត់ចំណាំដែលបានរក្សា',
    'desc.analytics':     'ការប្រើប្រាស់និងដំណើរការ',
    'desc.users':         'មនុស្សនៅលើវេទិកា',
    'desc.messenger':     'ទំនាក់ទំនងជានិច្ច',
    'desc.notifications': 'សកម្មភាពថ្មីៗ',
    'desc.profile':       'ប្រវត្តិរូបសាធារណៈ',
    'desc.settings':      'គ្រប់គ្រងចំណូលចិត្ត',
    // Header actions
    'action.search':         'ស្វែងរក',
    'action.sign_out':       'ចាកចេញ',
    'action.your_profile':   'ប្រវត្តិរូបខ្ញុំ',
    'action.settings':       'ការកំណត់',
    'action.change_color':   'ប្តូរពណ៌សំខាន់',
    'action.dark_mode':      'ប្តូរទៅរបៀបងងឹត',
    'action.light_mode':     'ប្តូរទៅរបៀបភ្លឺ',
    'action.active':         'សកម្ម',
    // Settings
    'settings.appearance':        'រូបរាង',
    'settings.appearance_desc':   'តុបតែងរូបរាងកន្លែងធ្វើការ',
    'settings.accent_color':      'ពណ៌សំខាន់',
    'settings.language':          'ភាសា',
    'settings.language_desc':     'ជ្រើសរើសភាសាដែលអ្នកចូលចិត្ត',
    'settings.profile':           'ព័ត៌មានប្រវត្តិរូប',
    'settings.profile_desc':      'ធ្វើបច្ចុប្បន្នភាពព័ត៌មានផ្ទាល់ខ្លួន',
    'settings.notifications':     'ចំណូលចិត្តការជូនដំណឹង',
    'settings.notifications_desc':'ជ្រើសសកម្មភាពដែលអ្នកចង់ទទួលការជូនដំណឹង',
    // Languages
    'lang.en': 'ភាសាអង់គ្លេស',
    'lang.km': 'ភាសាខ្មែរ',
    // Buttons
    'btn.new_note':   'កំណត់ចំណាំថ្មី',
    'btn.save':       'រក្សាទុក',
    'btn.saving':     'កំពុងរក្សា…',
    'btn.cancel':     'បោះបង់',
    'btn.refresh':    'ធ្វើឡើងវិញ',
    'btn.all_notes':  'ទាំងអស់',
    'btn.favorites':  'ចូលចិត្ត',
    // Greeting
    'greeting.morning':   'អរុណសួស្តី',
    'greeting.afternoon': 'ទិវាសួស្តី',
    'greeting.evening':   'សាយណ្ហសួស្តី',
    // Misc
    'misc.loading': 'កំពុងផ្ទុក…',
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

interface I18nContextValue {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextValue>({
  lang: 'en',
  setLang: () => {},
  t: (key) => translations.en[key],
});

export function useI18n() {
  return useContext(I18nContext);
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('lang') as Language | null;
    const initial: Language = saved === 'km' ? 'km' : 'en';
    apply(initial);
    setLangState(initial);
  }, []);

  function setLang(l: Language) {
    setLangState(l);
    localStorage.setItem('lang', l);
    apply(l);
  }

  function t(key: TranslationKey): string {
    return (translations[lang] as Record<string, string>)[key] ?? translations.en[key];
  }

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

function apply(lang: Language) {
  document.documentElement.setAttribute('data-lang', lang);
}
