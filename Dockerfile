FROM node:lts-alpine3.14

EXPOSE 3000

COPY ./dist .

RUN yarn config set registry https://registry.npm.taobao.org/
RUN yarn install && npm run build

CMD [ "node", "./dist/bundle.js" ]