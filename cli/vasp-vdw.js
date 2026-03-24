#!/usr/bin/env node

/**
 * VASP-vdw-Tool CLI Tool / VASP vdw 泛函替换 CLI 工具
 * Modify INCAR files to add van der Waals functionals directly from command line
 * 用于在命令行中直接修改 INCAR 文件
 *
 * Usage / 使用方法:
 *   node vasp-vdw.js -i INCAR -t dft-d3 -o INCAR_new
 *   node vasp-vdw.js --list
 */

const fs = require('fs');
const path = require('path');

// Import service layer / 引入服务层
const vaspService = require('../backend/src/services/vasp-vdw.service');

/**
 * Display help information / 显示帮助信息
 */
function showHelp() {
  console.log(`
🔬 VASP-vdw-Tool CLI Tool / VASP vdw 泛函替换 CLI 工具

Usage / 使用方法:
  node vasp-vdw.js [options]

Options / 选项:
  -i, --input <file>     Input INCAR file path (default: INCAR) / 输入的 INCAR 文件路径 (默认: INCAR)
  -t, --type <type>      vdw functional type (required, use --list to see available) / vdw 泛函类型 (必需, 使用 --list 查看可用类型)
  -o, --output <file>    Output INCAR file path (default: overwrite input) / 输出的 INCAR 文件路径 (默认: 覆盖原文件)
  -l, --list             List all available vdw functional types / 列出所有可用的 vdw 泛函类型
  -h, --help             Show this help message / 显示帮助信息

Examples / 示例:
  # List all available vdw functionals / 列出所有可用的 vdw 泛函
  node vasp-vdw.js --list

  # Modify INCAR with DFT-D3 / 使用 DFT-D3 修改 INCAR 文件
  node vasp-vdw.js -i INCAR -t dft-d3

  # Modify with vdW-DF2 and save to new file / 使用 vdW-DF2 修改并保存到新文件
  node vasp-vdw.js -i INCAR -t vdw-df2 -o INCAR_vdw
`);
}

/**
 * List all available vdw functional types / 列出所有可用的 vdw 泛函类型
 */
function listTypes() {
  const types = vaspService.getVdwTypesFlat();

  console.log('\n📋 Available vdw functional types / 可用的 vdw 泛函类型:\n');

  // Display by category / 按分类显示
  const categories = {};
  types.forEach(t => {
    if (!categories[t.category]) categories[t.category] = [];
    categories[t.category].push(t);
  });

  Object.entries(categories).forEach(([category, items]) => {
    console.log(`\n【${category}】`);
    console.log('-'.repeat(60));
    items.forEach(t => {
      console.log(`  ${t.id.padEnd(15)} - ${t.name}`);
      console.log(`  ${''.padEnd(15)}   ${t.description}`);
      console.log();
    });
  });
}

/**
 * Main function / 主函数
 */
function main() {
  const args = process.argv.slice(2);

  // Parse arguments / 解析参数
  let inputFile = 'INCAR';
  let outputFile = null;
  let vdwType = null;
  let showList = false;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    switch (arg) {
      case '-h':
      case '--help':
        showHelp();
        process.exit(0);

      case '-l':
      case '--list':
        showList = true;
        break;

      case '-i':
      case '--input':
        inputFile = args[++i];
        break;

      case '-t':
      case '--type':
        vdwType = args[++i];
        break;

      case '-o':
      case '--output':
        outputFile = args[++i];
        break;

      default:
        if (arg.startsWith('-')) {
          console.error(`❌ Unknown option / 未知选项: ${arg}`);
          console.error('Use --help for usage information / 使用 --help 查看帮助信息');
          process.exit(1);
        }
    }
  }

  // Show list / 显示列表
  if (showList) {
    listTypes();
    process.exit(0);
  }

  // Check required parameters / 检查必需参数
  if (!vdwType) {
    console.error('❌ Error / 错误: vdw functional type is required (-t) / 必须指定 vdw 泛函类型 (-t)');
    console.error('Use --list to see available types / 使用 --list 查看可用的类型');
    process.exit(1);
  }

  // Check input file / 检查输入文件
  if (!fs.existsSync(inputFile)) {
    console.error(`❌ Error / 错误: Input file not found / 找不到输入文件: ${inputFile}`);
    process.exit(1);
  }

  // Read INCAR file / 读取 INCAR 文件
  let incarContent;
  try {
    incarContent = fs.readFileSync(inputFile, 'utf-8');
  } catch (err) {
    console.error(`❌ Error / 错误: Cannot read file / 无法读取文件: ${err.message}`);
    process.exit(1);
  }

  // Execute replacement / 执行替换
  try {
    const result = vaspService.replaceVdwFunctional(incarContent, vdwType);

    // Determine output file / 确定输出文件
    const finalOutputFile = outputFile || inputFile;

    // Write file / 写入文件
    fs.writeFileSync(finalOutputFile, result.modified, 'utf-8');

    // Show results / 显示结果
    console.log('\n✅ Success / 成功!');
    console.log(`   Input file / 输入文件: ${path.resolve(inputFile)}`);
    console.log(`   Output file / 输出文件: ${path.resolve(finalOutputFile)}`);
    console.log(`   Applied functional / 应用泛函: ${result.vdwType}`);
    console.log(`   Category / 分类: ${result.vdwCategory}`);
    console.log(`   Added parameters / 新增参数: ${result.changes.added.join(', ')}`);

    if (result.changes.removed && result.changes.removed.length > 0) {
      console.log(`   Removed parameters / 移除参数: ${result.changes.removed.join(', ')}`);
    }

    console.log('\n📄 Modified INCAR preview / 修改后的 INCAR 内容预览:');
    console.log('-'.repeat(60));
    console.log(result.modified);

  } catch (err) {
    console.error(`❌ Error / 错误: ${err.message}`);
    process.exit(1);
  }
}

// Run main function / 运行主函数
main();
