FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY tsconfig.json ./
COPY vite.config.ts ./
COPY index.html ./
COPY public ./public
COPY App.tsx ./
COPY main.tsx ./
COPY index.css ./
COPY config.ts ./
COPY vite-env.d.ts ./
COPY tsconfig.node.json ./
COPY components ./components
COPY pages ./pages
COPY hooks ./hooks
COPY store ./store
COPY ui ./ui
COPY types ./types
COPY services ./services
COPY utils ./utils
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]