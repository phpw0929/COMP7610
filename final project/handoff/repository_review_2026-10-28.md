# 仓库现状与前端接入计划

核查日期：2026-10-28，Asia/Shanghai。

合约源码、ABI、编译产物和接口说明已足够启动前端开发。当前仓库尚不能作为完整可运行 DApp 交付：React 页面仍是教学模板，入口缺失，演示账号和链上测试证据也需补齐。若你负责前端，主要任务是把现有合约的业务流程变成可操作、可演示的界面。

## 1. 核查基线与边界

- 远端：<https://github.com/phpw0929/COMP7610>。
- 本地：`/Users/diannao/Desktop/HKU/Semester-1/COMP7610/repo`。上层已有 `Assignment3/`，因此使用独立子目录克隆，没有覆盖原作业。
- 当前 `main`：`21ad35e`，提交说明 `Document volunteer verification DApp`。
- 指定交接提交：`fc728cb2013ad6f6d6f9c835d06e2e9f70682a0d`，新增 `.env.example`、DApp `.gitignore`、`src/contract.js`、`handoff/frontend_handoff.md`。
- `fc728cb` 之后的唯一提交增加了 Final Project README，没有增加业务前端。
- 已读 `AGENTS.md`、产品计划、目录指南、历史 context、交接表、合约源码、编译信息、手工测试文档及两份课程 PDF。选题 XLSX 仅登记用途，本次不重做选题分析。
- 本次安装依赖、复现构建并写入核查文档；未修改业务代码、未发起钱包交易、未 commit/push。

## 2. 项目实际要做什么

这是志愿服务时长审核与验证平台，主流程是：

`管理员登记机构 → 机构建立活动 → 志愿者提交服务申请 → 所属机构批准/拒绝 → 批准自动生成记录 → 公开查询 → 必要时撤销或创建关联更正记录`

四种角色是管理员、服务机构、志愿者和公开验证者。区块链记录机构签发行为和后续状态，不能独立证明现实出勤；钱包也不是实名身份。

现有 `.codex/context.md` 明确保留八项 MVP，排除了公开活动浏览、分享链接/QR code、总时长汇总；`plan.md` 开头仍有一些旧描述，不能据此扩张第一版。NFT、token、支付、GPS、图片证据、导出等也不属于 MVP。

## 3. 已有材料与确认结果

| 部分 | 当前证据 | 结论 |
| --- | --- | --- |
| 产品定义 | `doc/plan.md` 与历史 context | 核心流程和范围足够明确。 |
| 合约 | `dapp/contracts/VolunteerHoursRegistry.sol` | 机构、活动、申请、审核、公开查询、历史、更正和撤销均有实现；本次做静态阅读，没有重新执行完整合约测试。 |
| ABI | `src/contract.js` 与 `artifacts/VolunteerHoursRegistry.json` | JSON 数组逐项比较完全一致。 |
| 源码与编译输入 | `artifacts/build-info/` | 所含合约源码与当前 `.sol` 完全一致；编译输出未列出错误。并非本次重新编译的结果。 |
| 部署配置 | handoff 与 README | 声明 Sepolia、chain ID `0xaa36a7`、地址 `0xf1a55E316439a99Cd904E131e0f889E4D36D7DEe`。 |
| 部署在线核查 | Etherscan 页面访问失败；PublicNode JSON-RPC 请求返回 HTTP 403 | 本次不能确认实时字节码、管理员、记录 ID 或部署与当前产物的一致性，不能把声明地址当作本次已验收的部署。 |
| 合约测试 | `test/test_procedure.md`、`test/test_overview.md` | 提供 Remix 手工步骤，表格均标记 `x`；没有清晰的标记图例、交易哈希或独立测试日志。用户转述队友已测试，但本次未独立复跑。 |
| 自动化测试 | Git 跟踪文件与 package scripts | 未发现项目测试代码；没有 `test`、lint、typecheck scripts，也没有 TypeScript 配置。 |
| 前端 | `App.jsx`、`index.html` | 尚不可运行，详见下一节。 |

## 4. 本地验证与阻塞

使用 bundled Node `v24.19.0`；系统默认 Node 为 `v20.11.0`。锁定安装的 Vite 为 `7.3.6`，声明支持 Node `^20.19.0 || >=22.12.0`，因此默认 Node 版本不足，后续开发应统一到满足条件的版本。

在 `final project/dapp` 执行：

```sh
npm ci --ignore-scripts --no-audit --no-fund
npm run build
```

安装成功，新增 74 个本地依赖包，没有改动 lockfile。构建失败：

```text
[vite:build-html] Failed to resolve /src/main.jsx
```

`index.html:5` 引用了尚不存在的入口。另用 Vite `transformWithEsbuild` 独立解析原始 `App.jsx`，结果：

```text
src/App.jsx:5:2: ERROR: Expected identifier but found "<"
```

