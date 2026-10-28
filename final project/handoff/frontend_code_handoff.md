# 前端代码交接文档

更新：2026-10-28。接收对象：前端维护者、负责合约与部署的组员、最终集成人。

## 1. 交接结论与入口

八项 MVP 前端已实现，自动化测试、本地链浏览器主流程与 Sepolia 公开读取已有真实证据。当前报告和配音视频仍是草稿；新 Sepolia 钱包签名主流程、完整成员贡献和课程提交尚未完成。

我方结果在 `/Users/diannao/Desktop/HKU/Semester-1/COMP7610/delivery`。朋友并行开发的 `/Users/diannao/Desktop/HKU/Semester-1/COMP7610/repo` 保留。不要直接把整份目录覆盖过去。

原始集成基线为 `21ad35e7aaaf611ece5405b3c2681dc8a4dc89a1`；已验证前端源码阶段为 `f2e4d32bd2ee702f9613412357f6919eb4cee70c`。本次后续修改仅涉及报告、配音、交接与打包文档；最终源码 commit、patch 基线和包校验以 ZIP 外侧 `submission/delivery_receipt.json` 为准。ZIP 内也有版本记录，其外层 ZIP 哈希留空以避免自引用。

优先阅读：

| 文档 | 用途 |
| --- | --- |
| `../README.md` | 安装、配置、四工作区及测试命令 |
| `frontend_handoff.md` | 完整 ABI、实体字段、状态枚举、事件及权限；本文件不复制这张接口表 |
| `integration_status.md` | 当前部署、公开钱包地址、metadata 和待补材料 |
| `merge_protocol.md` | 双方文件所有权与冲突处理 |
| `../test/acceptance/browser_acceptance.md` | 已验收操作、问题修复和未覆盖边界 |
| `../submission/README.md` | Word/PDF、配音视频和交接包的维护方式 |
| `../../DOCUMENT_INDEX.md` | 全部文档和证据的索引 |

## 2. 安装与运行

应用目录是仓库中的 `final project/dapp`。推荐 Node 24；`package.json` 声明支持 `^20.19.0 || >=22.12.0`。保留锁文件，使用 `npm ci`。

```sh
cd 'final project/dapp'
node --version
npm ci
npm test
npm run build
npm run dev
```

打开 Vite 实际打印的本地 URL。默认公开页面直接读取 Sepolia，不需要连接钱包；写入时连接 MetaMask。项目没有后端服务、数据库或需要另行运行的 API server。

生产文件输出到 `dapp/dist`。可用以下命令检查静态构建：

```sh
npm run preview -- --host 127.0.0.1 --port 5185 --strictPort
```

部署到站点子路径前，核对 Vite base 和 metadata URI；重新构建并检查静态资源请求。当前交付验证的是本地生产预览，未宣称已上线公共网站。

## 3. 文件地图与修改位置

| 文件 | 责任与维护位置 |
| --- | --- |
| `src/App.jsx` | Public verification、My service、Organization、Administration 四工作区；表单、查询、列表、记录历史；读取代次和已验证记录刷新 |
| `src/useRegistry.js` | 只读 provider 初始化、合约可用性、MetaMask 会话/权限、写入锁、收据与事件、交易替换/取消/待确认状态 |
| `src/utils.js` | ID、分钟、UTC 日期、理由 hash、metadata 精确字节校验、错误消息及部分失败的分批读取 |
| `src/contract.js` | ABI、状态名称与公开网络配置导出；ABI 来自合约产物，不手工猜字段 |
| `src/main.jsx`、`src/styles.css` | React 挂载和响应式布局；390px 已验收无横向溢出 |
| `index.html`、`public/favicon.svg` | HTML 入口与应用标识 |
| `public/metadata/` | 明确标注为 demo 的机构/活动 JSON；最终测试网使用前需发布 |
| `test/domain.test.js` | 整数/日期/hash/metadata/部分读取失败的边界测试 |
| `test/contract.test.js` | 真实本地 Solidity 状态机测试，不是伪造返回值 |
| `scripts/local-support.mjs`、`scripts/local-chain.mjs` | Ganache 编译部署和本地测试配置生成 |
| `test/wallet.html`、`test/wallet.js` | 只允许 loopback 与 local-test 模式的 EIP-1193 开发入口；不进入生产 bundle |
| `scripts/read-sepolia.mjs` | 无签名的真实链 code/getter/运行字节码对比及历史日志查询 |
| `contracts/`、`artifacts/` | 合约组员负责；本轮原 Solidity 和原始产物未改 |

新增表单逻辑先复用 `utils.js`；交易统一走 `useRegistry.send`，不要另起一套 provider、权限判定或收据处理。变更 Solidity 接口后，先更新接口文档和测试，再改调用位置。

