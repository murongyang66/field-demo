<template>
  <div class="pixel-canvas-container">
    <h2>像素交流机器人</h2>
    <!-- 像素画布容器 -->
    <div id="pixelCanvasContainer" class="canvas-wrapper"></div>
    
    <!-- 控制面板 -->
    <div class="control-panel">
      <button @click="startAnimation">开始动画</button>
      <button @click="stopAnimation">停止动画</button>
      <button @click="changeExpression">切换表情</button>
    </div>
  </div>
</template>

<script>
import * as PIXI from 'pixi.js';

export default {
  name: 'PixelCanvas',
  data() {
    return {
      app: null,
      sprite: null,
      animationInterval: null,
      currentExpression: 0,
      expressions: ['happy', 'sad', 'angry', 'surprised']
    };
  },
  mounted() {
    // 组件挂载后初始化Pixi.js应用
    this.initPixiApp();
  },
  beforeUnmount() {
    // 组件卸载前清理资源
    this.cleanup();
  },
  methods: {
    /**
     * 初始化Pixi.js应用
     * 这是创建像素画布的核心函数
     */
    initPixiApp() {
      // 创建Pixi.js应用实例
      this.app = new PIXI.Application({
        width: 400,  // 画布宽度
        height: 400, // 画布高度
        backgroundColor: 0x1a1a1a, // 画布背景色（深灰色）
        resolution: window.devicePixelRatio || 1, // 适配高分辨率屏幕
        autoDensity: true // 自动密度
      });
      
      // 获取容器元素并添加画布
      const container = document.getElementById('pixelCanvasContainer');
      container.appendChild(this.app.view);
      
      // 创建一个简单的像素角色
      this.createPixelCharacter();
    },
    
    /**
     * 创建像素角色
     * 这里我们用简单的图形来模拟一个像素角色
     */
    createPixelCharacter() {
      // 创建一个容器来存放角色的所有部分
      const character = new PIXI.Container();
      character.x = 200; // 设置角色在画布中的X坐标
      character.y = 200; // 设置角色在画布中的Y坐标
      
      // 创建角色的身体（一个矩形）
      const body = new PIXI.Graphics();
      body.beginFill(0xff0000); // 设置填充颜色为红色
      body.drawRect(-30, -30, 60, 60); // 绘制矩形
      body.endFill();
      
      // 创建角色的眼睛（两个圆形）
      const leftEye = new PIXI.Graphics();
      leftEye.beginFill(0xffffff); // 设置填充颜色为白色
      leftEye.drawCircle(-15, -10, 5); // 绘制左眼睛
      leftEye.endFill();
      
      const rightEye = new PIXI.Graphics();
      rightEye.beginFill(0xffffff); // 设置填充颜色为白色
      rightEye.drawCircle(15, -10, 5); // 绘制右眼睛
      rightEye.endFill();
      
      // 创建角色的嘴巴（一个简单的线条）
      this.mouth = new PIXI.Graphics();
      this.updateMouth('happy'); // 初始表情设为开心
      
      // 将所有部分添加到角色容器中
      character.addChild(body);
      character.addChild(leftEye);
      character.addChild(rightEye);
      character.addChild(this.mouth);
      
      // 将角色添加到舞台
      this.app.stage.addChild(character);
      
      // 保存角色引用以便后续操作
      this.sprite = character;
    },
    
    /**
     * 更新角色的嘴巴形状，从而改变表情
     * @param {string} expression - 表情类型（happy, sad, angry, surprised）
     */
    updateMouth(expression) {
      this.mouth.clear(); // 清除之前的嘴巴图形
      this.mouth.lineStyle(3, 0xffffff); // 设置线条样式
      
      // 根据不同的表情绘制不同的嘴巴形状
      switch(expression) {
        case 'happy':
          this.mouth.arc(0, 10, 15, 0, Math.PI, false);
          break;
        case 'sad':
          this.mouth.arc(0, 20, 15, 0, Math.PI, true);
          break;
        case 'angry':
          this.mouth.moveTo(-15, 10);
          this.mouth.lineTo(15, 10);
          break;
        case 'surprised':
          this.mouth.drawCircle(0, 15, 8);
          break;
      }
    },
    
    /**
     * 开始角色动画
     */
    startAnimation() {
      if (this.animationInterval) return; // 如果动画已经在运行，就不再重复启动
      
      // 设置一个定时器，每隔一段时间更新角色的位置，实现动画效果
      this.animationInterval = setInterval(() => {
        if (this.sprite) {
          // 让角色上下移动（简单的弹跳效果）
          const time = Date.now() * 0.001;
          this.sprite.y = 200 + Math.sin(time) * 10;
        }
      }, 16); // 约60fps的更新频率
    },
    
    /**
     * 停止角色动画
     */
    stopAnimation() {
      if (this.animationInterval) {
        clearInterval(this.animationInterval); // 清除定时器
        this.animationInterval = null;
        
        // 重置角色位置
        if (this.sprite) {
          this.sprite.y = 200;
        }
      }
    },
    
    /**
     * 切换角色表情
     */
    changeExpression() {
      // 循环切换表情
      this.currentExpression = (this.currentExpression + 1) % this.expressions.length;
      const newExpression = this.expressions[this.currentExpression];
      
      // 更新嘴巴形状以显示新表情
      this.updateMouth(newExpression);
    },
    
    /**
     * 清理资源
     * 当组件卸载时调用，防止内存泄漏
     */
    cleanup() {
      this.stopAnimation(); // 停止动画
      
      if (this.app) {
        this.app.destroy(true); // 销毁Pixi.js应用
        this.app = null;
      }
    }
  }
};
</script>

<style scoped>
.pixel-canvas-container {
  font-family: 'Courier New', monospace;
  text-align: center;
  margin: 0 auto;
  max-width: 500px;
}

.canvas-wrapper {
  border: 4px solid #333;
  border-radius: 8px;
  overflow: hidden;
  margin: 20px 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.control-panel {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
}

button:hover {
  background-color: #45a049;
}
</style>