文件的 imports、provider、网络切换、连接钱包、mint、effect 中均有 `</XXXX>` 占位符；页面仍显示 `Sepolia NFT Claim System`。即使补入口也不能直接运行，仍需实现志愿服务业务页面。没有 `styles.css`，但缺少独立 CSS 文件本身不构成构建错误，因为当前模板使用 inline styles。

## 5. 前端职责与接口映射

以下是建议分工，不是仓库已确认的成员分配；仓库没有正式贡献分工表。

| 前端区域 | 用户操作 | 合约接口 |
| --- | --- | --- |
| 钱包与网络 | 连接 MetaMask、显示地址、识别权限、切换 Sepolia、响应账号/网络变化 | `administrator()`、`getOrganization(wallet)`；钱包 provider/signature |
| 管理员 | 登记机构、启用/停用机构；必要时管理异常记录 | `registerOrganization`、`setOrganizationActive`、记录管理接口 |
| 机构工作台 | 建立/关闭自有活动，查看申请，批准/拒绝，管理已签发记录 | `createActivity`、`closeActivity`、`getOrganizationActivityIds`、`getActivityClaimIds`、`getClaim`、`approveClaim`、`rejectClaim`、`getIssuerRecordIds` |
| 志愿者 | 输入机构给的 activity ID、读取活动详情、提交分钟数/日期、查看个人申请及记录 | `getActivity`、`submitServiceClaim`、`getVolunteerHistory`、`getClaim`、`getServiceRecord` |
| 公开验证 | 输入 record ID，展示机构、志愿者地址、活动、时长、日期、状态及前后更正链 | `getServiceRecord`、`getActivity`、`getOrganization` |
| 通用交易反馈 | 等待钱包、拒绝签名、提交中、等待区块确认、失败原因、浏览器链接、确认后刷新 | Ethers transaction response、`tx.wait()`、receipt/events |

继续使用现有 React/Vite/Ethers 即可。MVP 的链上读写无需额外数据库或自建业务后端；metadata 的内容与托管要单独约定。无需为了五个区域引入复杂状态管理或路由系统。

权限从真实钱包与合约读取。管理员也可能同时是机构/志愿者，不要用互斥角色下拉框替代权限判断；合约仍负责最终授权。`getOrganization` 对未登记地址会 revert，前端应识别该正常情况，不能让普通志愿者连接失败。

## 6. 接口接入时必须保留的规则

- 时长是正整数分钟，字段类型为 `uint32`；小时展示由前端换算，勿直接将小时数字传入分钟参数。批准时长可小于或大于申请时长，要同时保留两者展示。
- 日期是 Unix 秒，不是 JavaScript 毫秒。合约注释建议 date-only 使用 UTC midnight；界面输入、转换和展示需统一，并校验活动日期窗口及非未来日期。
- 申请状态：`0 None / 1 Pending / 2 Approved / 3 Rejected`；记录状态：`0 None / 1 Valid / 2 Revoked / 3 Corrected`。申请仍可为 Approved，而其记录已经 Revoked/Corrected。
- 批准操作直接生成服务记录，无需再 mint NFT 或调用额外签发交易。写操作的 Solidity 返回 ID 应从 receipt/event 或确认后查询取得，不能将 transaction response 当作 ID。
- `supportingInfoHash`、批准的 `reviewNoteHash` 可为零；机构/活动 metadata hash，以及拒绝/撤销/更正 reason hash 必须非零。handoff 的“optional hashes use zero”不适用于全部 hash 字段。
- metadata hash 是实际内容字节的 `keccak256`；`metadataURI` 非空即可通过合约校验，不代表 URL 可用或内容可信。需定义 JSON 字段、UTF-8 字节与托管方式，前端读取后校验内容摘要。
- 更正会创建新记录，保留旧记录，显示 `replacesRecordId` 和 `replacementRecordId`；不能只显示最早签发的 ID 或重复累计更正记录。
- 活动关闭只阻止新申请，已有 Pending 申请仍可由 active issuer 审核。机构停用不自动撤销历史记录，但阻止该机构后续业务操作，管理员仍可管理异常记录。
- 合约允许同一活动多次申请；前端需禁用重复点击，并提示已有申请，不能擅自增加“一活动只能申请一次”的业务规则。
- 公开验证只读，无需签名或 gas。如果要做到无钱包访问，需要 `JsonRpcProvider`/只读 RPC；目前配置只提供地址、chain ID 和 explorer，尚无独立 RPC 配置。
- Ethers v6 的整数字段通常为 `bigint`；ID 和金额以外的整数也需正确转换，避免 `JSON.stringify` 或 Number 精度问题。

## 7. 队友还需补充什么

可以先开发页面与读写封装；真实联调前需要：

