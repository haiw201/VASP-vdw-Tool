#!/usr/bin/env node

/**
 * VASP-vdw-Tool CLI Tool / VASP vdw 泛函替换 CLI 工具
 * Modify INCAR files to add van der Waals functionals directly from command line
 * 用于在命令行中直接修改 INCAR 文件
 * Supports batch processing for multiple files / 支持批量处理多个文件
 *
 * Usage / 使用方法:
 *   # Single file / 单文件处理
 *   node vasp-vdw.js -i INCAR -t dft-d3 -o INCAR_new
 *
 *   # Batch processing / 批量处理
 *   node vasp-vdw.js -d ./incars -t dft-d3
 *   node vasp-vdw.js -d ./incars -t dft-d3 -r
 *   node vasp-vdw.js -d ./incars -t dft-d3 --suffix "_vdw"
 *
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

Single File Mode / 单文件模式:
  -i, --input <file>     Input INCAR file path (default: INCAR)
  -o, --output <file>    Output INCAR file path (default: overwrite input)

Batch Processing Mode / 批量处理模式:
  -d, --dir <directory>  Input directory containing INCAR files
  -r, --recursive         Recursively search subdirectories
  -p, --pattern <glob>    File pattern to match (default: INCAR*)
  --suffix <string>       Suffix to add to output files (e.g., "_vdw")
  --dry-run               Preview mode, no files will be modified

vdw Options / vdw 选项:
  -t, --type <type>       vdw functional type (required, use --list to see available)
  -l, --list              List all available vdw functional types

General Options / 通用选项:
  -h, --help              Show this help message

Examples / 示例:
  # CLI tool / CLI 工具
  node vasp-vdw.js --help
  node vasp-vdw.js --list
  node vasp-vdw.js -i INCAR -t dft-d3
  node vasp-vdw.js -d ./incars -t dft-d3 -r --dry-run

  # List all available vdw functionals / 列出所有可用的 vdw 泛函
  node vasp-vdw.js --list

  # Single file / 单文件
  node vasp-vdw.js -i INCAR -t dft-d3
  node vasp-vdw.js -i INCAR -t vdw-df2 -o INCAR_vdw

  # Batch processing (directory with INCAR files) / 批量处理
  node vasp-vdw.js -d ./incars -t dft-d3
  node vasp-vdw.js -d ./incars -t dft-d3 --suffix "_dftd3"

  # Batch processing with subdirectories / 包含子目录的批量处理
  node vasp-vdw.js -d ./calculations -t dft-d3 -r

  # Preview mode (dry-run) / 预览模式
  node vasp-vdw.js -d ./incars -t dft-d3 --dry-run
`);
}

/**
 * List all available vdw functional types / 列出所有可用的 vdw 泛函类型
 */
