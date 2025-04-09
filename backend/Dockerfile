FROM node:22-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY ../backend .

RUN yarn prisma generate

EXPOSE 3001

CMD yarn prisma migrate deploy && yarn start:dev