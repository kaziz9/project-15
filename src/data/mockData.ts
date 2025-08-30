import { Link } from '../types';

export const mockLinks: Link[] = [
  // Work Links
  {
    id: '1',
    url: 'https://www.linkedin.com/',
    title: 'LinkedIn',
    description: 'للتوظيف وبناء شبكة علاقات مهنية',
    image: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=800',
    folder: 'Work',
    tags: ['networking', 'jobs', 'professional'],
    isFavorite: false,
    readLater: false,
    createdAt: new Date('2024-01-20')
  },
  {
    id: '2',
    url: 'https://www.upwork.com/',
    title: 'Upwork',
    description: 'للعمل الحر (Freelance)',
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
    folder: 'Work',
    tags: ['freelance', 'remote work', 'projects'],
    isFavorite: false,
    readLater: false,
    createdAt: new Date('2024-01-19')
  },
  {
    id: '3',
    url: 'https://www.fiverr.com/',
    title: 'Fiverr',
    description: 'بيع وشراء الخدمات المصغّرة',
    image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
    folder: 'Work',
    tags: ['services', 'gigs', 'marketplace'],
    isFavorite: false,
    readLater: false,
    createdAt: new Date('2024-01-18')
  },
  {
    id: '4',
    url: 'https://www.indeed.com/',
    title: 'Indeed',
    description: 'البحث عن وظائف حول العالم',
    image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
    folder: 'Work',
    tags: ['jobs', 'career', 'employment'],
    isFavorite: true,
    readLater: false,
    createdAt: new Date('2024-01-17')
  },

  // Study Links
  {
    id: '5',
    url: 'https://www.coursera.org/',
    title: 'Coursera',
    description: 'دورات من جامعات عالمية',
    image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=800',
    folder: 'Study',
    tags: ['education', 'courses', 'university'],
    isFavorite: true,
    readLater: false,
    createdAt: new Date('2024-01-16')
  },
  {
    id: '6',
    url: 'https://www.udemy.com/',
    title: 'Udemy',
    description: 'كورسات متنوعة بأسعار منخفضة',
    image: 'https://images.pexels.com/photos/301926/pexels-photo-301926.jpeg?auto=compress&cs=tinysrgb&w=800',
    folder: 'Study',
    tags: ['online learning', 'skills', 'affordable'],
    isFavorite: false,
    readLater: true,
    createdAt: new Date('2024-01-15')
  },
  {
    id: '7',
    url: 'https://www.khanacademy.org/',
    title: 'Khan Academy',
    description: 'تعلم مجاني في الرياضيات، العلوم، وغيرها',
    image: 'https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg?auto=compress&cs=tinysrgb&w=800',
    folder: 'Study',
    tags: ['free education', 'math', 'science'],
    isFavorite: false,
    readLater: false,
    createdAt: new Date('2024-01-14')
  },
  {
    id: '8',
    url: 'https://www.edx.org/',
    title: 'edX',
    description: 'كورسات من MIT, Harvard وغيرها',
    image: 'https://images.pexels.com/photos/207691/pexels-photo-207691.jpeg?auto=compress&cs=tinysrgb&w=800',
    folder: 'Study',
    tags: ['MIT', 'Harvard', 'university courses'],
    isFavorite: true,
    readLater: false,
    createdAt: new Date('2024-01-13')
  },

  // Fun Links
  {
    id: '9',
    url: 'https://www.reddit.com/',
    title: 'Reddit',
    description: 'مجتمعات للنقاش والميمز وكل شيء',
    image: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=800',
    folder: 'Fun',
    tags: ['community', 'discussion', 'memes'],
    isFavorite: false,
    readLater: false,
    createdAt: new Date('2024-01-12')
  },
  {
    id: '10',
    url: 'https://www.youtube.com/',
    title: 'YouTube',
    description: 'فيديوهات تعليمية وترفيهية',
    image: 'https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg?auto=compress&cs=tinysrgb&w=800',
    folder: 'Fun',
    tags: ['videos', 'entertainment', 'education'],
    isFavorite: true,
    readLater: false,
    createdAt: new Date('2024-01-11')
  },
  {
    id: '11',
    url: 'https://9gag.com/',
    title: '9GAG',
    description: 'ميمز وضحك',
    image: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800',
    folder: 'Fun',
    tags: ['memes', 'funny', 'humor'],
    isFavorite: false,
    readLater: false,
    createdAt: new Date('2024-01-10')
  },
  {
    id: '12',
    url: 'https://www.twitch.tv/',
    title: 'Twitch',
    description: 'بث مباشر للألعاب والمحتوى الترفيهي',
    image: 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=800',
    folder: 'Fun',
    tags: ['streaming', 'gaming', 'live'],
    isFavorite: false,
    readLater: true,
    createdAt: new Date('2024-01-09')
  },

  // Original MyWaslat link
  {
    id: '13',
    url: 'https://mail.google.com/',
    title: 'Gmail',
    description: 'خدمة البريد الإلكتروني من جوجل',
    image: 'https://images.pexels.com/photos/4439901/pexels-photo-4439901.jpeg?auto=compress&cs=tinysrgb&w=800',
    folder: 'Personal',
    tags: ['email', 'google', 'communication'],
    isFavorite: true,
    readLater: false,
    createdAt: new Date('2024-01-17')
  },

  {
    id: '15',
    url: 'https://chatgpt.com/',
    title: 'ChatGPT',
    description: 'مساعد ذكي للمحادثة والإجابة على الأسئلة',
    image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
    folder: 'Personal',
    tags: ['AI', 'chat', 'assistant', 'questions'],
    isFavorite: true,
    readLater: false,
    createdAt: new Date('2024-01-15')
  },

  // Original MyWaslat link
  {
    id: '14',
    url: 'http://mywaslat.com/',
    title: 'MyWaslat',
    description: 'تطبيق MyWaslat هو منصة ذكية مصممة لمساعدتك في حفظ وتنظيم روابطك. يتيح لك جمع أنواع مختلفة من الروابط، مثل المقالات ومقاطع الفيديو والأدوات أو الأبحاث، في مكان واحد آمن وسهل الاستخدام.',
    image: '/55e2e5dd-4da4-4dcf-9157-04bb6b8e3c24.png',
    folder: 'Personal',
    tags: ['links', 'mywaslat', 'mylinks', 'lien', 'LinkSharing', 'LinkManager'],
    isFavorite: true,
    readLater: false,
    createdAt: new Date('2024-01-16')
  }
];