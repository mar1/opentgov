// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY
    }
  },
  css: ['~/assets/css/main.css'],
  vite: {
    optimizeDeps: {
      include: ['bn.js']
    }
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  nitro: {
    devProxy: {
      '/api': {
        target: 'http://localhost:3001', // Your backend URL
        changeOrigin: true,
      },
    },
  },
  modules: [
    '@nuxt/image',
    '@nuxtjs/seo',
    '@nuxtjs/robots',
    ['@nuxtjs/google-fonts', {
      families: {
        Roboto: true,
        Outfit: true,
        Inter: [400, 700],
        'Josefin+Sans': true,
        Lato: [100, 300],
        Raleway: {
          wght: [100, 400],
          ital: [100]
        }
      }
    }]
  ],
  build: {
    transpile: ['@polkadot/api', '@polkadot/util-crypto', '@polkadot/extension-dapp', 'rxjs'],
  },
  // SEO Configuration
  site: {
    url: 'https://opentgov.com', // Replace with your actual domain
    name: 'OpenTGov - Telegram Voting Bot for Polkadot Governance',
    description: 'Set up your own Telegram bot to participate in Polkadot governance voting. Secure, self-custodial, and easy to use.',
    defaultLocale: 'en'
  },
  // Robots.txt configuration
  robots: {
    UserAgent: '*',
    Allow: ['/'],
    Disallow: ['/api/', '/admin/'],
    Sitemap: 'https://opentgov.com/sitemap.xml'
  },
  // OG Image configuration
  ogImage: {
    defaults: {
      componentDirs: ['components/og'],
      defaults: {
        width: 1200,
        height: 630,
        fonts: ['Inter:400,700'],
      },
    },
  }
})