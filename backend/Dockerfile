# Use Node.js 18 Alpine image 
FROM node:18-alpine 
 
# Set working directory 
WORKDIR /app 
 
# Copy package files first for better caching 
COPY package*.json ./ 
 
# Install dependencies using npm install (not npm ci) 
RUN npm install 
 
# Copy the rest of the application 
COPY . . 
 
# Expose port 
EXPOSE 5000 
 
# Health check 
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \ 
  CMD curl -f http://localhost:5000/api/health || exit 1 
 
# Start the application 
CMD ["npm", "start"] 
