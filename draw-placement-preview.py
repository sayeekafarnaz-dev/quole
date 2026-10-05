"""Placement illustration only; not a browser screenshot or a replacement character."""
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
NAVY='#00132D'; PAPER='#F7F6F2'; RUST='#9C5A3C'; STONE='#8A8474'; BORDER='#DCDAD1'
font='/System/Library/Fonts/Supplemental/Arial.ttf'
serif='/System/Library/Fonts/Supplemental/Georgia.ttf'
def f(size,heading=False):
    return ImageFont.truetype(serif if heading else font,size)
def draw(w,h,mobile=False):
    im=Image.new('RGB',(w,h),PAPER); d=ImageDraw.Draw(im)
    pad=20 if mobile else 48
    d.text((pad,pad),'QUOLE / ISOLATED PREVIEW',font=f(13),fill=STONE)
    d.text((pad,pad+40),'Assistant placement' if mobile else 'Quole sits above the page, bottom-right',font=f(24 if mobile else 37,True),fill=NAVY)
    if not mobile:
        d.text((pad,pad+100),'Generic test canvas. Existing websites are not modified.',font=f(17),fill=NAVY)
        d.rounded_rectangle((pad,pad+155,690,pad+270),radius=10,fill='white',outline=BORDER)
        d.text((pad+20,pad+175),'Original glasses asset: awaiting supply',font=f(18),fill=NAVY)
        d.text((pad+20,pad+210),'Temporary launcher remains clearly marked.',font=f(15),fill=STONE)
    right=12 if mobile else 24; bottom=16 if mobile else 24
    lw=90 if mobile else 110; lh=62; lx=w-right-lw; ly=h-bottom-lh
    pw=min(370,w-24) if mobile else 370; ph=min(550,h-140) if mobile else 570
    px=w-right-pw; py=ly-12-ph
    d.rounded_rectangle((px+3,py+6,px+pw+3,py+ph+6),radius=14,fill='#E1E0DA')
    d.rounded_rectangle((px,py,px+pw,py+ph),radius=14,fill=PAPER,outline=BORDER)
    d.text((px+16,py+14),'Quole',font=f(26,True),fill=NAVY)
    d.text((px+16,py+49),'Qlogue AI Assistant',font=f(12),fill=STONE)
    d.rounded_rectangle((px+pw-58,py+16,px+pw-14,py+60),radius=6,outline=BORDER)
    d.text((px+pw-43,py+25),'−',font=f(24),fill=NAVY)
    d.line((px,py+78,px+pw,py+78),fill=BORDER)
    d.rounded_rectangle((px+14,py+92,px+pw-34,py+214),radius=9,outline=BORDER)
    d.text((px+26,py+104),'Quole',font=f(11),fill=STONE)
    lines=["Hello, I'm Quole. I can help you", "explore Qlogue's advisory services,", 'technology products and areas of', 'expertise. What would you like to know?']
    for i,line in enumerate(lines):d.text((px+26,py+125+i*19),line,font=f(13),fill=NAVY)
    cy=py+ph-198
    d.line((px,cy,px+pw,cy),fill=BORDER)
    d.rectangle((px+14,cy+26,px+29,cy+41),outline=STONE)
    d.text((px+37,cy+23),'I agree to external AI processing.',font=f(11),fill=NAVY)
    d.text((px+37,cy+39),'Privacy information',font=f(11),fill=NAVY)
    d.rounded_rectangle((px+12,cy+65,px+pw-84,cy+109),radius=7,fill='white',outline=BORDER)
    d.text((px+23,cy+78),'Ask Quole anything...',font=f(13),fill=STONE)
    d.rounded_rectangle((px+pw-76,cy+65,px+pw-12,cy+109),radius=7,fill=RUST)
    d.text((px+pw-60,cy+78),'Send',font=f(13),fill='white')
    for i,line in enumerate(['Quole is an AI assistant. Responses are informational', 'and may require verification. Please do not submit', 'confidential or sensitive information.']):d.text((px+12,cy+119+i*15),line,font=f(10),fill='#615D52')
    d.text((px+12,cy+175),'Contact Qlogue     Clear conversation',font=f(11),fill=NAVY)
    d.rectangle((lx,ly,lx+lw,ly+lh),outline=STONE,width=1)
    for i,line in enumerate(['DEV PLACEHOLDER','Original Quole','asset pending']):d.text((lx+6,ly+8+i*16),line,font=f(9 if mobile else 10),fill=NAVY)
    return im
ROOT.joinpath('preview').mkdir(exist_ok=True)
desktop=draw(1440,900);mobile=draw(390,844,True)
desktop.save(ROOT/'preview/desktop-placement.png');mobile.save(ROOT/'preview/mobile-placement.png')
out=Image.new('RGB',(1440+430,990),'#EAE8E0');d=ImageDraw.Draw(out)
d.text((24,18),'PLACEMENT ILLUSTRATION — not a browser screenshot. Original character not supplied.',font=f(18),fill=NAVY)
out.paste(desktop,(0,65));out.paste(mobile,(1460,65));out.save(ROOT/'preview/placement-overview.png')
