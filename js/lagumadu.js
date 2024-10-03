
const lagumadu={}
export default lagumadu


import web_data from "./web_data.json" with { type: "json" }


import {Howl, Howler} from 'howler';

let randopicko=function(a)
{
	let i=Math.floor(Math.random()*a.length)
	return a[i]
}

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
		lagumadu.logdivs[4]=document.getElementById("chan4");
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
		layer.time_len=randopicko(layer.wait)
	}
	
	if( layer.time_now + layer.time_len > (performance.now()/1000) )
	{
		let t=layer.time_now + layer.time_len - (performance.now()/1000)
		lagumadu.log(layer.idx,"wait "+t.toFixed(1))
		return // wait
	}

	layer.time_now=null
	layer.time_len=null
	
	layer.stereo_num=randopicko(layer.stereo)
	layer.volume_num=randopicko(layer.volume)

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
	
	layer.wait=[0]
	layer.stereo=[0]
	layer.volume=[1]
	
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
		lagumadu.new_sound(layer,"sg6")
		lagumadu.new_sound(layer,"no7")
		lagumadu.new_sound(layer,"no8")
		lagumadu.new_sound(layer,"no9")
		lagumadu.new_sound(layer,"no10")
		lagumadu.new_sound(layer,"no11")
		lagumadu.new_sound(layer,"no12")
		lagumadu.new_sound(layer,"no13")
		lagumadu.new_sound(layer,"no14")
		lagumadu.new_sound(layer,"no15")
		lagumadu.new_sound(layer,"no16")
		
		layer.wait=[0,10,20]
		layer.stereo=[0]
		layer.volume=[0.5]
	}

	{
		let idx=1
		let layer=lagumadu.new_layer(idx)
		lagumadu.layers[idx]=layer
		
		lagumadu.new_sound(layer,"bd1")
		lagumadu.new_sound(layer,"bd3")
		lagumadu.new_sound(layer,"bd4")
		lagumadu.new_sound(layer,"shh3")
		lagumadu.new_sound(layer,"bd9")
		lagumadu.new_sound(layer,"bd10")
		lagumadu.new_sound(layer,"bd14")
		lagumadu.new_sound(layer,"bd17")
		lagumadu.new_sound(layer,"bd18")
		lagumadu.new_sound(layer,"bd19")
		lagumadu.new_sound(layer,"bd20")
		lagumadu.new_sound(layer,"bd31")
		lagumadu.new_sound(layer,"bd32")
		lagumadu.new_sound(layer,"bd33")
		lagumadu.new_sound(layer,"bd34")
		lagumadu.new_sound(layer,"bd35")
		lagumadu.new_sound(layer,"bd36")
		lagumadu.new_sound(layer,"bd37")
		lagumadu.new_sound(layer,"bd38")

		layer.wait=[0,5,10]
		layer.stereo=[-1,0.5,1]
		layer.volume=[0.5]
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
		lagumadu.new_sound(layer,"bd16")
		lagumadu.new_sound(layer,"bd22")
		lagumadu.new_sound(layer,"bd23")
		lagumadu.new_sound(layer,"bd25")
		lagumadu.new_sound(layer,"bd26")
		lagumadu.new_sound(layer,"bd28")
		lagumadu.new_sound(layer,"bd29")
		lagumadu.new_sound(layer,"bd40")
		lagumadu.new_sound(layer,"bd41")
		lagumadu.new_sound(layer,"bd42")
		lagumadu.new_sound(layer,"bd43")
		lagumadu.new_sound(layer,"bd44")
		lagumadu.new_sound(layer,"bd45")

		layer.wait=[0,1,2,3,4,5]
		layer.stereo=[-1,0,1]
		layer.volume=[0.5]
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
		lagumadu.new_sound(layer,"sg9")
		lagumadu.new_sound(layer,"sg10")
		lagumadu.new_sound(layer,"sg11")
		lagumadu.new_sound(layer,"sg12")
		lagumadu.new_sound(layer,"sg13")

		layer.wait=[10,20,30,40,50,60]
		layer.stereo=[-1,-0.5,1]
		layer.volume=[0.5]
	}

	{
		let idx=4 // Short sounds
		let layer=lagumadu.new_layer(idx)
		lagumadu.layers[idx]=layer
		
		lagumadu.new_sound(layer,"sg7")
		lagumadu.new_sound(layer,"bd2")
		lagumadu.new_sound(layer,"bd11")
		lagumadu.new_sound(layer,"bd21")
		lagumadu.new_sound(layer,"bd24")
		lagumadu.new_sound(layer,"bd27")
		lagumadu.new_sound(layer,"bd30")
		lagumadu.new_sound(layer,"bd39")

		layer.wait=[30,70,110]
		layer.stereo=[-1,1]
		layer.volume=[0.3,0.7]
	}
	
	
	setInterval( lagumadu.update , 100 ) // 10fps?

	document.addEventListener("click",function(){lagumadu.clicked=true})
	
	// will firefox allow audio to just work?
	if( navigator && navigator.getAutoplayPolicy ) // this is firefox?
	{
		if( navigator.getAutoplayPolicy("mediaelement") === "allowed" )
		{
			lagumadu.clicked=true
		}
	}
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
		lagumadu.log(-1,"CHANNEL LOADED - CLICK ANYWHERE TO START" )
		return
	}

	for(let layer of lagumadu.layers)
	{
		lagumadu.update_layer(layer)
	}
}

