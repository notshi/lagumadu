
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

lagumadu.log=function(idx,text)
{
	if( !lagumadu.logdivs )
	{
		lagumadu.logdivs=[]
		lagumadu.logdivs[0]=document.getElementById("chan0");
		lagumadu.logdivs[1]=document.getElementById("chan1");
		lagumadu.logdivs[2]=document.getElementById("chan2");
		lagumadu.logdivs[3]=document.getElementById("chan3");
	}
	if(idx==-1) // all\
	{
		for(let d of lagumadu.logdivs)
		{
			d.innerText=text
		}
	}
	let d=lagumadu.logdivs[idx]
	if(d)
	{
		d.innerText=text
	}
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

			let t=layer.play_now + layer.sound._duration - (performance.now()/1000)
			let vp=Math.floor(layer.volume_num*100)+"%"
			let sp=layer.stereo_num.toFixed(2)
			if(sp>=0){sp="+"+sp}
			lagumadu.log(layer.idx,"play "+vp+" "+sp+"<> "+layer.sound.myname.padStart(12," ")+" "+t.toFixed(1))

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
	}
	
	if( layer.time_now + layer.time_len > (performance.now()/1000) )
	{
		let t=layer.time_now + layer.time_len - (performance.now()/1000)
		lagumadu.log(layer.idx,"wait "+t.toFixed(1))
		return // wait
	}

	layer.time_now=null
	layer.time_len=null
	
	layer.stereo_num=layer.stereo[0] + ( Math.random()*(layer.stereo[1]-layer.stereo[0]) )
	layer.volume_num=layer.volume[0] + ( Math.random()*(layer.volume[1]-layer.volume[0]) )

	if(layer.toplay.length==0) { lagumadu.layer_shuffle(layer) } // new shuffle?
	
	layer.sound=layer.toplay.pop()

	layer.sound.stereo(layer.stereo_num)
	layer.sound.volume(layer.volume_num)
	layer.sound.play()
	layer.play_now=(performance.now()/1000)

}

lagumadu.new_sound=function(layer,name)
{
	let sound=new Howl({
		src:[ "./data/"+name+".mp3"  ],
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
	lagumadu.log(-1,"start")
	
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

	document.addEventListener("click",function(){lagumadu.clicked=true})
	
}

lagumadu.clicked=false
lagumadu.loading=1
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
					lagumadu.loading++
					lagumadu.log(-1,sound.state()+" "+lagumadu.loading )
					return
				}
			}
		}
		lagumadu.loading=false
	}
	if(!lagumadu.clicked)
	{
		lagumadu.log(-1,"CLICK ANYWHERE TO BEGIN THE INVOCATION" )
		return
	}

	for(let layer of lagumadu.layers)
	{
		lagumadu.update_layer(layer)
	}
}

