FROM node:10.16.0
RUN mkdir /okhatiui
WORKDIR /okhatiui
COPY package.json yarn.lock ./
RUN yarn
COPY . /okhatiui
EXPOSE 3000
CMD ["yarn", "start"]