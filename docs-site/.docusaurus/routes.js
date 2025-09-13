import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug', '5ff'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config', '5ba'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content', 'a2b'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData', 'c3c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata', '156'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry', '88c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes', '000'),
    exact: true
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs', 'c58'),
    routes: [
      {
        path: '/docs',
        component: ComponentCreator('/docs', 'dfc'),
        routes: [
          {
            path: '/docs',
            component: ComponentCreator('/docs', '59e'),
            routes: [
              {
                path: '/docs/api/api-reference',
                component: ComponentCreator('/docs/api/api-reference', 'b64'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/api/authentication',
                component: ComponentCreator('/docs/api/authentication', 'db7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/changelog',
                component: ComponentCreator('/docs/changelog', '048'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/faq',
                component: ComponentCreator('/docs/faq', '0ec'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/getting-started',
                component: ComponentCreator('/docs/getting-started', 'db2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/guides/error-handling',
                component: ComponentCreator('/docs/guides/error-handling', 'c60'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/guides/rate-limiting',
                component: ComponentCreator('/docs/guides/rate-limiting', '8a9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/guides/sdks-libraries',
                component: ComponentCreator('/docs/guides/sdks-libraries', '2d9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/guides/webhooks',
                component: ComponentCreator('/docs/guides/webhooks', '972'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/intro',
                component: ComponentCreator('/docs/intro', '784'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/introduction',
                component: ComponentCreator('/docs/introduction', '05a'),
                exact: true,
                sidebar: "tutorialSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