## 4. 读取与写入路径

公开读取：页面 → `useRegistry` 的 JsonRpcProvider → 合约 getter → `App.jsx` 展示。公开验证不依赖钱包授权，也不产生交易。RPC 故障应展示暂时不可读，不能判为记录失效。

签名写入：表单参数校验 → `send(method, prepare)` → 再确认 chain/account → BrowserProvider signer → 合约交易 → 等待 receipt → 解析事件 ID → 刷新相关数据。未获得成功收据时不要展示成功；待确认期间不应自动重发相同业务操作。

切换账户/链会使旧权限和过期读取结果失效。曾发现的更正后仍显示旧 Valid 状态已经修复：成功写入后会刷新当前查询记录，页面也提供更新时间和刷新按钮。修改缓存逻辑时要回归更正与撤销场景。

## 5. 网络与环境配置

从 `.env.example` 复制到自己的 `.env`，所有 `VITE_*` 都会进入浏览器，不能放私钥或 secret。

| 配置 | 当前默认值/说明 |
| --- | --- |
| `VITE_CONTRACT_ADDRESS` | `0xf1a55E316439a99Cd904E131e0f889E4D36D7DEe` |
| `VITE_CHAIN_ID` | `0xaa36a7`，即 Sepolia 11155111 |
| `VITE_NETWORK_NAME` | `Sepolia` |
| `VITE_EXPLORER_URL` | `https://sepolia.etherscan.io` |
| `VITE_READ_RPC_URL` | `https://ethereum-sepolia-rpc.publicnode.com`；需允许浏览器跨域读取 |

修改配置后重启 dev server；生产版本需要重新 build。更换部署时同步地址、网络、ABI、产物及相关文档。`contract.js` 含前端使用的配置导出，不能用一份纯 ABI 文件直接覆盖整个文件。

当前地址确实读到了链上代码和历史记录，但机构已停用、活动已关闭，旧记录也有更正/撤销。旧 example.org metadata 不可用是已知事实，不能把“读取了链上记录”写成“metadata 校验成功”。完整编译 metadata 哈希不同、历史日志被 RPC pruned 的限制见 `integration_status.md`。

## 6. 必须保持的业务不变量

- ID 使用 `bigint` 与 uint256 边界；分钟是正整数 uint32，不能用小数小时传给合约。
- 日期输入是 UTC date-only，转换为 Unix seconds；不得混用毫秒或本地时区午夜。
- Claim 的 Approved 和 ServiceRecord 的 Valid 是两套状态。Approved claim 对应的记录以后仍可能被更正或撤销。
- 批准时可以调整分钟；批准与发记录在同一笔交易完成，无需再增加 mint 按钮。
- 驳回不发记录；复核只能对 Pending claim 执行一次。
- 更正创建新记录并链接前后记录，保留原 volunteer/issuer/activity/claim，不原地改历史事实。
- 活动关闭阻止新申请；活跃机构仍可审核已有 Pending claim。机构停用不自动使过去记录失效；管理员仍可处理记录。
- metadata 和驳回/撤销/更正理由要求非零 hash；支持材料及批准备注允许零值。统一使用现有 hash 工具和合约约束。
- 钱包证明签名权限，不证明真实机构或现实出勤；前端不增加生产角色切换器来绕过权限。

八项 MVP 的范围以 `doc/plan.md` 为准。不要在本轮补进 NFT、支付、QR 分享、活动广场或总时长汇总。

## 7. Metadata 发布与对接

使用 `schemaVersion: 1`，区分 organization/activity；字段以 `public/metadata` 示例和 `metadataAt` 校验为准。先发布最终 JSON，再按下载的原始 UTF-8 字节计算 keccak256，最后把公开 URI 和 hash 写入合约。

浏览器先验证原始字节 hash，再解析 JSON。改缩进、换行、编码、末尾换行或托管平台返回内容都会改变 hash，不能对“重新格式化后的对象”求 hash。端点应提供稳定 HTTPS、正确 CORS 和可读取正文。本地 HTTP 的例外只服务开发测试。

metadata 不可用、hash 不匹配或 schema 不正确时，名称等外部内容保持未验证；链上记录与其状态仍独立显示。哈希不负责加密或保证内容真实。演示可以使用虚构机构和活动，但必须标明 demo。

## 8. 本地全流程复现

先完成 `npm ci`。两个终端都进入 `final project/dapp`。

终端 A：

```sh
npm run test:local
```

终端 B：

```sh
npm run dev:local
```