function listTypes() {
  const types = vaspService.getVdwTypesFlat();

  console.log('\n📋 Available vdw functional types / 可用的 vdw 泛函类型:\n');

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
 * Find INCAR files in a directory / 查找目录中的 INCAR 文件
 * @param {string} dir - Directory path
 * @param {string} pattern - File pattern (glob)
 * @param {boolean} recursive - Recursive search
 * @returns {string[]} Array of file paths
 */
function findIncarFiles(dir, pattern = 'INCAR*', recursive = false) {
  const files = [];

  if (!fs.existsSync(dir)) {
    return files;
  }

  const stats = fs.statSync(dir);
  if (stats.isFile()) {
    return [dir];
  }

  if (!stats.isDirectory()) {
    return files;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory() && recursive) {
      files.push(...findIncarFiles(fullPath, pattern, true));
    } else if (entry.isFile()) {
      if (entry.name.startsWith('INCAR') || globMatch(entry.name, pattern)) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

/**
 * Simple glob pattern matching / 简单的 glob 模式匹配
 * @param {string} filename - File name to test
 * @param {string} pattern - Glob pattern
 * @returns {boolean}
 */
function globMatch(filename, pattern) {
  const regexPattern = pattern
    .replace(/\./g, '\\.')
    .replace(/\*/g, '.*')
    .replace(/\?/g, '.');
  return new RegExp(`^${regexPattern}$`, 'i').test(filename);
}

/**
 * Process a single INCAR file / 处理单个 INCAR 文件
 * @param {string} inputPath - Input file path
 * @param {string} vdwType - vdw functional type
 * @param {string|null} outputPath - Output file path (null for in-place)
 * @param {string} suffix - Suffix for output filename
 * @returns {object} Processing result
 */
function processFile(inputPath, vdwType, outputPath = null, suffix = '') {
  const inputContent = fs.readFileSync(inputPath, 'utf-8');
  const result = vaspService.replaceVdwFunctional(inputContent, vdwType);

  let finalOutputPath;
  if (outputPath) {
    finalOutputPath = outputPath;
  } else if (suffix) {
    const ext = path.extname(inputPath);
    const basename = path.basename(inputPath, ext);
    finalOutputPath = path.join(path.dirname(inputPath), `${basename}${suffix}${ext}`);
  } else {
    finalOutputPath = inputPath;
  }

  fs.writeFileSync(finalOutputPath, result.modified, 'utf-8');

  return {
    input: inputPath,
    output: finalOutputPath,
    vdwType: result.vdwType,
    category: result.vdwCategory,
    added: result.changes.added
  };
}

/**
 * Process batch files / 批量处理文件
 * @param {string[]} files - Array of file paths
 * @param {string} vdwType - vdw functional type
 * @param {string} suffix - Suffix for output filename
 * @param {boolean} dryRun - Dry run mode
 * @returns {object} Processing summary
 */
function processBatch(files, vdwType, suffix = '', dryRun = false) {
  const results = { success: 0, failed: 0, errors: [] };

  for (const file of files) {
    try {
      if (dryRun) {
        const inputContent = fs.readFileSync(file, 'utf-8');
        const result = vaspService.replaceVdwFunctional(inputContent, vdwType);
        const ext = path.extname(file);
        const basename = path.basename(file, ext);
        const outputFile = suffix
          ? path.join(path.dirname(file), `${basename}${suffix}${ext}`)
          : file;

        console.log(`  [DRY-RUN] ${file} -> ${outputFile} (${result.vdwType})`);
        results.success++;
      } else {
        processFile(file, vdwType, null, suffix);
        console.log(`  ✅ ${file}`);
        results.success++;
      }
    } catch (err) {
      console.error(`  ❌ ${file}: ${err.message}`);
      results.failed++;
      results.errors.push({ file, error: err.message });
    }
  }

  return results;
}

/**
 * Main function / 主函数
 */
function main() {
  const args = process.argv.slice(2);

  let inputFile = 'INCAR';
  let outputFile = null;
  let inputDir = null;
  let vdwType = null;
  let showList = false;
  let recursive = false;
  let pattern = 'INCAR*';
  let suffix = '';
  let dryRun = false;

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

      case '-o':
      case '--output':
        outputFile = args[++i];
        break;

      case '-d':
      case '--dir':
        inputDir = args[++i];
        break;

      case '-r':
      case '--recursive':
        recursive = true;
        break;

      case '-p':
      case '--pattern':
        pattern = args[++i];
        break;

      case '-t':
      case '--type':
        vdwType = args[++i];
        break;

      case '--suffix':
        suffix = args[++i];
        break;

      case '--dry-run':
        dryRun = true;
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

  // Batch processing mode / 批量处理模式
  if (inputDir) {
    console.log(`\n📂 Batch processing mode / 批量处理模式`);
    console.log(`   Directory / 目录: ${inputDir}`);
    console.log(`   Pattern / 匹配模式: ${pattern}`);
    console.log(`   Recursive / 递归搜索: ${recursive ? 'Yes' : 'No'}`);
    console.log(`   vdw functional / vdW 泛函: ${vdwType}`);
    if (suffix) console.log(`   Suffix / 文件后缀: ${suffix}`);
    if (dryRun) console.log(`   Mode / 模式: DRY-RUN (preview only)`);
    console.log();

    const files = findIncarFiles(path.resolve(inputDir), pattern, recursive);

    if (files.length === 0) {
      console.log('❌ No INCAR files found / 未找到 INCAR 文件');
      process.exit(1);
    }

    console.log(`Found ${files.length} file(s) / 找到 ${files.length} 个文件:\n`);

    const results = processBatch(files, vdwType, suffix, dryRun);

    console.log(`\n📊 Summary / 摘要:`);
    console.log(`   Total / 总数: ${files.length}`);
    console.log(`   Success / 成功: ${results.success}`);
    console.log(`   Failed / 失败: ${results.failed}`);

    if (results.failed > 0) {
      console.log(`\n⚠️ Errors / 错误:`);
      results.errors.forEach(e => console.log(`   ${e.file}: ${e.error}`));
    }

    console.log();
    process.exit(results.failed > 0 ? 1 : 0);
  }

  // Single file mode / 单文件模式
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

    const finalOutputFile = outputFile || inputFile;

    fs.writeFileSync(finalOutputFile, result.modified, 'utf-8');

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
