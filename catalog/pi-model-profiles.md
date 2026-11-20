<!-- pi-model-profiles schema=1 updated=2026-12-01 -->

# Pi 模型画像目录

K Switch 内置的人工精选模型默认填入表，为 pi 供应商「添加模型」提供画像预填（CONTEXT.md「Pi 模型画像目录」；决策见 `.docs/adr/0012-pi-model-profile-catalog.md`）。本文件是唯一事实源：编译期 `include_str!` 嵌入，解析器单元测试守护格式。

## 收录规则

- 首行「通用设置」记录未命中任何条目的模型所用的兜底填入（contextWindow 1048576、maxTokens 131072、五档恒等 thinkingLevelMap、允许读图）；它是目录的普通一行，关键词不会命中真实模型 ID。
- 其余条目收录 **2026 年起发布** 的人工精选当世代模型；字段允许与兜底相同（`-` 表示沿用兜底/恒等），不再要求“必须有差异”。
- token 数值一律 1024 倍数（如对官方十进制 1000000/500000 做二进制归一）。
- 匹配语义：对模型 ID 大小写不敏感子串包含；多个关键词命中取 **输入串中位置最靠前** 者，同位取 **更长** 者。除首行外，下表按 keyword 的 ASCII 字母顺序排列，声明顺序不参与匹配。
- thinking 列记五档全量映射（`来自档=发送值`），`-` 表示恒等；off/minimal 不映射，归 pi 处理。
- input 列 `text` 表示纯文本（input 不含 image），`-` 表示允许读图。

## 目录

| keyword             | contextWindow | maxTokens | thinking                                                   | input |
| ------------------- | ------------- | --------- | ---------------------------------------------------------- | ----- |
| 通用设置            | 1048576       | 131072    | -                                                          | -     |
| claude-fable-5-2    | -             | 128000    | -                                                          | -     |
| claude-haiku-5-5    | -             | 128000    | -                                                          | -     |
| claude-mythos-5-2   | -             | 128000    | -                                                          | -     |
| claude-opus-5-5     | -             | 128000    | -                                                          | -     |
| claude-sonnet-5-5   | -             | 128000    | -                                                          | -     |
| deepseek-v4-flash   | -             | 393216    | low=low, medium=low, high=high, xhigh=max, max=max         | -     |
| deepseek-v4-pro     | -             | 393216    | low=low, medium=low, high=high, xhigh=max, max=max         | text  |
| deepseek-v4.1-flash | -             | 393216    | low=low, medium=low, high=high, xhigh=max, max=max         | -     |
| gemini-4-argon      | -             | 65536     | low=low, medium=medium, high=high, xhigh=high, max=high    | -     |
| gemini-4-carbon     | -             | 65536     | low=low, medium=medium, high=high, xhigh=high, max=high    | -     |
| gemini-4-hydrogen   | -             | 65536     | low=low, medium=medium, high=high, xhigh=xhigh, max=xhigh  | -     |
| glm-5.2             | -             | -         | low=none, medium=high, high=high, xhigh=max, max=max       | text  |
| glm-5.3             | -             | -         | low=low, medium=low, high=high, xhigh=max, max=max         | text  |
| glm-5.3-flash       | -             | -         | low=low, medium=low, high=high, xhigh=max, max=max         | -     |
| gpt-6               | 1048576       | 128000    | -                                                          | -     |
| gpt-6-astra         | 1048576       | 128000    | -                                                          | -     |
| gpt-6-luna          | 1048576       | 128000    | -                                                          | -     |
| gpt-6-sol           | 1048576       | 128000    | -                                                          | -     |
| gpt-6.1             | 1048576       | 128000    | -                                                          | -     |
| gpt-6.2-astra       | 1048576       | 128000    | -                                                          | -     |
| gpt-6.2-sol         | 1048576       | 128000    | -                                                          | -     |
| grok-4.5            | 524288        | 524288    | low=low, medium=medium, high=high, xhigh=high, max=high    | -     |
| grok-4.6            | 524288        | 524288    | low=low, medium=medium, high=high, xhigh=xhigh, max=xhigh  | -     |
| grok-4.7            | 524288        | 524288    | low=low, medium=medium, high=high, xhigh=xhigh, max=xhigh  | -     |
| kimi-k3             | -             | -         | low=low, medium=low, high=high, xhigh=max, max=max         | -     |
| minimax-m2.7        | 204800        | -         | -                                                          | text  |
| minimax-m3          | -             | 512000    | -                                                          | -     |
| minimax-m3.1-flash  | -             | 524288    | -                                                          | -     |
| qwen3.8             | 262144        | -         | low=low, medium=medium, high=xhigh, xhigh=xhigh, max=xhigh | -     |

## 数据出处

2026-11 人工检索定稿：Anthropic 官方模型文档（Claude Fable 5.2 / Opus 5.5 / Sonnet 5.5 / Haiku 5.5：1M 上下文、128K 输出、低至高五档 effort 恒等）、Google AI Studio 与 DeepMind 模型卡（Gemini 4 Argon / Carbon / Hydrogen：1M 上下文、同步输出 65536，Argon 与 Carbon 仅低/中/高三档，Hydrogen 另有 xhigh）、OpenAI 模型文档（GPT-6 家族与 2026-11-17 发布的 GPT-6.2 Astra / Sol：1.05M 上下文、128K 输出、低至 max 五档 reasoning effort）、MiniMax 官方文档（2026-10-19 发布的 M3.1 Flash：1M 上下文、最大输出 524288、低至 max 五档 `reasoning_effort`、文本/图片/视频输入）、models.dev 结构化目录（各模型 release_date / limit / reasoning_options / modalities）与 z.ai 官方文档（glm-5.3 仅 low/high/max；glm-5.2 接受全七档并服务端归一，`none`/`minimal` 跳过思考）。gpt-6 家族 contextWindow 按官方 1.05M 做二进制归一（1048576）；首行通用设置与代码兜底同值，差异门槛已于 2026-11-18 废除（见 ADR 0012 修订），旧 gpt-5.x 系列条目不再收录；Claude 与 Gemini 只收基线（Claude Opus 5.5 / Fable 5.1、Gemini 3.8）之上的当世代模型。
