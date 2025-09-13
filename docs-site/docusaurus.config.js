import {themes} from 'prism-react-renderer';
const lightTheme = themes.github;
const darkTheme = themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'EnvoyOU API Documentation',
  tagline: 'Comprehensive Environmental Data API Platform',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://docs.envoyou.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'hk-dev13', // Usually your GitHub org/user name.
  projectName: 'envoyou-page-react', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/hk-dev13/envoyou-page-react/tree/main/',
          path: '../docs',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/hk-dev13/envoyou-page-react/tree/main/',
        },
        theme: {
          customCss: './docusaurus-theme/css/custom.css',
        },
      }),
    ],
  ],

  plugins: [
    [
      'redocusaurus',
      {
        specs: [
          {
            id: 'envoyou-core-api',
            spec: '../openapi/envoyou-api.yaml',
            route: '/api-spec/'
          }
        ],
        theme: {
          primaryColor: '#0B5CCC'
        }
      }
    ]
  ],

  clientModules: [],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/envoyou-social-card.jpg',
      navbar: {
        title: 'EnvoyOU API Docs',
        logo: {
          alt: 'EnvoyOU Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Documentation',
          },
          {
            href: '/api-spec/',
            label: 'API Spec',
            position: 'left',
          },
          {
            href: 'https://api.envoyou.com/docs',
            label: 'Interactive API',
            position: 'left',
          },
          {
            href: 'https://app.envoyou.com',
            label: 'Web App',
            position: 'right',
          },
          {
            href: 'https://github.com/hk-dev13/envoyou-page-react',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Documentation',
            items: [
              {
                label: 'Getting Started',
                to: '/docs/introduction',
              },
              {
                label: 'API Reference',
                to: '/docs/api-reference',
              },
              {
                label: 'Interactive API',
                href: 'https://api.envoyou.com/docs',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Support',
                href: 'mailto:support@envoyou.com',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/hk-dev13/envoyou-page-react',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Web App',
                href: 'https://app.envoyou.com',
              },
              {
                label: 'Landing Page',
                href: 'https://envoyou.com',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} EnvoyOU. Built with Docusaurus.`,
      },
      prism: {
        theme: lightTheme,
        darkTheme: darkTheme,
      },
    }),
};

export default config;