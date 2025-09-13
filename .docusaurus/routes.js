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
    path: '/auth/EmailVerificationPage',
    component: ComponentCreator('/auth/EmailVerificationPage', '761'),
    exact: true
  },
  {
    path: '/auth/ForgotPasswordPage',
    component: ComponentCreator('/auth/ForgotPasswordPage', '23e'),
    exact: true
  },
  {
    path: '/auth/LoginPage',
    component: ComponentCreator('/auth/LoginPage', 'a8b'),
    exact: true
  },
  {
    path: '/auth/OAuthCallbackPage',
    component: ComponentCreator('/auth/OAuthCallbackPage', 'b47'),
    exact: true
  },
  {
    path: '/auth/RegisterPage',
    component: ComponentCreator('/auth/RegisterPage', '2fc'),
    exact: true
  },
  {
    path: '/auth/RegisterSuccessPage',
    component: ComponentCreator('/auth/RegisterSuccessPage', '3d7'),
    exact: true
  },
  {
    path: '/auth/ResetPasswordPage',
    component: ComponentCreator('/auth/ResetPasswordPage', '87a'),
    exact: true
  },
  {
    path: '/auth/SetPasswordPage',
    component: ComponentCreator('/auth/SetPasswordPage', '3ce'),
    exact: true
  },
  {
    path: '/Dashboard',
    component: ComponentCreator('/Dashboard', '8f3'),
    exact: true
  },
  {
    path: '/DashboardUsage',
    component: ComponentCreator('/DashboardUsage', 'eca'),
    exact: true
  },
  {
    path: '/developer-dashboard/analytics/',
    component: ComponentCreator('/developer-dashboard/analytics/', 'e4e'),
    exact: true
  },
  {
    path: '/developer-dashboard/api-docs/',
    component: ComponentCreator('/developer-dashboard/api-docs/', '530'),
    exact: true
  },
  {
    path: '/developer-dashboard/api-keys/',
    component: ComponentCreator('/developer-dashboard/api-keys/', '01b'),
    exact: true
  },
  {
    path: '/developer-dashboard/DeveloperDashboard',
    component: ComponentCreator('/developer-dashboard/DeveloperDashboard', '3db'),
    exact: true
  },
  {
    path: '/developer-dashboard/rate-limits/',
    component: ComponentCreator('/developer-dashboard/rate-limits/', '718'),
    exact: true
  },
  {
    path: '/developer-dashboard/snippets/',
    component: ComponentCreator('/developer-dashboard/snippets/', '285'),
    exact: true
  },
  {
    path: '/settings/APIKeysSettingsPage',
    component: ComponentCreator('/settings/APIKeysSettingsPage', '9f4'),
    exact: true
  },
  {
    path: '/settings/ProfileSettingsPage',
    component: ComponentCreator('/settings/ProfileSettingsPage', 'c7a'),
    exact: true
  },
  {
    path: '/settings/SecuritySettingsPage',
    component: ComponentCreator('/settings/SecuritySettingsPage', '4cf'),
    exact: true
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs', '968'),
    routes: [
      {
        path: '/docs',
        component: ComponentCreator('/docs', 'f4d'),
        routes: [
          {
            path: '/docs',
            component: ComponentCreator('/docs', 'e38'),
            routes: [
              {
                path: '/docs/api/api-reference',
                component: ComponentCreator('/docs/api/api-reference', '976'),
                exact: true
              },
              {
                path: '/docs/api/authentication',
                component: ComponentCreator('/docs/api/authentication', '2bd'),
                exact: true
              },
              {
                path: '/docs/changelog',
                component: ComponentCreator('/docs/changelog', '96f'),
                exact: true
              },
              {
                path: '/docs/faq',
                component: ComponentCreator('/docs/faq', '489'),
                exact: true
              },
              {
                path: '/docs/getting-started',
                component: ComponentCreator('/docs/getting-started', 'eba'),
                exact: true
              },
              {
                path: '/docs/guides/error-handling',
                component: ComponentCreator('/docs/guides/error-handling', 'de1'),
                exact: true
              },
              {
                path: '/docs/guides/rate-limiting',
                component: ComponentCreator('/docs/guides/rate-limiting', '4dd'),
                exact: true
              },
              {
                path: '/docs/guides/sdks-libraries',
                component: ComponentCreator('/docs/guides/sdks-libraries', 'dc1'),
                exact: true
              },
              {
                path: '/docs/guides/webhooks',
                component: ComponentCreator('/docs/guides/webhooks', '851'),
                exact: true
              },
              {
                path: '/docs/intro',
                component: ComponentCreator('/docs/intro', '853'),
                exact: true
              },
              {
                path: '/docs/introduction',
                component: ComponentCreator('/docs/introduction', '6e1'),
                exact: true
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