1. 确认声明的 Sepolia 地址就是最终版本，提供部署交易链接、管理员公钥地址，以及与该部署对应的编译器和设置。私钥/助记词由各账号持有者保管，不作为交接材料。
2. 提供机构、志愿者等演示公钥地址，以及目前有效/可审核的 activity ID、claim ID、record ID 和各自状态。原测试结尾已关闭活动、停用机构、撤销记录，不能假设 ID 1 可继续走成功流程。
3. 提供一组机构/活动 metadata JSON、真实可访问 URI、对应 hash；确认演示采用静态公开 JSON 还是其他存储。小规模演示可优先考虑同源静态 metadata，避免额外后端，但要与队友统一内容格式。
4. 补测试结果图例与关键交易链接，尤其部署、批准、更正、撤销。仓库截图/交易回执能让前端确认预期状态。
5. 确认成员分工、Demo 操作人、部署页面的负责人和最终 README/报告汇总人。前端账号无需是管理员；管理员/机构成员可以协助操作对应钱包。

可直接转发的交接回复：

> `fc728cb` 的地址、ABI、接口表和合约源码已经够开始接前端。请再给我最终部署交易链接、管理员/机构/志愿者的公钥地址、一组现在可用的活动/申请/记录 ID，以及机构/活动 metadata JSON 和 URL/hash。也请确认部署对应的编译器版本与设置：测试文档写 0.8.30，但产物是 0.8.34。私钥和助记词不用发。

## 8. 推荐开发顺序与阶段验收

按照 `AGENTS.md`，本次先给出架构与实施顺序，尚未开始业务编码。

1. **恢复最小可运行前端。** 补 `main.jsx`，替换无效模板，建立基本界面与配置，完成构建。验收：`npm ci`、`npm run build` 成功，浏览器能打开页面。
2. **先读链再写链。** 用 record ID 做公开验证，核对返回字段与更正链接；接钱包、网络变化、真实权限识别。验收：真实记录可读，不存在的 ID 有明确提示；只读访问不要求签名。
3. **打通一条成功链路。** 管理员登记机构 → 机构创建活动 → 志愿者申请 → 机构批准 → 志愿者与公开验证页读取。验收：每笔交易可查、确认后数据刷新，无需 Remix 补业务操作。
4. **补齐其余 MVP 和异常。** 拒绝、关闭活动、停用机构、更正、撤销；处理错误网络、拒绝签名、等待确认、未授权操作、重复点击。验收：更正/撤销历史完整，前端显示与链上实际状态一致。
5. **完成演示和交付。** 用角色账号做真实浏览器联调，整理配置与部署说明，完善报告和英文演示。验收：新机器按 README 可启动；生产构建通过；按八项 MVP 逐项演示。

先实现能完整读写的流程，再做视觉完善。组件可按钱包、管理员、机构、志愿者、验证区域拆分；状态和合约调用保持简单，避免一开始增加大量抽象。

## 9. 文档差异与课程交付

- `.codex/context.md` 仍称合约未实现，后续维护时应更新其进度，但保留八项范围和排除项。
- `guide.md` 的“当前 idea/design”“TicketNFT”及地址模板描述已落后于合约完成状态。
- 手工测试步骤写编译器 `0.8.30`，实际 metadata/build-info 是 `0.8.34+commit.80d5c536`、EVM `osaka`、optimizer disabled；应记录实际部署的编译设置。
- 测试表步骤编号与 procedure 不完全对应；“Account 4 不需要 ETH”仅适用于只读使用，而越权交易测试若实际发送交易也需要测试 ETH。
- `.env.example` 仍是占位地址，不能直接复制后认为已配置。前端 `VITE_*` 会出现在浏览器构建中，不能放私钥或秘密。

`doc/Final Project.pdf` 原始要求为：团队提交 15 分钟以内的英文 MP4/MOV 演示、PDF 报告（背景、想法、设计、实现、贡献分工）、完整可运行源码与详细 README；如有 slides 一并提交。每位学生还需个人提交 `Peer assignment 04`。PDF 列出的截止日期是 **11 月 8 日 23:59**，本次没有核对 Moodle 或后续公告是否变更。

因此，“合约完成”只是一个阶段；前端、完整联调、演示视频、报告和可复现说明仍是全组后续交付内容。

## 10. 同日后续文档维护补记

以上为首次仓库检查快照，保留当时的构建与在线核查结果。用户随后要求完整计划、文档更新与可行性/课程覆盖审核，已新增 [完整执行计划](../doc/execution_plan.md)、[计划与课程要求审核](../doc/plan_review_2026-10-28.md) 和 [集成状态登记](integration_status.md)。第 9 节指出的 context/guide/产品规则/测试说明旧文案已在后续文档维护中修订，原历史 `x` 未改为新测试通过。

后续执行以新主计划和真实状态登记为准。业务源码、部署和前端未在本轮修改；先前构建失败及部署未确认状态仍有效，课程实时页面也尚未核对。
