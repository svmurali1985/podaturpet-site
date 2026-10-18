"""Original vector-style motion graphics. Needs Pillow and ffmpeg; no network calls."""
from pathlib import Path
import math, subprocess, os
from PIL import Image, ImageDraw, ImageFont
R=Path(__file__).resolve().parents[1];OUT=R/'images/business-promo';OUT.mkdir(parents=True,exist_ok=True)
W,H,FPS,SECONDS=720,450,20,21
NAVY='#183655';BLUE='#446eec';LIME='#d7f675';INK='#25425e';WHITE='#ffffff';ORANGE='#ffa66e';PINK='#f5a9c5'
FONT_PATH=os.environ.get('PODATURPET_PROMO_FONT','/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf')
FONT=ImageFont.truetype(FONT_PATH,16) if Path(FONT_PATH).exists() else ImageFont.load_default(size=16)
def rr(d,box,fill,r=14,outline=None,width=2):d.rounded_rectangle(tuple(int(x) for x in box),r,fill=fill,outline=outline,width=width)
def line(d,pts,fill=INK,width=3):d.line(pts,fill=fill,width=width,joint='curve')
def star(d,x,y,r=8,fill=LIME):d.polygon([(x,y-r),(x+r*.35,y-r*.35),(x+r,y),(x+r*.35,y+r*.35),(x,y+r),(x-r*.35,y+r*.35),(x-r,y),(x-r*.35,y-r*.35)],fill=fill)
def robot(d,x,y,s=1,t=0):
 def b(a):return [x+a[0]*s,y+a[1]*s,x+a[2]*s,y+a[3]*s]
 d.ellipse(b([-57,92,57,109]),fill='#d5dff2')
 line(d,[(x,y-73*s),(x,y-96*s)],BLUE,max(2,int(4*s)));d.ellipse(b([-9,-110,9,-92]),fill=ORANGE)
 rr(d,b([-50,17,50,91]),WHITE,int(18*s),BLUE,max(2,int(3*s)))
 rr(d,b([-69,-68,69,24]),WHITE,int(25*s),BLUE,max(2,int(3*s)))
 rr(d,b([-54,-53,54,8]),NAVY,int(18*s))
 blink=(t%4)>3.82
 for ex in [-25,25]:
  if blink:line(d,[(x+(ex-7)*s,y-27*s),(x+(ex+7)*s,y-27*s)],LIME,max(2,int(4*s)))
  else:d.ellipse(b([ex-6,-36,ex+6,-19]),fill=LIME)
 d.arc(b([-13,-28,13,-7]),0,180,fill='#f6b4cd',width=max(2,int(3*s)))
 d.ellipse(b([-17,43,17,76]),fill=LIME);d.text((x-12*s,y+46*s),'MR',font=FONT,fill=NAVY)
 line(d,[(x-49*s,y+42*s),(x-78*s,y+(28+math.sin(t*3)*10)*s)],BLUE,max(2,int(8*s)))
 line(d,[(x+49*s,y+42*s),(x+78*s,y+(28-math.sin(t*3)*10)*s)],BLUE,max(2,int(8*s)))
 for ex in [-27,27]:rr(d,b([ex-13,83,ex+13,106]),BLUE,int(7*s))
def person(d,x,y,color,flip=1):
 d.ellipse((x-19,y-84,x+19,y-46),fill='#f4c6a4');rr(d,(x-30,y-42,x+30,y+35),color,17)
 line(d,[(x-14,y+30),(x-18,y+68)],INK,12);line(d,[(x+14,y+30),(x+18,y+68)],INK,12)
 line(d,[(x+flip*23,y-15),(x+flip*62,y+3)],'#f4c6a4',10)
