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
        if (req.url === '/api/upload-image' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk.toString(); });
          req.on('end', () => {
            try {
              const data = JSON.parse(body);
              const base64Data = data.image.replace(/^data:image\/\w+;base64,/, '');
              const buffer = Buffer.from(base64Data, 'base64');
              
              let filename = `${data.type}.webp`;
              if (data.type === 'babadham_favicon_image') filename = 'favicon.png';
              else if (data.type === 'babadham_logo_image') filename = 'logo.png';
              else if (data.type === 'babadham_header_bg') filename = 'header-bg.webp';
              else if (data.type === 'babadham_mobile_header_bg') filename = 'header-bg-mob.webp';
              
              // Write to babadham public folder
              const pubPath = path.resolve(__dirname, './public/assets', filename);
              fs.writeFileSync(pubPath, buffer);
              
              // Write to prasadam public folder
              const adminPubPath = path.resolve(__dirname, './prasadam/public/assets', filename);
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

