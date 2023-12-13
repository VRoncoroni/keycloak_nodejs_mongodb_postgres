FROM node
WORKDIR /home/node/app
COPY ./nodejs .
RUN npm install
EXPOSE 3000
CMD ["npm", "start"]