def bubble(d,x,y,w=130,color=WHITE,t=0):
 rr(d,(x,y,x+w,y+55),color,18);d.polygon([(x+22,y+52),(x+20,y+69),(x+43,y+52)],fill=color)
 for j in range(3):
  yy=y+27+math.sin(t*4+j)*3;d.ellipse((x+w/2-27+j*24,yy-5,x+w/2-17+j*24,yy+5),fill=BLUE)
def browser(d,x,y,w=320,h=230):
 rr(d,(x+7,y+12,x+w+7,y+h+12),'#c6d5f4',18);rr(d,(x,y,x+w,y+h),WHITE,18,BLUE)
 rr(d,(x+2,y+2,x+w-2,y+33),'#dbe5ff',14)
 for i in range(3):d.ellipse((x+16+i*14,y+13,x+22+i*14,y+19),fill=['#f6ab90','#e6d17f','#81c9b2'][i])
 line(d,[(x+14,y+33),(x+w-14,y+33)],BLUE,2)
def store(d,x,y,w=240,h=160):
 if h<100:
  rr(d,(x,y,x+w,y+h),WHITE,7,INK);rr(d,(x,y-10,x+w,y+12),ORANGE,5);rr(d,(x+10,y+23,x+w-10,y+h-8),BLUE,4);return
 rr(d,(x,y,x+w,y+h),'#fff8ea',10,INK);rr(d,(x+20,y+50,x+w-20,y+h-17),WHITE,5)
 rr(d,(x+27,y+60,x+w*.56,y+h-27),'#dce8ff',6);rr(d,(x+w*.65,y+58,x+w-24,y+h-10),'#d7ecd7',7)
 for j in range(6):
  xx=x+j*w/6;rr(d,(xx,y-22,xx+w/6+1,y+26),ORANGE if j%2 else WHITE,7,INK,1)
 rr(d,(x+43,y-64,x+w-43,y-29),NAVY,8);star(d,x+w/2,y-47,10)
def map_pin(d,x,y,color):
 d.polygon([(x-15,y),(x+15,y),(x,y+28)],fill=color);d.ellipse((x-18,y-22,x+18,y+12),fill=color);d.ellipse((x-7,y-11,x+7,y+3),fill=WHITE)
