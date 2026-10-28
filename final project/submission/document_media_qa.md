# 报告与配音修订验收

日期：2026-10-28。范围：报告格式、英文女声配音、代码交接与交付包；DApp 运行源码没有改变。

## 报告

- Markdown 为正文来源，python-docx 生成可编辑 Word；PDF 由同一 Word 通过 bundled headless LibreOffice 导出。
- A4、四边 25.4 mm；正文 Times New Roman 12 pt、1.5 倍行距；标题黑色；独立封面无页码，正文从 Page 1 开始。
- 共 7 页，含封面。最终导出的 7 张页图均逐页检查；无文本裁切、表格溢出、图文覆盖、空白页或孤立标题。图题跟随架构图，测试表在同一页。
- 首轮修复了默认 Title 样式蓝色边线、主题字体覆盖和架构图文字挤出边框。最终 PDF 经 pdffonts 确认嵌入 TimesNewRomanPS 系列字体，未保留 Liberation Serif 替代字体。
- 渲染时通过任务临时 FONTCONFIG_FILE 加入系统 Supplemental 字体目录；未改变全局字体配置，也未将字体文件分发到仓库。
- 参考文献统一编号并补正文引用；贡献章节改为报告语气，保留真实成员信息和最终签名证据待补。仓库未提供学校专用版式模板，不把本次字体/页数当作课程强制规定。

## 配音与视频

| 项目 | 实测/配置 |
| --- | --- |
| 语音 | macOS say，Karen，英文女声，145 words/minute |
| 柔和处理 | 70 Hz high-pass、3.5 kHz 减 2 dB、8 kHz low-pass、轻压缩；不改变音高 |
| 总时长 | 246.877032 秒，约 4 分 7 秒 |
| 视频 | H.264、1920×1080、25 fps、yuv420p |
| 音频 | AAC、48 kHz、mono，目标 128 kb/s |
| 综合响度 | -18.0 LUFS；LRA 1.4 LU |
| 平均/最大采样音量 | -17.6 dB / -2.6 dB |
| True peak | -2.6 dBFS，无满幅削波 |
| 完整解码 | FFmpeg 从头到尾解码成功，media_decode.log 为空 |

原英文旁白的业务内容、6 张真实截图来源和 DRAFT 标记保留。视频抽帧检查画面/标题无裁切。只验证了音色预设、编码和响度参数，未进行人工听审；主观柔和程度以实际播放为准。旧 Samantha 版本保存在忽略的 media/revisions 目录，不进入新交接包。

## 交接与源码边界

新增 `handoff/frontend_code_handoff.md`，覆盖运行、源码地图、读写路径、配置、关键不变量、metadata、本地复现、累计 patch 合并、合约方资料和故障排查。同步 README、guide、计划/审核补记、集成状态、context、manifest 与总索引。

使用 `git diff f2e4d32 -- 'final project/dapp'` 确认 25 个前端/配置/原始产物文件字节一致。本次不重复宣称进行了新一轮链上或浏览器业务测试；此前 15 个自动化测试和 14 笔本地 UI 成功交易的证据保持原样。

本次将源码指纹明确为可复算的规范文件清单：按仓库相对路径排序 `{path,sha256}` 列表，以 `sort_keys=True, separators=(',', ':'), ensure_ascii=False` 的 UTF-8 JSON（无末尾换行）求 SHA256。它和旧版未明确序列化方式的指纹不是同一个计算定义；DApp 文件本身未改变。

`build_delivery.py` 只在干净提交上打包，使用独立临时 Git index 将累计 binary patch 应用到 21ad35e，并检查所得 tree 与交付 HEAD tree 相同；还检查 ZIP CRC、精确文件集合和 manifest 校验值。最终 commit/包校验见生成回执。本地打包不推送、不部署、不进行学校提交。
