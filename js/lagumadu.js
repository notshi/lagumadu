
const lagumadu={}
export default lagumadu


import web_data from "./web_data.json" with { type: "json" }


import {Howl, Howler} from 'howler';



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
	
	layer.stereo_num=layer.stereo[0] + ( Math.random()*(layer.stereo[1]-layer.stereo[0]) )
	layer.volume_num=layer.volume[0] + ( Math.random()*(layer.volume[1]-layer.volume[0]) )

//	console.log("update "+layer.idx)

	if(layer.toplay.length==0) { lagumadu.layer_shuffle(layer) } // new shuffle?
	
	layer.sound=layer.toplay.pop()

	layer.sound.stereo(layer.stereo_num)
	layer.sound.volume(layer.volume_num)
	layer.sound.play()
	let vp=Math.floor(layer.volume_num*100)+"%"
	console.log("play",layer.idx,layer.sound.myname,vp,layer.stereo_num)

}

lagumadu.new_sound=function(layer,name)
{
	let sound=new Howl({
		src:[ "./data/"+name+".mp3"  ],
/*
		onplayerror: function()
		{
			console.log("lock")
			lagumadu.locked=true
			sound.once('unlock', function()
			{
				console.log("unlock")
				lagumadu.locked=false
			})
		}
*/
	})
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
	layer.stereo=[0,0]
	layer.volume=[1,1]
	
	return layer
}

lagumadu.start=async function(opts)
{
	console.log("START lagumadu")
	
	lagumadu.layers=[]

	{
		let idx=0
		let layer=lagumadu.new_layer(idx)
		lagumadu.layers[idx]=layer
		
		lagumadu.new_sound(layer,"no1")
		lagumadu.new_sound(layer,"no2")
		lagumadu.new_sound(layer,"no3")
		lagumadu.new_sound(layer,"no4")
		lagumadu.new_sound(layer,"no5")
		lagumadu.new_sound(layer,"no6")
		lagumadu.new_sound(layer,"shh1")
		lagumadu.new_sound(layer,"shh2")
		lagumadu.new_sound(layer,"shh3")
		
		layer.wait=[0,10]
		layer.stereo=[0,0]
		layer.volume=[1,1]
	}

	{
		let idx=1
		let layer=lagumadu.new_layer(idx)
		lagumadu.layers[idx]=layer
		
		lagumadu.new_sound(layer,"bd1")
		lagumadu.new_sound(layer,"bd2")
		lagumadu.new_sound(layer,"bd3")
		lagumadu.new_sound(layer,"bd4")
		lagumadu.new_sound(layer,"shh1")
		lagumadu.new_sound(layer,"shh3")
		lagumadu.new_sound(layer,"bd9")
		lagumadu.new_sound(layer,"bd10")
		lagumadu.new_sound(layer,"bd11")
		lagumadu.new_sound(layer,"bd14")

		layer.wait=[1,10]
		layer.stereo=[-1,1]
		layer.volume=[1,1]
	}

	{
		let idx=2
		let layer=lagumadu.new_layer(idx)
		lagumadu.layers[idx]=layer
		
		lagumadu.new_sound(layer,"bd5")
		lagumadu.new_sound(layer,"bd6")
		lagumadu.new_sound(layer,"bd7")
		lagumadu.new_sound(layer,"bd8")
		lagumadu.new_sound(layer,"shh2")
		lagumadu.new_sound(layer,"shh3")
		lagumadu.new_sound(layer,"bd12")
		lagumadu.new_sound(layer,"bd13")
		lagumadu.new_sound(layer,"bd15")

		layer.wait=[0,5]
		layer.stereo=[-1,1]
		layer.volume=[1,1]
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
		lagumadu.new_sound(layer,"sg6")
		lagumadu.new_sound(layer,"sg7")

		layer.wait=[10,60] // min, max in seconds delay
		layer.stereo=[-1,1]
		layer.volume=[1,1]
	}
	
	
	setInterval( lagumadu.update , 100 ) // 10fps?

}

lagumadu.loading=true
lagumadu.update=async function(opts)
{
	if(lagumadu.locked) // wait for click
	{
		return
	}
	
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

