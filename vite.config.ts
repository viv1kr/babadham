// @ts-nocheck
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'

function fileUploadPlugin() {
  return {
    name: 'file-upload-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'SAMEORIGIN');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

        if (req.url === '/api/db' && req.method === 'GET') {
          try {
            const dbPath = path.resolve(__dirname, './public/data/database.json');
            if (fs.existsSync(dbPath)) {
              const data = fs.readFileSync(dbPath, 'utf-8');
              res.setHeader('Content-Type', 'application/json');
              res.end(data);
              return;
            }
          } catch (e) {}
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ empty: true }));
          return;
        }

        if (req.url === '/api/db' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk.toString(); });
          req.on('end', () => {
            try {
              const dataDir = path.resolve(__dirname, './public/data');
              const adminDataDir = path.resolve(__dirname, './prasadam/public/data');

              if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
              if (!fs.existsSync(adminDataDir)) fs.mkdirSync(adminDataDir, { recursive: true });

              const dbPath = path.join(dataDir, 'database.json');
              const adminDbPath = path.join(adminDataDir, 'database.json');

              fs.writeFileSync(dbPath, body);
              fs.writeFileSync(adminDbPath, body);

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true }));
            } catch (e) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: String(e) }));
            }
          });
          return;
        }

        if (req.url === '/api/upload-image' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk.toString(); });
          req.on('end', () => {
            try {
              const data = JSON.parse(body);
              const base64Data = data.image.replace(/^data:image\/\w+;base64,/, '');
              const buffer = Buffer.from(base64Data, 'base64');
              
              let filename = `${data.type || 'upload'}.webp`;
              if (data.type === 'babadham_favicon_image' || data.type === 'favicon') filename = 'favicon.png';
              else if (data.type === 'babadham_logo_image' || data.type === 'logo') filename = 'logo.png';
              else if (data.type === 'babadham_profile_photo' || data.type === 'profile') filename = 'profile.png';
              else if (data.type === 'babadham_header_bg') filename = 'header-bg.webp';
              else if (data.type === 'babadham_mobile_header_bg') filename = 'header-bg-mob.webp';
              else filename = `${data.type || 'asset'}-${Date.now()}.webp`;

              const pubDir = path.resolve(__dirname, './public/assets');
              const adminPubDir = path.resolve(__dirname, './prasadam/public/assets');

              if (!fs.existsSync(pubDir)) fs.mkdirSync(pubDir, { recursive: true });
              if (!fs.existsSync(adminPubDir)) fs.mkdirSync(adminPubDir, { recursive: true });

              const pubPath = path.join(pubDir, filename);
              const adminPubPath = path.join(adminPubDir, filename);

              fs.writeFileSync(pubPath, buffer);
              fs.writeFileSync(adminPubPath, buffer);
              
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, path: `/assets/${filename}` }));
            } catch (e) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: String(e) }));
            }
          });
          return;
        }
        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), fileUploadPlugin()],
})

