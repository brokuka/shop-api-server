FROM node:lts-alpine AS base
ENV PACKAGE_MANAGER=yarn

COPY ./package*.json ./
RUN $PACKAGE_MANAGER install

# Build dev image
FROM base AS dev
COPY . .
CMD $PACKAGE_MANAGER dev

# Build prod image
FROM base AS prod
COPY . .
CMD $PACKAGE_MANAGER start