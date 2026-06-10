'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export type Language = 'en' | 'km';

const translations = {
  en: {
    // ── Sidebar groups ──
    'group.workspace':     'Workspace',
    'group.insights':      'Insights',
    'group.communication': 'Communication',
    // ── Nav items ──
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
    // ── Header page descriptions ──
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
    // ── Header actions ──
    'action.search':         'Search',
    'action.sign_out':       'Sign out',
    'action.your_profile':   'Your profile',
    'action.settings':       'Settings',
    'action.change_color':   'Change accent color',
    'action.dark_mode':      'Switch to dark mode',
    'action.light_mode':     'Switch to light mode',
    'action.active':         'Active',
    // ── Settings ──
    'settings.appearance':        'Appearance',
    'settings.appearance_desc':   'Customize the look of your workspace',
    'settings.accent_color':      'Accent Color',
    'settings.accent_hint':       'Highlight color used across the entire workspace.',
    'settings.language':          'Language',
    'settings.language_desc':     'Choose your preferred language',
    'settings.profile':           'Profile Information',
    'settings.profile_desc':      'Update your personal details',
    'settings.notifications':     'Notification Preferences',
    'settings.notifications_desc':'Choose what you want to be notified about',
    'settings.my_account':        'My Account',
    'settings.account_desc':      'Manage your personal information and avatar.',
    'settings.notif_desc':        'Control which events send you an alert.',
    'settings.appearance_desc2':  'Customize colors and theme to suit your taste.',
    'settings.language_desc2':    'Set the display language for the interface.',
    'settings.security':          'Security',
    'settings.security_desc':     'Update your password and manage active sessions.',
    'settings.personal_group':    'Personal',
    'settings.workspace_group':   'Workspace',
    'settings.preferences':       'Preferences',
    'settings.theme_label':       'Theme',
    'settings.theme_hint':        'Choose how the interface looks.',
    'settings.light':             'Light',
    'settings.dark':              'Dark',
    'settings.display_lang':      'Display Language',
    'settings.lang_hint':         'Select the language used throughout the interface.',
    'settings.change_password':   'Change Password',
    'settings.password_hint':     "Use a strong password you don't use elsewhere.",
    'settings.current_password':  'Current password',
    'settings.new_password':      'New password',
    'settings.confirm_password':  'Confirm password',
    'settings.update_password':   'Update password',
    'settings.active_sessions':   'Active Sessions',
    'settings.sessions_hint':     "Devices where you're currently signed in.",
    'settings.current_session':   'Current',
    'settings.revoke':            'Revoke',
    // ── Languages ──
    'lang.en': 'English',
    'lang.km': 'Khmer',
    // ── Buttons / actions ──
    'btn.new_note':   'New Note',
    'btn.save':       'Save Changes',
    'btn.saving':     'Saving…',
    'btn.cancel':     'Cancel',
    'btn.refresh':    'Refresh',
    'btn.all_notes':  'All Notes',
    'btn.favorites':  'Favorites',
    // ── Greeting ──
    'greeting.morning':   'Good morning',
    'greeting.afternoon': 'Good afternoon',
    'greeting.evening':   'Good evening',
    // ── Dashboard stats ──
    'stat.my_notes':       'My Notes',
    'stat.favorites':      'Favorites',
    'stat.total_members':  'Total Members',
    'stat.active_members': 'Active Members',
    'stat.this_month':     'this month',
    // ── Charts ──
    'chart.monthly_title':    'Monthly Notes Activity',
    'chart.monthly_subtitle': 'Notes created vs starred per month',
    'chart.workspace_title':  'Workspace Overview',
    'chart.workspace_sub':    'Note & member breakdown',
    'chart.center':           'Items',
    'chart.notes':            'Notes',
    'chart.regular_notes':    'Regular Notes',
    'chart.favorite_notes':   'Favorite Notes',
    'chart.other_members':    'Other Members',
    'chart.count':            'Count',
    // ── Dashboard widgets ──
    'widget.recent_notes':     'Recent Notes',
    'widget.recent_notes_sub': 'Latest activity across all notes',
    'widget.active_users':     'Active Users',
    'widget.active_users_sub': 'Users registered in the workspace',
    'widget.no_notes':         'No notes yet',
    'widget.no_users':         'No users yet',
    'widget.no_description':   'No description',
    'widget.untitled':         'Untitled',
    // ── Time ──
    'time.just_now':  'just now',
    'time.m_ago':     'm ago',
    'time.h_ago':     'h ago',
    'time.d_ago':     'd ago',
    // ── Notes page ──
    'notes.no_match':    'No notes match your search.',
    'notes.no_favorites':'No favorite notes yet.',
    'notes.empty':       'No notes yet.',
    'notes.create_first':'Create your first note',
    'notes.create':      'Create Note',
    'notes.update':      'Update Note',
    // ── Favorites page ──
    'favorites.no_match': 'No favorites match your search.',
    'favorites.empty':    'You have not starred any notes yet.',
    // ── Archive page ──
    'archive.no_match': 'No archived notes match your search.',
    'archive.empty':    'Nothing archived yet.',
    // ── Members page ──
    'users.search':    'Search members…',
    'users.no_match':  'No members match your search.',
    'users.empty':     'No members found.',
    // ── Confirm dialog ──
    'dialog.please_wait':          'Please wait…',
    'dialog.delete':               'Delete',
    'dialog.delete_note_title':    'Delete note',
    'dialog.delete_note_desc':     'This note will be permanently deleted and cannot be recovered.',
    'dialog.delete_member_title':  'Delete member',
    'dialog.delete_member_desc':   'This member profile will be permanently deleted and cannot be recovered.',
    // ── Pagination ──
    'pagination.rows_per_page': 'Rows per page',
    'pagination.showing':       'Showing',
    'pagination.of':            'of',
    'pagination.records':       'records',
    'pagination.page':          'Page',
    // ── Messenger ──
    'messenger.title':        'Messages',
    'messenger.contact':      'contact',
    'messenger.contacts':     'contacts',
    'messenger.search':       'Search contacts…',
    'messenger.no_found':     'No contacts found.',
    'messenger.no_users':     'No users to chat with.',
    'messenger.new_message':  'New message',
    'messenger.your_messages':'Your Messages',
    'messenger.select_prompt':'Select a contact on the left to start a conversation',
    'messenger.realtime':     'Real-time powered by Supabase',
    'messenger.active_now':   'Active now',
    'messenger.loading':      'Loading contacts…',
    'messenger.no_messages':  'No messages yet',
    'messenger.say_hello':    'Say hello to',
    'messenger.deleted':      'This message was deleted',
    'messenger.placeholder':  'Type a message…',
    'messenger.today':        'Today',
    'messenger.yesterday':    'Yesterday',
    // ── Calendar ──
    'calendar.today':         'Today',
    'calendar.tomorrow':      'Tomorrow',
    'calendar.days_short':    'd',
    'calendar.no_events_day': 'No events on this day',
    'calendar.month_events':  'Events',
    'calendar.holiday':       'holiday',
    'calendar.holidays':      'holidays',
    'calendar.no_holidays':   'No holidays this month',
    'calendar.upcoming':      'Upcoming Holidays',
    'calendar.next':          'Next',
    'calendar.events':        'events',
    'calendar.legend':        'Legend',
    'calendar.more':          'more',
    // ── Profile page ──
    'profile.edit':           'Edit profile',
    'profile.joined':         'Joined',
    'profile.active_member':  'Active member',
    'profile.stat_notes':     'Notes',
    'profile.stat_favorites': 'Favourites',
    'profile.member_since':   'Member since',
    'profile.my_notes':       'My Notes',
    'profile.recent_desc':    'Your most recent captures',
    'profile.view_all':       'View all',
    'profile.no_notes':       'No notes yet',
    'profile.start_capturing':'Start capturing your ideas',
    'profile.create_first':   'Create your first note',
    // ── Profile settings ──
    'ps.full_name':      'Full Name',
    'ps.email':          'Email Address',
    'ps.photo_hint':     'JPG, PNG or GIF · Max 5 MB',
    'ps.your_name':      'Your Name',
    'ps.full_name_placeholder': 'Your full name',
    'ps.save':           'Save changes',
    'ps.saving':         'Saving…',
    'ps.saved':          'Saved',
    // ── Notification settings ──
    'notif.new_note_label':     'New Note Created',
    'notif.new_note_desc':      'Get notified when a new note is added to the workspace',
    'notif.mention_label':      'Note Mentions',
    'notif.mention_desc':       'Alert when someone mentions you in a note',
    'notif.message_label':      'New Messages',
    'notif.message_desc':       'Notify when you receive a new chat message',
    'notif.favorite_label':     'Favorites Activity',
    'notif.favorite_desc':      'When a note you favorited is updated or deleted',
    'notif.new_user_label':     'New User Joined',
    'notif.new_user_desc':      'Alert when a new user registers in the workspace',
    'notif.deleted_label':      'Note Deleted',
    'notif.deleted_desc':       'Notify when a note you created is deleted',
    // ── NoteCard / table headers ──
    'table.name':        'NAME',
    'table.description': 'DESCRIPTION',
    'table.updated':     'UPDATED',
    'table.status':      'STATUS',
    'table.user':        'USER',
    'table.email':       'EMAIL',
    'table.joined':      'JOINED',
    // ── Misc ──
    'misc.loading': 'Loading your workspace…',
    'misc.active':  'Active',
  },
  km: {
    // ── Sidebar groups ──
    'group.workspace':     'កន្លែងធ្វើការ',
    'group.insights':      'ការយល់ដឹង',
    'group.communication': 'ការទំនាក់ទំនង',
    // ── Nav items ──
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
    // ── Header page descriptions ──
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
    // ── Header actions ──
    'action.search':         'ស្វែងរក',
    'action.sign_out':       'ចាកចេញ',
    'action.your_profile':   'ប្រវត្តិរូបខ្ញុំ',
    'action.settings':       'ការកំណត់',
    'action.change_color':   'ប្ដូរពណ៌សំខាន់',
    'action.dark_mode':      'ប្ដូរទៅរបៀបងងឹត',
    'action.light_mode':     'ប្ដូរទៅរបៀបភ្លឺ',
    'action.active':         'សកម្ម',
    // ── Settings ──
    'settings.appearance':        'រូបរាង',
    'settings.appearance_desc':   'តុបតែងរូបរាងកន្លែងធ្វើការ',
    'settings.accent_color':      'ពណ៌សំខាន់',
    'settings.accent_hint':       'ពណ៌សំខាន់ប្រើក្នុងកន្លែងធ្វើការទាំងមូល',
    'settings.language':          'ភាសា',
    'settings.language_desc':     'ជ្រើសរើសភាសាដែលអ្នកចូលចិត្ត',
    'settings.profile':           'ព័ត៌មានប្រវត្តិរូប',
    'settings.profile_desc':      'ធ្វើបច្ចុប្បន្នភាពព័ត៌មានផ្ទាល់ខ្លួន',
    'settings.notifications':     'ចំណូលចិត្តការជូនដំណឹង',
    'settings.notifications_desc':'ជ្រើសសកម្មភាពដែលអ្នកចង់ទទួលការជូនដំណឹង',
    'settings.my_account':        'គណនីរបស់ខ្ញុំ',
    'settings.account_desc':      'គ្រប់គ្រងព័ត៌មានផ្ទាល់ខ្លួននិងរូបភាព',
    'settings.notif_desc':        'គ្រប់គ្រងការជូនដំណឹងដែលអ្នកចង់ទទួល',
    'settings.appearance_desc2':  'តុបតែងពណ៌និងស្បែកទៅតាមចំណូលចិត្ត',
    'settings.language_desc2':    'កំណត់ភាសាបង្ហាញក្នុងចំណុចប្រទាក់',
    'settings.security':          'សុវត្ថិភាព',
    'settings.security_desc':     'ធ្វើបច្ចុប្បន្នភាពពាក្យសម្ងាត់និងគ្រប់គ្រងវគ្គ',
    'settings.personal_group':    'ផ្ទាល់ខ្លួន',
    'settings.workspace_group':   'កន្លែងធ្វើការ',
    'settings.preferences':       'ចំណូលចិត្ត',
    'settings.theme_label':       'ស្បែក',
    'settings.theme_hint':        'ជ្រើសរូបរាងចំណុចប្រទាក់',
    'settings.light':             'ភ្លឺ',
    'settings.dark':              'ងងឹត',
    'settings.display_lang':      'ភាសាបង្ហាញ',
    'settings.lang_hint':         'ជ្រើសភាសាប្រើក្នុងចំណុចប្រទាក់',
    'settings.change_password':   'ប្ដូរពាក្យសម្ងាត់',
    'settings.password_hint':     'ប្រើពាក្យសម្ងាត់ខ្លាំងដែលមិនប្រើនៅកន្លែងផ្សេង',
    'settings.current_password':  'ពាក្យសម្ងាត់បច្ចុប្បន្ន',
    'settings.new_password':      'ពាក្យសម្ងាត់ថ្មី',
    'settings.confirm_password':  'បញ្ជាក់ពាក្យសម្ងាត់',
    'settings.update_password':   'ធ្វើបច្ចុប្បន្នភាពពាក្យសម្ងាត់',
    'settings.active_sessions':   'វគ្គសកម្ម',
    'settings.sessions_hint':     'ឧបករណ៍ដែលអ្នកបានចូលស្ថាប័ន',
    'settings.current_session':   'បច្ចុប្បន្ន',
    'settings.revoke':            'លុបចោល',
    // ── Languages ──
    'lang.en': 'ភាសាអង់គ្លេស',
    'lang.km': 'ភាសាខ្មែរ',
    // ── Buttons / actions ──
    'btn.new_note':   'កំណត់ចំណាំថ្មី',
    'btn.save':       'រក្សាទុក',
    'btn.saving':     'កំពុងរក្សា…',
    'btn.cancel':     'បោះបង់',
    'btn.refresh':    'ធ្វើឡើងវិញ',
    'btn.all_notes':  'ទាំងអស់',
    'btn.favorites':  'ចូលចិត្ត',
    // ── Greeting ──
    'greeting.morning':   'អរុណសួស្ដី',
    'greeting.afternoon': 'ទិវាសួស្ដី',
    'greeting.evening':   'សាយណ្ហសួស្ដី',
    // ── Dashboard stats ──
    'stat.my_notes':       'កំណត់ចំណាំរបស់ខ្ញុំ',
    'stat.favorites':      'ចូលចិត្ត',
    'stat.total_members':  'សមាជិកសរុប',
    'stat.active_members': 'សមាជិកសកម្ម',
    'stat.this_month':     'ខែនេះ',
    // ── Charts ──
    'chart.monthly_title':    'សកម្មភាពប្រចាំខែ',
    'chart.monthly_subtitle': 'កំណត់ចំណាំបង្កើតធៀបនឹងដាក់ផ្កាយ',
    'chart.workspace_title':  'ទិដ្ឋភាពរួម',
    'chart.workspace_sub':    'ការបែងចែកកំណត់ចំណាំនិងសមាជិក',
    'chart.center':           'ធាតុ',
    'chart.notes':            'កំណត់ចំណាំ',
    'chart.regular_notes':    'កំណត់ចំណាំធម្មតា',
    'chart.favorite_notes':   'កំណត់ចំណាំចូលចិត្ត',
    'chart.other_members':    'សមាជិកផ្សេង',
    'chart.count':            'ចំនួន',
    // ── Dashboard widgets ──
    'widget.recent_notes':     'កំណត់ចំណាំថ្មីៗ',
    'widget.recent_notes_sub': 'សកម្មភាពចុងក្រោយ',
    'widget.active_users':     'អ្នកប្រើប្រាស់សកម្ម',
    'widget.active_users_sub': 'អ្នកប្រើប្រាស់ចុះឈ្មោះ',
    'widget.no_notes':         'មិនទានមានកំណត់ចំណាំ',
    'widget.no_users':         'មិនទានមានអ្នកប្រើប្រាស់',
    'widget.no_description':   'គ្មានការពិពណ៌នា',
    'widget.untitled':         'គ្មានចំណងជើង',
    // ── Time ──
    'time.just_now':  'ទើបបង្ហើប',
    'time.m_ago':     'នាទីមុន',
    'time.h_ago':     'ម៉ោងមុន',
    'time.d_ago':     'ថ្ងៃមុន',
    // ── Notes page ──
    'notes.no_match':    'មិនមានកំណត់ចំណាំត្រូវគ្នា',
    'notes.no_favorites':'មិនទានមានកំណត់ចំណាំចូលចិត្ត',
    'notes.empty':       'មិនទានមានកំណត់ចំណាំ',
    'notes.create_first':'បង្កើតកំណត់ចំណាំដំបូង',
    'notes.create':      'បង្កើតកំណត់ចំណាំ',
    'notes.update':      'កែប្រែកំណត់ចំណាំ',
    // ── Favorites page ──
    'favorites.no_match': 'មិនមានចូលចិត្តត្រូវគ្នា',
    'favorites.empty':    'អ្នកមិនទានដាក់ផ្កាយកំណត់ចំណាំ',
    // ── Archive page ──
    'archive.no_match': 'មិនមានប័ណ្ណសារត្រូវគ្នា',
    'archive.empty':    'មិនទានមានអ្វីក្នុងប័ណ្ណសារ',
    // ── Members page ──
    'users.search':    'ស្វែងរកសមាជិក…',
    'users.no_match':  'មិនមានសមាជិកត្រូវគ្នា',
    'users.empty':     'រកមិនឃើញសមាជិក',
    // ── Confirm dialog ──
    'dialog.please_wait':          'សូមរង់ចាំ…',
    'dialog.delete':               'លុប',
    'dialog.delete_note_title':    'លុបកំណត់ចំណាំ',
    'dialog.delete_note_desc':     'កំណត់ចំណាំនេះនឹងត្រូវបានលុបជាអចិន្ត្រៃយ៍',
    'dialog.delete_member_title':  'លុបសមាជិក',
    'dialog.delete_member_desc':   'ព័ត៌មានសមាជិកនេះនឹងត្រូវបានលុបជាអចិន្ត្រៃយ៍',
    // ── Pagination ──
    'pagination.rows_per_page': 'ជួរក្នុងទំព័រ',
    'pagination.showing':       'បង្ហាញ',
    'pagination.of':            'នៃ',
    'pagination.records':       'កំណត់ត្រា',
    'pagination.page':          'ទំព័រ',
    // ── Messenger ──
    'messenger.title':        'សារ',
    'messenger.contact':      'ទំនាក់ទំនង',
    'messenger.contacts':     'ទំនាក់ទំនង',
    'messenger.search':       'ស្វែងរកទំនាក់ទំនង…',
    'messenger.no_found':     'រកមិនឃើញទំនាក់ទំនង',
    'messenger.no_users':     'មិនមានអ្នកប្រើប្រាស់',
    'messenger.new_message':  'សារថ្មី',
    'messenger.your_messages':'សាររបស់ខ្ញុំ',
    'messenger.select_prompt':'ជ្រើសទំនាក់ទំនងខាងឆ្វេង ដើម្បីចាប់ផ្ដើមសន្ទនា',
    'messenger.realtime':     'ផ្ទាល់ពេលដោយ Supabase',
    'messenger.active_now':   'សកម្មឥឡូវ',
    'messenger.loading':      'កំពុងផ្ទុកទំនាក់ទំនង…',
    'messenger.no_messages':  'មិនទានមានសារ',
    'messenger.say_hello':    'ស្វាគមន៍ចំពោះ',
    'messenger.deleted':      'សារនេះត្រូវបានលុប',
    'messenger.placeholder':  'វាយបញ្ចូលសារ…',
    'messenger.today':        'ថ្ងៃនេះ',
    'messenger.yesterday':    'ម្សិលមិញ',
    // ── Calendar ──
    'calendar.today':         'ថ្ងៃនេះ',
    'calendar.tomorrow':      'ថ្ងៃស្អែក',
    'calendar.days_short':    'ថ',
    'calendar.no_events_day': 'គ្មានព្រឹត្តិការណ៍នៅថ្ងៃនេះ',
    'calendar.month_events':  'ព្រឹត្តិការណ៍',
    'calendar.holiday':       'ថ្ងៃបុណ្យ',
    'calendar.holidays':      'ថ្ងៃបុណ្យ',
    'calendar.no_holidays':   'គ្មានថ្ងៃបុណ្យខែនេះ',
    'calendar.upcoming':      'ថ្ងៃបុណ្យខាងមុខ',
    'calendar.next':          'បន្ទាប់',
    'calendar.events':        'ព្រឹត្តិការណ៍',
    'calendar.legend':        'សញ្ញាពន្យល',
    'calendar.more':          'ទៀត',
    // ── Profile page ──
    'profile.edit':           'កែប្រែប្រវត្តិរូប',
    'profile.joined':         'ចូលរួម',
    'profile.active_member':  'សមាជិកសកម្ម',
    'profile.stat_notes':     'កំណត់ចំណាំ',
    'profile.stat_favorites': 'ចូលចិត្ត',
    'profile.member_since':   'សមាជិកតាំងពី',
    'profile.my_notes':       'កំណត់ចំណាំរបស់ខ្ញុំ',
    'profile.recent_desc':    'ការចាប់យកថ្មីៗរបស់អ្នក',
    'profile.view_all':       'មើលទាំងអស់',
    'profile.no_notes':       'មិនទានមានកំណត់ចំណាំ',
    'profile.start_capturing':'ចាប់ផ្ដើមចាប់យកគំនិត',
    'profile.create_first':   'បង្កើតកំណត់ចំណាំ',
    // ── Profile settings ──
    'ps.full_name':      'ឈ្មោះពេញ',
    'ps.email':          'អាសយដ្ឋានអ៊ីមែល',
    'ps.photo_hint':     'JPG, PNG ឬ GIF · អតិបរមា 5 MB',
    'ps.your_name':      'ឈ្មោះរបស់អ្នក',
    'ps.full_name_placeholder': 'ឈ្មោះពេញរបស់អ្នក',
    'ps.save':           'រក្សាទុកការផ្លាស់ប្ដូរ',
    'ps.saving':         'កំពុងរក្សា…',
    'ps.saved':          'បានរក្សា',
    // ── Notification settings ──
    'notif.new_note_label':     'កំណត់ចំណាំថ្មីបានបង្កើត',
    'notif.new_note_desc':      'ទទួលការជូនដំណឹងនៅពេលមានកំណត់ចំណាំថ្មី',
    'notif.mention_label':      'ការរំលឹករំឭក',
    'notif.mention_desc':       'ជូនដំណឹងនៅពេលអ្នកត្រូវបានរំឭករំលឹក',
    'notif.message_label':      'សារថ្មី',
    'notif.message_desc':       'ជូនដំណឹងនៅពេលទទួលសារថ្មី',
    'notif.favorite_label':     'សកម្មភាពចូលចិត្ត',
    'notif.favorite_desc':      'នៅពេលកំណត់ចំណាំចូលចិត្តត្រូវបានធ្វើបច្ចុប្បន្នភាពឬលុប',
    'notif.new_user_label':     'អ្នកប្រើប្រាស់ថ្មីចូលរួម',
    'notif.new_user_desc':      'ជូនដំណឹងនៅពេលអ្នកប្រើប្រាស់ថ្មីចុះឈ្មោះ',
    'notif.deleted_label':      'កំណត់ចំណាំបានលុប',
    'notif.deleted_desc':       'ជូនដំណឹងនៅពេលកំណត់ចំណាំរបស់អ្នកត្រូវបានលុប',
    // ── NoteCard / table headers ──
    'table.name':        'ឈ្មោះ',
    'table.description': 'ការពិពណ៌នា',
    'table.updated':     'ធ្វើបច្ចុប្បន្នភាព',
    'table.status':      'ស្ថានភាព',
    'table.user':        'អ្នកប្រើប្រាស់',
    'table.email':       'អ៊ីមែល',
    'table.joined':      'ចូលរួម',
    // ── Misc ──
    'misc.loading': 'កំពុងផ្ទុក…',
    'misc.active':  'សកម្ម',
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
