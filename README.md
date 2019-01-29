# WebAssembly

- WebAssembly 是一种新的字节码格式，主流浏览器都已经支持 WebAssembly
- WebAssembly 字节码和底层机器码很相似可快速装载运行，因此性能相对于 JS 解释执行大大提升

## 基础概念

- WebAssembly 并不是一门编程语言，而是一份字节码标准，需要用高级编程语言编译出字节码放到 WebAssembly 虚拟机中才能运行
- 浏览器厂商需要做的就是根据 WebAssembly 规范实现虚拟机
- WebAssembly 字节码不能直接在任何一种 CPU 架构上运行， 但由于非常接近机器码，可以非常快的被翻译为对应架构的机器码，因此 WebAssembly 运行速度和机器码接近

## 优点

- 体积小：由于浏览器运行时只加载编译成的字节码，一样的逻辑比用字符串描述的 JS 文件体积要小很多
- 加载快：由于文件体积小，再加上无需解释执行，WebAssembly 能更快的加载并实例化，减少运行前的等待时间
- 兼容性问题少：WebAssembly 是非常底层的字节码规范，制订好后很少变动，就算以后发生变化,也只需在从高级语言编译成字节码过程中做兼容。可能出现兼容性问题的地方在于 JS 和 WebAssembly 桥接的 JS 接口

## AssemblyScript

[AssemblyScript](https://github.com/AssemblyScript/assemblyscript) 语法和 TypeScript 一致，对前端来说学习成本低，为前端编写 WebAssembly 最佳选择。

- 比 TypeScript 多了很多更细致的内置类型，以优化性能和内存占用，详情[文档](https://github.com/AssemblyScript/assemblyscript/wiki/Types);
- 不能使用 any 和 undefined 类型，以及枚举类型；
- 可空类型的变量必须是引用类型，而不能是基本数据类型如 string、number、boolean；
- 函数中的可选参数必须提供默认值，函数必须有返回类型，无返回值的函数返回类型需要是 void；
- 不能使用 JS 环境中的内置函数，只能使用 [AssemblyScript 提供的内置函数](https://github.com/AssemblyScript/assemblyscript/wiki/Built-in-functions)。

## 编写 WebAssembly

### 编写 TS

```ts
export function f(x: i32): i32 {
  if (x === 1 || x === 2) {
    return 1;
  }
  return f(x - 1) + f(x - 2)
}
```

### 生成 wasm 文件

```sh
asc AssemblyScript/f.ts -o dist/f.wasm
```

### html 运行

```ts
fetch('dist/f.wasm') // 从网络加载 f.wasm 文件
  .then(res => res.arrayBuffer()) // 转成 ArrayBuffer
  .then(WebAssembly.instantiate) // 编译为当前 CPU 架构的机器码 + 实例化
  .then(mod => {
    // 调用模块实例上的 f 函数计算
    console.log(mod.instance.exports.f(40));
  });
```

### Webpack 构建

package.json

```json
{
  "devDependencies": {
    "assemblyscript": "github:AssemblyScript/assemblyscript",
    "assemblyscript-typescript-loader": "^1.3.2",
    "typescript": "^2.8.1",
    "webpack": "^3.10.0",
    "webpack-dev-server": "^2.10.1"
  }
}
```

webpack.config.js

```js
module.exports = {
  entry: `${__dirname}/AssemblyScript/f.ts`,
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'assemblyscript-typescript-loader',
        options: {
          sourceMap: true,
        }
      }
    ]
  },
};
```

tsconfig.json

```json
{
  "extends": "./node_modules/assemblyscript/std/portable.json",
  "include": [
    "./**/*.ts"
  ]
}
```