# hatchways-backend-assessment
This assessment project builds a customized API upon an existing API
 
# Getting started
1. Run `npm install` in the same folder
2. Run `node server.js` to start the server
3. There are two routes in this API:
    - `/api/ping` : Checks if the server is connected to the API
    - `/api/posts` : Makes requests based on the query string provided in its URL
4. Once the server has been started, a link to the proxy server (localhost) can be found on the command link
5. You may also manually input the URL as `http://localhost:3000/api/ping` or `http://localhost:3000/api/posts`


# `/api/posts` fields
1. `tags` : This is a required field for the query string. The program will not run if this field is not provided
2. `sortBy` : This an optional field for the query string. Its default value is `id`. Only a single value is accepted. Valid options are `id, reads, likes, popularity`
3. `direction` : This is an optional field for the query string. Its default value is `asc`. Only a single value is accepted. Valid options are `asc, desc`


# `http://localhost:3000/api/posts` usage
1. This route will not work unless `tags` field exist. To fetch data, the url should be in this format: `http://localhost:3000/api/posts?tags=tech`
3. The available options are: `tech, history, science, design, culture, health, startups, politics`
4. Multiple tags can be aggregated, each separated by a comma `,` 
   - `/api/posts?tags=tech,history,science`
5. This API can sort the JSON request by using the optional fields, each separated by `&`
   - `/api/posts?tags=tech,history,science&sortBy=likes&direction=desc`
