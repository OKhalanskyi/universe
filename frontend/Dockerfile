FROM node:22-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY ../frontend1 .

EXPOSE 3000

CMD ["yarn", "dev"]
