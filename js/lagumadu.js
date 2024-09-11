
const lagumadu={}
export default lagumadu


import web_data from "./web_data.json" with { type: "json" }

let htmltemplate=function(s)
{
    let temp = document.createElement("template")
    temp.innerHTML = s.trim()
    return temp.content.firstChild
}

lagumadu.start=async function(opts)
{
	console.log("START lagumadu")
}
