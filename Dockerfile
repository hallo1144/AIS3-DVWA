FROM node:13

WORKDIR /usr/app
COPY . .
RUN npm install
RUN npm audit fix

WORKDIR /usr/app/frontend
RUN npm install
RUN npm audit fix
WORKDIR /usr/app
CMD ["npm", "run", "dev"]
