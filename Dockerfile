FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# fix compatability issues with react-19
RUN npm install --force

# For prod
# COPY . .
# RUN npm run build

EXPOSE 3000

# For dev
CMD ["npm", "run", "dev"]

# For prod
# CMD ["npm", "start"]