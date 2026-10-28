# 双人开发与合并交接

更新日期：2026-10-28。用户确认分工：朋友负责合约/部署，我方负责前端。组员姓名、学号和具体贡献最后补充，不编造。

## 当前工作目录

- 原目录：`/Users/diannao/Desktop/HKU/Semester-1/COMP7610/repo`，保留朋友正在进行的改动。
- 我方隔离目录：`/Users/diannao/Desktop/HKU/Semester-1/COMP7610/delivery`，从 `21ad35e` 创建，并保留分流时的脏文件快照。开发测试和交付文件以此目录为本轮结果。
- 两个目录使用同一个 Git 仓库对象库，但工作文件分开；不要把前端源码手工互相整份覆盖。
- 远端仍为 `phpw0929/COMP7610`。当前连接账号 `Mikuu177` 的仓库元数据权限为 `push:false`；GitHub CLI 配置读取被系统权限拒绝，没有可用推送路径。

## 文件所有权

| 负责人 | 主要文件 | 协作边界 |
| --- | --- | --- |
| 朋友 | `dapp/contracts/VolunteerHoursRegistry.sol`、部署、`dapp/artifacts/` | 合约函数/字段/状态改变时先更新接口说明；提供部署 tx、地址、ABI、编译设置与测试网演示账号 |
| 我方 | `dapp/src/`、`index.html`、前端配置、前端/本地 EVM 测试与运行说明 | 保持现有 Solidity 不变；本地测试编译针对 Ganache 的 Shanghai 目标，不替换原 Sepolia 产物 |
| 共同核对，由我方暂整合 | `src/contract.js`、README、交付状态、报告/视频、总索引 | ABI 只接受合约最终产物；成员贡献和提交状态由真人提供和核对 |

代码入口、环境配置、业务不变量、累计 patch 的具体命令与故障排查见 [frontend_code_handoff.md](frontend_code_handoff.md)。交付包覆盖从 `21ad35e` 到最终交付 commit 的完整差异，包含本次文档与配音更新。

## 合并步骤

1. 双方完成当前小阶段，分别做一个清晰提交，记录 commit。不要在同一工作目录同时编辑。
2. 合约方先将最终源码/产物/部署交接同步到团队仓库，或提供可应用提交。
3. 集成方拉取最新代码，在干净集成目录应用前端提交或交付包中的 patch。`contract.js` 同时改动时，保留我方配置导出，ABI 以最终合约产物为准；同一文件冲突逐处合并，不选择整份 ours/theirs。
4. 不覆盖任何现有 `.env`、钱包文件或用户未提交改动。安装配置从 `.env.example` 创建。
5. 执行 `npm ci`、`npm test`、`npm run build`；再按 execution_plan 的 T 用例复测。若合约变化，重新确认 UI 参数、状态、事件与部署地址，旧证据不能冒充新版本验收。
6. 在最终 Sepolia 部署上用专用演示钱包完成主链路。当前旧机构已停用，原活动也已关闭；需要管理员重新启用并创建新活动，或由朋友提供新部署。
7. 更新 integration_status、报告、Demo、manifest 与总索引，冻结集成 commit。由有 push/提交权限的人执行远端同步和课程提交，并保留回执。

课程最终证据需要真实测试网的有意义交易；本地 EVM 和 UI 测试用于开发/验收，不标成 Sepolia 新交易。无需真实机构或现实出勤数据，专用测试钱包与清楚标注的虚构 demo metadata 即可。
