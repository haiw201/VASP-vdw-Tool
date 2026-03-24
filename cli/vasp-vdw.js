#!/usr/bin/env node

/**
 * VASP vdw 泛函替换 CLI 工具
 * 用于在命令行中直接修改 INCAR 文件
 * 
 * 使用方法:
 *   node vasp-vdw.js -i INCAR -t dft-d3 -o INCAR_new
 *   node vasp-vdw.js --list
 */

const fs = require('fs');
const path = require('path');

// 引入服务层
const vaspService = require('../backend/src/services/vasp-vdw.service');

/**
 * 显示帮助信息
 */
function showHelp() {
  console.log(`
🔬 VASP vdw 泛函替换 CLI 工具

使用方法:
  node vasp-vdw.js [选项]

选项:
  -i, --input <file>     输入的 INCAR 文件路径 (默认: INCAR)
  -t, --type <type>      vdw 泛函类型 (必需, 使用 --list 查看可用类型)
  -o, --output <file>    输出的 INCAR 文件路径 (默认: 覆盖原文件)
  -l, --list             列出所有可用的 vdw 泛函类型
  -h, --help             显示帮助信息

示例:
  # 列出所有可用的 vdw 泛函
  node vasp-vdw.js --list

  # 使用 DFT-D3 修改 INCAR 文件
  node vasp-vdw.js -i INCAR -t dft-d3

  # 使用 vdW-DF2 修改并保存到新文件
  node vasp-vdw.js -i INCAR -t vdw-df2 -o INCAR_vdw
`);
}

/**
 * 列出所有可用的 vdw 泛函类型
 */
function listTypes() {
  const types = vaspService.getVdwTypesFlat();
  
  console.log('\n📋 可用的 vdw 泛函类型:\n');
  
  // 按分类显示
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
 * 主函数
 */
function main() {
  const args = process.argv.slice(2);
  
  // 解析参数
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
          console.error(`❌ 未知选项: ${arg}`);
          console.error('使用 --help 查看帮助信息');
          process.exit(1);
        }
    }
  }
  
  // 显示列表
  if (showList) {
    listTypes();
    process.exit(0);
  }
  
  // 检查必需参数
  if (!vdwType) {
    console.error('❌ 错误: 必须指定 vdw 泛函类型 (-t)');
    console.error('使用 --list 查看可用的类型');
    process.exit(1);
  }
  
  // 检查输入文件
  if (!fs.existsSync(inputFile)) {
    console.error(`❌ 错误: 找不到输入文件: ${inputFile}`);
    process.exit(1);
  }
  
  // 读取 INCAR 文件
  let incarContent;
  try {
    incarContent = fs.readFileSync(inputFile, 'utf-8');
  } catch (err) {
    console.error(`❌ 错误: 无法读取文件: ${err.message}`);
    process.exit(1);
  }
  
  // 执行替换
  try {
    const result = vaspService.replaceVdwFunctional(incarContent, vdwType);
    
    // 确定输出文件
    const finalOutputFile = outputFile || inputFile;
    
    // 写入文件
    fs.writeFileSync(finalOutputFile, result.modified, 'utf-8');
    
    // 显示结果
    console.log('\n✅ 成功!');
    console.log(`   输入文件: ${path.resolve(inputFile)}`);
    console.log(`   输出文件: ${path.resolve(finalOutputFile)}`);
    console.log(`   应用泛函: ${result.vdwType}`);
    console.log(`   分类: ${result.vdwCategory}`);
    console.log(`   新增参数: ${result.changes.added.join(', ')}`);
    
    if (result.changes.removed && result.changes.removed.length > 0) {
      console.log(`   移除参数: ${result.changes.removed.join(', ')}`);
    }
    
    console.log('\n📄 修改后的 INCAR 内容预览:');
    console.log('-'.repeat(60));
    console.log(result.modified);
    
  } catch (err) {
    console.error(`❌ 错误: ${err.message}`);
    process.exit(1);
  }
}

// 运行主函数
main();
