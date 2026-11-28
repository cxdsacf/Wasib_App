import os,sys
from PIL import Image,ImageDraw
R='android/app/src/main/res'
BLUE='#7138E8'
if not os.path.isdir(R):
    sys.exit('res folder not found: '+R)
mask=Image.open('www/assets/icons/maskable-512.png').convert('RGBA')
icon=Image.open('www/assets/icons/icon-512.png').convert('RGBA')
L={'mdpi':48,'hdpi':72,'xhdpi':96,'xxhdpi':144,'xxxhdpi':192}
F={'mdpi':108,'hdpi':162,'xhdpi':216,'xxhdpi':324,'xxxhdpi':432}
def circ(im,n):
    im=im.resize((n,n),Image.LANCZOS);m=Image.new('L',(n,n),0);ImageDraw.Draw(m).ellipse((0,0,n-1,n-1),fill=255);o=Image.new('RGBA',(n,n),(0,0,0,0));o.paste(im,(0,0),m);return o
done=0
for d in L:
    p=f'{R}/mipmap-{d}'
    if not os.path.isdir(p):continue
    icon.resize((L[d],L[d]),Image.LANCZOS).save(f'{p}/ic_launcher.png')
    circ(mask,L[d]).save(f'{p}/ic_launcher_round.png')
    mask.resize((F[d],F[d]),Image.LANCZOS).save(f'{p}/ic_launcher_foreground.png')
    done+=1
os.makedirs(f'{R}/values',exist_ok=True)
open(f'{R}/values/ic_launcher_background.xml','w').write(f'<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">{BLUE}</color>\n</resources>\n')
sp=0
for r,_,fs in os.walk(R):
    for f in fs:
        if f=='splash.png':
            fp=os.path.join(r,f);w,h=Image.open(fp).size;im=Image.new('RGB',(w,h),'#FFF9F4');n=int(min(w,h)*.26);g=icon.resize((n,n),Image.LANCZOS);im.paste(g,((w-n)//2,(h-n)//2),g);im.save(fp);sp+=1
print(f'icons updated in {done} densities, splash images replaced: {sp}')
