
const lagumadu={}
export default lagumadu


import web_data from "./web_data.json" with { type: "json" }


import {Howl, Howler} from 'howler';


lagumadu.start=async function(opts)
{
	const f=function(e)
	{
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

//	console.log("update "+layer.idx)

	if(layer.toplay.length==0) { lagumadu.layer_shuffle(layer) } // new shuffle?
	
	layer.sound=layer.toplay.pop()
	layer.sound.play()
	console.log("play",layer.idx,layer.sound.myname)

}

lagumadu.new_sound=function(layer,name)
{
	let sound=new Howl({src:[ "./data/"+name+".mp3"  ]})
	sound.myname=name
	layer.sounds.push(sound)

	return sound
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
		
		lagumadu.new_sound(layer,"drone")
	}

	{
		let idx=1
		let layer=lagumadu.new_layer(idx)
		lagumadu.layers[idx]=layer
		
		lagumadu.new_sound(layer,"test1")
		lagumadu.new_sound(layer,"test2")
		lagumadu.new_sound(layer,"test3")
		lagumadu.new_sound(layer,"test4")
	}

	{
		let idx=2
		let layer=lagumadu.new_layer(idx)
		lagumadu.layers[idx]=layer
		
		lagumadu.new_sound(layer,"test5")
		lagumadu.new_sound(layer,"test6")
		lagumadu.new_sound(layer,"test7")
		lagumadu.new_sound(layer,"test8")
	}

	{
		let idx=3
		let layer=lagumadu.new_layer(idx)
		lagumadu.layers[idx]=layer
		
		lagumadu.new_sound(layer,"test9")
		lagumadu.new_sound(layer,"test10")
	}
	
	
	setInterval( lagumadu.update , 100 ) // 10fps?

}

lagumadu.loading=true
lagumadu.update=async function(opts)
{
	if(lagumadu.loading)
	{
		for(let layer of lagumadu.layers)
		{
			for(let sound of layer.sounds)
			{
				if(sound.state()!="loaded")
				{
					console.log( sound.state() )
					return
				}
			}
		}
		lagumadu.loading=false
	}

	for(let layer of lagumadu.layers)
	{
		lagumadu.update_layer(layer)
	}
}