def scene(n,u,t):
 im=Image.new('RGB',(W,H),'#eef3ff');d=ImageDraw.Draw(im)
 # Gentle decorative shapes, no flashing or rapid cuts.
 d.ellipse((490,-150,850,190),fill='#e0e8ff');d.ellipse((-160,250,200,610),fill='#e6f0df')
 for x,y in [(46,54),(655,334),(595,67)]:star(d,x,y,6+math.sin(t*2)*1.5,'#b9c9ef')
 rr(d,(34,25,91,51),NAVY,10);d.text((47,28),'MR',font=FONT,fill=LIME)
 if n in [2,3,4,6]:
  rr(d,(554,24,682,61),LIME,10);d.text((587,31),'FREE',font=FONT,fill=NAVY)
 # Seven small scene markers.
 for j in range(7):rr(d,(304+j*17,422,313+j*17,427),BLUE if j==n else '#c5d2ee',3)
 bob=math.sin(t*2.5)*4
 if n==0:
  d.ellipse((153,337,560,371),fill='#d2def0');person(d,245,249,BLUE);person(d,467,249,'#e9a27a',-1)
  rr(d,(231,281,482,294),NAVY,7);line(d,[(260,293),(247,351)],NAVY,8);line(d,[(453,293),(466,351)],NAVY,8)
  browser(d,304,215,102,65);bubble(d,273,82,168,t=t);robot(d,595,285+bob,.62,t)
 elif n==1:
  store(d,122,191,255,172);robot(d,506,245+bob,.95,t)
  d.polygon([(397,155),(449,130),(449,192),(397,175)],fill=ORANGE,outline=INK);rr(d,(389,153,405,177),NAVY,4)
  for k in range(3):d.arc((445-k*12,134-k*10,482+k*12,186+k*10),280,80,fill=BLUE,width=3)
  for j in range(8):star(d,130+j*58,101+math.sin(t*2+j)*12,5,[LIME,PINK,ORANGE][j%3])
 elif n==2:
  browser(d,83,93,398,277)
  rr(d,(107,145,302,225),NAVY,9);rr(d,(319,145,453,225),'#dce8ff',9);star(d,386,185,26,BLUE)
  for j in range(3):rr(d,(108+j*118,244,213+j*118,335),['#e5f2df','#ffeddb','#eee7ff'][j],8)
  rr(d,(125,168,261,177),WHITE,4);rr(d,(125,189,222,196),'#8fa9d5',4);rr(d,(126,208,185,217),LIME,4)
  robot(d,579,259+bob,.83,t)
 elif n==3:
  robot(d,350,255+bob,1.2,t);bubble(d,91,113,150,t=t);bubble(d,470,135,154,'#dff2ce',t+1)
  bubble(d,498,261,135,'#ffe9d4',t+2);star(d,188,285,27,PINK)
 elif n==4:
  nodes=[(106,120),(470,120),(470,300),(106,300)]
  for j,(x,y) in enumerate(nodes):
   nx,ny=nodes[(j+1)%4];line(d,[(x+55,y),(nx+55,ny)],'#b7c8e8',4)
  points=[(161+(364*u),120),(525,120+180*u),(525-364*u,300),(161,300-180*u)]
  px,py=points[int(t)%4];d.ellipse((px-8,py-8,px+8,py+8),fill=BLUE)
  for j,(x,y) in enumerate(nodes):
   rr(d,(x,y-36,x+110,y+36),WHITE,13,BLUE,2)
   for k in range(3):rr(d,(x+19,y-19+k*15,x+91,y-13+k*15),['#d5e5ff','#dcebb9','#ffd6b6'][j%3],3)
  robot(d,346,225+bob,.7,t)
 elif n==5:
  rr(d,(85,102,550,367),'#e0efd9',18)
  line(d,[(95,242),(202,242),(280,136),(400,136),(525,281)],WHITE,23);line(d,[(215,350),(215,242),(418,242),(418,350)],WHITE,18)
  map_pin(d,186,192,BLUE);map_pin(d,402,159,'#ec9668');map_pin(d,400,299,'#8068d7')
  store(d,111,284,91,62);robot(d,595,255+bob,.85,t)
 else:
  robot(d,359,239+bob,1.03,t)
  for j in range(6):
   a=j*math.pi/3+t*.16;x=359+math.cos(a)*218;y=227+math.sin(a)*130
   rr(d,(x-30,y-23,x+30,y+23),[WHITE,'#ffe7ca','#e2edc8','#e5ddfc'][j%4],12,BLUE,1)
   if j%2:star(d,x,y,11,BLUE)
   else:
    for k in range(2):rr(d,(x-16,y-8+k*12,x+16,y-3+k*12),BLUE,2)
 return im

def render():
 cmd=['ffmpeg','-hide_banner','-loglevel','error','-y','-f','rawvideo','-vcodec','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','-','-an','-c:v','libx264','-preset','medium','-crf','24','-pix_fmt','yuv420p','-movflags','+faststart',str(OUT/'business-help.mp4')]
 proc=subprocess.Popen(cmd,stdin=subprocess.PIPE)
 for frame in range(FPS*SECONDS):
  t=frame/FPS;n=min(6,int(t//3));u=(t%3)/3
  im=scene(n,u,t)
  # Crossfade last 0.3 s of each scene into the next; loop also blends.
  if u>.9:im=Image.blend(im,scene((n+1)%7,0,t),min(1,(u-.9)/.1))
  proc.stdin.write(im.tobytes())
  if frame==int(FPS*1.5):im.save(OUT/'business-help-poster.webp','WEBP',quality=85,method=6)
 proc.stdin.close();assert proc.wait()==0
 print('Created',OUT/'business-help.mp4')
if __name__=='__main__':render()
