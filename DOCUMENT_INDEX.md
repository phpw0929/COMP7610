# COMP7610 文档总索引

更新日期：2026-10-28。源码基线 `21ad35e`，接口交接 `fc728cb`。本轮前端交付在 `COMP7610/delivery`；朋友的原工作目录 `COMP7610/repo` 保留，分流后不覆盖。

当前已实现前端并完成主要本地验收和真实 Sepolia 读取；报告/视频为草稿，最终测试网签名、组员身份和课程提交待补。文档新增、移动或修改时必须同步本索引。

## 文档和记录

| 路径 | 功能 |
| --- | --- |
| `DOCUMENT_INDEX.md` | 全仓库文档总索引；每次维护文档同步更新。 |
| `README.md` | 课程仓库入口，指向 Final Project 运行说明与本总索引。 |
| `assignment 3/README.md` | Assignment 3 的原有说明，与 Final Project 分开。 |
| `assignment 3/debug.log` | Assignment 3 历史调试记录，不作为本项目验收证据。 |
| `final project/.codex/context.md` | 最新实施交接上下文：源码阶段、责任边界、已验证结果及剩余条件。 |
| `final project/AGENTS.md` | 项目协作与实施规则；保留原文。 |
| `final project/README.md` | 当前可运行前端、配置、四工作区、测试命令、部署快照与交付边界。 |
| `final project/doc/DApp_idea.xlsx` | 早期选题比较资料，本轮未重新分析或修改。 |
| `final project/doc/Final Project.pdf` | 课程原始正式要求和日期；最新平台通知尚未核对。 |
| `final project/doc/Project Tutorial.pdf` | React/Ethers/MetaMask 课程教程；NFT 示例不等于产品需求。 |
| `final project/doc/execution_plan.md` | 完整 G0–G7 计划、M1–M8、T01–T14、排期及实施补记。 |
| `final project/doc/guide.md` | 源码目录、配置与读写关系，区分当前文件和可选文件。 |
| `final project/doc/plan.md` | 八项产品范围、角色、数据与真实合约规则；排除 NFT/QR/汇总等扩展。 |
| `final project/doc/plan_review_2026-10-28.md` | 实施前可行性与 R01–R15 课程覆盖审核，并附实施后状态更新。 |
| `final project/handoff/frontend_handoff.md` | ABI 参数/结构/枚举/权限/事件与当前接入说明。 |
| `final project/handoff/integration_status.md` | 真实进度、角色公钥、部署/RPC/metadata、缺失资料和最终收口。 |
| `final project/handoff/merge_protocol.md` | 朋友合约/部署、我方前端的分工，隔离目录及安全合并步骤。 |
| `final project/handoff/repository_review_2026-10-28.md` | 首轮检查历史快照，保留当时构建失败与后续维护补记。 |
| `final project/submission/README.md` | 交付文件作用、草稿属性、重建环境和最终团队待办。 |
| `final project/submission/audio_check.log` | 视频音频实测：非静音、max -1.4 dB。 |
| `final project/submission/demo_script.md` | 完整英文旁白脚本，明确本地写入与真实测试网读取。 |
| `final project/submission/media_decode.log` | 视频完整解码检查，无错误输出时为空。 |
| `final project/submission/project_report_draft.md` | 可编辑英文报告源文，真实贡献/最终签名证据待补。 |
| `final project/submission/project_report_draft.pdf` | 4 页英文报告草稿，含原生架构图，逐页渲染检查。 |
| `final project/submission/submission_manifest.md` | 交付源码指纹、主要文件校验、结果边界与最终待办。 |
| `final project/test/acceptance/automated-tests.log` | 实际 Node 测试输出：15 通过，保留 Ganache fallback 提示。 |
| `final project/test/acceptance/browser_acceptance.md` | 实际浏览器/本地链/Sepolia 读取验收、3 个修复问题和未验收边界。 |
| `final project/test/acceptance/build.log` | 实际 Vite 生产构建输出。 |
| `final project/test/acceptance/clean-reproduction.log` | 干净目录 npm ci/test/build 的实际执行摘要。 |
| `final project/test/acceptance/recording/concat.txt` | 原始问题录屏重放时间序列，含生成时本机路径，仅供证据重建。 |
| `final project/test/acceptance/recording/encode.log` | 问题重放视频实际编码日志。 |
| `final project/test/test_overview.md` | 原手工覆盖与历史 x；保留标记，链接新验收结果。 |
| `final project/test/test_procedure.md` | 校正后的 Remix 复测步骤、预期及证据要求，不冒充本轮全部重测。 |

## 源码与配置入口

