# Use the official Ruby image as the base image
FROM ruby:2.3.3

# Set the working directory inside the container
WORKDIR /app

# Copy the Gemfile and Gemfile.lock into the container
COPY Gemfile* ./

# Install dependencies using Bundler
RUN bundle install

# Copy the application code into the container
COPY . .

# Expose port 4567
EXPOSE 4567

# Run the Ruby web server when the container starts
CMD ["ruby", "app.rb"]

