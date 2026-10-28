"""Package a clean committed revision. Does not push, deploy or submit coursework."""
from datetime import datetime, timezone
from pathlib import Path
import hashlib
import json
import os
import subprocess
import tempfile
import zipfile

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
BASE = '21ad35e7aaaf611ece5405b3c2681dc8a4dc89a1'


def git(*args, env=None):
    result = subprocess.run(['git', '-c', 'core.excludesFile=/dev/null', *args], cwd=ROOT, env=env, capture_output=True)
    if result.returncode:
        raise SystemExit(result.stderr.decode(errors='replace'))
    return result.stdout


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def describe(path):
    return {'bytes': path.stat().st_size, 'sha256': digest(path)}


def json_bytes(value):
    return (json.dumps(value, indent=2, ensure_ascii=False) + '\n').encode()


def main():
    if git('status', '--porcelain', '--untracked-files=all').strip():
        raise SystemExit('Commit the intended changes and keep the worktree clean before packaging.')
    revision = git('rev-parse', 'HEAD').decode().strip()
    tree = git('rev-parse', 'HEAD^{tree}').decode().strip()
    tracked = sorted(p for p in git('ls-files', '-z').decode().split('\0') if p)
    for name in tracked:
        parts = Path(name).parts
        if '.git' in parts or 'node_modules' in parts or 'dist' in parts or Path(name).name.startswith('.env') and Path(name).name != '.env.example':
            raise SystemExit(f'Unexpected private/generated tracked path: {name}')
    frontend = [{'path': name, 'sha256': digest(ROOT / name)} for name in tracked if name.startswith('final project/dapp/')]
    canonical = json.dumps(frontend, sort_keys=True, separators=(',', ':'), ensure_ascii=False).encode()
    fingerprint = hashlib.sha256(canonical).hexdigest()
    artifacts = [HERE / name for name in ('project_report_draft.docx', 'project_report_draft.pdf', 'demo_walkthrough_draft.mp4', 'browser-regression-repro.mp4')]
    artifacts += [ROOT / 'final project/handoff/frontend_code_handoff.md']
    manifest = (HERE / 'submission_manifest.md').read_text()
    for path in artifacts:
        if digest(path) not in manifest:
            raise SystemExit(f'Update submission_manifest.md for {path.name} before committing.')
    if fingerprint not in manifest:
        raise SystemExit('Update the canonical frontend file-list fingerprint in submission_manifest.md.')
    media = HERE / 'media'
    media.mkdir(exist_ok=True)
    patch = HERE / 'frontend_delivery.patch'
    patch_tmp = media / 'frontend_delivery.tmp.patch'
    patch_tmp.write_bytes(git('diff', '--binary', '--full-index', BASE, revision, '--'))
    with tempfile.TemporaryDirectory(prefix='comp7610-patch-') as temporary:
        env = dict(os.environ, GIT_INDEX_FILE=str(Path(temporary) / 'index'))
        git('read-tree', BASE, env=env)
        git('apply', '--cached', '--binary', str(patch_tmp), env=env)
        if git('write-tree', env=env).decode().strip() != tree:
            raise SystemExit('Applied patch does not reproduce the committed source tree.')
    patch_tmp.replace(patch)
    receipt = {
        'createdAt': datetime.now(timezone.utc).isoformat(),
        'sourceCommit': revision,
        'sourceTree': tree,
        'patchBase': BASE,
        'patchFormat': 'Cumulative binary git diff; validated against a temporary index',
        'sourceDirectory': str(ROOT),
        'trackedFileCount': len(tracked),
        'frontendFileCount': len(frontend),
        'frontendFileListSHA256': fingerprint,
        'frontendFingerprintAlgorithm': 'SHA256 of UTF-8 compact sorted-key JSON [{path,sha256}], sorted by repo-relative path, no final newline',
        'contractAndOriginalArtifactsModified': bool(git('diff', '--name-only', BASE, revision, '--', 'final project/dapp/contracts', 'final project/dapp/artifacts').strip()),
        'packagingRun': {'pushedToRemote': False, 'courseSubmitted': False, 'signedSepoliaTransaction': False},
        'statusDocument': 'final project/handoff/integration_status.md',
        'files': {str(path.relative_to(ROOT)): describe(path) for path in [patch, *artifacts]},
        'archiveChecksumNote': 'The receipt inside the ZIP omits the outer archive checksum to avoid circular hashing; the external sibling receipt includes it.',
    }
    archive = HERE / 'frontend_delivery.zip'
    archive_tmp = media / 'frontend_delivery.tmp.zip'
    extra = [patch, HERE / 'demo_walkthrough_draft.mp4', HERE / 'browser-regression-repro.mp4']
    with zipfile.ZipFile(archive_tmp, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=6) as output:
        for name in tracked:
            output.write(ROOT / name, name)
        for path in extra:
            output.write(path, str(path.relative_to(ROOT)))
        output.writestr('final project/submission/delivery_receipt.json', json_bytes(receipt))
    with zipfile.ZipFile(archive_tmp) as packed:
        if packed.testzip() is not None:
            raise SystemExit('Archive CRC verification failed.')
        expected = set(tracked) | {str(path.relative_to(ROOT)) for path in extra} | {'final project/submission/delivery_receipt.json'}
        if set(packed.namelist()) != expected or len(packed.namelist()) != len(expected):
            raise SystemExit('Archive entry set does not match the committed source plus approved attachments.')
    if git('status', '--porcelain', '--untracked-files=all').strip() or git('rev-parse', 'HEAD').decode().strip() != revision:
        raise SystemExit('Source changed while packaging; rerun after committing.')
    archive_tmp.replace(archive)
    receipt['archive'] = {'name': archive.name, **describe(archive)}
    (HERE / 'delivery_receipt.json').write_bytes(json_bytes(receipt))
    print(json.dumps({'sourceCommit': revision, 'trackedFiles': len(tracked), 'archive': receipt['archive'], 'patchTreeVerified': True}, indent=2))


if __name__ == '__main__':
    main()
