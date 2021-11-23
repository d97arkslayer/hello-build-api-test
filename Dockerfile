FROM node:17.0-alpine as  builder
WORKDIR /app
COPY package.json ./
COPY src ./src
COPY tsconfig.json ./tsconfig.json
COPY tslint.json ./tslint.json
COPY .env ./dist/
RUN npm install
RUN npm run build

FROM node:17.0-alpine as server
WORKDIR /app
COPY package.json ./
RUN npm install --only=production
COPY --from=0 /app/dist .
RUN npm install pm2 -g

EXPOSE 9000
CMD ["pm2-runtime","index.js"]
