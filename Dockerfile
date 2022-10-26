FROM node:14
ENV PORT=$PORT

#create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

#installing dependencies
COPY package*.json /usr/src/app/
RUN npm install 

#copying source files
COPY . /usr/src/app

#building app
RUN npm run build

#running the app
CMD "npm" "run" "dev" -p $PORT