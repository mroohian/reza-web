FROM node:14.15.3-alpine as dependencies

ARG RW_NPM_REPO 
ARG RW_NPM_TOKEN

WORKDIR /workdir

COPY package.json .

RUN echo "${RW_NPM_REPO}" > .npmrc && \
    echo "${RW_NPM_TOKEN}" >> .npmrc && \
    npm install --only=production  && \
    cp -R node_modules prod_node_modules && \
    npm install && \
    rm -f .npmrc

FROM dependencies as build

COPY . .

RUN npm run build

FROM node:14.15.3-alpine as production

WORKDIR /workdir

COPY --from=dependencies /workdir/prod_node_modules ./node_modules

COPY --from=build /workdir/dest ./dest

COPY config ./config

COPY package.json .

EXPOSE 3000

CMD npm run start