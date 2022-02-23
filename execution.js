const fetch = require('node-fetch');

//Global Parameter
const param = { tags : '', sortBy : '', direction: '' }

//Step 1 - Validation
async function validate(request, response){
    response.status(200).json({success : true})
}

//Step 2 - Data Fetching
async function dataFetch(request, response){
    //Assign query string to its appropriate parameter name
    param.tags = request.query.tags
    param.sortBy = request.query.sortBy
    param.direction = request.query.direction

    //Verify if query string is valid or invalid
    checkParameters(response)

    //Split "tags" field by ',' into an array
    let allTags = param.tags.split(',')
    let data = getConcurrentRequest(allTags)

    //Resolve promises returned by the requests
    data.then((values) =>{
        values = removeDuplicate(values)

        //Check if optional fields are inputted
        //Use default setting if none
        if(param.sortBy){
            if (param.direction === 'desc'){
                values.posts.sort((a, b) => b[param.sortBy] - a[param.sortBy]);
            } else {
                values.posts.sort((a, b) => a[param.sortBy] - b[param.sortBy]);
            }
        }

        //Display values
        response.json(values)
    })
}


/* *******Utility functions******* */

/*  Usage: Ensure field data are acceptable by the API
    Description: Accepts only valid parameter as given in the instructions by handling bad parameters
    Return: Appropriate status code and JSON body*/
function checkParameters(res){
    const validSort = ["id", "reads", "likes", "popularity"]
    const validDirection = ["asc", "desc"]

    if(param.tags != undefined && param.tags.length != 0) param.tags = param.tags.toLowerCase()
    else{
        return res.status(400).json({ error : "Tags parameter is required" })
    }

    if(param.sortBy != undefined && param.sortBy.length != 0){
        param.sortBy = param.sortBy.toLowerCase()
        if (!validSort.includes(param.sortBy) || param.sortBy.indexOf(',') > 0){
            return res.status(400).json({ error : "sortBy parameter is invalid" })
        }
    }

    if(param.direction != undefined && param.direction.length != 0) {
        param.direction = param.direction.toLowerCase()
        if(!validDirection.includes(param.direction)){
            return res.status(400).json({ error : "direction parameter is invalid" })
        }
    }
}

/*  Usage: Remove duplicates from the aggregate requested data
    Description: Function uses hash table to store unique values as its hash value, duplicates will be removed
    Return: Refined data in the correct format
*/
function removeDuplicate(data){
    let hashTable = {}
    let current = []

    while(data.length != 0){
        current = data.pop()
        for(var i = 0; i < current.posts.length; i++){
            hashTable[current.posts[i].id] = current.posts[i];
        }
    }

    let refined = []
    for (let key in hashTable) {
        refined.push(hashTable[key]);
    }

    return {"posts": refined};
}

/*  Usage: Makes asynchronous request based on tags passed
    Description: Promise ensure the requests are delivered sequentially
    Return: promised requests
*/
async function getConcurrentRequest(tags){
    try {
        const api_url = "https://api.hatchways.io/assessment/blog/posts"
        let promises = []
        let jsonData = []

        //Push array of promises based on number of requests made (bounded by number of tags)
        for(var i = 0; i < tags.length; i++){
            promises[i] = await fetch(api_url + `/?tag=${tags[i]}`)
            jsonData.push(await promises[i].json())
        }

        //Coalesce multiple promises into a single super-promise
        let data = Promise.all(jsonData)

        return data
    }
    catch (error) {
        console.log(error);
    }
}


module.exports = {
    validate,
    dataFetch
}