# 本地交付清单

更新日期：2026-10-28。完整前端源码与主要验收证据已完成；这是开发交付，不是已完成的课程提交。

## 版本与分工

- 原始基线：`21ad35e`；接口交接：`fc728cb`。
- 用户确认：朋友负责合约/部署，我方负责前端；真实成员身份与最终贡献最后补。
- 当前交付目录：`/Users/diannao/Desktop/HKU/Semester-1/COMP7610/delivery`；原 repo 目录未覆盖。
- 前端规范文件清单 SHA256：`d3b0d0c132befc038cbf70c3f2db2003aab975760abf923b065cc64887dfb421`。按仓库相对路径排序 `{path,sha256}` 列表，对 UTF-8 compact sorted-key JSON（无末尾换行）求 SHA256；算法详见 document_media_qa.md。
- 清单覆盖 25 个源码/配置/原始产物文件，与已验收前端 commit f2e4d32 的文件完全一致；完整 Git commit、patch 和 ZIP 校验见打包后生成的 delivery_receipt.json。

## 交付文件与 SHA256

| 文件 | 大小 bytes | SHA256 |
| --- | --- | --- |
| `final project/submission/project_report_draft.docx` | 239901 | `5cd4abd446a36aceb91ef45f169cb4306798dfa812c6d2c21b868611d038780f` |
| `final project/submission/project_report_draft.pdf` | 381475 | `6610d5258c681487e7ea7580bfc4b1eb2693e7f7519cffcbc2e1e4c6a1540a55` |
| `final project/submission/demo_walkthrough_draft.mp4` | 17488030 | `2199a93ec92fb7c6bdc80c71249e06a9293db93acff58e93a746586954791b51` |
| `final project/submission/browser-regression-repro.mp4` | 297561 | `c78b3275b2b6454dc12d3ad5233e45d05ca326db01bd974b209b0ff88824b7dc` |
| `final project/handoff/frontend_code_handoff.md` | 13218 | `1e476821772fa61aeb04ea4bb662dee12f75ca1548a07e2c322619db149e1de6` |
| `final project/test/acceptance/local-browser-ledger.json` | 15435 | `acb8b3887cf0ebcc62f301f3b9bec6186663bed583b6b1212b443caa2b29bd00` |
| `final project/test/acceptance/sepolia-proof.json` | 6052 | `333d0fbb8aec21fefac66ab851cf16af07dbf309b3716f635bf5a6ff672eb5e8` |

报告以可编辑 Word 和同版 PDF 交付，含封面 7 页，A4、12 pt Times New Roman、1.5 行距、黑色标题、正文页码、图表与编号参考文献；PDF 字体已嵌入，7 页逐页检查。英文证据视频使用 Karen 女声、145 words/minute，246.88 秒、1920×1080、H.264/AAC（48 kHz）；完整解码无错误，综合响度 -18.0 LUFS、max/true peak -2.6 dB。保留实际截图与 DRAFT 标记，不冒充最终 signed Sepolia live demo。详见 document_media_qa.md。修复前问题视频仍来自 29 个真实 screencast 帧，空闲间隔最多保留 8 秒。

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
4. 集成负责人复核最终仓库版本、提交团队文件；每人完成 Peer assignment 04，保留各自回执。

2026-10-28 本机 Git 凭据已成功将前端交付推送到远端 `main`，并核对远端 SHA；这不是学校提交。运行/维护/对接入口见 handoff/frontend_code_handoff.md，合并分工见 handoff/merge_protocol.md；本地 commit/patch 作为交接，不覆盖朋友未提交内容。

交付包维护：先更新正文、媒体、manifest 与总索引并提交，再运行 submission/build_delivery.py。累计 patch 从 21ad35e 到交付 HEAD，覆盖完整前端与本次文档修订；临时 index 的 tree 校验和 ZIP CRC/文件集合校验通过后才生成最终回执。ZIP 内回执不包含外层 ZIP 自身哈希，外侧回执包含。
