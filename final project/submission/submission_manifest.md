# 本地交付清单

更新日期：2026-10-28。完整前端源码与主要验收证据已完成；这是开发交付，不是已完成的课程提交。

## 版本与分工

- 原始基线：`21ad35e`；接口交接：`fc728cb`。
- 用户确认：朋友负责合约/部署，我方负责前端；真实成员身份与最终贡献最后补。
- 当前交付目录：`/Users/diannao/Desktop/HKU/Semester-1/COMP7610/delivery`；原 repo 目录未覆盖。
- 前端目录源码指纹（路径 + 各文件 SHA256；不含依赖/构建/本地环境/测试账号）：`cded988446ac9ee6dae8723bbdd64af00595eb2888420ca334cf097dab6075e7`。
- 指纹覆盖 25 个源码/配置/原始产物文件；完整 Git commit、patch 和 ZIP 校验见打包后生成的 delivery_receipt.json。

## 交付文件与 SHA256

| 文件 | 大小 bytes | SHA256 |
| --- | --- | --- |
| `final project/submission/project_report_draft.pdf` | 46656 | `315726a2e8a5b0e691232382d287fc7ddd0cfcdb78d709714bdec9e2dc7624f4` |
| `final project/submission/demo_walkthrough_draft.mp4` | 15047775 | `0bdf42c1c5ed4ae52eeb6e28bbe317b0a9069f7c886c88dcfd1258873dadf18e` |
| `final project/submission/browser-regression-repro.mp4` | 297561 | `c78b3275b2b6454dc12d3ad5233e45d05ca326db01bd974b209b0ff88824b7dc` |
| `final project/test/acceptance/local-browser-ledger.json` | 15435 | `acb8b3887cf0ebcc62f301f3b9bec6186663bed583b6b1212b443caa2b29bd00` |
| `final project/test/acceptance/sepolia-proof.json` | 6052 | `333d0fbb8aec21fefac66ab851cf16af07dbf309b3716f635bf5a6ff672eb5e8` |

报告 PDF 4 页已逐页渲染检查；英文旁白视频 220.27 秒、1920×1080、H.264/AAC，完整解码无错误，音频非静音且未检测到满幅削波（max -1.4 dB）。视频为真实捕获画面的证据讲解草稿，采用系统合成英文旁白，不冒充最终 live testnet demo。修复前问题视频来自 29 个真实 screencast 帧，空闲间隔最多保留 8 秒。

## 验收范围

- npm test：15 pass / 0 fail；npm run build 成功；干净目录 npm ci/test/build 成功。
- 本地 EVM 普通浏览器操作：14 笔成功交易、3 claims、5 records；包含申请/批准/拒绝/更正/撤销/关闭/停用/管理员介入。
- 真实 Sepolia：RPC 和浏览器读取成功；code/getter 已核对；可执行部分排除 immutable/metadata 后匹配，完整 metadata 哈希不同；历史事件受 pruned history 限制。
- 390px 视口无横向溢出；修复记录状态缓存错误；拒签和未授权/无记录反馈已验证。
- 原 Solidity 与三个原始 artifact 文件保持不变；生产 bundle 不含本地测试钱包入口。
- 未触发/未完整验收：真实 MetaMask 的新 Sepolia 签名、部分 T11 延迟/取消/故障组合、最新 Moodle 要求与所有提交回执。

## 最后由团队补齐

1. 朋友确认最终部署、部署 tx、可控专用演示钱包及测试 ETH，并发布真实可读的 demo metadata。无需真实机构或现实出勤数据。
2. 合入前端后，从 UI 在最终 Sepolia 跑一遍新流程并录制真正的英文 live demonstration；不要使用已关闭的旧活动冒充成功。
3. 填写完整成员姓名/学号/实际贡献，核对课程政策、截止与入口，完成报告/视频定稿。
4. 有权限的人推送最终仓库、提交团队文件；每人完成 Peer assignment 04，保留各自回执。

当前 GitHub 账号对原仓库无 push 权限，未推送。合并方式见 handoff/merge_protocol.md；本地 commit/patch 作为交接，不覆盖朋友未提交内容。
