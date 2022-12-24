module.exports = {
  images: {
    domains: ['localhost', 'images.unsplash.com'],
  },
  env: {
    // https://www.google.com/recaptcha/admin/create
    RECAPTCHA_SITE_KEY_V3: '6Ldv5M4aAAAAAGBhBngvNMcxdgnDipwGizzzmwxj',
    RECAPTCHA_SECRET_KEY_V3: '6Ldv5M4aAAAAAOiPM2-j41RDoiTsa8rwrITypSXO',
    PUBLIC_GA_ID: 'G-MN03SLNE9C',
    SERVER_URL: 'http://localhost:3000',
    // GRAPHQL_URL: 'https://exam-central-server.onrender.com/api/graphql'
    // GRAPHQL_URL: 'http://examcentral.in:3000/api/graphql'
    GRAPHQL_URL: 'http://localhost:3000/api/graphql'
  }
}
