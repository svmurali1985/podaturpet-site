"""Create an original gentle music bed and mux it into the original promo. No samples/APIs."""
from pathlib import Path
import math, array, subprocess, tempfile, wave
R=Path(__file__).resolve().parents[1];target=R/'images/business-promo/business-help.mp4'
SR=44100;DURATION=21
notes=[523.25,659.25,783.99,659.25,440,523.25,659.25,523.25,349.23,440,523.25,659.25,392,493.88,587.33,783.99]
chords=[(261.63,329.63,392),(220,261.63,329.63),(174.61,220,261.63),(196,246.94,293.66)]
samples=array.array('h')
for i in range(SR*DURATION):
 t=i/SR;beat=t%0.5;idx=int(t/.5)%len(notes);env=math.exp(-beat*7)*(min(1,beat/.015));freq=notes[idx]
 melody=(math.sin(2*math.pi*freq*t)+.18*math.sin(4*math.pi*freq*t))*env*.075
 chord=chords[int(t/2)%4];pad=sum(math.sin(2*math.pi*f*t) for f in chord)/3*.04
 pulse=math.sin(2*math.pi*95*t)*math.exp(-(t%1)*20)*.035
 fade=min(1,t/.6,(DURATION-t)/.9);v=(melody+pad+pulse)*fade
 samples.append(int(max(-1,min(1,v))*32767))
with tempfile.TemporaryDirectory() as temp:
 wav=Path(temp)/'original-music.wav';out=Path(temp)/'with-audio.mp4'
 with wave.open(str(wav),'wb') as w:w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes(samples.tobytes())
 subprocess.run(['ffmpeg','-v','error','-y','-i',str(target),'-i',str(wav),'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','96k','-shortest','-movflags','+faststart',str(out)],check=True)
 target.write_bytes(out.read_bytes())
print('Added original 21-second music bed to MP4')
