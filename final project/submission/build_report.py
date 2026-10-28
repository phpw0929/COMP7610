from pathlib import Path
import re
from xml.sax.saxutils import escape
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Flowable
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

root=Path(__file__).resolve().parent
font=Path('/System/Library/Fonts/Supplemental/Arial.ttf')
if font.exists():pdfmetrics.registerFont(TTFont('ReportArial',str(font)))
fontname='ReportArial' if font.exists() else 'Helvetica'
styles=getSampleStyleSheet()
styles.add(ParagraphStyle(name='ReportBody',fontName=fontname,fontSize=10.2,leading=15,spaceAfter=9,textColor=colors.HexColor('#26372f')))
styles.add(ParagraphStyle(name='ReportTitle',fontName=fontname,fontSize=25,leading=30,spaceAfter=15,textColor=colors.HexColor('#285e4e')))
styles.add(ParagraphStyle(name='ReportHeading',fontName=fontname,fontSize=15,leading=20,spaceBefore=15,spaceAfter=9,textColor=colors.HexColor('#285e4e'),keepWithNext=True))
styles.add(ParagraphStyle(name='Caption',fontName=fontname,fontSize=8,leading=11,textColor=colors.HexColor('#647168'),spaceAfter=12))
story=[]
images={}

class Architecture(Flowable):
 def __init__(self):
  Flowable.__init__(self);self.width=490;self.height=175
 def draw(self):
  c=self.canv
  def box(x,y,w,h,lines):
   c.setFillColor(colors.HexColor('#edf1e9'));c.setStrokeColor(colors.HexColor('#c5d1c5'));c.roundRect(x,y,w,h,4,fill=1,stroke=1)
   c.setFillColor(colors.HexColor('#20352e'));c.setFont(fontname,9)
   for i,line in enumerate(lines):c.drawCentredString(x+w/2,y+h-15-i*12,line)
  def arrow(x,y,x2,y2):
   c.setStrokeColor(colors.HexColor('#2c6655'));c.line(x,y,x2,y2)
   c.line(x2,y2,x2-5,y2+3);c.line(x2,y2,x2-5,y2-3)
  box(0,61,140,64,['React interface','Public / Volunteer','Organization / Admin'])
  box(170,110,140,43,['Read-only RPC','No wallet signature'])
  box(170,35,140,43,['MetaMask signer','Account and chain checks'])
  box(350,75,140,52,['Solidity registry','Permissions and states'])
  box(350,5,140,43,['Public metadata JSON','Check exact-byte hash'])
  arrow(140,110,170,131);arrow(140,75,170,56);arrow(310,131,350,112);arrow(310,56,350,88)
  c.line(70,61,70,25);arrow(70,25,350,25)


source=(root/'project_report_draft.md').read_text()
for block in source.split('\n\n'):
 block=block.strip()
 if not block:continue
 if block.startswith('# '):story.append(Paragraph(escape(block[2:]),styles['ReportTitle']))
 elif block.startswith('## '):
  if block == '## 4. Implementation':
   story.extend([Architecture(),Spacer(1,6),Paragraph('Figure 1. Implemented read/write separation and metadata integrity checks. RPC access does not confer signing authority.',styles['Caption'])])
  story.append(Paragraph(escape(block[3:]),styles['ReportHeading']))
 else:
  text=escape(block).replace('\n','<br/>')
  text=re.sub(r'(https?://[^\s<]+)',lambda m:f'<link href="{m.group(1)}" color="#285e4e">{m.group(1)}</link>',text)
  story.append(Paragraph(text,styles['ReportBody']))

def page(canvas,doc):
 canvas.saveState(); canvas.setStrokeColor(colors.HexColor('#dce1d8')); canvas.line(48,44,A4[0]-48,44)
 canvas.setFont(fontname,8);canvas.setFillColor(colors.HexColor('#647168'))
 canvas.drawString(48,30,'COMP7610 | Implementation and evidence draft | 28 October 2026')
 canvas.drawRightString(A4[0]-48,30,str(doc.page));canvas.restoreState()
SimpleDocTemplate(str(root/'project_report_draft.pdf'),pagesize=A4,rightMargin=48,leftMargin=48,topMargin=45,bottomMargin=60,title='Volunteer Service-Hour Verification DApp - Draft',author='COMP7610 team - identities pending').build(story,onFirstPage=page,onLaterPages=page)
print(root/'project_report_draft.pdf')
