import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default ({ mode }) => {
  const env = loadEnv(mode, '.');

  // https://vitejs.dev/config/
  return defineConfig({
    plugins: [react()],
    server: {
      host: '127.0.0.1',
      proxy: {
        '/supabase': {
          target: env.VITE_DB_URL,
          changeOrigin: true,
          secure: false, 
          rewrite: (path) => path.replace(/^\/supabase/, ''),
        }
      }
    }
  })
}
