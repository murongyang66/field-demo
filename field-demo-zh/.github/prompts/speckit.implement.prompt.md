---
description: 通过处理和执行tasks.md中定义的所有任务来执行实施计划
---

## 用户输入

```text
$ARGUMENTS
```

在继续之前，您**必须**考虑用户输入（如果不为空）。

## 概述

1. 从仓库根目录运行`.specify/scripts/powershell/check-prerequisites.ps1 -Json -RequireTasks -IncludeTasks`并解析FEATURE_DIR和AVAILABLE_DOCS列表。所有路径必须是绝对路径。对于参数中的单引号（如"I'm Groot"），使用转义语法：例如'I'\''m Groot'（或尽可能使用双引号："I'm Groot"）。

2. **检查检查清单状态**（如果FEATURE_DIR/checklists/存在）：
   - 扫描checklists/目录中的所有检查清单文件
   - 对于每个检查清单，统计：
     * 总项目数：所有匹配`- [ ]`或`- [X]`或`- [x]`的行
     * 已完成项目数：匹配`- [X]`或`- [x]`的行
     * 未完成项目数：匹配`- [ ]`的行
   - 创建状态表：
     ```
     | 检查清单    | 总数 | 已完成 | 未完成 | 状态  |
     |------------|------|--------|--------|-------|
     | ux.md      | 12   | 12     | 0      | ✓ 通过 |
     | test.md    | 8    | 5      | 3      | ✗ 失败 |
     | security.md | 6   | 6      | 0      | ✓ 通过 |
     ```
   - 计算整体状态：
     * **通过**：所有检查清单有0个未完成项目
     * **失败**：一个或多个检查清单有未完成项目
   
   - **如果有任何检查清单未完成**：
     * 显示包含未完成项目计数的表格
     * **停止**并询问："有些检查清单未完成。您仍要继续实施吗？(是/否)"
     * 等待用户响应后再继续
     * 如果用户说"否"或"等待"或"停止"，则停止执行
     * 如果用户说"是"或"继续"或"进行"，则继续执行步骤3
   
   - **如果所有检查清单都已完成**：
     * 显示表格，显示所有检查清单已通过
     * 自动继续执行步骤3

3. 加载并分析实施上下文：
   - **必需**：阅读tasks.md获取完整任务列表和执行计划
   - **必需**：阅读plan.md了解技术栈、架构和文件结构
   - **如果存在**：阅读data-model.md了解实体和关系
   - **如果存在**：阅读contracts/目录获取API规范和测试要求
   - **如果存在**：阅读research.md了解技术决策和约束
   - **如果存在**：阅读quickstart.md了解集成场景

