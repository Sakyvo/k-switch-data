# k-switch-data

K Switch 的远端数据仓库。当前只有一张表：运行时的 pi 模型画像目录（模型默认填入表）。

## 内容

- `catalog/pi-model-profiles.md` — pi 模型画像目录。**这是事实源**：推送到 `main` 即对所有 K Switch 客户端生效，不需要发版。
- `scripts/validate.mjs` — 格式校验脚本，`main` 上每次 push/PR 由 CI 运行。
- `LICENSE` — MIT。

## 推送约定

- 改动直接提交到 `main`，commit message 用 `catalog: <一句话>`。
- 不打 tag，不维护 CHANGELOG（`git log` 已足够）。
- 一次改动只动这一个文件；格式错了 CI 会红，坏表进不了 `main`。

## 格式

文件顶部一行注释头，其后是 markdown 表格：

```
<!-- pi-model-profiles schema=1 updated=2026-12-01 -->
```

| keyword | contextWindow | maxTokens | thinking | input |
| --- | --- | --- | --- | --- |

- 首行固定为 `通用设置`，值为 `1048576 / 131072 / - / -`（未命中任何条目的兜底）。
- 其余按 `keyword` 的 ASCII 升序；keyword 全小写，大小写不敏感子串匹配（位置靠前者优先，同位取更长）。
- `contextWindow` / `maxTokens` 为 `-` 或 1024 的正倍数；`-` 表示沿用兜底。
- `thinking` 为 `-`（恒等）或恰好覆盖 `low/medium/high/xhigh/max` 各一次的 `档=值` 列表。
- `input` 为 `-`（允许读图）或 `text`（仅文本）。
- `schema` 只能涨、不能乱涨：客户端支持到 `1`，遇到更高值会整份拒绝并提示升级 K Switch。

## 客户端如何用它

K Switch 默认每天检查一次（可关、可手动），拉取后校验再落盘；任何失败都沿用本地版本，最差回落到安装包内置的种子。完整契约见 K Switch 仓库的 `.docs/spec/pi-profile-catalog-remote.md`。
