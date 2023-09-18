require 'sinatra'
require 'open-uri'

set :bind, '0.0.0.0'  # Bind to all available network interfaces

get '/' do
  format 'RESPONSE: %s', open(params[:url]).read
end