4. **项目设置验证**：
   - **必需**：根据实际项目设置创建/验证忽略文件：
   
   **检测和创建逻辑**：
   - 检查以下命令是否成功以确定存储库是否为git存储库（如果是，则创建/验证.gitignore）：

     ```sh
     git rev-parse --git-dir 2>/dev/null
     ```
   - 检查是否存在Dockerfile*或plan.md中包含Docker → 创建/验证.dockerignore
   - 检查是否存在.eslintrc*或eslint.config.* → 创建/验证.eslintignore
   - 检查是否存在.prettierrc* → 创建/验证.prettierignore
   - 检查是否存在.npmrc或package.json → 创建/验证.npmignore（如果发布）
   - 检查是否存在terraform文件（*.tf）→ 创建/验证.terraformignore
   - 检查是否需要.helmignore（存在helm图表）→ 创建/验证.helmignore
   
   **如果忽略文件已存在**：验证它包含基本模式，仅添加缺失的关键模式
   **如果忽略文件缺失**：使用检测到的技术的完整模式集创建
   
   **按技术分类的常见模式**（来自plan.md技术栈）：
   - **Node.js/JavaScript**：`node_modules/`, `dist/`, `build/`, `*.log`, `.env*`
   - **Python**：`__pycache__/`, `*.pyc`, `.venv/`, `venv/`, `dist/`, `*.egg-info/`
   - **Java**：`target/`, `*.class`, `*.jar`, `.gradle/`, `build/`
   - **C#/.NET**：`bin/`, `obj/`, `*.user`, `*.suo`, `packages/`
   - **Go**：`*.exe`, `*.test`, `vendor/`, `*.out`
   - **Ruby**：`.bundle/`, `log/`, `tmp/`, `*.gem`, `vendor/bundle/`
   - **PHP**：`vendor/`, `*.log`, `*.cache`, `*.env`
   - **Rust**：`target/`, `debug/`, `release/`, `*.rs.bk`, `*.rlib`, `*.prof*`, `.idea/`, `*.log`, `.env*`
   - **Kotlin**：`build/`, `out/`, `.gradle/`, `.idea/`, `*.class`, `*.jar`, `*.iml`, `*.log`, `.env*`
   - **C++**：`build/`, `bin/`, `obj/`, `out/`, `*.o`, `*.so`, `*.a`, `*.exe`, `*.dll`, `.idea/`, `*.log`, `.env*`
   - **C**：`build/`, `bin/`, `obj/`, `out/`, `*.o`, `*.a`, `*.so`, `*.exe`, `Makefile`, `config.log`, `.idea/`, `*.log`, `.env*`
   - **通用**：`.DS_Store`, `Thumbs.db`, `*.tmp`, `*.swp`, `.vscode/`, `.idea/`
   
   **工具特定模式**：
   - **Docker**：`node_modules/`, `.git/`, `Dockerfile*`, `.dockerignore`, `*.log*`, `.env*`, `coverage/`
   - **ESLint**：`node_modules/`, `dist/`, `build/`, `coverage/`, `*.min.js`
   - **Prettier**：`node_modules/`, `dist/`, `build/`, `coverage/`, `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`
   - **Terraform**：`.terraform/`, `*.tfstate*`, `*.tfvars`, `.terraform.lock.hcl`

5. 解析tasks.md结构并提取：
   - **任务阶段**：Setup（设置）、Tests（测试）、Core（核心）、Integration（集成）、Polish（优化）
   - **任务依赖**：顺序执行与并行执行规则
   - **任务详情**：ID、描述、文件路径、并行标记[P]
   - **执行流程**：顺序和依赖要求

6. 按照任务计划执行实施：
   - **分阶段执行**：完成每个阶段后再移动到下一个阶段
   - **尊重依赖关系**：按顺序运行顺序任务，并行任务[P]可以一起运行
   - **遵循TDD方法**：在相应的实施任务之前执行测试任务
   - **基于文件的协调**：影响相同文件的任务必须顺序运行
   - **验证检查点**：在继续之前验证每个阶段的完成情况

7. 实施执行规则：
   - **先设置**：初始化项目结构、依赖项、配置
   - **代码前测试**：如果需要为契约、实体和集成场景编写测试
   - **核心开发**：实现模型、服务、CLI命令、端点
   - **集成工作**：数据库连接、中间件、日志记录、外部服务
   - **优化和验证**：单元测试、性能优化、文档

8. 进度跟踪和错误处理：
   - 完成每个任务后报告进度
   - 如果任何非并行任务失败，则停止执行
   - 对于并行任务[P]，继续执行成功的任务，报告失败的任务
   - 提供清晰的错误消息和上下文以进行调试
   - 如果实施无法继续，建议下一步操作
   - **重要** 对于已完成的任务，请确保在tasks文件中将其标记为[X]。

9. 完成验证：
   - 验证所有必需任务都已完成
   - 检查已实施的功能是否与原始规范匹配
   - 验证测试通过且覆盖率满足要求
   - 确认实施遵循技术计划
   - 报告最终状态并总结已完成的工作

注意：此命令假设tasks.md中存在完整的任务分解。如果任务不完整或缺失，建议先运行`/tasks`来重新生成任务列表。