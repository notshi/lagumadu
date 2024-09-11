
const lagumadu={}
export default lagumadu


import web_data from "./web_data.json" with { type: "json" }


import {Howl, Howler} from 'howler';


lagumadu.start=async function(opts)
{
	console.log(1)
	const f=function(e)
	{
		console.log(2)
		document.removeEventListener("click",f)
		if(!lagumadu.started)
		{
			lagumadu.started=true
			lagumadu.start_ffs(opts)
		}
	}
	document.addEventListener("click",f, true); 

}


let htmltemplate=function(s)
{
    let temp = document.createElement("template")
    temp.innerHTML = s.trim()
    return temp.content.firstChild
}


lagumadu.layer_shuffle=function(layer)
{
	let temp=[]
	for(let sound of layer.sounds) { temp.push(sound) }
	while( temp.length>0 )
	{
		let r=Math.floor(Math.random() * temp.length)
		layer.toplay.push( temp.splice(r,1)[0] )
	}
}

lagumadu.update_layer=function(layer)
{	
	if( layer.sound )
	{
		if( layer.sound.playing() ) // wait for sound to end
		{
			return
		}
	}

	console.log("update "+layer.idx)

	if(layer.toplay.length==0) { lagumadu.layer_shuffle(layer) } // new shuffle?
	
	layer.sound=layer.toplay.pop()
	layer.sound.play()

}


lagumadu.new_layer=function(idx)
{
	let layer={}
	
	layer.idx=idx
	layer.sounds=[] // push some sounds in here
	
	layer.toplay=[]
	
	return layer
}

lagumadu.start_ffs=async function(opts)
{
	console.log("START lagumadu")
	
	lagumadu.layers=[]

	{
		let idx=0
		let layer=lagumadu.new_layer(idx)
		lagumadu.layers[idx]=layer
		
		layer.sounds.push( new Howl({src:[ "./data/drone.mp3"  ]}) )
	}

	{
		let idx=1
		let layer=lagumadu.new_layer(idx)
		lagumadu.layers[idx]=layer
		
		layer.sounds.push( new Howl({src:[ "./data/test1.mp3"  ]}) )
		layer.sounds.push( new Howl({src:[ "./data/test2.mp3"  ]}) )
		layer.sounds.push( new Howl({src:[ "./data/test3.mp3"  ]}) )
		layer.sounds.push( new Howl({src:[ "./data/test4.mp3"  ]}) )
	}

	{
		let idx=2
		let layer=lagumadu.new_layer(idx)
		lagumadu.layers[idx]=layer
		
		layer.sounds.push( new Howl({src:[ "./data/test5.mp3"  ]}) )
		layer.sounds.push( new Howl({src:[ "./data/test6.mp3"  ]}) )
		layer.sounds.push( new Howl({src:[ "./data/test7.mp3"  ]}) )
		layer.sounds.push( new Howl({src:[ "./data/test8.mp3"  ]}) )
	}

	{
		let idx=3
		let layer=lagumadu.new_layer(idx)
		lagumadu.layers[idx]=layer
		
		layer.sounds.push( new Howl({src:[ "./data/test9.mp3"  ]}) )
		layer.sounds.push( new Howl({src:[ "./data/test10.mp3" ]}) )
	}
	
	
	setInterval( lagumadu.update , 100 ) // 10fps?

}

lagumadu.update=async function(opts)
{
	for(let layer of lagumadu.layers)
	{
		lagumadu.update_layer(layer)
	}
}

