FROM mysql
RUN apt-get install nodejs
WORKDIR /usr/app
COPY package.json /usr/app
RUN npm install
COPY . /usr/app