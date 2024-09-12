
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
	
	if(!layer.time_now)
	{
		layer.time_now=(performance.now()/1000)
	}

	if(!layer.time_len)
	{
		layer.time_len=layer.wait[0]+((layer.wait[1]-layer.wait[0])*Math.random())
		console.log("wait",layer.idx,layer.time_len)
	}
	
	if( layer.time_now + layer.time_len > (performance.now()/1000) )
	{
		return // wait
	}

	layer.time_now=null
	layer.time_len=null

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
	
	layer.wait=[0,0]
	
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
		
		layer.wait=[0,0]
	}

	{
		let idx=1
		let layer=lagumadu.new_layer(idx)
		lagumadu.layers[idx]=layer
		
		lagumadu.new_sound(layer,"bd1")
		lagumadu.new_sound(layer,"bd2")
		lagumadu.new_sound(layer,"bd3")
		lagumadu.new_sound(layer,"bd4")

		layer.wait=[0,2]
	}

	{
		let idx=2
		let layer=lagumadu.new_layer(idx)
		lagumadu.layers[idx]=layer
		
		lagumadu.new_sound(layer,"bd5")
		lagumadu.new_sound(layer,"bd6")
		lagumadu.new_sound(layer,"bd7")
		lagumadu.new_sound(layer,"bd8")

		layer.wait=[0,2]
	}

	{
		let idx=3
		let layer=lagumadu.new_layer(idx)
		lagumadu.layers[idx]=layer
		
		lagumadu.new_sound(layer,"sg1")
		lagumadu.new_sound(layer,"sg2")
		lagumadu.new_sound(layer,"sg3")
		lagumadu.new_sound(layer,"sg4")
		lagumadu.new_sound(layer,"sg5")

		layer.wait=[10,60]
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