| 路径 | 功能 |
| --- | --- |
| `final project/dapp/src/App.jsx` | 四工作区、表单、历史与公开验证；处理读请求代次及记录刷新。 |
| `final project/dapp/src/useRegistry.js` | 只读 provider、钱包权限/会话、交易等待/替换/失败与确认刷新。 |
| `final project/dapp/src/utils.js` | ID/分钟/UTC 日期、理由 hash、精确字节 metadata、部分失败列表读取。 |
| `final project/dapp/src/main.jsx`、`styles.css` | React 入口与响应式样式。 |
| `final project/dapp/src/contract.js` | 原 ABI 与状态映射、公开网络/地址/RPC 配置；ABI 保持一致。 |
| `final project/dapp/contracts/VolunteerHoursRegistry.sol` | 朋友的原合约；本轮未修改。 |
| `final project/dapp/artifacts/` | 原 ABI、编译 metadata 和 build-info；本轮未修改。 |
| `final project/dapp/public/metadata/` | 机构和活动的明确 demo JSON，需要合约方发布后用于新 Sepolia 对象。 |
| `final project/dapp/public/favicon.svg` | 原生 SVG 应用标识。 |
| `final project/dapp/index.html`、`package.json`、`package-lock.json`、`.env.example`、`.gitignore` | HTML、运行/测试脚本、锁定依赖和公开配置；本地 .env/钱包状态忽略。 |
| `final project/dapp/test/domain.test.js`、`contract.test.js` | 纯函数边界与真实本地 Solidity 状态机测试；默认新证据输出到忽略目录 .local-test。 |
| `final project/dapp/test/wallet.html`、`wallet.js` | 仅 local-test/loopback 的开发 EIP-1193 账号切换与拒签 harness；不进入生产 bundle。 |
| `final project/dapp/scripts/local-support.mjs`、`local-chain.mjs` | 使用原源码、Shanghai 目标启动/部署 Ganache；打印公钥、生成忽略的测试配置。 |
| `final project/dapp/scripts/read-sepolia.mjs` | 只读刷新真实 code/getter/字节码对比与历史日志尝试；不签名。 |
| `final project/submission/build_report.py`、`build_demo.py` | 报告/英文证据视频重建脚本；后者使用 macOS say 和 FFmpeg。 |
| `.gitignore`、`final project/submission/.gitignore` | 忽略依赖、渲染临时文件、大媒体、patch/ZIP 和生成回执。 |
| `assignment 3/scripts/`、`assets/`、`remix.config.json` | 原 Assignment 3 合约、素材与配置，不参与本项目运行。 |

## 数据、媒体与交付附件

| 路径 | 功能与状态 |
| --- | --- |
| `final project/test/acceptance/local-contract.json` | 归档的独立自动化本地链真实结果及交易；不等于 UI 测试链。 |
| `final project/test/acceptance/local-browser-ledger.json` | 14 笔实际 UI 本地成功交易、3 claims、5 records 与角色/事件/回执。 |
| `final project/test/acceptance/sepolia-read.json`、`sepolia-proof.json`、`sepolia-runtime.hex` | 实际 Sepolia 只读数据、执行字节码对比与原始 code；历史日志缺失已记录。 |
| `final project/test/acceptance/production-browser.json` | 最终生产构建真实 Sepolia record 2 的无钱包 DOM/日志快照。 |
| `final project/test/acceptance/*.jpg` | 实际浏览器步骤、修复前后、无钱包验证、错误/权限和 390px 截图；具体映射见 browser_acceptance。 |
| `final project/test/acceptance/recording/frames.json`、`000000.jpg` 至 `000028.jpg` | 修复前问题的 29 个真实 screencast 帧及时间戳。 |
| `final project/submission/demo_walkthrough_draft.mp4` | 英文合成旁白、实际捕获画面讲解草稿，220.27 秒，1920×1080；单独交付，不提交 Git。 |
| `final project/submission/browser-regression-repro.mp4` | 修复前问题真实帧重放，保留来源并缩短空闲段；单独交付。 |
| `final project/submission/demo_media_probe.json` | 实际 MP4 音视频格式、分辨率、时长信息。 |
| `final project/submission/frontend_delivery.patch`、`frontend_delivery.zip`、`delivery_receipt.json` | 打包后生成的独立交接附件/版本/校验记录；不代表远端推送或学校提交。 |

## 维护与排除

本轮更新了产品计划、执行/审核、目录指南、README、context、接口说明、测试记录和集成状态；新增双人合并协议、实际验收证据、报告/视频草稿及交付清单。原测试 x 与首次核查历史保留。

`node_modules`、`dist`、本地 .env/测试钱包状态、`tmp` 和 `submission/media` 为生成内容，不作为源码文档。未包含私人钱包密钥、助记词或 API secret。最终完成状态以 integration_status、browser_acceptance 和 manifest 为准。