打开 `http://127.0.0.1:5184/test/wallet.html`，使用仅本地的角色账户。按管理员注册机构 → 机构创建活动 → 志愿者申请 → 机构批准 → 公开查询 → 更正 → 撤销复现。拒绝、关闭、停用、管理员介入详见 T01–T14 和浏览器验收文档。

本地链是 31337；每次重启使用新的钱包、地址和 IDs，忽略的 `.env.local-test`/本地状态由脚本生成。Ganache 编译采用 Shanghai，以兼容本地 EVM；不替换原 Sepolia/Osaka 产物。测试钱包不能拿去签 Sepolia。

已有证据：15 个自动化测试通过；本地 UI 成功交易 14 笔、3 claims、5 records；真实 Sepolia 无钱包读取成功。尚未完整验收的包括真实 MetaMask 新 Sepolia 写入、T11 部分延迟/取消和 provider 故障组合，不能把这些标成完成。

## 9. 与合约方合并

双方先分别保存/提交当前工作，保留原目录。优先在干净的集成 clone 处理。交付的 `frontend_delivery.patch` 是从上述 `21ad35e` 到交付 commit 的累计 binary Git diff，包含此前前端和本轮文档变更；不是只含最后一次文档提交的 patch。

在干净集成目录、仓库根目录运行以下命令。把 patch 路径换成实际绝对路径：

```sh
git status --short
git apply --check /absolute/path/frontend_delivery.patch
git apply --3way --index /absolute/path/frontend_delivery.patch
git diff --cached --stat
```

如果 `--check` 因朋友已改同一行失败，不要反复覆盖：先确认基线和分工，在拥有基线 Git objects 的 clone 中使用三方应用，逐处解决冲突。重点检查 `src/contract.js`：ABI 用朋友最终产物，保留前端配置导出。解决后重新执行 `npm ci`、`npm test`、`npm run build` 及受影响的 UI 用例，再提交集成结果。

ZIP 可用于独立运行和文件审阅，不含 `.git`、依赖、构建目录、私有 `.env` 或本地钱包状态。不要把 ZIP 直接解压覆盖朋友的工作目录。当前连接账号对原仓库没有 push 权限，本轮未推送；由有权限的成员同步最终集成 commit。

## 10. 合约组员交回的最小材料

| 材料 | 完成标准 |
| --- | --- |
| 最终部署 | chain ID、合约地址、部署 tx 链接、ABI、编译器/优化/EVM 设置 |
| 可操作演示角色 | 管理员、机构、志愿者的公开地址，以及各自操作者确认可签名；仅用测试 ETH，不传私钥 |
| Metadata | 已发布 URL、最终原始文件、对应 keccak256；浏览器可取且匹配 |
| 新演示对象 | 当前可用机构、活动 ID、日期窗口，避免复用已关闭的旧活动 |
| 前端真实测试网验收 | 使用最终构建通过 MetaMask 跑新主流程，保留 tx、事件 IDs 和浏览器证据 |

本地 mock UI 不能代替测试网要求；当前本地测试运行的是真实 Solidity。最终可以使用专用测试钱包和虚构 demo 数据，无需联系真实机构或收集现实志愿者身份。

## 11. 常见问题

| 现象 | 核查方法 |
| --- | --- |
| Vite 无法启动 | 先检查 Node 版本、依赖安装结果与端口；不要删除锁文件来碰运气 |
| 公开读取失败 | 核对 RPC、浏览器 CORS、chain ID、地址非空 code；检查错误详情 |
| Organization/Admin 不可用 | 先看当前钱包地址、网络与合约登记状态；普通账户不能打开管理入口是预期行为 |
| metadata 显示未验证 | 比较真实 HTTP 响应字节、hash、schema 和 CORS；不要只检查网页标题 |
| 交易仍 pending | 先查交易状态和界面确认入口，避免重复申请；已拒签不能标为成功 |
| 本地旧 ID 不存在 | 检查是否重启了本地链；读取新输出的地址、账户和 IDs |

## 12. 文档与交付维护

代码/部署变化后，同步接口说明、`integration_status.md`、受影响测试证据、README、报告及视频。每次文档新增或修改都更新 `DOCUMENT_INDEX.md` 的条目和作用说明。不要仅改目录上的“完成”字样而保留旧哈希和旧视频时长。

`submission/build_report.py` 从 Markdown 生成 Word；正式 PDF 从同一 Word 导出，逐页检查。`build_demo.py` 默认 Karen 英文女声、145 words/minute；保留真实捕获画面及本地/测试网标记。`submission/build_delivery.py` 在工作区干净并提交后生成累计 patch、ZIP 和版本回执。

最终提交前补真实姓名/学号/贡献，核对课程最新入口和截止，更新报告/视频，再由有权限的人提交并保存回执。当前交付不包含课程提交回执。
