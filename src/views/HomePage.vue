<template>
  <div class="home-page">
    <div class="page-container">
      <!-- Hero 区域 -->
      <div class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">
            AI 智能营销内容生成平台
          </h1>
          <p class="hero-subtitle">
            为中小餐饮店、零售店打造专业营销文案，让获客更简单
          </p>
          <div class="hero-stats">
            <div class="stat-item">
              <span class="stat-number">5000+</span>
              <span class="stat-label">商家使用</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">10万+</span>
              <span class="stat-label">文案生成</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">98%</span>
              <span class="stat-label">用户满意度</span>
            </div>
          </div>
        </div>
        <!-- 数据可视化图表 -->
        <div class="hero-chart">
          <div class="chart-card">
            <h4 class="chart-title">平台数据概览</h4>
            <div class="chart-item">
              <div class="chart-label">
                <span>本月生成文案</span>
                <span class="chart-value">12,450</span>
              </div>
              <el-progress :percentage="75" :stroke-width="8" :show-text="false" color="#4F46E5" />
            </div>
            <div class="chart-item">
              <div class="chart-label">
                <span>活跃商家</span>
                <span class="chart-value">3,280</span>
              </div>
              <el-progress :percentage="65" :stroke-width="8" :show-text="false" color="#10B981" />
            </div>
            <div class="chart-item">
              <div class="chart-label">
                <span>收藏总数</span>
                <span class="chart-value">8,920</span>
              </div>
              <el-progress :percentage="45" :stroke-width="8" :show-text="false" color="#F59E0B" />
            </div>
            <div class="chart-item">
              <div class="chart-label">
                <span>社区互动</span>
                <span class="chart-value">5,640</span>
              </div>
              <el-progress :percentage="85" :stroke-width="8" :show-text="false" color="#EC4899" />
            </div>
          </div>
        </div>
        <div class="hero-visual">
          <div class="floating-cards">
            <div class="float-card card-1">
              <el-icon><Document /></el-icon>
            </div>
            <div class="float-card card-2">
              <el-icon><Goods /></el-icon>
            </div>
            <div class="float-card card-3">
              <el-icon><Connection /></el-icon>
            </div>
          </div>
        </div>
      </div>

      <!-- 功能入口卡片 -->
      <div class="features-section">
        <h2 class="section-title">选择你的营销需求</h2>
        <p class="section-subtitle">多种内容类型，满足不同场景的营销需求</p>
        <div class="features-grid">
          <FeatureCard
            icon="Document"
            title="营销文案"
            description="快速生成吸引人的营销活动文案，开业促销、会员日、节日活动等"
            @click="$router.push('/marketing')"
          />
          <FeatureCard
            icon="Goods"
            title="产品描述"
            description="为商品打造极具吸引力的描述文字，让顾客一眼爱上你的产品"
            @click="$router.push('/product')"
          />
          <FeatureCard
            icon="Connection"
            title="社交媒体"
            description="生成适合微信、微博、抖音、小红书等平台的推广内容"
            @click="$router.push('/social')"
          />
        </div>
      </div>

      <!-- 特色功能 -->
      <div class="advantages-section">
        <h2 class="section-title">为什么选择我们</h2>
        <div class="advantages-grid">
          <div class="advantage-item">
            <div class="advantage-icon">
              <el-icon :size="32"><Lightning /></el-icon>
            </div>
            <h3>快速生成</h3>
            <p>AI 智能算法，秒级生成多条营销内容</p>
          </div>
          <div class="advantage-item">
            <div class="advantage-icon">
              <el-icon :size="32"><EditPen /></el-icon>
            </div>
            <h3>灵活编辑</h3>
            <p>生成内容可自定义编辑，满足个性化需求</p>
          </div>
          <div class="advantage-item">
            <div class="advantage-icon">
              <el-icon :size="32"><Star /></el-icon>
            </div>
            <h3>一键收藏</h3>
            <p>喜欢的文案可收藏保存，随时查看复用</p>
          </div>
          <div class="advantage-item">
            <div class="advantage-icon">
              <el-icon :size="32"><Clock /></el-icon>
            </div>
            <h3>历史记录</h3>
            <p>自动保存生成历史，重复使用更便捷</p>
          </div>
        </div>
      </div>

      <!-- 快速开始 -->
      <div class="quick-start-section">
        <div class="quick-start-card">
          <div class="quick-start-content">
            <h2>立即开始</h2>
            <p>选择上方任意功能，输入店铺信息，AI 帮你搞定营销内容</p>
          </div>
          <div class="quick-start-actions">
            <el-button type="primary" size="large" @click="$router.push('/marketing')">
              <el-icon><MagicStick /></el-icon>
              开始生成
            </el-button>
            <el-button size="large" @click="$router.push('/history')">
              <el-icon><Clock /></el-icon>
              查看历史
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import FeatureCard from '../components/cards/FeatureCard.vue'
</script>

