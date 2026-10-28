# 集成资料与交付状态

更新日期：2026-10-28。当前实现目录为 `COMP7610/delivery`；原 `COMP7610/repo` 保留给朋友继续开发。用户已确认：朋友负责合约/部署，我方负责前端；姓名、学号及最终贡献最后补充。

状态分别记录实现、本地 EVM、Sepolia 读取、真实钱包签名、媒体和课程提交。没有把本地钱包选择器、测试交易或原测试表 `x` 当作新 Sepolia 验收。

## 1. 已确认资料与剩余依赖

| 项目 | 当前值及证据 | 剩余动作 |
| --- | --- | --- |
| 原始基线/交接 | `21ad35e` / `fc728cb` | 本轮交付 commit 见 submission_manifest |
| 责任边界 | 用户确认：朋友合约/部署，我方前端 | 最终姓名/学号/全组贡献稍后填 |
| Sepolia 网络/地址 | RPC 与浏览器确认 `11155111`，`0xf1a55E316439a99Cd904E131e0f889E4D36D7DEe` | 朋友确认最终仍沿用此部署 |
| 管理员 | getter：`0xb3B9ABeF11709509E6cd2424f9A9f744394adc25` | 谁持有该钱包、能否现场签名未知 |
| 机构 | getter：`0xff4e2bAA091080a9b45E3d66D6816FEd65e94599`，inactive | 朋友重新启用并准备新活动或提供新部署 |
| 历史志愿者 | `0xAf5837981Ef21BdB6A095D452ab1C5407E7c01B3` | 控制权未知，专用新演示钱包也可 |
| 源码/ABI | 本地源文件对齐 build-info；前端 ABI 对齐产物；未改 Solidity/原 artifact | 合约变更后按 merge_protocol 再核对 |
| 运行字节码 | 可执行部分排除 immutable/CBOR metadata 后与产物相同；完整 metadata 哈希不同 | 不能当作源码浏览器验证；朋友补部署 tx/设置 |
| 编译 | 原产物 0.8.34 / Osaka / optimizer disabled；本地测试同源码、0.8.34 / Shanghai | 本地目标不同不覆盖原产物 |
| Sepolia 只读 RPC | PublicNode 现已可读；浏览器跨域读取成功 | 可用性会变，配置可覆盖并重启 |
| 真实链状态 | 1 机构、1 活动、3 claims、4 records；机构停用，活动关闭，记录更正/撤销 | 不用旧 ID 假装新成功流程，完整字段/时间见 sepolia-proof |
| 链上历史日志 | 请求窗口遇到 pruned history | 朋友提供部署/批准/更正等交易链接；本次不补造 |
| metadata | 真实 Sepolia 为不可用 example.org；本地新增明确 demo JSON 并验证 hash | 发布真实 HTTPS URL，并在新 Sepolia 对象中使用 |
| 专用本地测试钱包 | 已生成，真实本地 EVM + 开发专用 EIP-1193 harness | 不属于真实 Sepolia 账号，不保留私人密钥入库 |
| GitHub 同步 | 2026-10-28 本机 Git 凭据已将前端交付快进推送到 `phpw0929/COMP7610` 的 `main`，远端 SHA 核对通过 | 后续合约集成需保存朋友原目录的未提交改动并再核对远端；学校提交仍待完成 |
| Moodle/个人互评入口 | 独立页面导航超时，实时状态未知 | 最后由 S/每人核对与提交，不能代填未知成绩/贡献 |

## 2. 执行阶段

| 阶段 | 实际进度 | 证据/限制 |
| --- | --- | --- |
| G0 交接条件 | 部分完成 | 网络、读链、角色公钥、源代码规则已核查；真实钱包控制权、部署 tx、发布 metadata、平台信息仍缺 |
| G1 可运行前端 | 已完成 | 正常/干净目录安装、生产构建通过 |
| G2 读取/钱包/metadata | 实现完成，读取与本地钱包已测 | 无钱包 Sepolia 读取；本地钱包切换、metadata 成功及失败；真实 MetaMask 签名待补 |
| G3 主流程 | 本地 UI 完整通过 | 真实 Solidity、本地链、由 UI 登记→活动→申请→批准→公开查询；不是 Sepolia 新写入 |
| G4 生命周期/异常 | 本地 UI 与合约测试通过 | 拒绝、关闭/停用、更正/撤销、管理员介入、拒签、权限；T11 仍有未触发组合 |
| G5 验收 | 已完成主要本地/读链验收，最终测试网写入待补 | 15 自动测试、14 UI 本地成功交易、390px 无溢出、干净复现；完整记录见 browser_acceptance |
| G6 报告/视频 | 草稿已生成 | A4 英文 Word/PDF（含封面 7 页）、Karen 温柔女声英文证据讲解视频（约 4 分 7 秒）；非最终 signed Sepolia live demo；成员信息待补 |
| G7 交付/提交 | 本地源码、patch/ZIP/manifest 已整理，前端交付已推送远端 `main`；课程提交未做 | 以 manifest 与远端提交记录核对版本；GitHub 推送不是学校提交回执 |

## 3. 验收入口

- `test/acceptance/browser_acceptance.md`：用例逐项结果、环境、缺陷与回归边界。
- `automated-tests.log` / `local-contract.json`：独立自动化测试真实执行结果，15 通过。
- `local-browser-ledger.json`：浏览器操作导致的 14 个真实本地成功交易、3 claims、5 records。
- `sepolia-proof.json` / `sepolia-read.json`：真实测试网只读快照；历史日志不可用明确记录。
- `*.jpg`：实际浏览器截图；`recording/`：修复前问题的原始 screencast 帧，不是最终成品画面。
- `submission/`：报告/视频草稿、重建脚本、媒体检查和交付 manifest。

## 4. 最后收口

1. 朋友确认/准备最终部署、真实演示钱包和测试 ETH，发布 demo metadata；不需要真实机构或真人出勤数据。
2. 在最终 Sepolia 从同一前端走一遍新主流程，补 tx/receipt/ID 和实际 MetaMask 拒签/切换检查；完成未执行的 T11 组合或如实保留限制。
3. 提供全组姓名/学号/实际贡献，确认课程政策、真实截止与入口；不要把职责建议直接写成贡献百分比。
4. 合并双方代码后再验收，生成最终报告与真正的英文 live-demo 视频。当前录音为系统合成英文旁白、画面为真实捕获证据的讲解草稿。
5. 有权限者推送最终仓库并提交团队作业，每人自行完成 Peer assignment 04，登记回执。
