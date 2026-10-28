from pathlib import Path
import subprocess,json
root=Path(__file__).resolve().parent
evidence=root.parent/'test'/'acceptance'
media=root/'media';media.mkdir(exist_ok=True)
segments=[
 ('Observed Sepolia records', 'sepolia-record-1.jpg', 'This development walkthrough presents the Volunteer Hours Registry for COMP seven six one zero. It uses captured browser evidence rather than claiming to be the final live testnet demonstration. The project lets recognized organizations approve volunteer service minutes, while anyone can check a record and its correction history. This first screen reads an actual Sepolia contract without connecting a wallet. The old record is corrected. The issuing organization is inactive, and its legacy example metadata is explicitly unverified. Blockchain state is not proof that a person really attended.'),
 ('Application workflow on a local EVM', 'local-claim-approved.jpg', 'The implemented frontend contains four workspaces: public verification, my service, organization, and administration. In the local browser integration run, an administrator registered a demo organization. The organization created an activity. A volunteer submitted one hundred and twenty minutes, and the organization approved ninety. Approval automatically issued a service record in the same transaction. These operations ran the real Solidity code on a local Ethereum virtual machine. The local test banner is visible. This is genuine local contract execution, but it is not a new Sepolia wallet transaction.'),
 ('Correction and revocation history', 'local-status-refresh-fixed.jpg', 'Approved facts cannot be edited silently. The issuer issued a linked replacement, then a second correction. The earlier records stayed readable, with links in both directions. Revocation invalidated the latest record without deleting the history. Browser testing discovered a stale status after a successful correction. That defect was fixed. The current build refreshes the displayed record after a confirmed write, shows the last lookup time, and provides a refresh control. This screen shows the correctly refreshed revoked state.'),
 ('Wallet-free verification and metadata', 'local-public-valid-viewport.jpg', 'An independent page with no test wallet connected successfully read the final local record. Its issuer had been deactivated, but the record itself remained valid, which is the contract rule. The administrator can still handle an exceptional correction. Organization and activity names are marked verified only when their exact downloaded bytes match the on-chain hash. The frontend distinguishes an unavailable or mismatched metadata file from the validity of the service record. A hash is an integrity commitment, not encryption and not proof of attendance.'),
 ('Verification results and responsive layout', 'mobile-390.jpg', 'Fifteen automated tests passed. They cover integer and date boundaries, metadata integrity, review permissions, rejection without issuance, public history, multiple corrections, revocation, activity closure and administrator intervention. Separate browser operation created fourteen successful local transactions, three claims and five records. Wallet rejection produced a clear message instead of fake success. An unauthorized wallet could not enter administration. A three hundred and ninety pixel viewport had no horizontal overflow. A clean installation passed the same tests and the production build. These are functional results, not production performance measurements.'),
 ('Team handoff and remaining final evidence', 'local-admin-correction.jpg', 'The ownership boundary is agreed: the friend maintains contracts and deployment, while this work delivers the frontend and integration tests. The repository includes a readable report draft, source code, configuration, a merge protocol and evidence files. Before the final course submission, the team must add real member details, publish usable demo metadata, confirm the deployment transaction, and record a fresh signed Sepolia workflow through the frontend. The final English video must remain within fifteen minutes. Each student must also complete the individual peer assignment. Private keys should never be shared. This draft honestly separates completed frontend work from the remaining team actions.'),
]
script=['# English evidence walkthrough script','', 'Status: development draft. Captured screens with generated English narration; not the final signed Sepolia live demonstration.','']
clips=[]
for i,(title,image,text) in enumerate(segments,1):
 script+=['## '+str(i)+'. '+title,'',text,'']
 textfile=media/f'{i:02d}.txt';textfile.write_text(text)
 audio=media/f'{i:02d}.aiff'
 subprocess.run(['say','-v','Samantha','-r','155','-f',str(textfile),'-o',str(audio)],check=True)
 duration=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',str(audio)],text=True).strip())+1
 caption=f'DRAFT {i}/6 - {title}'
 vf=(f"crop=iw:min(ih\\,900):0:(ih-oh)*min(t/{duration}\\,1),"
     "scale=1920:980:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:0:color=0x172c25,"
     "drawbox=x=0:y=980:w=1920:h=100:color=0x172c25:t=fill,"
     f"drawtext=fontfile=/System/Library/Fonts/Supplemental/Arial.ttf:text='{caption}':fontcolor=white:fontsize=31:x=45:y=995,"
     "drawtext=fontfile=/System/Library/Fonts/Supplemental/Arial.ttf:text='Captured browser evidence - final testnet signing and team details pending':fontcolor=0xcbd8cd:fontsize=23:x=45:y=1041")
 clip=media/f'{i:02d}.mp4'
 with (media/f'{i:02d}.log').open('w') as log:
  subprocess.run(['ffmpeg','-y','-loop','1','-framerate','25','-i',str(evidence/image),'-i',str(audio),'-vf',vf,'-af','apad','-t',str(duration),'-c:v','libx264','-preset','veryfast','-crf','24','-pix_fmt','yuv420p','-c:a','aac','-b:a','128k',str(clip)],check=True,stdout=log,stderr=log)
 clips.append(clip);print('Rendered chapter',i,round(duration,1),'seconds',flush=True)
(root/'demo_script.md').write_text('\n'.join(script))
concat=media/'concat.txt';concat.write_text(''.join("file '"+str(p).replace("'","'\\''")+"'\n" for p in clips))
subprocess.run(['ffmpeg','-y','-f','concat','-safe','0','-i',str(concat),'-c','copy','-movflags','+faststart',str(root/'demo_walkthrough_draft.mp4')],check=True,stdout=subprocess.DEVNULL,stderr=(media/'concat.log').open('w'))
probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(root/'demo_walkthrough_draft.mp4')],text=True))
(root/'demo_media_probe.json').write_text(json.dumps(probe,indent=2)+'\n')
print('Video complete',probe['format']['duration'],'seconds',flush=True)