<style scoped>
.home-page {
  min-height: calc(100vh - 60px);
  background: linear-gradient(180deg, var(--bg-page) 0%, #EEF2FF 100%);
}

/* Hero 区域 */
.hero-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 60px 0;
  gap: var(--space-xl);
}

.hero-content {
  flex: 1;
  max-width: 600px;
}

.hero-title {
  font-size: 42px;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1.2;
  margin-bottom: var(--space-md);
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 18px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: var(--space-xl);
}

.hero-stats {
  display: flex;
  gap: var(--space-xl);
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 28px;
  font-weight: 700;
  color: var(--primary-color);
}

.stat-label {
  font-size: 13px;
  color: var(--text-muted);
}

.hero-visual {
  flex: 1;
  display: flex;
  justify-content: center;
  position: relative;
  height: 300px;
}

/* 数据可视化图表 */
.hero-chart {
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 0 20px;
}

.chart-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  box-shadow: var(--shadow-md);
  width: 100%;
  max-width: 320px;
}

.chart-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-md);
  text-align: center;
}

.chart-item {
  margin-bottom: var(--space-md);
}

.chart-item:last-child {
  margin-bottom: 0;
}

.chart-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  font-size: 13px;
}

.chart-label span:first-child {
  color: var(--text-secondary);
}

.chart-value {
  font-weight: 600;
  color: var(--text-primary);
}

.floating-cards {
  position: relative;
  width: 100%;
  height: 100%;
}

.float-card {
  position: absolute;
  width: 80px;
  height: 80px;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: var(--primary-color);
  box-shadow: var(--shadow-lg);
  animation: float 3s ease-in-out infinite;
}

.float-card:nth-child(1) {
  top: 20%;
  left: 20%;
  animation-delay: 0s;
}

.float-card:nth-child(2) {
  top: 40%;
  left: 45%;
  animation-delay: 0.5s;
  color: var(--secondary-color);
}

.float-card:nth-child(3) {
  top: 20%;
  left: 70%;
  animation-delay: 1s;
  color: var(--accent-color);
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

/* 功能区域 */
.features-section {
  padding: var(--space-xl) 0;
}

.section-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  text-align: center;
  margin-bottom: var(--space-sm);
}

.section-subtitle {
  font-size: 16px;
  color: var(--text-secondary);
  text-align: center;
  margin-bottom: var(--space-xl);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-lg);
}

/* 特色功能 */
.advantages-section {
  padding: var(--space-xl) 0;
}

.advantages-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-lg);
}

.advantage-item {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  text-align: center;
  transition: all var(--transition);
}

.advantage-item:hover {
  border-color: var(--primary-color);
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.advantage-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto var(--space-md);
  background: var(--primary-light);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-color);
}

.advantage-item h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
}

.advantage-item p {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
}

/* 快速开始 */
.quick-start-section {
  padding: var(--space-xl) 0 80px;
}

.quick-start-card {
  background: linear-gradient(135deg, var(--primary-color), #6366F1);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
}

.quick-start-content h2 {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: var(--space-sm);
}

.quick-start-content p {
  opacity: 0.9;
  font-size: 15px;
}

.quick-start-actions {
  display: flex;
  gap: var(--space-md);
}

.quick-start-actions .el-button--large {
  padding: 12px 24px;
}

/* 响应式 */
@media (max-width: 1024px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .advantages-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .hero-chart {
    display: none;
  }
}

@media (max-width: 768px) {
  .hero-section {
    flex-direction: column;
    text-align: center;
    padding: 40px 0;
  }

  .hero-title {
    font-size: 28px;
  }

  .hero-subtitle {
    font-size: 15px;
  }

  .hero-stats {
    justify-content: center;
  }

  .hero-visual {
    display: none;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .advantages-grid {
    grid-template-columns: 1fr;
  }

  .quick-start-card {
    flex-direction: column;
    text-align: center;
    gap: var(--space-lg);
  }
}
</style>
